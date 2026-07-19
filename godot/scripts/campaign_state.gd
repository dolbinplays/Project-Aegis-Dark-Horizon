class_name AegisCampaignState
extends RefCounted

const SAVE_PATH := "user://project_aegis_godot_save_v4.json"
const IMPORTED_SAVE_PATH := "user://project_aegis_godot_imported_copy_v4.json"
const SAVE_FORMAT := 4
const BROWSER_CAMPAIGN_KIND := "project-aegis-campaign-save"
const BROWSER_SLOT_BACKUP_KIND := "project-aegis-save-slot-backup"
const PERSONNEL_PER_QUARTERS := 12
const SCIENTISTS_PER_LAB := 10
const ENGINEERS_PER_WORKSHOP := 10
const RESEARCH_PROGRESS_PER_SCIENTIST_DAY := 2
const MANUFACTURING_PROGRESS_PER_ENGINEER_DAY := 3
const RESEARCH_REQUIRED_PROGRESS := 100
const PERSONNEL_ARRIVAL_DAYS := 3
const MAX_MANUFACTURING_ORDERS := 8
const MAX_FACILITY_CONSTRUCTION_ORDERS := 3
const PERSONNEL_HIRING := {
	"soldier": {"label": "Soldier", "cost": 120},
	"scientist": {"label": "Scientist", "cost": 95},
	"engineer": {"label": "Engineer", "cost": 90}
}
const INTERCEPTION_STANCES := {
	"Cautious": {"accuracy": 66, "incoming": 24, "fuel": 18, "rounds": 2, "damage": 25},
	"Standard": {"accuracy": 76, "incoming": 38, "fuel": 25, "rounds": 3, "damage": 28},
	"Aggressive": {"accuracy": 86, "incoming": 56, "fuel": 34, "rounds": 3, "damage": 32}
}

var content: Dictionary = {}
var data: Dictionary = {}
var active_save_path := SAVE_PATH

func configure(source_content: Dictionary) -> void:
	content = source_content.duplicate(true)

func new_campaign(base_name: String, region_name: String) -> void:
	active_save_path = SAVE_PATH
	var starting_facilities := ["access", "quarters", "lab", "workshop", "sickbay", "stores", "hangar_interceptor", "hangar_skyranger", "radar"]
	var roster: Array = []
	for source in content.get("soldiers", []):
		var soldier: Dictionary = source.duplicate(true)
		soldier.merge({
			"rank": "Rookie",
			"status": "Ready",
			"missions": 0,
			"kills": 0,
			"wounds": 0,
			"weapon": "Ballistic Rifle",
			"armor": "Field Suit",
			"assigned": true
		}, true)
		roster.append(soldier)
	data = {
		"save_format": SAVE_FORMAT,
		"native_build": content.get("build", "godot-dev"),
		"campaign_name": "Project Aegis Campaign",
		"month": 1,
		"day": 1,
		"minutes": 8 * 60,
		"funds": 2200,
		"base": {
			"name": base_name.strip_edges() if not base_name.strip_edges().is_empty() else "Fort Aegis",
			"region": region_name,
			"facilities": starting_facilities,
			"facility_counts": _facility_counts_from_ids(starting_facilities)
		},
		"soldiers": roster,
		"scientists": 5,
		"engineers": 0,
		"personnel_orders": [],
		"next_personnel_order_id": 1,
		"facility_construction_orders": [],
		"next_facility_construction_order_id": 1,
		"manufacturing_queue": [],
		"manufacturing_assigned_engineers": 0,
		"next_manufacturing_order_id": 1,
		"incidents": content.get("incidents", []).duplicate(true),
		"selected_incident_id": "red_river",
		"travel": {},
		"aircraft": _default_aircraft(),
		"ufo_contacts": _default_ufos(),
		"selected_ufo_id": "nightglass_01",
		"interception_stance": "Standard",
		"interception": {},
		"last_interception": {},
		"reports": ["Project Aegis command established at %s." % region_name],
		"research": {"active": "Laser Weapons", "progress": 8, "required_progress": RESEARCH_REQUIRED_PROGRESS, "assigned_scientists": 5, "scientists": 5, "completed": false},
		"completed_research": [],
		"technology_unlocks": [],
		"stores": {"Ballistic Rifle": 0, "Field Suit": 0, "Medkit": 2},
		"mission_count": 0,
		"rescued_civilians": 0
	}
	interceptor()["base_region"] = region_name

func has_campaign() -> bool:
	return not data.is_empty() and data.has("base")

func is_imported_copy() -> bool:
	return active_save_path == IMPORTED_SAVE_PATH or data.get("save_origin", {}).get("type", "") == "browser_import"

func save_slot_label() -> String:
	return "Imported Copy" if is_imported_copy() else "Native Campaign"

func selected_incident() -> Dictionary:
	var selected_id := String(data.get("selected_incident_id", ""))
	for incident in data.get("incidents", []):
		if String(incident.get("id", "")) == selected_id:
			return incident
	var incidents: Array = data.get("incidents", [])
	return incidents[0] if not incidents.is_empty() else {}

func select_incident(incident_id: String) -> void:
	data["selected_incident_id"] = incident_id

func selected_ufo() -> Dictionary:
	var selected_id := String(data.get("selected_ufo_id", ""))
	for ufo in data.get("ufo_contacts", []):
		if String(ufo.get("id", "")) == selected_id and ufo.get("status", "") in ["Tracked", "Damaged"]:
			return ufo
	var contacts: Array = active_ufos()
	return contacts[0] if not contacts.is_empty() else {}

func active_ufos() -> Array:
	return data.get("ufo_contacts", []).filter(func(ufo): return ufo.get("status", "") in ["Tracked", "Damaged"])

func select_ufo(ufo_id: String) -> void:
	data["selected_ufo_id"] = ufo_id

func interceptor() -> Dictionary:
	var aircraft: Dictionary = data.get("aircraft", {})
	if aircraft.has("saber_one"):
		return aircraft["saber_one"]
	var available: Array = aircraft.values()
	return available[0] if not available.is_empty() else {}

func interception_launch_blocker() -> String:
	var craft := interceptor()
	if selected_ufo().is_empty():
		return "No tracked UFO contact selected."
	if craft.is_empty():
		return "No interceptor is assigned to this base."
	if not data.get("travel", {}).is_empty():
		return "Aegis One is already committed to an incident."
	if not data.get("interception", {}).is_empty():
		return "An interception is already in progress."
	if craft.get("status", "") != "Ready":
		return "%s is %s." % [craft.get("name", "Interceptor"), craft.get("status", "unavailable")]
	var stance := String(data.get("interception_stance", "Standard"))
	var profile: Dictionary = INTERCEPTION_STANCES.get(stance, INTERCEPTION_STANCES.Standard)
	if int(craft.get("fuel", 0)) < int(profile.get("fuel", 25)):
		return "Insufficient interceptor fuel for the selected stance."
	if int(craft.get("ammo", 0)) <= 0:
		return "Interceptor weapons require rearming."
	return ""

func begin_interception(stance: String = "Standard") -> bool:
	data["interception_stance"] = stance if INTERCEPTION_STANCES.has(stance) else "Standard"
	if not interception_launch_blocker().is_empty():
		return false
	var craft := interceptor()
	var ufo := selected_ufo()
	var profile: Dictionary = INTERCEPTION_STANCES[data["interception_stance"]]
	craft["fuel"] = maxi(0, int(craft.get("fuel", 0)) - int(profile.get("fuel", 25)))
	craft["status"] = "Outbound"
	data["interception"] = {
		"phase": "outbound",
		"progress": 0,
		"duration_minutes": 20,
		"craft_id": craft.get("id", "saber_one"),
		"ufo_id": ufo.get("id", ""),
		"stance": data["interception_stance"],
		"combat_log": [],
		"success": false
	}
	add_report("%s launched against %s using %s posture." % [craft.get("name", "Interceptor"), ufo.get("name", "UFO"), data["interception_stance"]])
	return true

func assigned_soldiers() -> Array:
	return data.get("soldiers", []).filter(func(soldier): return soldier.get("assigned", false) and soldier.get("status", "") == "Ready")

func facility_count(facility_id: String) -> int:
	var base: Dictionary = data.get("base", {})
	var counts_value: Variant = base.get("facility_counts", {})
	if counts_value is Dictionary and counts_value.has(facility_id):
		return maxi(0, int(counts_value.get(facility_id, 0)))
	return base.get("facilities", []).count(facility_id)

func personnel_capacity() -> int:
	return facility_count("quarters") * PERSONNEL_PER_QUARTERS

func scientist_capacity() -> int:
	return facility_count("lab") * SCIENTISTS_PER_LAB

