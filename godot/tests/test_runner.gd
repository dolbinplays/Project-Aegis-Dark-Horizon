extends SceneTree

var failures: Array[String] = []
var checks := 0

func _init() -> void:
	call_deferred("_run")

func _run() -> void:
	var content := _load_json("res://godot/data/content.json")
	_check(not content.is_empty(), "content catalog loads")
	_test_hex_rules()
	_test_campaign(content)
	_test_browser_import(content)
	_test_interception(content)
	await _test_tactical(content)
	_test_build_health()
	if failures.is_empty():
		print("AEGIS GODOT TESTS PASS: %d/%d" % [checks, checks])
		quit(0)
	else:
		for failure in failures:
			push_error("AEGIS TEST FAILED: %s" % failure)
		print("AEGIS GODOT TESTS FAIL: %d failure(s) across %d checks" % [failures.size(), checks])
		quit(1)

func _test_hex_rules() -> void:
	_check(AegisHexRules.neighbors(Vector2i(4, 4), 12, 12).size() == 6, "interior hex has six neighbors")
	_check(AegisHexRules.distance(Vector2i(2, 2), Vector2i(6, 5)) == AegisHexRules.distance(Vector2i(6, 5), Vector2i(2, 2)), "hex distance is symmetric")
	var blocked := {AegisHexRules.key(Vector2i(2, 1)): true}
	var route := AegisHexRules.path(Vector2i(1, 1), Vector2i(3, 1), blocked, {}, 8, 8)
	_check(not route.is_empty() and not route.has(Vector2i(2, 1)), "pathfinding routes around blocked cells")
	var reachable := AegisHexRules.reachable(Vector2i(3, 3), 2, {}, {}, 8, 8)
	_check(reachable.size() > 6 and reachable.values().all(func(value): return int(value) <= 2), "reachable flood remains step bounded")
	var strategic_map := AegisStrategicMap.new()
	strategic_map.size = Vector2(700, 470)
	var regions := [{"id": "oceania", "name": "Oceania", "map": [0.82, 0.72]}]
	var incidents: Array = []
	for incident_index in range(6):
		incidents.append({"id": "incident_%d" % incident_index, "name": "Incident %d" % incident_index, "region": "Oceania"})
	strategic_map.configure(regions, incidents)
	var marker_positions := {}
	for incident in incidents:
		var marker_point := strategic_map._incident_point(incident)
		marker_positions["%.1f,%.1f" % [marker_point.x, marker_point.y]] = true
	_check(marker_positions.size() == incidents.size(), "dense strategic incidents receive distinct marker positions")
	strategic_map.free()

