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
	var legacy := campaign.data.duplicate(true)
	legacy.erase("scientists")
	legacy.erase("engineers")
	legacy.erase("manufacturing_queue")
	legacy.erase("manufacturing_assigned_engineers")
	legacy.erase("next_manufacturing_order_id")
	legacy["base"].erase("facility_counts")
	legacy["research"] = {"active": "Laser Weapons", "progress": 8}
	var migrated := campaign.normalize_save(legacy)
	_check(int(migrated.get("scientists", 0)) == 5 and int(migrated.get("engineers", -1)) == 0 and int(migrated.get("base", {}).get("facility_counts", {}).get("quarters", 0)) == 1 and int(migrated.get("base", {}).get("facility_counts", {}).get("workshop", 0)) == 1 and int(migrated.get("research", {}).get("assigned_scientists", 0)) == 5 and migrated.get("personnel_orders", []).is_empty() and migrated.get("manufacturing_queue", []).is_empty() and int(migrated.get("manufacturing_assigned_engineers", -1)) == 0, "legacy native saves receive conservative personnel and manufacturing defaults")
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
	_check(personnel_campaign.pending_personnel_count() == 0 and personnel_campaign.living_soldier_count() == 7 and int(personnel_campaign.data.get("scientists", 0)) == 6 and not arrived_recruit.get("assigned", true), "third midnight delivers local staff and leaves new soldiers unassigned")
	var specialist_campaign := AegisCampaignState.new()
	specialist_campaign.configure(content)
	specialist_campaign.new_campaign("Specialist Capacity Test", "North America")
	specialist_campaign.data["base"]["facility_counts"]["quarters"] = 3
	specialist_campaign.data["scientists"] = 10
	specialist_campaign.data["engineers"] = 10
	_check(specialist_campaign.projected_personnel_used() == 26 and specialist_campaign.personnel_capacity() == 36 and specialist_campaign.personnel_hiring_blocker("soldier").is_empty() and specialist_campaign.personnel_hiring_blocker("scientist").contains("Laboratory full") and specialist_campaign.personnel_hiring_blocker("engineer").contains("Workshop full"), "spare quarters do not bypass full Laboratory or Workshop capacity")
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
	_check(campaign.save_campaign(save_path), "native save writes JSON")
	var loaded := AegisCampaignState.new()
	loaded.configure(content)
	_check(loaded.load_campaign(save_path), "native save loads")
	_check(loaded.data.get("base", {}).get("name", "") == "Test Aegis", "native save round-trip preserves campaign state")
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
	_check(imported_roster.size() == 8 and importer.assigned_soldiers().size() == 6 and int(imported_roster[0].get("accuracy", 0)) == 74 and imported_roster[0].get("callsign", "") == "Nested" and imported_roster[0].get("trait", "") == "Methodical" and imported_roster[5].get("status", "") == "Wounded", "nested browser identity stats and active squad normalize within native transport capacity")
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
	board.begin_battle(incident, content.get("soldiers", []))
	_check(board.units.filter(func(unit): return unit.get("team", "") == "human").size() == 6, "tactical deployment includes six soldiers")
	_check(board.units.filter(func(unit): return unit.get("team", "") == "civilian").size() == 2, "tactical incident includes rescue civilians")
	var wall_key := AegisHexRules.key(Vector2i(10, 2))
	var wall: Dictionary = board.covers.get(wall_key, {})
	var shooter: Dictionary = board.units.filter(func(unit): return unit.get("team", "") == "human")[0]
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
	board._select_unit(shooter.get("id", ""))
	_check(not board.reachable.is_empty(), "soldier selection produces bounded movement highlights")
	for cycle in range(3):
		board.end_human_turn()
		for wait_step in range(40):
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
	if health.size() != 52 or not health.all(func(row): return row.get("pass", false)):
		print("BUILD HEALTH DETAIL: %s" % JSON.stringify(health))
	_check(health.size() == 52 and health.all(func(row): return row.get("pass", false)), "visible Build Health passes all 52 rows")
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