func engineer_capacity() -> int:
	return facility_count("workshop") * ENGINEERS_PER_WORKSHOP

func facility_construction_orders() -> Array:
	return data.get("facility_construction_orders", [])

func pending_facility_count(facility_id: String) -> int:
	return facility_construction_orders().filter(func(order): return String(order.get("facility_id", "")) == facility_id).size()

func projected_personnel_capacity() -> int:
	return personnel_capacity() + pending_facility_count("quarters") * PERSONNEL_PER_QUARTERS

func projected_scientist_capacity() -> int:
	return scientist_capacity() + pending_facility_count("lab") * SCIENTISTS_PER_LAB

func projected_engineer_capacity() -> int:
	return engineer_capacity() + pending_facility_count("workshop") * ENGINEERS_PER_WORKSHOP

func facility_construction_blocker(facility_id: String) -> String:
	var definition := _facility_construction_definition(facility_id)
	if definition.is_empty():
		return "Facility is not available in this construction slice."
	if facility_construction_orders().size() >= MAX_FACILITY_CONSTRUCTION_ORDERS:
		return "Construction queue is full at %d concurrent projects." % MAX_FACILITY_CONSTRUCTION_ORDERS
	var cost := int(definition.get("build_cost", 0))
	if int(data.get("funds", 0)) < cost:
		return "Insufficient funds - $%dk required." % cost
	return ""

func begin_facility_construction(facility_id: String) -> bool:
	var blocker := facility_construction_blocker(facility_id)
	if not blocker.is_empty():
		add_report("Facility construction blocked: %s" % blocker)
		return false
	var definition := _facility_construction_definition(facility_id)
	var sequence := maxi(1, int(data.get("next_facility_construction_order_id", 1)))
	var days := maxi(1, int(definition.get("construction_days", 1)))
	var order := {
		"id": "facility_%03d" % sequence,
		"facility_id": facility_id,
		"label": String(definition.get("name", facility_id)),
		"cost": maxi(0, int(definition.get("build_cost", 0))),
		"days_remaining": days,
		"total_days": days,
		"base_id": _selected_base_identity()
	}
	var orders := facility_construction_orders()
	orders.append(order)
	data["facility_construction_orders"] = orders
	data["next_facility_construction_order_id"] = sequence + 1
	data["funds"] = int(data.get("funds", 0)) - int(order.get("cost", 0))
	add_report("Facility construction started: %s for $%dk. Completion in %d days." % [order.get("label", "Facility"), order.get("cost", 0), days])
	return true

func facility_construction_cancel_refund(order: Dictionary) -> int:
	return int(floor(float(maxi(0, int(order.get("cost", 0)))) * 0.5))

func cancel_facility_construction(order_id: String) -> bool:
	var orders := facility_construction_orders()
	for order_index in range(orders.size()):
		var order: Dictionary = orders[order_index]
		if String(order.get("id", "")) != order_id:
			continue
		var refund := facility_construction_cancel_refund(order)
		orders.remove_at(order_index)
		data["facility_construction_orders"] = orders
		data["funds"] = int(data.get("funds", 0)) + refund
		add_report("Facility construction cancelled: %s. Refund $%dk." % [order.get("label", "Facility"), refund])
		return true
	return false

func _facility_construction_definition(facility_id: String) -> Dictionary:
	for definition_value in content.get("facilities", []):
		if definition_value is Dictionary and String(definition_value.get("id", "")) == facility_id and int(definition_value.get("build_cost", 0)) > 0 and int(definition_value.get("construction_days", 0)) > 0:
			return definition_value
	return {}

func living_soldier_count() -> int:
	var base: Dictionary = data.get("base", {})
	var base_id := String(base.get("source_id", base.get("id", "")))
	var count := 0
	for soldier in data.get("soldiers", []):
		if String(soldier.get("status", "Ready")) == "KIA":
			continue
		var soldier_base_id := String(soldier.get("base_id", soldier.get("baseId", "")))
		if base_id.is_empty() or soldier_base_id.is_empty() or soldier_base_id == base_id:
			count += 1
	return count

func personnel_used() -> int:
	return living_soldier_count() + int(data.get("scientists", 0)) + int(data.get("engineers", 0))

func personnel_orders() -> Array:
	return data.get("personnel_orders", [])

func pending_personnel_count(personnel_type: String = "") -> int:
	if personnel_type.is_empty():
		return personnel_orders().size()
	return personnel_orders().filter(func(order): return String(order.get("type", "")) == personnel_type).size()

func projected_personnel_used() -> int:
	return personnel_used() + pending_personnel_count()

func personnel_hiring_blocker(personnel_type: String) -> String:
	if not PERSONNEL_HIRING.has(personnel_type):
		return "Unknown personnel order."
	var definition: Dictionary = PERSONNEL_HIRING[personnel_type]
	if int(data.get("funds", 0)) < int(definition.get("cost", 0)):
		return "Insufficient funds - $%dk required." % definition.get("cost", 0)
	if projected_personnel_used() >= personnel_capacity():
		return "Living Quarters full or reserved - %d/%d projected personnel." % [projected_personnel_used(), personnel_capacity()]
	if personnel_type == "scientist" and int(data.get("scientists", 0)) + pending_personnel_count("scientist") >= scientist_capacity():
		return "Laboratory full or reserved - %d/%d Scientists." % [int(data.get("scientists", 0)) + pending_personnel_count("scientist"), scientist_capacity()]
	if personnel_type == "engineer" and int(data.get("engineers", 0)) + pending_personnel_count("engineer") >= engineer_capacity():
		return "Workshop full or reserved - %d/%d Engineers." % [int(data.get("engineers", 0)) + pending_personnel_count("engineer"), engineer_capacity()]
	return ""

func hire_personnel(personnel_type: String) -> bool:
	var blocker := personnel_hiring_blocker(personnel_type)
	if not blocker.is_empty():
		add_report("Personnel order blocked: %s" % blocker)
		return false
	var sequence := maxi(1, int(data.get("next_personnel_order_id", 1)))
	var definition: Dictionary = PERSONNEL_HIRING[personnel_type]
	var order := {
		"id": "personnel_%03d" % sequence,
		"type": personnel_type,
		"days_remaining": PERSONNEL_ARRIVAL_DAYS,
		"total_days": PERSONNEL_ARRIVAL_DAYS,
		"cost": int(definition.get("cost", 0)),
		"base_id": _selected_base_identity()
	}
	if personnel_type == "soldier":
		order["recruit"] = _recruit_for_sequence(sequence)
	var orders := personnel_orders()
	orders.append(order)
	data["personnel_orders"] = orders
	data["next_personnel_order_id"] = sequence + 1
	data["funds"] = int(data.get("funds", 0)) - int(order.get("cost", 0))
	var subject := String(order.get("recruit", {}).get("name", definition.get("label", "Personnel")))
	add_report("Personnel order placed: %s arrives in %d days for $%dk." % [subject, PERSONNEL_ARRIVAL_DAYS, order.get("cost", 0)])
	return true

func personnel_order_cancel_refund(order: Dictionary) -> int:
	return int(floor(float(maxi(0, int(order.get("cost", 0)))) * 0.5))

func cancel_personnel_order(order_id: String) -> bool:
	var orders := personnel_orders()
	for order_index in range(orders.size()):
		var order: Dictionary = orders[order_index]
		if String(order.get("id", "")) != order_id:
			continue
		var refund := personnel_order_cancel_refund(order)
		var label := String(order.get("recruit", {}).get("name", PERSONNEL_HIRING.get(order.get("type", ""), {}).get("label", "Personnel")))
		orders.remove_at(order_index)
		data["personnel_orders"] = orders
		data["funds"] = int(data.get("funds", 0)) + refund
		add_report("Personnel order cancelled: %s. Refund $%dk." % [label, refund])
		return true
	return false

func _selected_base_identity() -> String:
	var base: Dictionary = data.get("base", {})
	return String(base.get("source_id", base.get("id", base.get("name", "Fort Aegis"))))

func _recruit_for_sequence(sequence: int, base_id_override: String = "") -> Dictionary:
	var candidates: Array = content.get("recruits", [])
	var source: Dictionary = candidates[(sequence - 1) % candidates.size()].duplicate(true) if not candidates.is_empty() else {
		"name": "Aegis Recruit %02d" % sequence,
		"callsign": "Recruit",
		"accuracy": 58 + sequence % 8,
		"bravery": 52 + sequence % 12,
		"health": 38 + sequence % 6,
		"tu": 55 + sequence % 7,
		"trait": "Steady Professional"
	}
	source["id"] = "native_recruit_%03d" % sequence
	source["rank"] = source.get("rank", "Rookie")
	source["status"] = "Ready"
	source["missions"] = 0
	source["kills"] = 0
	source["wounds"] = 0
	source["weapon"] = source.get("weapon", "Ballistic Rifle")
	source["armor"] = source.get("armor", "Field Suit")
	source["assigned"] = false
	source["base_id"] = base_id_override if not base_id_override.is_empty() else _selected_base_identity()
	return source