func _test_campaign(content: Dictionary) -> void:
	var campaign := AegisCampaignState.new()
	campaign.configure(content)
	campaign.new_campaign("Test Aegis", "North America")
	_check(campaign.has_campaign(), "new campaign creates a valid base")
	_check(campaign.assigned_soldiers().size() == 6, "opening squad assigns six soldiers")
	_check(campaign.personnel_capacity() == 12 and campaign.personnel_used() == 11 and campaign.scientist_capacity() == 10 and campaign.engineer_capacity() == 10, "base capacity counts six soldiers and five scientists against one quarters lab and workshop")
	var opening_roster: Array = campaign.data.get("soldiers", [])
	var first_soldier: Dictionary = opening_roster[0]
	var second_soldier: Dictionary = opening_roster[1]
	campaign.data["stores"]["Laser Rifle"] = 1
	_check(campaign.change_soldier_loadout(String(first_soldier.get("id", "")), "weapon", "Laser Rifle") and first_soldier.get("weapon", "") == "Laser Rifle" and campaign.loadout_stock("Laser Rifle") == 0 and campaign.loadout_stock("Ballistic Rifle") == 1, "issuing a local Laser Rifle atomically returns the prior rifle to stores")
	_check(not campaign.change_soldier_loadout(String(second_soldier.get("id", "")), "weapon", "Laser Rifle") and second_soldier.get("weapon", "") == "Ballistic Rifle" and campaign.loadout_stock("Laser Rifle") == 0, "unavailable equipment cannot be issued or duplicate stock")
	_check(campaign.change_soldier_loadout(String(first_soldier.get("id", "")), "armor", "No Armor") and first_soldier.get("armor", "") == "No Armor" and campaign.loadout_stock("Field Suit") == 1 and campaign.change_soldier_loadout(String(first_soldier.get("id", "")), "armor", "Field Suit") and campaign.loadout_stock("Field Suit") == 0, "armor return and reissue conserve local stock")
	var opening_medkits := campaign.loadout_stock("Medkit")
	_check(campaign.change_soldier_medkit(String(first_soldier.get("id", "")), true) and campaign.loadout_stock("Medkit") == opening_medkits - 1 and campaign.change_soldier_medkit(String(first_soldier.get("id", "")), true) and campaign.loadout_stock("Medkit") == opening_medkits - 1 and campaign.change_soldier_medkit(String(first_soldier.get("id", "")), false) and campaign.loadout_stock("Medkit") == opening_medkits and campaign.change_soldier_medkit(String(first_soldier.get("id", "")), true), "Medkit issue return and idempotent reissue conserve local stock")
	var malformed_loadout := campaign.data.duplicate(true)
	malformed_loadout["soldiers"][0].erase("weapon")
	malformed_loadout["soldiers"][0]["armor"] = ""
	malformed_loadout["soldiers"][0]["status"] = "Sickbay - 3 days"
	malformed_loadout["soldiers"][0]["medkit"] = 1
	malformed_loadout["soldiers"][0].erase("recovery_days")
	malformed_loadout["stores"]["Laser Rifle"] = -4
	malformed_loadout["stores"]["Medkit"] = -2
	var normalized_loadout := campaign.normalize_save(malformed_loadout)
	_check(normalized_loadout.get("soldiers", [])[0].get("weapon", "") == "Ballistic Rifle" and normalized_loadout.get("soldiers", [])[0].get("armor", "") == "No Armor" and int(normalized_loadout.get("stores", {}).get("Laser Rifle", -1)) == 0, "loadout migration supplies conservative defaults and clamps invalid stock")
	_check(normalized_loadout.get("soldiers", [])[0].get("status", "") == "Wounded" and int(normalized_loadout.get("soldiers", [])[0].get("recovery_days", 0)) == 3 and normalized_loadout.get("soldiers", [])[0].get("medkit", false) and int(normalized_loadout.get("stores", {}).get("Medkit", -1)) == 0, "legacy wound text and Medkit ownership migrate conservatively")
	var recovery_campaign := AegisCampaignState.new()
	recovery_campaign.configure(content)
	recovery_campaign.new_campaign("Recovery Test", "North America")
	var recovery_soldier: Dictionary = recovery_campaign.data.get("soldiers", [])[0]
	recovery_campaign.data["stores"]["Laser Rifle"] = 1
	recovery_campaign.change_soldier_loadout(String(recovery_soldier.get("id", "")), "weapon", "Laser Rifle")
	recovery_campaign.change_soldier_medkit(String(recovery_soldier.get("id", "")), true)
	recovery_campaign.complete_mission({"success":true,"rescued":1,"soldiers":{String(recovery_soldier.get("id", "")):{"hp":0,"kills":0,"medkit_charges":1}}})
	_check(recovery_soldier.get("status", "") == "KIA" and recovery_soldier.get("weapon", "") == "Unarmed" and recovery_soldier.get("armor", "") == "No Armor" and not recovery_soldier.get("medkit", true) and recovery_campaign.loadout_stock("Laser Rifle") == 1 and recovery_campaign.loadout_stock("Field Suit") == 1 and recovery_campaign.loadout_stock("Medkit") == 2, "successful mission recovery returns fallen soldier equipment and unused Medkit to local stores")
	var loss_campaign := AegisCampaignState.new()
	loss_campaign.configure(content)
	loss_campaign.new_campaign("Loss Test", "North America")
	var lost_soldier: Dictionary = loss_campaign.data.get("soldiers", [])[0]
	loss_campaign.change_soldier_medkit(String(lost_soldier.get("id", "")), true)
	loss_campaign.complete_mission({"success":false,"rescued":0,"soldiers":{String(lost_soldier.get("id", "")):{"hp":0,"kills":0,"medkit_charges":1}}})
	_check(not lost_soldier.get("medkit", true) and loss_campaign.loadout_stock("Medkit") == 1 and loss_campaign.data.get("reports", []).any(func(report): return String(report).contains("FIELD LOSS") and String(report).contains("Medkit")), "failed missions lose an unused Medkit carried by fallen personnel")
	var wound_campaign := AegisCampaignState.new()
	wound_campaign.configure(content)
	wound_campaign.new_campaign("Wound Test", "North America")
	var wounded_soldier: Dictionary = wound_campaign.data.get("soldiers", [])[0]
	wound_campaign.change_soldier_medkit(String(wounded_soldier.get("id", "")), true)
	wound_campaign.complete_mission({"success":true,"rescued":1,"soldiers":{String(wounded_soldier.get("id", "")):{"hp":int(wounded_soldier.get("health", 1)) - 11,"kills":0,"medkit_charges":0}}})
	_check(wounded_soldier.get("status", "") == "Wounded" and int(wounded_soldier.get("recovery_days", 0)) == 2 and not wounded_soldier.get("medkit", true) and wound_campaign.assigned_soldiers().size() == 5, "mission injury creates bounded unavailable recovery and consumes a used Medkit")
	wound_campaign.advance_minutes(24 * 60)
	_check(wounded_soldier.get("status", "") == "Wounded" and int(wounded_soldier.get("recovery_days", 0)) == 1, "one strategic midnight advances wound recovery by one day")
	var wound_save_path := "user://project_aegis_godot_wound_test_save.json"
	var wound_loaded := AegisCampaignState.new()
	wound_loaded.configure(content)
	_check(wound_campaign.save_campaign(wound_save_path) and wound_loaded.load_campaign(wound_save_path) and int(wound_loaded.data.get("soldiers", [])[0].get("recovery_days", 0)) == 1, "wound recovery persists at its exact remaining day")
	wound_loaded.advance_minutes(24 * 60)
	_check(wound_loaded.data.get("soldiers", [])[0].get("status", "") == "Ready" and int(wound_loaded.data.get("soldiers", [])[0].get("recovery_days", -1)) == 0 and wound_loaded.assigned_soldiers().size() == 6, "final recovery midnight returns the soldier to active duty")
	if FileAccess.file_exists(wound_save_path):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(wound_save_path))
	var legacy := campaign.data.duplicate(true)
	legacy.erase("scientists")
	legacy.erase("engineers")
	legacy.erase("manufacturing_queue")
	legacy.erase("manufacturing_assigned_engineers")
	legacy.erase("next_manufacturing_order_id")
	legacy.erase("facility_construction_orders")
	legacy.erase("next_facility_construction_order_id")
	legacy["base"].erase("facility_counts")
	legacy["research"] = {"active": "Laser Weapons", "progress": 8}
	var migrated := campaign.normalize_save(legacy)
	_check(int(migrated.get("scientists", 0)) == 5 and int(migrated.get("engineers", -1)) == 0 and int(migrated.get("base", {}).get("facility_counts", {}).get("quarters", 0)) == 1 and int(migrated.get("base", {}).get("facility_counts", {}).get("workshop", 0)) == 1 and int(migrated.get("research", {}).get("assigned_scientists", 0)) == 5 and migrated.get("personnel_orders", []).is_empty() and migrated.get("manufacturing_queue", []).is_empty() and int(migrated.get("manufacturing_assigned_engineers", -1)) == 0 and migrated.get("facility_construction_orders", []).is_empty(), "legacy native saves receive conservative personnel manufacturing and construction defaults")
	var personnel_campaign := AegisCampaignState.new()
	personnel_campaign.configure(content)
	personnel_campaign.new_campaign("Queue Test", "North America")
	personnel_campaign.data["base"]["facility_counts"]["workshop"] = 0
	_check(not personnel_campaign.personnel_hiring_blocker("engineer").is_empty(), "engineer hiring requires a local Workshop")
	personnel_campaign.data["base"]["facilities"].append("quarters")
	personnel_campaign.data["base"]["facility_counts"]["quarters"] = 2
	personnel_campaign.data["base"]["facility_counts"]["workshop"] = 1
	var funds_before := int(personnel_campaign.data.get("funds", 0))
	_check(not personnel_campaign.queue_manufacturing("Laser Rifle") and int(personnel_campaign.data.get("funds", 0)) == funds_before and int(personnel_campaign.data.get("stores", {}).get("Laser Rifle", 0)) == 0, "Laser Rifle production remains blocked before its research unlock")
	_check(personnel_campaign.hire_personnel("soldier") and personnel_campaign.hire_personnel("scientist") and personnel_campaign.hire_personnel("engineer"), "personnel office accepts affordable hires with reserved capacity")
	_check(personnel_campaign.pending_personnel_count() == 3 and personnel_campaign.projected_personnel_used() == 14 and int(personnel_campaign.data.get("funds", 0)) == funds_before - 305, "pending hires reserve quarters and deduct established costs")
	var engineer_order: Dictionary = personnel_campaign.personnel_orders().filter(func(order): return order.get("type", "") == "engineer")[0]
	_check(personnel_campaign.cancel_personnel_order(engineer_order.get("id", "")) and personnel_campaign.pending_personnel_count() == 2 and int(personnel_campaign.data.get("funds", 0)) == funds_before - 260, "personnel cancellation releases its reservation and returns half cost")
	personnel_campaign.advance_minutes(2 * 24 * 60)
	_check(personnel_campaign.pending_personnel_count() == 2 and personnel_campaign.living_soldier_count() == 6 and int(personnel_campaign.data.get("scientists", 0)) == 5, "personnel orders do not arrive before the third midnight")
	personnel_campaign.advance_minutes(24 * 60)
	var arrived_recruit: Dictionary = personnel_campaign.data.get("soldiers", [])[-1]
	_check(personnel_campaign.pending_personnel_count() == 0 and personnel_campaign.living_soldier_count() == 7 and int(personnel_campaign.data.get("scientists", 0)) == 6 and not arrived_recruit.get("assigned", true) and arrived_recruit.get("weapon", "") == "Unarmed" and arrived_recruit.get("armor", "") == "No Armor", "third midnight delivers unassigned recruits without creating free equipment")
	var specialist_campaign := AegisCampaignState.new()
	specialist_campaign.configure(content)
	specialist_campaign.new_campaign("Specialist Capacity Test", "North America")
	specialist_campaign.data["base"]["facility_counts"]["quarters"] = 3
	specialist_campaign.data["scientists"] = 10
	specialist_campaign.data["engineers"] = 10
	_check(specialist_campaign.projected_personnel_used() == 26 and specialist_campaign.personnel_capacity() == 36 and specialist_campaign.personnel_hiring_blocker("soldier").is_empty() and specialist_campaign.personnel_hiring_blocker("scientist").contains("Laboratory full") and specialist_campaign.personnel_hiring_blocker("engineer").contains("Workshop full"), "spare quarters do not bypass full Laboratory or Workshop capacity")
	var construction_campaign := AegisCampaignState.new()
	construction_campaign.configure(content)
	construction_campaign.new_campaign("Construction Test", "North America")
	construction_campaign.data["scientists"] = 10
	construction_campaign.data["engineers"] = 10
	var construction_funds_before := int(construction_campaign.data.get("funds", 0))
	_check(construction_campaign.begin_facility_construction("quarters") and construction_campaign.begin_facility_construction("lab") and construction_campaign.begin_facility_construction("workshop") and construction_campaign.facility_construction_orders().size() == 3 and int(construction_campaign.data.get("funds", 0)) == construction_funds_before - 1150, "facility projects prepay browser-established costs into three concurrent slots")
	var queue_full_funds := int(construction_campaign.data.get("funds", 0))
	_check(not construction_campaign.begin_facility_construction("quarters") and int(construction_campaign.data.get("funds", 0)) == queue_full_funds and construction_campaign.personnel_capacity() == 12 and construction_campaign.scientist_capacity() == 10 and construction_campaign.engineer_capacity() == 10 and construction_campaign.projected_personnel_capacity() == 24 and construction_campaign.projected_scientist_capacity() == 20 and construction_campaign.projected_engineer_capacity() == 20, "pending construction is bounded and does not grant operational capacity early")
	construction_campaign.advance_minutes(2 * 24 * 60)
	_check(construction_campaign.facility_construction_orders().map(func(order): return int(order.get("days_remaining", 0))) == [1, 3, 2] and construction_campaign.facility_count("quarters") == 1 and construction_campaign.facility_count("lab") == 1 and construction_campaign.facility_count("workshop") == 1, "concurrent facility projects retain independent countdowns")
	var construction_save_path := "user://project_aegis_godot_construction_test_save.json"
	_check(construction_campaign.save_campaign(construction_save_path), "partial facility construction writes native save state")
	var construction_loaded := AegisCampaignState.new()
	construction_loaded.configure(content)
	_check(construction_loaded.load_campaign(construction_save_path) and construction_loaded.facility_construction_orders().map(func(order): return int(order.get("days_remaining", 0))) == [1, 3, 2], "partial facility construction reloads exact countdowns")
	construction_campaign.advance_minutes(24 * 60)
	_check(construction_campaign.facility_count("quarters") == 2 and construction_campaign.facility_construction_orders().size() == 2 and construction_campaign.personnel_capacity() == 24, "completed Living Quarters activate twelve local personnel spaces")
	construction_campaign.advance_minutes(2 * 24 * 60)
	_check(construction_campaign.facility_construction_orders().is_empty() and construction_campaign.scientist_capacity() == 20 and construction_campaign.engineer_capacity() == 20, "Laboratory and Workshop capacity activate only on their completion days")
	var construction_cancel_funds := int(construction_campaign.data.get("funds", 0))
	construction_campaign.begin_facility_construction("quarters")
	var cancelled_construction: Dictionary = construction_campaign.facility_construction_orders()[0]
	_check(construction_campaign.cancel_facility_construction(String(cancelled_construction.get("id", ""))) and construction_campaign.facility_construction_orders().is_empty() and int(construction_campaign.data.get("funds", 0)) == construction_cancel_funds - 150, "facility cancellation returns half of prepaid construction cost")
	construction_campaign.begin_facility_construction("quarters")
	construction_campaign.advance_minutes(3 * 24 * 60)
	_check(construction_campaign.personnel_capacity() == 36 and construction_campaign.personnel_hiring_blocker("scientist").is_empty() and construction_campaign.personnel_hiring_blocker("engineer").is_empty(), "completed capacity expansion reopens specialist hiring")
	if FileAccess.file_exists(construction_save_path):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(construction_save_path))
	campaign.set_research_staffing(3)
	_check(campaign.research_assigned_scientists() == 3 and campaign.research_daily_progress() == 6, "research staffing remains bounded by available scientists and lab capacity")
	var research_before := int(campaign.data.get("research", {}).get("progress", 0))
	campaign.advance_minutes(24 * 60)
	_check(int(campaign.data.get("day", 0)) == 2 and int(campaign.data.get("research", {}).get("progress", 0)) == research_before + 6, "one strategic day advances research by assigned scientist output")
	campaign.data["research"]["progress"] = 99
	campaign.data["research"]["completed"] = false
	campaign.set_research_staffing(5)
	campaign.advance_minutes(24 * 60)
	_check(int(campaign.data.get("research", {}).get("progress", 0)) == 100 and campaign.research_assigned_scientists() == 0 and String(campaign.data.get("reports", [""])[0]).begins_with("RESEARCH COMPLETE"), "completed research releases scientists and records one report")
	_check(campaign.completed_research().has("Laser Weapons") and campaign.has_technology_unlock("laser_rifle_production") and campaign.available_research_projects().any(func(project): return project.get("id", "") == "Laser Power Output 1"), "Laser Weapons completion unlocks production and its follow-on project")
	campaign.data["engineers"] = 10
	var laser_funds_before := int(campaign.data.get("funds", 0))
	var laser_stores_before := int(campaign.data.get("stores", {}).get("Laser Rifle", 0))
	_check(campaign.queue_manufacturing("Laser Rifle") and int(campaign.data.get("funds", 0)) == laser_funds_before - 180 and int(campaign.data.get("stores", {}).get("Laser Rifle", 0)) == laser_stores_before, "unlocked Laser Rifle production prepays without instant delivery")
	campaign.advance_minutes(24 * 60)
	_check(int(campaign.data.get("stores", {}).get("Laser Rifle", 0)) == laser_stores_before and int(campaign.manufacturing_queue()[0].get("progress", 0)) == 30, "Laser Rifle production remains queued after one staffed day")
	campaign.advance_minutes(24 * 60)
	_check(campaign.manufacturing_queue().is_empty() and campaign.manufacturing_assigned_engineers() == 0 and int(campaign.data.get("stores", {}).get("Laser Rifle", 0)) == laser_stores_before + 1, "Laser Rifle production completes into local stores after required work")
	_check(campaign.start_research_project("Laser Power Output 1") and campaign.research_required_progress() == 180 and campaign.research_assigned_scientists() == 0, "follow-on research opens unstaffed with its own point requirement")
	var manufacturing_campaign := AegisCampaignState.new()
	manufacturing_campaign.configure(content)
	manufacturing_campaign.new_campaign("Manufacturing Test", "North America")
	manufacturing_campaign.data["engineers"] = 4
	var medkits_before := int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0))
	var manufacturing_funds_before := int(manufacturing_campaign.data.get("funds", 0))
	_check(manufacturing_campaign.queue_manufacturing("Medkit") and manufacturing_campaign.queue_manufacturing("Medkit") and manufacturing_campaign.manufacturing_queue().size() == 2 and int(manufacturing_campaign.data.get("funds", 0)) == manufacturing_funds_before - 80, "manufacturing orders prepay into a FIFO queue")
	_check(manufacturing_campaign.manufacturing_assigned_engineers() == 4 and manufacturing_campaign.manufacturing_daily_progress() == 12 and not manufacturing_campaign.set_manufacturing_staffing(20), "manufacturing staffing clamps to local engineers and Workshop capacity")
	manufacturing_campaign.advance_minutes(24 * 60)
	_check(int(manufacturing_campaign.manufacturing_queue()[0].get("progress", 0)) == 12 and int(manufacturing_campaign.manufacturing_queue()[1].get("progress", 0)) == 0 and int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0)) == medkits_before, "one strategic midnight advances only the active manufacturing order")
	manufacturing_campaign.advance_minutes(24 * 60)
	_check(manufacturing_campaign.manufacturing_queue().size() == 1 and int(manufacturing_campaign.manufacturing_queue()[0].get("progress", 0)) == 6 and int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0)) == medkits_before + 1, "completed manufacturing carries overflow into the next FIFO order")
	manufacturing_campaign.set_manufacturing_staffing(2)
	manufacturing_campaign.advance_minutes(2 * 24 * 60)
	_check(manufacturing_campaign.manufacturing_queue().is_empty() and manufacturing_campaign.manufacturing_assigned_engineers() == 0 and int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0)) == medkits_before + 2, "empty manufacturing queues release assigned engineers")
	var cancellation_funds_before := int(manufacturing_campaign.data.get("funds", 0))
	manufacturing_campaign.queue_manufacturing("Medkit")
	var cancellation_order: Dictionary = manufacturing_campaign.manufacturing_queue()[0]
	_check(manufacturing_campaign.cancel_manufacturing_order(String(cancellation_order.get("id", ""))) and manufacturing_campaign.manufacturing_queue().is_empty() and int(manufacturing_campaign.data.get("funds", 0)) == cancellation_funds_before - 20, "manufacturing cancellation returns half of prepaid cost")
	manufacturing_campaign.queue_manufacturing("Medkit")
	manufacturing_campaign.set_manufacturing_staffing(2)
	manufacturing_campaign.advance_minutes(24 * 60)
	var manufacturing_normalized := manufacturing_campaign.normalize_save(manufacturing_campaign.data)
	_check(manufacturing_normalized.get("manufacturing_queue", []).size() == 1 and int(manufacturing_normalized.get("manufacturing_queue", [])[0].get("progress", 0)) == 6 and int(manufacturing_normalized.get("manufacturing_assigned_engineers", 0)) == 2, "partially completed manufacturing state normalizes with exact progress and staffing")
	_check(campaign.begin_mission_travel(), "selected incident accepts a staffed Skyranger launch")
	_check(not campaign.advance_minutes(15), "outbound travel remains active at midpoint")
	_check(campaign.advance_minutes(15), "outbound travel completes after its duration")
	var save_path := "user://project_aegis_godot_test_save.json"
	var saved_ballistic_stock := campaign.loadout_stock("Ballistic Rifle")
	var saved_laser_stock := campaign.loadout_stock("Laser Rifle")
	var saved_medkit_stock := campaign.loadout_stock("Medkit")
	_check(campaign.save_campaign(save_path), "native save writes JSON")
	var loaded := AegisCampaignState.new()
	loaded.configure(content)
	_check(loaded.load_campaign(save_path), "native save loads")
	_check(loaded.data.get("base", {}).get("name", "") == "Test Aegis" and loaded.data.get("soldiers", [])[0].get("weapon", "") == "Laser Rifle" and loaded.data.get("soldiers", [])[0].get("medkit", false) and loaded.loadout_stock("Ballistic Rifle") == saved_ballistic_stock and loaded.loadout_stock("Laser Rifle") == saved_laser_stock and loaded.loadout_stock("Medkit") == saved_medkit_stock, "native save round-trip preserves campaign and exact loadout stock state")
	var absolute_path := ProjectSettings.globalize_path(save_path)
	if FileAccess.file_exists(save_path):
		DirAccess.remove_absolute(absolute_path)

func _test_browser_import(content: Dictionary) -> void:
	var app: Node = load("res://godot/main.tscn").instantiate()
	var payload: Dictionary = app._browser_import_test_payload()
	app.free()
	var importer := AegisCampaignState.new()
	importer.configure(content)
	var preview := importer.browser_import_preview(payload)
	_check(preview.get("valid", false) and preview.get("source_build", "") == "v0.26.07.17.0137_TEST_FIXTURE", "browser campaign wrapper produces a compatible preview")
	_check(preview.get("base_name", "") == "Pacific Aegis" and int(preview.get("soldier_count", 0)) == 8 and int(preview.get("incident_count", 0)) == 1, "browser import preview selects the active base and counts mapped content")
	var future_payload := payload.duplicate(true)
	future_payload["saveFormatVersion"] = AegisCampaignState.SAVE_FORMAT + 1
	_check(not importer.browser_import_preview(future_payload).get("valid", false), "future browser save formats are rejected")
	_check(not importer.browser_import_preview({"kind": AegisCampaignState.BROWSER_SLOT_BACKUP_KIND, "slots": []}).get("valid", false), "all-slot backups require an individual campaign export")
	var source_path := "user://project_aegis_browser_import_source_test.json"
	var imported_path := "user://project_aegis_browser_import_copy_test.json"
	var source_file := FileAccess.open(source_path, FileAccess.WRITE)
	source_file.store_string(JSON.stringify(payload, "  "))
	source_file = null
	var source_before := FileAccess.get_file_as_string(source_path)
	var parsed_source: Variant = JSON.parse_string(source_before)
	_check(parsed_source is Dictionary and importer.import_browser_save(parsed_source, "browser-source-test.json"), "browser export imports into native campaign memory")
	_check(importer.active_save_path == AegisCampaignState.IMPORTED_SAVE_PATH and AegisCampaignState.IMPORTED_SAVE_PATH != AegisCampaignState.SAVE_PATH, "browser import selects a separate imported-copy save slot")
	_check(importer.data.get("base", {}).get("name", "") == "Pacific Aegis" and importer.data.get("base", {}).get("facilities", []).has("radar") and importer.facility_count("quarters") == 2 and importer.personnel_capacity() == 24 and importer.personnel_used() == 20 and importer.scientist_capacity() == 10 and importer.research_assigned_scientists() == 10 and importer.research_required_progress() == 180 and int(importer.data.get("month", 0)) == 4 and int(importer.data.get("day", 0)) == 12 and int(importer.data.get("minutes", 0)) == 845 and importer.data.get("research", {}).get("active", "") == "Laser Power Output 1" and importer.completed_research().has("Laser Weapons") and importer.has_technology_unlock("laser_rifle_production"), "browser date clock base capacity personnel and research map into native state")
	var imported_roster: Array = importer.data.get("soldiers", [])
	_check(imported_roster.size() == 8 and importer.assigned_soldiers().size() == 6 and int(imported_roster[0].get("accuracy", 0)) == 74 and imported_roster[0].get("callsign", "") == "Nested" and imported_roster[0].get("trait", "") == "Methodical" and imported_roster[5].get("status", "") == "Wounded" and int(imported_roster[5].get("recovery_days", 0)) == 3 and not imported_roster[5].get("medkit", true), "nested browser identity stats wounds and active squad normalize within native transport capacity")
	_check(importer.selected_incident().get("name", "") == "Port Meridian Attack" and int(importer.selected_incident().get("required_rescues", 0)) == 2 and importer.begin_mission_travel(), "browser incident and rescue requirement remain launchable")
	_check(importer.save_campaign(imported_path) and FileAccess.get_file_as_string(source_path) == source_before, "saving the imported copy leaves the browser source file unchanged")
	var reloaded := AegisCampaignState.new()
	reloaded.configure(content)
	_check(reloaded.load_campaign(imported_path) and reloaded.is_imported_copy() and reloaded.data.get("save_origin", {}).get("source_name", "") == "browser-source-test.json", "imported-copy round trip preserves browser provenance")
	for cleanup_path in [source_path, imported_path]:
		if FileAccess.file_exists(cleanup_path):
			DirAccess.remove_absolute(ProjectSettings.globalize_path(cleanup_path))