func research_staff_limit() -> int:
	return mini(maxi(0, int(data.get("scientists", 0))), scientist_capacity())

func research_required_progress() -> int:
	var research: Dictionary = data.get("research", {})
	return maxi(1, int(research.get("required_progress", RESEARCH_REQUIRED_PROGRESS)))

func research_assigned_scientists() -> int:
	var research: Dictionary = data.get("research", {})
	return clampi(int(research.get("assigned_scientists", research.get("scientists", 0))), 0, research_staff_limit())

func set_research_staffing(amount: int) -> bool:
	var research: Dictionary = data.get("research", {})
	var next_amount := clampi(amount, 0, research_staff_limit())
	if bool(research.get("completed", false)) or int(research.get("progress", 0)) >= research_required_progress():
		next_amount = 0
	var changed := research_assigned_scientists() != next_amount
	research["assigned_scientists"] = next_amount
	research["scientists"] = next_amount
	data["research"] = research
	return changed

func research_daily_progress() -> int:
	return research_assigned_scientists() * RESEARCH_PROGRESS_PER_SCIENTIST_DAY

func research_days_remaining() -> int:
	var research: Dictionary = data.get("research", {})
	var remaining := maxi(0, research_required_progress() - int(research.get("progress", 0)))
	var daily := research_daily_progress()
	if remaining <= 0:
		return 0
	if daily <= 0:
		return -1
	return ceili(float(remaining) / float(daily))

func completed_research() -> Array:
	return data.get("completed_research", [])

func technology_unlocks() -> Array:
	return data.get("technology_unlocks", [])

func has_technology_unlock(unlock_id: String) -> bool:
	return technology_unlocks().has(unlock_id)

func available_research_projects() -> Array:
	var available: Array = []
	var active_topic := String(data.get("research", {}).get("active", ""))
	for project_value in content.get("research_projects", []):
		if not project_value is Dictionary:
			continue
		var project: Dictionary = project_value
		var topic := String(project.get("id", ""))
		if topic.is_empty() or topic == active_topic or completed_research().has(topic):
			continue
		var prerequisites: Array = project.get("prerequisites", [])
		if prerequisites.all(func(prerequisite): return completed_research().has(String(prerequisite))):
			available.append(project.duplicate(true))
	return available

func start_research_project(topic: String) -> bool:
	var current: Dictionary = data.get("research", {})
	if not bool(current.get("completed", false)) and int(current.get("progress", 0)) < research_required_progress():
		return false
	var definition := _research_definition(topic)
	if definition.is_empty() or not available_research_projects().any(func(project): return String(project.get("id", "")) == topic):
		return false
	data["research"] = {
		"active": topic,
		"progress": 0,
		"required_progress": maxi(1, int(definition.get("required", RESEARCH_REQUIRED_PROGRESS))),
		"assigned_scientists": 0,
		"scientists": 0,
		"completed": false
	}
	add_report("Research project opened: %s. Assign laboratory staff to begin." % topic)
	return true

func research_completion_unlock_labels(topic: String) -> Array[String]:
	var labels: Array[String] = []
	var definition := _research_definition(topic)
	for project_name in definition.get("unlocks_projects", []):
		labels.append(String(project_name))
	for capability_name in definition.get("unlock_labels", []):
		labels.append(String(capability_name))
	return labels

func _research_definition(topic: String) -> Dictionary:
	for project_value in content.get("research_projects", []):
		if project_value is Dictionary and String(project_value.get("id", "")) == topic:
			return project_value
	return {}

func _apply_research_completion(topic: String) -> void:
	var completed := completed_research()
	if not completed.has(topic):
		completed.append(topic)
	data["completed_research"] = completed
	var unlocks := technology_unlocks()
	var definition := _research_definition(topic)
	for unlock_id in definition.get("unlocks_capabilities", []):
		if not unlocks.has(unlock_id):
			unlocks.append(unlock_id)
	data["technology_unlocks"] = unlocks

func manufacturing_queue() -> Array:
	return data.get("manufacturing_queue", [])

func manufacturing_staff_limit() -> int:
	return mini(maxi(0, int(data.get("engineers", 0))), engineer_capacity())

func manufacturing_assigned_engineers() -> int:
	return clampi(int(data.get("manufacturing_assigned_engineers", 0)), 0, manufacturing_staff_limit())

func set_manufacturing_staffing(amount: int) -> bool:
	var next_amount := clampi(amount, 0, manufacturing_staff_limit())
	if manufacturing_queue().is_empty():
		next_amount = 0
	var changed := manufacturing_assigned_engineers() != next_amount
	data["manufacturing_assigned_engineers"] = next_amount
	return changed

func manufacturing_daily_progress() -> int:
	return manufacturing_assigned_engineers() * MANUFACTURING_PROGRESS_PER_ENGINEER_DAY

func manufacturing_order_blocker(item_name: String) -> String:
	var definition := _manufacturing_definition(item_name)
	if definition.is_empty():
		return "Unknown manufacturing order."
	if engineer_capacity() <= 0:
		return "No local Workshop is operational."
	var required_unlock := String(definition.get("required_unlock", ""))
	if not required_unlock.is_empty() and not has_technology_unlock(required_unlock):
		return "%s production research is incomplete." % item_name
	if manufacturing_queue().size() >= MAX_MANUFACTURING_ORDERS:
		return "Manufacturing queue is full at %d orders." % MAX_MANUFACTURING_ORDERS
	if int(data.get("funds", 0)) < int(definition.get("cost", 0)):
		return "Insufficient funds - $%dk required." % definition.get("cost", 0)
	return ""

func queue_manufacturing(item_name: String) -> bool:
	var blocker := manufacturing_order_blocker(item_name)
	if not blocker.is_empty():
		add_report("Workshop order blocked: %s" % blocker)
		return false
	var definition := _manufacturing_definition(item_name)
	var sequence := maxi(1, int(data.get("next_manufacturing_order_id", 1)))
	var order := {
		"id": "manufacturing_%03d" % sequence,
		"item_name": item_name,
		"cost": int(definition.get("cost", 0)),
		"work_required": maxi(1, int(definition.get("work", 1))),
		"progress": 0,
		"base_id": _selected_base_identity()
	}
	var queue := manufacturing_queue()
	queue.append(order)
	data["manufacturing_queue"] = queue
	data["next_manufacturing_order_id"] = sequence + 1
	data["funds"] = int(data.get("funds", 0)) - int(order.get("cost", 0))
	if manufacturing_assigned_engineers() <= 0 and manufacturing_staff_limit() > 0:
		data["manufacturing_assigned_engineers"] = manufacturing_staff_limit()
	add_report("Workshop order queued: %s for $%dk and %d work." % [item_name, order.get("cost", 0), order.get("work_required", 0)])
	return true

func manufacturing_order_cancel_refund(order: Dictionary) -> int:
	return int(floor(float(maxi(0, int(order.get("cost", 0)))) * 0.5))

func cancel_manufacturing_order(order_id: String) -> bool:
	var queue := manufacturing_queue()
	for order_index in range(queue.size()):
		var order: Dictionary = queue[order_index]
		if String(order.get("id", "")) != order_id:
			continue
		var refund := manufacturing_order_cancel_refund(order)
		queue.remove_at(order_index)
		data["manufacturing_queue"] = queue
		data["funds"] = int(data.get("funds", 0)) + refund
		if queue.is_empty():
			data["manufacturing_assigned_engineers"] = 0
		add_report("Workshop order cancelled: %s. Refund $%dk." % [order.get("item_name", "Item"), refund])
		return true
	return false

func manufacturing_order_remaining_work(order: Dictionary) -> int:
	return maxi(0, int(order.get("work_required", 1)) - int(order.get("progress", 0)))

func manufacturing_queue_days_remaining(order_id: String) -> int:
	var daily := manufacturing_daily_progress()
	if daily <= 0:
		return -1
	var work_ahead := 0
	for order_value in manufacturing_queue():
		var order: Dictionary = order_value
		work_ahead += manufacturing_order_remaining_work(order)
		if String(order.get("id", "")) == order_id:
			return ceili(float(work_ahead) / float(daily))
	return -1

func _manufacturing_definition(item_name: String) -> Dictionary:
	for item_value in content.get("manufacturing_items", []):
		if item_value is Dictionary and String(item_value.get("id", "")) == item_name:
			return item_value
	return {}