func _test_tactical(content: Dictionary) -> void:
	var board := AegisTacticalBoard.new()
	get_root().add_child(board)
	var incident: Dictionary = content.get("incidents", [])[0]
	var tactical_roster: Array = content.get("soldiers", []).duplicate(true)
	tactical_roster[0]["weapon"] = "Laser Rifle"
	tactical_roster[0]["armor"] = "Field Suit"
	tactical_roster[0]["medkit"] = true
	tactical_roster[1]["weapon"] = "Unarmed"
	tactical_roster[1]["armor"] = "No Armor"
	board.begin_battle(incident, tactical_roster, content)
	_check(board.units.filter(func(unit): return unit.get("team", "") == "human").size() == 6, "tactical deployment includes six soldiers")
	_check(board.units.filter(func(unit): return unit.get("team", "") == "civilian").size() == 2, "tactical incident includes rescue civilians")
	_check(board.skyranger_clear_of_buildings(), "Skyranger footprint and ramp remain separated from buildings")
	var multi_roster: Array = tactical_roster.duplicate(true)
	for multi_source in tactical_roster:
		var reinforcement: Dictionary = multi_source.duplicate(true)
		reinforcement["id"] = "%s-bravo" % String(multi_source.get("id", "soldier"))
		multi_roster.append(reinforcement)
	var alpha_ids: Array = multi_roster.slice(0, 6).map(func(unit): return unit.get("id", ""))
	var bravo_ids: Array = multi_roster.slice(6, 12).map(func(unit): return unit.get("id", ""))
	var multi_incident: Dictionary = incident.duplicate(true)
	multi_incident["transport_count"] = 2
	multi_incident["tactical_map_tier"] = "medium"
	multi_incident["response_squad_deployments"] = [{"squad_id":"alpha","soldier_ids":alpha_ids},{"squad_id":"bravo","soldier_ids":bravo_ids}]
	var multi_board := AegisTacticalBoard.new()
	get_root().add_child(multi_board)
	multi_board.begin_battle(multi_incident, multi_roster, content)
	var multi_humans: Array = multi_board.units.filter(func(unit): return unit.get("team", "") == "human")
	var multi_starts: Array = multi_board._soldier_start_cells()
	var formations_ready := multi_humans.size() == 12
	for multi_human in multi_humans:
		var assigned_transport := int(multi_human.get("transport_index", -1))
		formations_ready = formations_ready and assigned_transport in [0, 1] and multi_starts[assigned_transport].has(multi_human.get("cell", Vector2i.ZERO))
	_check(multi_board.transport_count == 2 and multi_board.skyranger_placements.size() == 2 and multi_board.extraction_cells.size() == 18 and formations_ready and multi_board.skyranger_clear_of_buildings(), "two dispatched Skyrangers deploy their exact squads at separate ramps")
	var large_incident: Dictionary = incident.duplicate(true)
	large_incident["tactical_map_tier"] = "large"
	var large_board := AegisTacticalBoard.new()
	get_root().add_child(large_board)
	large_board.begin_battle(large_incident, tactical_roster, content)
	_check(board.grid_width == 20 and board.grid_height == 14 and board.units.filter(func(unit): return unit.get("team", "") == "civilian").size() == 2 and multi_board.grid_width == 26 and multi_board.grid_height == 18 and multi_board.units.filter(func(unit): return unit.get("team", "") == "civilian").size() == 4 and large_board.grid_width == 32 and large_board.grid_height == 22 and large_board.units.filter(func(unit): return unit.get("team", "") == "civilian").size() == 6, "small medium and large maps increase battlefield area and civilian capacity")
	_check(AegisHexRules.path(Vector2i(2, 2), Vector2i(0, 2), {}, {}, multi_board.grid_width, multi_board.grid_height).is_empty() and AegisHexRules.neighbors(Vector2i(1, 1), multi_board.grid_width, multi_board.grid_height).all(func(cell): return multi_board._inside(cell)) and multi_board.units.all(func(unit): return multi_board._inside(unit.get("cell", Vector2i.ZERO))), "pathfinding and deployment reject cells on or beyond the map perimeter")
	large_board.queue_free()
	multi_board.queue_free()
	var wall_key := AegisHexRules.key(Vector2i(10, 2))
	var wall: Dictionary = board.covers.get(wall_key, {})
	var shooter: Dictionary = board.units.filter(func(unit): return unit.get("team", "") == "human")[0]
	_check(shooter.get("weapon", "") == "Laser Rifle" and int(shooter.get("weapon_damage", 0)) == 22 and int(shooter.get("weapon_range", 0)) == 9 and int(shooter.get("fire_tu", 0)) == 14 and int(shooter.get("damage_reduction", 0)) == 2 and int(shooter.get("medkit_charges", 0)) == 1, "saved Laser Rifle Field Suit and Medkit profiles enter tactical deployment")
	var unarmed_soldier: Dictionary = board.units.filter(func(unit): return unit.get("team", "") == "human")[1]
	var unarmed_target: Dictionary = board.units.filter(func(unit): return unit.get("team", "") == "alien")[0]
	unarmed_soldier["cell"] = unarmed_target.get("cell", Vector2i.ZERO) + Vector2i(-1, 0)
	var unarmed_tu := int(unarmed_soldier.get("tu", 0))
	board._try_shoot_unit(unarmed_soldier, unarmed_target)
	_check(int(unarmed_soldier.get("tu", 0)) == unarmed_tu and int(unarmed_target.get("hp", 0)) == int(unarmed_target.get("max_hp", 0)), "unarmed tactical soldiers cannot fire or spend TU")
	var laser_target: Dictionary = board.units.filter(func(unit): return unit.get("team", "") == "alien")[1]
	shooter["cell"] = Vector2i(6, 10)
	laser_target["cell"] = Vector2i(14, 10)
	laser_target["revealed"] = true
	shooter["tu"] = 64
	var selection_tu_updates: Array = []
	board.selection_changed.connect(func(unit: Dictionary):
		if not unit.is_empty():
			selection_tu_updates.append(int(unit.get("tu", -1)))
	)
	board._select_unit(String(shooter.get("id", "")))
	board._try_shoot_unit(shooter, laser_target)
	_check(int(shooter.get("tu", 0)) == 50, "Laser Rifle fires at range eight for its fourteen TU profile")
	_check(selection_tu_updates.size() >= 2 and int(selection_tu_updates[0]) == 64 and int(selection_tu_updates[-1]) == 50, "selected soldier feedback republishes current TU after firing")
	shooter["hp"] = int(shooter.get("max_hp", 1)) - 20
	_check(board.use_selected_medkit() and int(shooter.get("hp", 0)) == int(shooter.get("max_hp", 0)) - 8 and int(shooter.get("tu", 0)) == 38 and int(shooter.get("medkit_charges", -1)) == 0, "issued Medkit restores twelve HP spends twelve TU and is consumed")
	var post_medkit_state := [int(shooter.get("hp", 0)), int(shooter.get("tu", 0))]
	_check(not board.use_selected_medkit() and [int(shooter.get("hp", 0)), int(shooter.get("tu", 0))] == post_medkit_state, "consumed Medkit cannot be reused or spend additional TU")
	shooter["cell"] = Vector2i(8, 2)
	shooter["tu"] = 64
	board._try_shoot_cover(shooter, wall)
	board._try_shoot_cover(shooter, wall)
	_check(wall.get("type", "") == "rubble" and not wall.get("hard", true), "destroyed wall becomes nonblocking rubble")
	_check(not board._blocked_cells().has(wall_key), "destroyed wall is removed from tactical blockers")
	var breach_route := AegisHexRules.path(Vector2i(9, 2), Vector2i(10, 2), board._blocked_cells(), {}, board.GRID_WIDTH, board.GRID_HEIGHT)
	_check(not breach_route.is_empty(), "soldiers aliens and civilians can path through a breach")
	var civilian: Dictionary = board.units.filter(func(unit): return unit.get("team", "") == "civilian")[0]
	shooter["cell"] = civilian.get("cell", Vector2i.ZERO) + Vector2i(-1, 0)
	shooter["tu"] = 16
	board._try_contact_civilian(shooter, civilian)
	_check(civilian.get("escort_id", "") == shooter.get("id", "") and int(shooter.get("tu", 0)) == 8, "civilian contact establishes escort and spends eight TU")
	var ai_board := AegisTacticalBoard.new()
	get_root().add_child(ai_board)
	ai_board.begin_battle(incident, tactical_roster, content)
	var ai_humans: Array = ai_board.units.filter(func(unit): return unit.get("team", "") == "human")
	var ai_aliens: Array = ai_board.units.filter(func(unit): return unit.get("team", "") == "alien")
	var priority_civilian: Dictionary = ai_board.units.filter(func(unit): return unit.get("team", "") == "civilian")[0]
	priority_civilian["cell"] = ai_humans[0].get("cell", Vector2i.ZERO) + Vector2i(1, 0)
	ai_board._assign_precontact_civilian_claim(priority_civilian, [ai_humans[0]])
	_check(priority_civilian.get("priority_escort_id", "") == ai_humans[0].get("id", "") and ai_humans[0].get("priority_civilian_id", "") == priority_civilian.get("id", ""), "pre-contact civilian sighting assigns a persistent soldier rescue priority")
	ai_aliens[0]["revealed"] = true
	ai_aliens[0]["visible"] = false
	ai_aliens[0]["last_known_cell"] = Vector2i(9, 6)
	var tactical_source := FileAccess.get_file_as_string("res://godot/scripts/tactical_board.gd")
	_check(ai_board._known_alien_contact_cells().has(Vector2i(9, 6)) and tactical_source.contains("if rescue_target == null and _inside(contact_target_cell)") and tactical_source.contains("_known_alien_contact_cells().is_empty() and rescued < required_rescues"), "non-escort AI soldiers converge on remembered alien contact areas")
	var distress_board := AegisTacticalBoard.new()
	get_root().add_child(distress_board)
	distress_board.begin_battle(incident, tactical_roster, content)
	var distress_humans: Array = distress_board.units.filter(func(unit): return unit.get("team", "") == "human")
	var distress_aliens: Array = distress_board.units.filter(func(unit): return unit.get("team", "") == "alien")
	var distress_victim: Dictionary = distress_humans[0]
	var distress_responder: Dictionary = distress_humans[1]
	var distress_attacker: Dictionary = distress_aliens[0]
	distress_board.turn_number = 3
	distress_victim.cell = Vector2i(10, 10)
	distress_responder.cell = Vector2i(2, 2)
	distress_attacker.cell = Vector2i(16, 10)
	distress_board._record_tactical_distress(distress_victim, distress_attacker, true)
	var far_distress: Dictionary = distress_board._ai_distress_target(distress_responder)
	distress_responder.cell = Vector2i(9, 10)
	var near_distress: Dictionary = distress_board._ai_distress_target(distress_responder)
	distress_victim.hp = 0
	distress_responder.cell = Vector2i(2, 2)
	var down_distress: Dictionary = distress_board._ai_distress_target(distress_responder)
	_check(far_distress.get("stage", "") == "converge" and far_distress.get("cell", Vector2i.ZERO) == Vector2i(10, 10) and near_distress.get("stage", "") == "search" and near_distress.get("cell", Vector2i.ZERO) == Vector2i(16, 10) and down_distress.get("stage", "") == "converge" and tactical_source.contains("_record_tactical_distress(target, alien, roll <= chance)"), "non-escort AI soldiers answer wounded and downed squad distress calls then search the firing direction")
	distress_board.queue_free()
	ai_humans[0]["rank"] = "Captain"
	ai_humans[0]["missions"] = 12
	var doctrine_summary := ai_board.ai_command_summary()
	var rookie_doctrine: Dictionary = ai_board.ai_doctrine_for_commander({"rank":"Rookie","missions":0})
	var veteran_doctrine: Dictionary = ai_board.ai_doctrine_for_commander({"rank":"Captain","missions":12})
	_check(rookie_doctrine.get("key", "") == "wedge" and veteran_doctrine.get("key", "") == "diamond" and doctrine_summary.contains("Diamond Security"), "rank and mission experience unlock advanced commander doctrine")
	ai_humans[1]["tu"] = 62
	var movement_plan: Dictionary = ai_board._ai_movement_plan(ai_humans[1], ai_aliens[0].cell, int(ai_humans[1].get("fire_tu", 14)), String(ai_humans[1].get("ai_role", "")))
	_check(int(movement_plan.get("steps", 0)) <= ai_board.AI_MAX_MOVE_STEPS and int(movement_plan.get("steps", 0)) * ai_board.MOVE_TU <= 62 - int(ai_humans[1].get("fire_tu", 14)) and not String(ai_humans[1].get("ai_role", "")).is_empty(), "formation movement is bounded and preserves selected-shot TU")
	var reaction_shooter: Dictionary = ai_humans[1]
	var reaction_target: Dictionary = ai_aliens[0]
	reaction_shooter["cell"] = Vector2i(6, 10)
	reaction_target["cell"] = Vector2i(7, 10)
	reaction_shooter["tu"] = 62
	reaction_shooter["reactions"] = 100
	reaction_shooter["accuracy"] = 100
	for serial in range(100):
		if AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), 900 + (serial + 1) * 31 + ai_board.turn_number * 47) <= 95:
			ai_board.action_serial = serial
			break
	var reaction_tu_before := int(reaction_shooter.get("tu", 0))
	ai_board._reaction_fire_for_move(reaction_target, {})
	_check(int(reaction_shooter.get("tu", 0)) == reaction_tu_before - int(reaction_shooter.get("fire_tu", 14)), "Reaction stat can trigger a TU-consuming shot during alien movement")
	for hidden_alien in ai_aliens:
		hidden_alien["visible"] = false
	_check(ai_board.tactical_map_contacts().get("aliens", []).is_empty(), "AI-command tactical contacts preserve live fog of war")
	for secure_alien in ai_aliens:
		secure_alien["hp"] = 0
	var tracked_civilians: Array = ai_board.units.filter(func(unit): return unit.get("team", "") == "civilian")
	tracked_civilians[0]["cell"] = Vector2i(18, 1)
	tracked_civilians[1]["cell"] = Vector2i(18, 12)
	for tracked_civilian in tracked_civilians:
		tracked_civilian["vip_tracker"] = true
		tracked_civilian["revealed"] = false
		tracked_civilian["visible"] = false
		tracked_civilian["escort_id"] = ""
	ai_board.explored_cells.clear()
	var secure_assignments: Dictionary = ai_board._ai_secure_search_assignments(ai_humans)
	var tracker_assignments: Array = secure_assignments.values().filter(func(assignment): return assignment.get("kind", "") == "tracker")
	var building_assignments: Array = secure_assignments.values().filter(func(assignment): return assignment.get("kind", "") == "building")
	var assignment_zones := {}
	for secure_assignment in secure_assignments.values():
		assignment_zones[secure_assignment.get("zone_id", "")] = true
	ai_board._refresh_explored_cells([ai_humans[0]])
	_check(secure_assignments.size() == ai_humans.size() and tracker_assignments.size() == 2 and tracker_assignments[0].get("tracker_id", "") != tracker_assignments[1].get("tracker_id", "") and building_assignments.size() == 1 and building_assignments[0].get("building_id", "") == "outpost" and assignment_zones.size() == secure_assignments.size() and ai_board._active_vip_tracker_targets().size() == 2 and ai_board.explored_cells.size() > 0 and ai_board.explored_cells.size() <= ai_board.grid_width * ai_board.grid_height and tactical_source.contains("var tracker_guidance :=") and tactical_source.contains("secure_rescue or tracker_guidance") and tactical_source.contains("var search_reserve := 0 if secure_rescue"), "tracked VIP pings guide idle AI searchers and split secure searches across buildings and sectors")
	var console_soldier: Dictionary = ai_humans[2]
	ai_board._select_unit(String(console_soldier.get("id", "")))
	var console_tu_before := int(console_soldier.get("tu", 0))
	var console_ready := ai_board.set_selected_reserve_mode("snap") and ai_board.toggle_selected_kneeling()
	var console_inventory := ai_board.selected_inventory()
	_check(console_ready and int(console_soldier.get("tu", 0)) == console_tu_before - 4 and console_inventory.get("reserve_mode", "") == "snap" and console_inventory.get("kneeling", false) and ai_board.bleed_selected_tu(), "classic reserve stance inventory and Done controls mutate live tactical state")
	console_soldier["tu"] = 60
	console_soldier["reserve_mode"] = "none"
	console_soldier["reserve_tu"] = 0
	ai_board._select_unit(String(console_soldier.get("id", "")))
	var hand_inventory := ai_board.selected_inventory()
	_check(hand_inventory.get("right_hand", "") == console_soldier.get("weapon", "") and hand_inventory.get("left_hand", "") == "Frag Grenade" and int(hand_inventory.get("grenade_charges", 0)) == 1, "tactical deployment exposes functional right and left hand slots")
	var prime_tu_before := int(console_soldier.get("tu", 0))
	_check(ai_board.prime_selected_grenade() and int(console_soldier.get("tu", 0)) == prime_tu_before - ai_board.GRENADE_PRIME_TU and console_soldier.get("grenade_primed", false) and console_soldier.get("targeting_mode", "") == "grenade", "grenade preparation spends four TU and enters explicit targeting")
	var grenade_target := Vector2i(8, 8)
	var grenade_wall_key := AegisHexRules.key(grenade_target)
	ai_board.covers[grenade_wall_key] = {"cell":grenade_target,"type":"wall","hard":true,"hp":30,"max_hp":30,"building":"test"}
	var grenade_alien: Dictionary = ai_aliens[1]
	grenade_alien["cell"] = Vector2i(8, 9)
	grenade_alien["hp"] = 30
	var throw_tu_before := int(console_soldier.get("tu", 0))
	_check(ai_board.grenade_blast_cells(grenade_target).size() == 7 and ai_board._try_throw_grenade(console_soldier, grenade_target) and int(console_soldier.get("tu", 0)) == throw_tu_before - ai_board.GRENADE_THROW_TU and int(console_soldier.get("grenade_charges", -1)) == 0 and int(grenade_alien.get("hp", 0)) < 30 and not ai_board._blocked_cells().has(grenade_wall_key), "grenade throw uses a bounded seven-hex blast damages units and opens traversable rubble")
	var fair_board := AegisTacticalBoard.new()
	get_root().add_child(fair_board)
	fair_board.begin_battle(incident, tactical_roster, content)
	var fair_humans: Array = fair_board.units.filter(func(unit): return unit.get("team", "") == "human")
	var fair_aliens: Array = fair_board.units.filter(func(unit): return unit.get("team", "") == "alien")
	var fair_civilians: Array = fair_board.units.filter(func(unit): return unit.get("team", "") == "civilian")
	fair_board.covers.clear()
	fair_humans[0]["cell"] = Vector2i(18, 2)
	for fair_index in range(1, fair_humans.size()):
		fair_humans[fair_index]["cell"] = Vector2i(6, fair_index * 2)
	for fair_alien in fair_aliens:
		fair_alien["hp"] = 0
	fair_aliens[0]["hp"] = int(fair_aliens[0].get("max_hp", 30))
	fair_aliens[0]["cell"] = Vector2i(12, 6)
	fair_aliens[0]["visible"] = true
	fair_civilians[0]["cell"] = Vector2i(17, 2)
	fair_civilians[0]["escort_id"] = fair_humans[0].get("id", "")
	fair_civilians[0]["escort_order"] = 1
	fair_civilians[0]["revealed"] = true
	fair_civilians[1]["cell"] = Vector2i(18, 12)
	for fair_civilian in fair_civilians:
		fair_civilian["revealed"] = true
	var fair_state_frames: Array = []
	fair_board.status_changed.connect(func(state: Dictionary): fair_state_frames.append(state))
	fair_board._refresh_visibility()
	await fair_board._run_ai_human_turn()
	_check(fair_board.ai_last_acted_ids.size() == fair_humans.size() and String(fair_civilians[1].get("escort_id", "")).is_empty() and fair_civilians[0].get("escort_id", "") == fair_humans[0].get("id", ""), "AI command tasks every viable soldier while existing escorts retain rescue duty during contact")
	_check(fair_state_frames.size() >= fair_humans.size(), "AI-controlled visible soldier actions publish sequential tactical states")
	_check(tactical_source.contains("0.18 if alien.get(\"visible\", false) else 0.01") and tactical_source.contains("0.38 if soldier.cell != cell_before"), "visible soldiers and aliens use bounded one-actor playback delays while hidden aliens stay fast")
	fair_board.queue_free()
	var route_board := AegisTacticalBoard.new()
	get_root().add_child(route_board)
	route_board.begin_battle(incident, tactical_roster, content)
	var route_unit: Dictionary = route_board.units.filter(func(unit): return unit.get("team", "") == "human")[0]
	route_board.units = [route_unit]
	route_board.covers.clear()
	route_unit["cell"] = Vector2i(6, 7)
	route_unit["tu"] = 60
	route_unit["ai_move_history"] = [AegisHexRules.key(Vector2i(6, 7))]
	var rescue_plan: Dictionary = route_board._ai_extraction_plan(route_unit, int(route_unit.get("fire_tu", 14)))
	var route_keys := {}
	for route_cell in rescue_plan.get("path", []):
		route_keys[AegisHexRules.key(route_cell)] = true
	var crosses_ramp: bool = rescue_plan.get("path", []).any(func(cell): return route_board.extraction_cells.has(AegisHexRules.key(cell)))
	_check(int(rescue_plan.get("steps", 0)) > 0 and rescue_plan.get("reached", false) and crosses_ramp and route_keys.size() == rescue_plan.get("path", []).size(), "AI rescue route crosses the ramp without repeating a cell")
	route_unit["cell"] = Vector2i(2, 8)
	route_unit["tu"] = 60
	var route_threat := {"id":"route-threat","team":"alien","hp":30,"cell":Vector2i(5, 8),"weapon_range":1}
	route_board.units = [route_unit, route_threat]
	var safe_rescue_plan: Dictionary = route_board._ai_rescue_plan(route_unit, [Vector2i(8, 8)], 0, false, [route_threat])
	_check(int(safe_rescue_plan.get("steps", 0)) > 0 and AegisHexRules.distance(safe_rescue_plan.get("cell", route_unit.cell), Vector2i(8, 8)) < AegisHexRules.distance(Vector2i(2, 8), Vector2i(8, 8)) and int(safe_rescue_plan.get("threat_steps", -1)) == 0 and int(safe_rescue_plan.get("reentries", -1)) == 0, "civilian escort routing advances toward extraction without known alien firing exposure when a safe path exists")
	var reclaim_cell: Vector2i = route_unit.cell
	var reclaim_tu := int(route_unit.get("tu", 0))
	var reclaim_voices: Array[String] = []
	route_board.voice_requested.connect(func(file_name: String): reclaim_voices.append(file_name))
	route_board.ai_command_active = true
	route_board.reclaim_ai_command()
	_check(not route_board.ai_command_active and route_unit.cell == reclaim_cell and int(route_unit.get("tu", 0)) == reclaim_tu and reclaim_voices.has("Back with you steady professional.wav"), "player reclaim exits AI command without resetting live tactical state")
	route_board.queue_free()
	ai_board.queue_free()
	board._select_unit(shooter.get("id", ""))
	_check(not board.reachable.is_empty(), "soldier selection produces bounded movement highlights")
	for cycle in range(3):
		board.end_human_turn()
		for wait_step in range(140):
			if board.phase != "alien":
				break
			await create_timer(0.05).timeout
	_check(board.turn_number == 4 and board.phase == "human", "practical tactical mission completes three End Turn cycles")
	board.queue_free()

func _test_interception(content: Dictionary) -> void:
	var campaign := AegisCampaignState.new()
	campaign.configure(content)
	campaign.new_campaign("Air Test", "North America")
	var legacy := campaign.data.duplicate(true)
	legacy["base"]["region"] = "Europe"
	for legacy_key in ["aircraft", "ufo_contacts", "selected_ufo_id", "interception_stance", "interception", "last_interception"]:
		legacy.erase(legacy_key)
	var migrated := campaign.normalize_save(legacy)
	_check(migrated.get("aircraft", {}).get("saber_one", {}).get("base_region", "") == "Europe" and migrated.get("ufo_contacts", []).size() == 1, "legacy native save receives base-local interceptor and tracked contact")
	_check(campaign.interceptor().get("status", "") == "Ready" and campaign.active_ufos().size() == 1, "new campaign starts with one ready interceptor and tracked UFO")
	_check(campaign.interception_launch_blocker().is_empty(), "tracked contact has a valid interception solution")
	_check(campaign.begin_interception("Aggressive"), "Aggressive interception launches")
	_check(campaign.interceptor().get("status", "") == "Outbound" and int(campaign.interceptor().get("fuel", 0)) == 66, "launch commits interceptor fuel and outbound state")
	campaign.advance_minutes(10)
	var save_path := "user://project_aegis_godot_interception_test.json"
	_check(int(campaign.data.get("interception", {}).get("progress", 0)) == 50 and campaign.save_campaign(save_path), "mid-interception state saves at bounded progress")
	var loaded := AegisCampaignState.new()
	loaded.configure(content)
	_check(loaded.load_campaign(save_path) and loaded.data.get("interception", {}).get("phase", "") == "outbound" and int(loaded.data.get("interception", {}).get("progress", 0)) == 50, "native save resumes the same outbound interception")
	loaded.advance_minutes(10)
	var operation: Dictionary = loaded.data.get("interception", {})
	_check(operation.get("phase", "") == "returning" and operation.get("success", false) and not operation.get("combat_log", []).is_empty(), "deterministic air combat resolves into a surviving return leg")
	_check(loaded.data.get("incidents", []).any(func(incident): return String(incident.get("id", "")).begins_with("crash_")), "downed UFO creates a recovery incident")
	loaded.advance_minutes(20)
	_check(loaded.data.get("interception", {}).is_empty() and loaded.interceptor().get("status", "") == "Servicing", "returning interceptor enters bounded base service")
	loaded.advance_minutes(30)
	_check(loaded.interceptor().get("status", "") == "Ready" and int(loaded.interceptor().get("hp", 0)) == int(loaded.interceptor().get("max_hp", 0)) and int(loaded.interceptor().get("ammo", 0)) == int(loaded.interceptor().get("max_ammo", 0)), "service restores interceptor readiness")
	if FileAccess.file_exists(save_path):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(save_path))

func _test_build_health() -> void:
	var app: Node = load("res://godot/main.tscn").instantiate()
	app.content = _load_json("res://godot/data/content.json")
	var health: Array = app._run_self_tests()
	if health.size() != 92 or not health.all(func(row): return row.get("pass", false)):
		print("BUILD HEALTH DETAIL: %s" % JSON.stringify(health))
	_check(health.size() == 92 and health.all(func(row): return row.get("pass", false)), "visible Build Health passes all 92 rows")
	app.free()

func _load_json(path: String) -> Dictionary:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return {}
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	return parsed if parsed is Dictionary else {}

func _check(condition: bool, label: String) -> void:
	checks += 1
	if not condition:
		failures.append(label)