func set_soldier_assigned(soldier_id: String, assigned: bool) -> void:
	for soldier in data.get("soldiers", []):
		if String(soldier.get("id", "")) == soldier_id:
			soldier["assigned"] = assigned
			break

func begin_mission_travel() -> bool:
	if assigned_soldiers().is_empty() or selected_incident().is_empty() or not data.get("interception", {}).is_empty():
		return false
	data["travel"] = {
		"phase": "outbound",
		"progress": 0,
		"duration_minutes": 30,
		"incident_id": selected_incident().get("id", "")
	}
	add_report("Aegis One launched for %s." % selected_incident().get("name", "incident"))
	return true

func advance_minutes(amount: int) -> bool:
	var bounded_amount := maxi(0, amount)
	data["minutes"] = int(data.get("minutes", 0)) + bounded_amount
	var days_advanced := 0
	while int(data["minutes"]) >= 24 * 60:
		data["minutes"] = int(data["minutes"]) - 24 * 60
		data["day"] = int(data.get("day", 1)) + 1
		days_advanced += 1
	_advance_facility_construction_days(days_advanced)
	_advance_personnel_days(days_advanced)
	_advance_research_days(days_advanced)
	_advance_manufacturing_days(days_advanced)
	_advance_aircraft_service(bounded_amount)
	_advance_interception(bounded_amount)
	var travel: Dictionary = data.get("travel", {})
	if travel.is_empty() or travel.get("phase", "") != "outbound":
		return false
	var duration := maxi(1, int(travel.get("duration_minutes", 30)))
	travel["progress"] = mini(100, int(travel.get("progress", 0)) + int(round(float(amount) / float(duration) * 100.0)))
	data["travel"] = travel
	return int(travel["progress"]) >= 100

func _advance_research_days(days_advanced: int) -> void:
	if days_advanced <= 0:
		return
	var research: Dictionary = data.get("research", {})
	if String(research.get("active", "")).is_empty() or bool(research.get("completed", false)):
		return
	var daily := research_daily_progress()
	if daily <= 0:
		return
	var required_progress := research_required_progress()
	var previous_progress := clampi(int(research.get("progress", 0)), 0, required_progress)
	var next_progress := mini(required_progress, previous_progress + daily * days_advanced)
	research["progress"] = next_progress
	if next_progress >= required_progress:
		research["completed"] = true
		research["assigned_scientists"] = 0
		research["scientists"] = 0
		var topic := String(research.get("active", "Research project"))
		_apply_research_completion(topic)
		var unlock_labels := research_completion_unlock_labels(topic)
		var unlock_text := " UNLOCKED: %s." % ", ".join(unlock_labels) if not unlock_labels.is_empty() else ""
		add_report("RESEARCH COMPLETE: %s.%s" % [topic, unlock_text])
	data["research"] = research

func _advance_facility_construction_days(days_advanced: int) -> void:
	if days_advanced <= 0 or facility_construction_orders().is_empty():
		return
	var remaining_orders: Array = []
	for order_value in facility_construction_orders():
		if not order_value is Dictionary:
			continue
		var order: Dictionary = order_value
		order["days_remaining"] = maxi(0, int(order.get("days_remaining", 1)) - days_advanced)
		if int(order.get("days_remaining", 0)) > 0:
			remaining_orders.append(order)
			continue
		var facility_id := String(order.get("facility_id", ""))
		var definition := _facility_construction_definition(facility_id)
		if definition.is_empty():
			continue
		var base: Dictionary = data.get("base", {})
		var counts: Dictionary = base.get("facility_counts", {}).duplicate(true)
		counts[facility_id] = int(counts.get(facility_id, 0)) + 1
		base["facility_counts"] = counts
		var facilities: Array = base.get("facilities", []).duplicate(true)
		facilities.append(facility_id)
		base["facilities"] = facilities
		data["base"] = base
		add_report("FACILITY COMPLETE: %s is now operational." % definition.get("name", facility_id))
	data["facility_construction_orders"] = remaining_orders

func _advance_manufacturing_days(days_advanced: int) -> void:
	if days_advanced <= 0 or manufacturing_queue().is_empty():
		return
	var work_pool := manufacturing_daily_progress() * days_advanced
	if work_pool <= 0:
		return
	var queue := manufacturing_queue()
	while work_pool > 0 and not queue.is_empty():
		var order: Dictionary = queue[0]
		var remaining := manufacturing_order_remaining_work(order)
		var applied := mini(work_pool, remaining)
		order["progress"] = int(order.get("progress", 0)) + applied
		work_pool -= applied
		if manufacturing_order_remaining_work(order) > 0:
			queue[0] = order
			break
		var stores: Dictionary = data.get("stores", {})
		var item_name := String(order.get("item_name", "Manufactured item"))
		stores[item_name] = int(stores.get(item_name, 0)) + 1
		data["stores"] = stores
		queue.remove_at(0)
		add_report("MANUFACTURING COMPLETE: %s delivered to local stores." % item_name)
	data["manufacturing_queue"] = queue
	if queue.is_empty():
		data["manufacturing_assigned_engineers"] = 0

func _advance_personnel_days(days_advanced: int) -> void:
	if days_advanced <= 0 or personnel_orders().is_empty():
		return
	var remaining_orders: Array = []
	for order_value in personnel_orders():
		if not order_value is Dictionary:
			continue
		var order: Dictionary = order_value
		order["days_remaining"] = maxi(0, int(order.get("days_remaining", PERSONNEL_ARRIVAL_DAYS)) - days_advanced)
		if int(order.get("days_remaining", 0)) > 0:
			remaining_orders.append(order)
			continue
		var personnel_type := String(order.get("type", ""))
		var arrival_label := String(PERSONNEL_HIRING.get(personnel_type, {}).get("label", "Personnel"))
		match personnel_type:
			"soldier":
				var recruit_value: Variant = order.get("recruit", {})
				var recruit: Dictionary = recruit_value.duplicate(true) if recruit_value is Dictionary else _recruit_for_sequence(int(data.get("next_personnel_order_id", 1)))
				var roster: Array = data.get("soldiers", [])
				roster.append(recruit)
				data["soldiers"] = roster
				arrival_label = String(recruit.get("name", "Soldier"))
			"scientist": data["scientists"] = int(data.get("scientists", 0)) + 1
			"engineer": data["engineers"] = int(data.get("engineers", 0)) + 1
			_: continue
		add_report("Personnel arrived: %s reported to %s." % [arrival_label, data.get("base", {}).get("name", "the selected base")])
	data["personnel_orders"] = remaining_orders

func _advance_interception(amount: int) -> void:
	var operation: Dictionary = data.get("interception", {})
	if operation.is_empty() or amount <= 0:
		return
	var duration := maxi(1, int(operation.get("duration_minutes", 20)))
	operation["progress"] = mini(100, int(operation.get("progress", 0)) + int(round(float(amount) / float(duration) * 100.0)))
	if int(operation["progress"]) < 100:
		data["interception"] = operation
		return
	if operation.get("phase", "") == "outbound":
		var craft_survived := _resolve_interception_combat(operation)
		if craft_survived:
			operation["phase"] = "returning"
			operation["progress"] = 0
			operation["duration_minutes"] = 20
			interceptor()["status"] = "Returning"
			data["interception"] = operation
		else:
			data["last_interception"] = operation.duplicate(true)
			data["interception"] = {}
	elif operation.get("phase", "") == "returning":
		_complete_interceptor_return(operation)

func _resolve_interception_combat(operation: Dictionary) -> bool:
	var craft := interceptor()
	var ufo := _ufo_by_id(operation.get("ufo_id", ""))
	if craft.is_empty() or ufo.is_empty():
		operation["combat_log"] = ["Contact solution failed. Interceptor recalled."]
		return not craft.is_empty()
	var stance := String(operation.get("stance", "Standard"))
	var profile: Dictionary = INTERCEPTION_STANCES.get(stance, INTERCEPTION_STANCES.Standard)
	var combat_log: Array = []
	var stance_salt := 11 if stance == "Cautious" else 29 if stance == "Standard" else 47
	for round_index in range(int(profile.get("rounds", 3))):
		if int(craft.get("ammo", 0)) <= 0 or int(craft.get("hp", 0)) <= 0 or int(ufo.get("hull", 0)) <= 0:
			break
		craft["ammo"] = maxi(0, int(craft.get("ammo", 0)) - 1)
		var shot_roll := AegisHexRules.deterministic_roll(int(ufo.get("seed", 1)), stance_salt + round_index * 37)
		var hit_chance := clampi(int(profile.get("accuracy", 76)) + int(craft.get("accuracy", 72)) / 10 - int(ufo.get("evasion", 36)) / 3, 18, 94)
		if shot_roll <= hit_chance:
			var damage := int(profile.get("damage", 28)) + AegisHexRules.deterministic_roll(int(ufo.get("seed", 1)), 100 + stance_salt + round_index * 19, 0, 8)
			ufo["hull"] = maxi(0, int(ufo.get("hull", 0)) - damage)
			combat_log.append("Round %d: Saber One hits for %d. UFO hull %d/%d." % [round_index + 1, damage, ufo.get("hull", 0), ufo.get("max_hull", 1)])
		else:
			combat_log.append("Round %d: Saber One firing solution misses." % [round_index + 1])
		if int(ufo.get("hull", 0)) <= 0:
			break
		var return_roll := AegisHexRules.deterministic_roll(int(ufo.get("seed", 1)), 200 + stance_salt + round_index * 23)
		var incoming_chance := clampi(int(profile.get("incoming", 38)) + int(ufo.get("accuracy", 42)) / 5, 12, 82)
		if return_roll <= incoming_chance:
			var incoming_damage := int(ufo.get("damage", 15)) + AegisHexRules.deterministic_roll(int(ufo.get("seed", 1)), 300 + stance_salt + round_index * 31, 0, 7)
			craft["hp"] = maxi(0, int(craft.get("hp", 0)) - incoming_damage)
			combat_log.append("Return fire damages Saber One for %d. Hull %d/%d." % [incoming_damage, craft.get("hp", 0), craft.get("max_hp", 1)])
		else:
			combat_log.append("Saber One evades return fire.")
	operation["combat_log"] = combat_log
	if int(craft.get("hp", 0)) <= 0:
		craft["status"] = "Lost"
		ufo["status"] = "Escaped"
		operation["success"] = false
		operation["phase"] = "lost"
		add_report("AIR LOSS: %s was destroyed engaging %s." % [craft.get("name", "Interceptor"), ufo.get("name", "UFO")])
		return false
	if int(ufo.get("hull", 0)) <= 0:
		ufo["status"] = "Downed"
		operation["success"] = true
		_create_crash_site(ufo)
		add_report("AIR VICTORY: %s shot down %s. A recovery site is available." % [craft.get("name", "Interceptor"), ufo.get("name", "UFO")])
	else:
		ufo["status"] = "Escaped"
		operation["success"] = false
		add_report("AIR CONTACT LOST: %s disengaged from %s." % [craft.get("name", "Interceptor"), ufo.get("name", "UFO")])
	return true

func _complete_interceptor_return(operation: Dictionary) -> void:
	var craft := interceptor()
	if not craft.is_empty():
		var repair_minutes := maxi(20, int(craft.get("max_hp", 100)) - int(craft.get("hp", 100)) + (int(craft.get("max_ammo", 6)) - int(craft.get("ammo", 6))) * 5)
		craft["status"] = "Servicing"
		craft["service_minutes"] = repair_minutes
		add_report("%s returned to base. Service crews require %d minutes." % [craft.get("name", "Interceptor"), repair_minutes])
	operation["phase"] = "complete"
	operation["progress"] = 100
	data["last_interception"] = operation.duplicate(true)
	data["interception"] = {}

func _advance_aircraft_service(amount: int) -> void:
	for craft in data.get("aircraft", {}).values():
		if craft.get("status", "") != "Servicing":
			continue
		craft["service_minutes"] = maxi(0, int(craft.get("service_minutes", 0)) - amount)
		if int(craft["service_minutes"]) <= 0:
			craft["hp"] = int(craft.get("max_hp", 100))
			craft["fuel"] = int(craft.get("max_fuel", 100))
			craft["ammo"] = int(craft.get("max_ammo", 6))
			craft["status"] = "Ready"
			add_report("%s is refueled, repaired, and ready." % craft.get("name", "Interceptor"))

func _create_crash_site(ufo: Dictionary) -> void:
	var crash_id := "crash_%s" % ufo.get("id", "ufo")
	for incident in data.get("incidents", []):
		if incident.get("id", "") == crash_id:
			return
	var incidents: Array = data.get("incidents", [])
	incidents.append({
		"id": crash_id,
		"name": "%s Crash Site" % ufo.get("class", "UFO"),
		"region": ufo.get("region", "Unknown"),
		"threat": 2,
		"reward": 560,
		"intent": "UFO Recovery",
		"biome": "Crash Site",
		"required_rescues": 0,
		"seed": int(ufo.get("seed", 1)) + 91
	})
	data["incidents"] = incidents

func _ufo_by_id(ufo_id: String) -> Dictionary:
	for ufo in data.get("ufo_contacts", []):
		if ufo.get("id", "") == ufo_id:
			return ufo
	return {}

func _default_aircraft() -> Dictionary:
	var result := {}
	for source in content.get("aircraft", []):
		var craft: Dictionary = source.duplicate(true)
		craft["status"] = "Ready"
		craft["service_minutes"] = 0
		craft["base_region"] = "North America"
		result[craft.get("id", "aircraft-%d" % result.size())] = craft
	return result

func _default_ufos() -> Array:
	return content.get("ufos", []).duplicate(true)

func complete_mission(result: Dictionary) -> void:
	var incident := selected_incident()
	var success := bool(result.get("success", false))
	var reward := int(incident.get("reward", 0)) if success else 0
	data["funds"] = int(data.get("funds", 0)) + reward
	data["mission_count"] = int(data.get("mission_count", 0)) + 1
	data["rescued_civilians"] = int(data.get("rescued_civilians", 0)) + int(result.get("rescued", 0))
	for soldier in data.get("soldiers", []):
		var tactical_record: Dictionary = result.get("soldiers", {}).get(soldier.get("id", ""), {})
		if tactical_record.is_empty():
			continue
		soldier["missions"] = int(soldier.get("missions", 0)) + 1
		soldier["kills"] = int(soldier.get("kills", 0)) + int(tactical_record.get("kills", 0))
		if int(tactical_record.get("hp", soldier.get("health", 1))) <= 0:
			soldier["status"] = "KIA"
		elif int(tactical_record.get("hp", soldier.get("health", 1))) < int(soldier.get("health", 1)):
			soldier["status"] = "Wounded"
			soldier["wounds"] = int(soldier.get("wounds", 0)) + 1
	if success:
		data["incidents"] = data.get("incidents", []).filter(func(item): return item.get("id", "") != incident.get("id", ""))
	add_report("%s: %s. %d civilian%s rescued. Funds +$%dk." % ["SUCCESS" if success else "FAILURE", incident.get("name", "Incident"), int(result.get("rescued", 0)), "" if int(result.get("rescued", 0)) == 1 else "s", reward])
	data["travel"] = {}

func add_report(message: String) -> void:
	var reports: Array = data.get("reports", [])
	reports.push_front(message)
	if reports.size() > 30:
		reports.resize(30)
	data["reports"] = reports

func clock_text() -> String:
	var total := int(data.get("minutes", 0))
	return "%02d:%02d" % [total / 60, total % 60]

func save_campaign(path: String = "") -> bool:
	if not has_campaign():
		return false
	var target_path := path if not path.is_empty() else active_save_path
	var file := FileAccess.open(target_path, FileAccess.WRITE)
	if file == null:
		return false
	file.store_string(JSON.stringify(data, "  "))
	return true

func load_campaign(path: String = "") -> bool:
	var target_path := path if not path.is_empty() else SAVE_PATH
	if not FileAccess.file_exists(target_path):
		return false
	var file := FileAccess.open(target_path, FileAccess.READ)
	if file == null:
		return false
	var parsed = JSON.parse_string(file.get_as_text())
	if not parsed is Dictionary:
		return false
	data = normalize_save(parsed)
	if not has_campaign():
		return false
	active_save_path = target_path
	return true

func browser_import_preview(browser_data: Dictionary) -> Dictionary:
	var kind := String(browser_data.get("kind", ""))
	if kind == BROWSER_SLOT_BACKUP_KIND:
		return {"valid": false, "error": "This is an all-slots browser backup. Export one campaign or one save slot before importing it into the native slice."}
	if not kind.is_empty() and kind != BROWSER_CAMPAIGN_KIND:
		return {"valid": false, "error": "The selected JSON file is not a Project Aegis campaign export."}
	var source_value: Variant = browser_data.get("data", browser_data.get("game", browser_data))
	if not source_value is Dictionary:
		return {"valid": false, "error": "The campaign payload does not contain a readable data object."}
	var source: Dictionary = source_value
	var bases_value: Variant = source.get("bases", [])
	var soldiers_value: Variant = source.get("soldiers", [])
	if not bases_value is Array or bases_value.is_empty() or not soldiers_value is Array or soldiers_value.is_empty():
		return {"valid": false, "error": "The selected file does not contain the browser campaign's bases and soldiers."}
	var source_format := int(browser_data.get("saveFormatVersion", source.get("saveFormatVersion", 0)))
	if source_format > SAVE_FORMAT:
		return {"valid": false, "error": "This browser save uses format %d, but this native build supports through format %d." % [source_format, SAVE_FORMAT]}
	var first_base := _browser_selected_base(source)
	var incidents := _normalize_browser_incidents(source)
	var warnings: Array[String] = [
		"The native vertical slice imports a compatible campaign subset; complex base layouts, relationships, transfers, and browser-only queues stay in the browser save.",
		"Native aircraft and the tracked Nightglass contact use the vertical slice defaults."
	]
	if incidents.is_empty():
		warnings.append("No compatible active browser incidents were found, so the native opening incidents will be supplied.")
	return {
		"valid": true,
		"name": String(browser_data.get("name", source.get("campaignName", "Imported Aegis Campaign"))),
		"source_build": String(browser_data.get("gameBuild", source.get("gameBuild", "Unknown browser build"))),
		"source_format": source_format,
		"month": maxi(1, int(source.get("month", browser_data.get("month", 1)))),
		"day": maxi(1, int(source.get("dayOfMonth", browser_data.get("dayOfMonth", 1)))),
		"funds": int(source.get("funds", browser_data.get("funds", 2200))),
		"base_name": String(first_base.get("name", "Fort Aegis")),
		"base_region": String(first_base.get("region", "North America")),
		"soldier_count": soldiers_value.size(),
		"incident_count": incidents.size(),
		"warnings": warnings
	}

func import_browser_save(browser_data: Dictionary, source_label: String = "Browser export") -> bool:
	var preview := browser_import_preview(browser_data)
	if not preview.get("valid", false):
		return false
	var source_value: Variant = browser_data.get("data", browser_data.get("game", browser_data))
	var source: Dictionary = source_value
	var first_base := _browser_selected_base(source)
	var roster := _normalize_browser_soldiers(source)
	var incidents := _normalize_browser_incidents(source)
	if incidents.is_empty():
		incidents = content.get("incidents", []).duplicate(true)
	active_save_path = IMPORTED_SAVE_PATH
	data = {
		"save_format": SAVE_FORMAT,
		"native_build": content.get("build", "godot-dev"),
		"campaign_name": preview.get("name", "Imported Aegis Campaign"),
		"month": preview.get("month", 1),
		"day": preview.get("day", 1),
		"minutes": clampi(int(source.get("geoscapeMinuteOfDay", source.get("minutes", 8 * 60))), 0, 24 * 60 - 1),
		"funds": preview.get("funds", 2200),
		"base": {
			"name": first_base.get("name", "Fort Aegis"),
			"region": first_base.get("region", "North America"),
			"source_id": String(first_base.get("id", "")),
			"facilities": _normalize_browser_facilities(first_base),
			"facility_counts": _normalize_browser_facility_counts(first_base)
		},
		"soldiers": roster,
		"scientists": maxi(0, int(source.get("scientists", source.get("research", {}).get("assignedScientists", 5)))),
		"engineers": maxi(0, int(source.get("engineers", 0))),
		"incidents": incidents,
		"selected_incident_id": "",
		"travel": {},
		"aircraft": _default_aircraft(),
		"ufo_contacts": _default_ufos(),
		"selected_ufo_id": "nightglass_01",
		"interception_stance": "Standard",
		"interception": {},
		"last_interception": {},
		"reports": ["Browser campaign imported as an isolated native copy."] + _normalize_browser_reports(source),
		"research": _normalize_browser_research(source),
		"stores": source.get("gearInventory", source.get("stores", {})),
		"mission_count": int(source.get("missionCount", source.get("mission_count", 0))),
		"rescued_civilians": int(source.get("rescuedCivilians", source.get("rescued_civilians", 0))),
		"save_origin": {
			"type": "browser_import",
			"source_name": source_label,
			"source_build": preview.get("source_build", "Unknown browser build"),
			"source_format": preview.get("source_format", 0),
			"imported_at": Time.get_datetime_string_from_system(true)
		},
		"import_warnings": preview.get("warnings", []).duplicate(true)
	}
	data = normalize_save(data)
	interceptor()["base_region"] = first_base.get("region", "North America")
	if not incidents.is_empty():
		data["selected_incident_id"] = incidents[0].get("id", "")
	return has_campaign()

func _browser_selected_base(source: Dictionary) -> Dictionary:
	var bases: Array = source.get("bases", [])
	var selected_base_id := String(source.get("selectedBaseId", ""))
	for candidate in bases:
		if candidate is Dictionary and String(candidate.get("id", "")) == selected_base_id:
			return candidate
	return bases[0] if not bases.is_empty() and bases[0] is Dictionary else {}

func _normalize_browser_facilities(base_source: Dictionary) -> Array:
	var known_ids: Array = content.get("facilities", []).map(func(item): return item.get("id", ""))
	var normalized: Array = []
	var source_facilities: Variant = base_source.get("facilities", [])
	if source_facilities is Array:
		for facility in source_facilities:
			var facility_id := String(facility.get("type", facility.get("id", ""))) if facility is Dictionary else String(facility)
			if facility_id in known_ids and facility_id not in normalized:
				normalized.append(facility_id)
	var grid_value: Variant = base_source.get("grid", [])
	if grid_value is Array:
		for grid_row in grid_value:
			if not grid_row is Array:
				continue
			for grid_cell in grid_row:
				var grid_id := String(grid_cell)
				if grid_id == "shortradar":
					grid_id = "radar"
				if grid_id.begins_with("hangar"):
					for hangar_id in ["hangar_interceptor", "hangar_skyranger"]:
						if hangar_id not in normalized:
							normalized.append(hangar_id)
				elif grid_id in known_ids and grid_id not in normalized:
					normalized.append(grid_id)
	var defaults := ["access", "quarters", "lab", "sickbay", "stores", "hangar_interceptor", "hangar_skyranger", "radar"]
	return normalized if not normalized.is_empty() else defaults

func _facility_counts_from_ids(facilities: Array) -> Dictionary:
	var counts := {}
	for facility_value in facilities:
		var facility_id := String(facility_value)
		if facility_id.is_empty():
			continue
		counts[facility_id] = int(counts.get(facility_id, 0)) + 1
	return counts

func _normalize_browser_facility_counts(base_source: Dictionary) -> Dictionary:
	var counts := {}
	var grid_value: Variant = base_source.get("grid", [])
	if grid_value is Array and not grid_value.is_empty():
		for grid_row in grid_value:
			if not grid_row is Array:
				continue
			for grid_cell in grid_row:
				var grid_id := String(grid_cell)
				if grid_id == "shortradar":
					grid_id = "radar"
				if grid_id in ["access", "quarters", "lab", "workshop", "sickbay", "stores", "radar"]:
					counts[grid_id] = int(counts.get(grid_id, 0)) + 1
	else:
		var source_facilities: Variant = base_source.get("facilities", [])
		if source_facilities is Array:
			for facility in source_facilities:
				var facility_id := String(facility.get("type", facility.get("id", ""))) if facility is Dictionary else String(facility)
				if facility_id == "shortradar":
					facility_id = "radar"
				if not facility_id.is_empty():
					counts[facility_id] = int(counts.get(facility_id, 0)) + 1
	if counts.is_empty():
		return _facility_counts_from_ids(["access", "quarters", "lab", "sickbay", "stores", "hangar_interceptor", "hangar_skyranger", "radar"])
	return counts

func _browser_assigned_ids(source: Dictionary) -> Array[String]:
	var result: Array[String] = []
	var active_squad_id := String(source.get("activeSquadId", ""))
	var squads_value: Variant = source.get("squads", [])
	if squads_value is Array:
		for squad in squads_value:
			if not squad is Dictionary or (not active_squad_id.is_empty() and String(squad.get("id", "")) != active_squad_id):
				continue
			var members: Variant = squad.get("soldierIds", squad.get("memberIds", squad.get("members", [])))
			if members is Array:
				for member in members:
					var soldier_id := String(member.get("id", "")) if member is Dictionary else String(member)
					if not soldier_id.is_empty() and soldier_id not in result:
						result.append(soldier_id)
			break
	return result

func _normalize_browser_soldiers(source: Dictionary) -> Array:
	var normalized: Array = []
	var assigned_ids := _browser_assigned_ids(source)
	var source_soldiers: Array = source.get("soldiers", [])
	var native_assigned_count := 0
	for soldier_index in range(source_soldiers.size()):
		var browser_soldier: Dictionary = source_soldiers[soldier_index]
		var soldier_id := String(browser_soldier.get("id", "browser_soldier_%d" % soldier_index))
		var source_status := String(browser_soldier.get("status", "Ready")).to_lower()
		var status := "KIA" if source_status in ["kia", "dead", "fallen"] else "Wounded" if "wound" in source_status or "sickbay" in source_status or "injur" in source_status else "Ready"
		var soldier_name := String(browser_soldier.get("name", "Imported Soldier %d" % (soldier_index + 1)))
		var stat_value: Variant = browser_soldier.get("stats", browser_soldier.get("baseStats", {}))
		var stats: Dictionary = stat_value if stat_value is Dictionary else {}
		var identity_value: Variant = browser_soldier.get("identity", {})
		var identity: Dictionary = identity_value if identity_value is Dictionary else {}
		var weapon_value: Variant = browser_soldier.get("weapon", "Ballistic Rifle")
		var armor_value: Variant = browser_soldier.get("armor", "Field Suit")
		var requested_for_squad := soldier_id in assigned_ids if not assigned_ids.is_empty() else true
		var assigned := status == "Ready" and requested_for_squad and native_assigned_count < 6
		if assigned:
			native_assigned_count += 1
		normalized.append({
			"id": soldier_id,
			"base_id": String(browser_soldier.get("baseId", browser_soldier.get("base_id", ""))),
			"name": soldier_name,
			"callsign": String(browser_soldier.get("callsign", browser_soldier.get("nickname", identity.get("callsign", soldier_name.split(" ")[0])))),
			"rank": String(browser_soldier.get("rank", "Rookie")),
			"status": status,
			"missions": int(browser_soldier.get("missions", 0)),
			"kills": int(browser_soldier.get("kills", 0)),
			"wounds": int(browser_soldier.get("wounds", browser_soldier.get("wounded", 0))),
			"accuracy": int(browser_soldier.get("accuracy", browser_soldier.get("aim", stats.get("accuracy", 60)))),
			"bravery": int(browser_soldier.get("bravery", stats.get("bravery", 55))),
			"health": int(browser_soldier.get("health", browser_soldier.get("maxHp", browser_soldier.get("hp", stats.get("health", 38))))),
			"tu": int(browser_soldier.get("tu", browser_soldier.get("timeUnits", browser_soldier.get("maxTu", stats.get("tu", 56))))),
			"trait": String(browser_soldier.get("trait", browser_soldier.get("personality", identity.get("trait", "Imported Veteran")))),
			"weapon": String(weapon_value.get("name", "Ballistic Rifle")) if weapon_value is Dictionary else String(weapon_value),
			"armor": String(armor_value.get("name", "Field Suit")) if armor_value is Dictionary else String(armor_value),
			"assigned": assigned
		})
	return normalized

func _normalize_browser_incidents(source: Dictionary) -> Array:
	var normalized: Array = []
	var source_incidents: Variant = source.get("missions", source.get("incidents", []))
	if not source_incidents is Array:
		return normalized
	for incident_index in range(source_incidents.size()):
		var browser_incident: Variant = source_incidents[incident_index]
		if not browser_incident is Dictionary:
			continue
		var civilian_objective: Variant = browser_incident.get("civilianObjective", {})
		var required_rescues := int(browser_incident.get("required_rescues", browser_incident.get("requiredRescues", 0)))
		if civilian_objective is Dictionary:
			required_rescues = int(civilian_objective.get("required", civilian_objective.get("minimum", required_rescues)))
		var incident_kind := String(browser_incident.get("kind", browser_incident.get("intent", "Alien Incident")))
		normalized.append({
			"id": String(browser_incident.get("id", "browser_incident_%d" % incident_index)),
			"name": String(browser_incident.get("name", browser_incident.get("title", incident_kind))),
			"region": String(browser_incident.get("region", "Unknown")),
			"threat": clampi(int(browser_incident.get("threat", 1)), 1, 5),
			"reward": maxi(0, int(browser_incident.get("reward", 400))),
			"intent": incident_kind,
			"biome": String(browser_incident.get("biome", "Wilderness")),
			"required_rescues": maxi(0, required_rescues),
			"seed": int(browser_incident.get("seed", 5000 + incident_index * 97))
		})
	return normalized

func _normalize_browser_research(source: Dictionary) -> Dictionary:
	var browser_research: Variant = source.get("research", {})
	if browser_research is Dictionary and (browser_research.has("active") or browser_research.has("topic")):
		var topic := String(browser_research.get("active", browser_research.get("topic", "Laser Weapons")))
		var assigned := maxi(0, int(browser_research.get("assignedScientists", browser_research.get("assigned_scientists", browser_research.get("scientists", 0)))))
		var raw_progress := maxi(0, int(browser_research.get("progress", 0)))
		var required_progress := maxi(1, int(browser_research.get("requiredProgress", browser_research.get("required_progress", browser_research.get("needed", _research_requirement_for_topic(topic, raw_progress))))))
		var progress := mini(raw_progress, required_progress)
		return {
			"active": topic,
			"progress": progress,
			"required_progress": required_progress,
			"assigned_scientists": assigned,
			"scientists": assigned,
			"completed": progress >= required_progress
		}
	return {"active": "Laser Weapons", "progress": 0, "required_progress": RESEARCH_REQUIRED_PROGRESS, "assigned_scientists": 0, "scientists": 0, "completed": false}

func _research_requirement_for_topic(topic: String, progress: int = 0) -> int:
	for definition in content.get("research_projects", []):
		if String(definition.get("id", "")) == topic:
			return maxi(1, int(definition.get("required", RESEARCH_REQUIRED_PROGRESS)))
	return maxi(RESEARCH_REQUIRED_PROGRESS, progress + 10 if progress >= RESEARCH_REQUIRED_PROGRESS else RESEARCH_REQUIRED_PROGRESS)

func _normalize_browser_reports(source: Dictionary) -> Array:
	var normalized: Array = []
	var source_reports: Variant = source.get("reports", [])
	if not source_reports is Array:
		return normalized
	for report in source_reports.slice(0, 12):
		if report is Dictionary:
			normalized.append(String(report.get("message", report.get("summary", report.get("title", "Imported browser report")))))
		else:
			normalized.append(String(report))
	return normalized

func normalize_save(source: Dictionary) -> Dictionary:
	var normalized := source.duplicate(true)
	normalized["save_format"] = SAVE_FORMAT
	normalized["funds"] = int(normalized.get("funds", 2200))
	normalized["month"] = maxi(1, int(normalized.get("month", 1)))
	normalized["day"] = maxi(1, int(normalized.get("day", 1)))
	normalized["minutes"] = clampi(int(normalized.get("minutes", 8 * 60)), 0, 24 * 60 - 1)
	normalized["soldiers"] = normalized.get("soldiers", []).duplicate(true)
	var base_value: Variant = normalized.get("base", {})
	var normalized_base: Dictionary = base_value.duplicate(true) if base_value is Dictionary else {}
	var facilities_value: Variant = normalized_base.get("facilities", [])
	var normalized_facilities: Array = facilities_value.duplicate(true) if facilities_value is Array else []
	var save_origin_value: Variant = normalized.get("save_origin", {})
	var browser_imported := save_origin_value is Dictionary and String(save_origin_value.get("type", "")) == "browser_import"
	if not browser_imported and not normalized_facilities.has("workshop"):
		normalized_facilities.append("workshop")
	normalized_base["facilities"] = normalized_facilities
	var counts_value: Variant = normalized_base.get("facility_counts", {})
	var facility_counts: Dictionary = counts_value.duplicate(true) if counts_value is Dictionary else {}
	if facility_counts.is_empty():
		facility_counts = _facility_counts_from_ids(normalized_facilities)
	for required_facility in ["quarters", "lab", "workshop"]:
		if not facility_counts.has(required_facility):
			facility_counts[required_facility] = normalized_facilities.count(required_facility)
	normalized_base["facility_counts"] = facility_counts
	normalized["base"] = normalized_base
	var research_value: Variant = normalized.get("research", {})
	var normalized_research: Dictionary = research_value.duplicate(true) if research_value is Dictionary else {}
	var legacy_assigned := maxi(0, int(normalized_research.get("assigned_scientists", normalized_research.get("scientists", 5))))
	var default_scientists := legacy_assigned if legacy_assigned > 0 else 5
	normalized["scientists"] = maxi(0, int(normalized.get("scientists", default_scientists)))
	normalized["engineers"] = maxi(0, int(normalized.get("engineers", 0)))
	var orders_value: Variant = normalized.get("personnel_orders", [])
	var normalized_orders: Array = []
	if orders_value is Array:
		for order_index in range(orders_value.size()):
			var order_value: Variant = orders_value[order_index]
			if not order_value is Dictionary:
				continue
			var order: Dictionary = order_value.duplicate(true)
			var personnel_type := String(order.get("type", ""))
			if not PERSONNEL_HIRING.has(personnel_type):
				continue
			var sequence := order_index + 1
			order["id"] = String(order.get("id", "personnel_%03d" % sequence))
			order["days_remaining"] = clampi(int(order.get("days_remaining", order.get("daysLeft", PERSONNEL_ARRIVAL_DAYS))), 1, PERSONNEL_ARRIVAL_DAYS)
			order["total_days"] = PERSONNEL_ARRIVAL_DAYS
			order["cost"] = maxi(0, int(order.get("cost", PERSONNEL_HIRING[personnel_type].get("cost", 0))))
			order["base_id"] = String(order.get("base_id", normalized_base.get("source_id", normalized_base.get("id", normalized_base.get("name", "Fort Aegis")))))
			if personnel_type == "soldier":
				var recruit_value: Variant = order.get("recruit", {})
				if not recruit_value is Dictionary or recruit_value.is_empty():
					order["recruit"] = _recruit_for_sequence(sequence, String(order.get("base_id", "")))
			normalized_orders.append(order)
	normalized["personnel_orders"] = normalized_orders
	normalized["next_personnel_order_id"] = maxi(int(normalized.get("next_personnel_order_id", 1)), normalized_orders.size() + 1)
	var construction_value: Variant = normalized.get("facility_construction_orders", [])
	var normalized_construction: Array = []
	if construction_value is Array:
		for order_index in range(mini(construction_value.size(), MAX_FACILITY_CONSTRUCTION_ORDERS)):
			var order_value: Variant = construction_value[order_index]
			if not order_value is Dictionary:
				continue
			var order: Dictionary = order_value.duplicate(true)
			var facility_id := String(order.get("facility_id", order.get("facility", "")))
			var definition := _facility_construction_definition(facility_id)
			if definition.is_empty():
				continue
			var sequence := order_index + 1
			var total_days := maxi(1, int(order.get("total_days", order.get("days", definition.get("construction_days", 1)))))
			order["id"] = String(order.get("id", "facility_%03d" % sequence))
			order["facility_id"] = facility_id
			order["label"] = String(order.get("label", definition.get("name", facility_id)))
			order["cost"] = maxi(0, int(order.get("cost", definition.get("build_cost", 0))))
			order["days_remaining"] = clampi(int(order.get("days_remaining", order.get("daysLeft", total_days))), 1, total_days)
			order["total_days"] = total_days
			order["base_id"] = String(order.get("base_id", normalized_base.get("source_id", normalized_base.get("id", normalized_base.get("name", "Fort Aegis")))))
			normalized_construction.append(order)
	normalized["facility_construction_orders"] = normalized_construction
	normalized["next_facility_construction_order_id"] = maxi(int(normalized.get("next_facility_construction_order_id", 1)), normalized_construction.size() + 1)
	var manufacturing_value: Variant = normalized.get("manufacturing_queue", [])
	var normalized_manufacturing: Array = []
	if manufacturing_value is Array:
		for order_index in range(mini(manufacturing_value.size(), MAX_MANUFACTURING_ORDERS)):
			var order_value: Variant = manufacturing_value[order_index]
			if not order_value is Dictionary:
				continue
			var order: Dictionary = order_value.duplicate(true)
			var item_name := String(order.get("item_name", order.get("item", "")))
			var definition := _manufacturing_definition(item_name)
			if definition.is_empty():
				continue
			var sequence := order_index + 1
			var required_work := maxi(1, int(order.get("work_required", order.get("work", definition.get("work", 1)))))
			order["id"] = String(order.get("id", "manufacturing_%03d" % sequence))
			order["item_name"] = item_name
			order["cost"] = maxi(0, int(order.get("cost", definition.get("cost", 0))))
			order["work_required"] = required_work
			order["progress"] = clampi(int(order.get("progress", 0)), 0, required_work - 1)
			order["base_id"] = String(order.get("base_id", normalized_base.get("source_id", normalized_base.get("id", normalized_base.get("name", "Fort Aegis")))))
			normalized_manufacturing.append(order)
	normalized["manufacturing_queue"] = normalized_manufacturing
	normalized["next_manufacturing_order_id"] = maxi(int(normalized.get("next_manufacturing_order_id", 1)), normalized_manufacturing.size() + 1)
	var workshop_capacity := maxi(0, int(facility_counts.get("workshop", 0))) * ENGINEERS_PER_WORKSHOP
	var manufacturing_staff_limit := mini(int(normalized["engineers"]), workshop_capacity)
	normalized["manufacturing_assigned_engineers"] = clampi(int(normalized.get("manufacturing_assigned_engineers", 0)), 0, manufacturing_staff_limit) if not normalized_manufacturing.is_empty() else 0
	var lab_capacity := maxi(0, int(facility_counts.get("lab", 0))) * SCIENTISTS_PER_LAB
	var staffing_limit := mini(int(normalized["scientists"]), lab_capacity)
	var assigned := clampi(legacy_assigned, 0, staffing_limit)
	var active_topic := String(normalized_research.get("active", normalized_research.get("topic", "Laser Weapons")))
	var raw_progress := maxi(0, int(normalized_research.get("progress", 0)))
	var required_progress := maxi(1, int(normalized_research.get("required_progress", normalized_research.get("requiredProgress", _research_requirement_for_topic(active_topic, raw_progress)))))
	var progress := mini(raw_progress, required_progress)
	normalized_research["active"] = active_topic
	normalized_research["progress"] = progress
	normalized_research["required_progress"] = required_progress
	normalized_research["completed"] = bool(normalized_research.get("completed", false)) or progress >= required_progress
	if bool(normalized_research["completed"]):
		assigned = 0
	normalized_research["assigned_scientists"] = assigned
	normalized_research["scientists"] = assigned
	normalized["research"] = normalized_research
	var completed_value: Variant = normalized.get("completed_research", [])
	var normalized_completed: Array = completed_value.duplicate(true) if completed_value is Array else []
	if bool(normalized_research["completed"]) and not active_topic.is_empty() and not normalized_completed.has(active_topic):
		normalized_completed.append(active_topic)
	var active_definition := _research_definition(active_topic)
	for prerequisite in active_definition.get("prerequisites", []):
		if not normalized_completed.has(prerequisite):
			normalized_completed.append(prerequisite)
	normalized["completed_research"] = normalized_completed
	var unlocks_value: Variant = normalized.get("technology_unlocks", [])
	var normalized_unlocks: Array = unlocks_value.duplicate(true) if unlocks_value is Array else []
	for completed_topic in normalized_completed:
		for unlock_id in _research_definition(String(completed_topic)).get("unlocks_capabilities", []):
			if not normalized_unlocks.has(unlock_id):
				normalized_unlocks.append(unlock_id)
	normalized["technology_unlocks"] = normalized_unlocks
	normalized["incidents"] = normalized.get("incidents", []).duplicate(true)
	normalized["reports"] = normalized.get("reports", []).duplicate(true)
	normalized["travel"] = normalized.get("travel", {}).duplicate(true)
	var had_aircraft_state := normalized.has("aircraft")
	var default_aircraft := _default_aircraft()
	var normalized_aircraft: Dictionary = normalized.get("aircraft", {}).duplicate(true)
	for craft_id in default_aircraft:
		if not normalized_aircraft.has(craft_id):
			normalized_aircraft[craft_id] = default_aircraft[craft_id].duplicate(true)
		else:
			normalized_aircraft[craft_id].merge(default_aircraft[craft_id], false)
		if not had_aircraft_state or String(normalized_aircraft[craft_id].get("base_region", "")).is_empty():
			normalized_aircraft[craft_id]["base_region"] = normalized.get("base", {}).get("region", "North America")
	normalized["aircraft"] = normalized_aircraft
	normalized["ufo_contacts"] = normalized.get("ufo_contacts", _default_ufos()).duplicate(true)
	normalized["selected_ufo_id"] = normalized.get("selected_ufo_id", "nightglass_01")
	normalized["interception_stance"] = normalized.get("interception_stance", "Standard")
	normalized["interception"] = normalized.get("interception", {}).duplicate(true)
	normalized["last_interception"] = normalized.get("last_interception", {}).duplicate(true)
	normalized["save_origin"] = normalized.get("save_origin", {}).duplicate(true)
	normalized["import_warnings"] = normalized.get("import_warnings", []).duplicate(true)
	normalized["native_build"] = content.get("build", normalized.get("native_build", "godot-dev"))
	return normalized
