class_name AegisTacticalBoard
extends Control

signal selection_changed(unit: Dictionary)
signal status_changed(status: Dictionary)
signal log_added(message: String)
signal battle_finished(result: Dictionary)
signal ai_command_changed(active: bool)
signal voice_requested(file_name: String)

const GRID_WIDTH := 20
const GRID_HEIGHT := 14
const HEX_RADIUS := 27.0
const HEX_WIDTH := 46.765
const ROW_STEP := 40.5
const MAP_PROFILES := {
	"small":{"key":"small","label":"Small","width":20,"height":14,"civilian_count":2,"structure_bonus":0},
	"medium":{"key":"medium","label":"Medium","width":26,"height":18,"civilian_count":4,"structure_bonus":1},
	"large":{"key":"large","label":"Large","width":32,"height":22,"civilian_count":6,"structure_bonus":2}
}
const MOVE_TU := 4
const FIRE_TU := 16
const ESCORT_TU := 8
const MEDKIT_TU := 12
const MEDKIT_HEAL := 12
const GRENADE_PRIME_TU := 4
const GRENADE_THROW_TU := 12
const GRENADE_RANGE := 6
const GRENADE_CENTER_DAMAGE := 28
const GRENADE_EDGE_DAMAGE := 16
const GRENADE_CENTER_BREACH := 42
const GRENADE_EDGE_BREACH := 24
const INVENTORY_ACTION_TU := 4
const AI_MAX_MOVE_STEPS := 8
const AI_MAX_CANDIDATES := 192
const AI_MAX_TURNS := 24
const AI_DISTRESS_TURNS := 12
const TRACKER_PULSE_INTERVAL := 5.5
const TRACKER_PULSE_DURATION := 1.4
const RANK_ORDER := ["Rookie", "Squaddie", "Corporal", "Sergeant", "Lieutenant", "Captain", "Major", "Colonel"]
const COMMAND_DOCTRINES := [
	{"key":"wedge","label":"Protected Wedge","rank":"Rookie","missions":0},
	{"key":"line","label":"Assault Line","rank":"Corporal","missions":2},
	{"key":"echelon","label":"Echelon Flank","rank":"Sergeant","missions":4},
	{"key":"support_maneuver","label":"Support and Maneuver","rank":"Lieutenant","missions":6},
	{"key":"diamond","label":"Diamond Security","rank":"Captain","missions":9}
]

var incident: Dictionary = {}
var roster: Array = []
var equipment_catalog: Dictionary = {}
var units: Array = []
var covers: Dictionary = {}
var extraction_cells: Dictionary = {}
var floor_items: Array[Dictionary] = []
var selected_id := ""
var reachable: Dictionary = {}
var hovered_cell := Vector2i(-1, -1)
var phase := "human"
var turn_number := 1
var rescued := 0
var required_rescues := 1
var resolved := false
var action_serial := 0
var event_log: Array[String] = []
var board_origin := Vector2(42, 46)
var ai_command_active := false
var ai_command_busy := false
var ai_last_acted_ids: Array[String] = []
var commander_id := ""
var commander_doctrine: Dictionary = {}
var alien_contact_seen := false
var explored_cells: Dictionary = {}
var tracker_pulse_elapsed := TRACKER_PULSE_INTERVAL - 0.8
var tracker_pulse_remaining := 0.0
var tracker_pulse_serial := 0
var map_profile: Dictionary = MAP_PROFILES.small.duplicate(true)
var grid_width := GRID_WIDTH
var grid_height := GRID_HEIGHT
var hex_radius := HEX_RADIUS
var hex_width := HEX_WIDTH
var row_step := ROW_STEP
var transport_count := 1
var skyranger_placements: Array[Dictionary] = []

func _ready() -> void:
	custom_minimum_size = Vector2(990, 650)
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	clip_contents = true

func _process(delta: float) -> void:
	if resolved or _active_vip_tracker_targets().is_empty():
		return
	tracker_pulse_elapsed += delta
	if tracker_pulse_elapsed >= TRACKER_PULSE_INTERVAL:
		tracker_pulse_elapsed = 0.0
		tracker_pulse_remaining = TRACKER_PULSE_DURATION
		tracker_pulse_serial += 1
	if tracker_pulse_remaining > 0.0:
		tracker_pulse_remaining = maxf(0.0, tracker_pulse_remaining - delta)
		queue_redraw()

func begin_battle(next_incident: Dictionary, next_roster: Array, next_equipment_catalog: Dictionary = {}) -> void:
	incident = next_incident.duplicate(true)
	roster = next_roster.duplicate(true)
	equipment_catalog = next_equipment_catalog.duplicate(true)
	required_rescues = maxi(0, int(incident.get("required_rescues", 1)))
	_configure_map_profile()
	units.clear()
	covers.clear()
	extraction_cells.clear()
	floor_items.clear()
	event_log.clear()
	selected_id = ""
	reachable.clear()
	phase = "human"
	turn_number = 1
	rescued = 0
	resolved = false
	action_serial = 0
	ai_command_active = false
	ai_command_busy = false
	ai_last_acted_ids.clear()
	commander_id = ""
	commander_doctrine = {}
	alien_contact_seen = false
	explored_cells.clear()
	tracker_pulse_elapsed = TRACKER_PULSE_INTERVAL - 0.8
	tracker_pulse_remaining = 0.0
	tracker_pulse_serial = 0
	_generate_field()
	_emit_log("Aegis One deployed. Secure the incident and rescue at least %d civilian%s." % [required_rescues, "" if required_rescues == 1 else "s"])
	_refresh_visibility()
	_emit_state()
	queue_redraw()

func _configure_map_profile() -> void:
	transport_count = clampi(int(incident.get("transport_count", (incident.get("response_squad_deployments", []) as Array).size())), 1, 2)
	var explicit := String(incident.get("tactical_map_tier", incident.get("map_size", ""))).to_lower()
	var threat := int(incident.get("threat", 1))
	var profile_key := explicit if MAP_PROFILES.has(explicit) else "large" if threat >= 5 else "medium" if threat >= 3 or transport_count > 1 else "small"
	map_profile = (MAP_PROFILES.get(profile_key, MAP_PROFILES.small) as Dictionary).duplicate(true)
	grid_width = int(map_profile.width)
	grid_height = int(map_profile.height)
	var fit_scale := minf(1.0, minf(900.0 / (float(grid_width) * HEX_WIDTH + HEX_WIDTH * 0.5), 560.0 / (float(grid_height) * ROW_STEP + HEX_RADIUS)))
	hex_radius = HEX_RADIUS * fit_scale
	hex_width = HEX_WIDTH * fit_scale
	row_step = ROW_STEP * fit_scale
	board_origin = Vector2(34, 38)

func fit_entire_map() -> void:
	var available_width := maxf(320.0, size.x - 68.0) if size.x > 0.0 else 900.0
	var available_height := maxf(260.0, size.y - 82.0) if size.y > 0.0 else 560.0
	var fit_scale := minf(1.0, minf(available_width / (float(grid_width) * HEX_WIDTH + HEX_WIDTH * 0.5), available_height / (float(grid_height) * ROW_STEP + HEX_RADIUS)))
	hex_radius = HEX_RADIUS * fit_scale
	hex_width = HEX_WIDTH * fit_scale
	row_step = ROW_STEP * fit_scale
	board_origin = Vector2(maxf(24.0, (size.x - (float(grid_width) * hex_width + hex_width * 0.5)) * 0.5), maxf(28.0, (size.y - (float(grid_height) * row_step + hex_radius)) * 0.5))
	queue_redraw()

func _generate_field() -> void:
	_build_skyranger_placements()
	var starts := _soldier_start_cells()
	for index in range(roster.size()):
		var source: Dictionary = roster[index]
		var transport_index := _soldier_transport_index(source, index)
		var transport_starts: Array = starts[transport_index]
		var transport_member_index := _transport_member_index(source, index, transport_index)
		var start_cell: Vector2i = transport_starts[transport_member_index % transport_starts.size()]
		var weapon_name := String(source.get("weapon", "Ballistic Rifle"))
		var armor_name := String(source.get("armor", "Field Suit"))
		var weapon_profile := _equipment_definition("weapons", weapon_name, {"damage":17,"damage_variance":8,"range":7,"tu_cost":FIRE_TU,"breach_damage":26})
		var armor_profile := _equipment_definition("armors", armor_name, {"damage_reduction":0})
		var medkit_profile := _equipment_definition("field_items", "Medkit", {"heal":MEDKIT_HEAL,"tu_cost":MEDKIT_TU})
		var grenade_profile := _equipment_definition("field_items", "Frag Grenade", {"damage":GRENADE_CENTER_DAMAGE,"edge_damage":GRENADE_EDGE_DAMAGE,"range":GRENADE_RANGE,"prime_tu":GRENADE_PRIME_TU,"throw_tu":GRENADE_THROW_TU,"breach_damage":GRENADE_CENTER_BREACH,"edge_breach_damage":GRENADE_EDGE_BREACH})
		units.append({
			"id": source.get("id", "soldier-%d" % index),
			"name": source.get("name", "Soldier"),
			"callsign": source.get("callsign", source.get("name", "Soldier")),
			"team": "human",
			"cell": start_cell,
			"transport_index": transport_index,
			"hp": int(source.get("health", 40)),
			"max_hp": int(source.get("health", 40)),
			"tu": int(source.get("tu", 56)),
			"max_tu": int(source.get("tu", 56)),
			"accuracy": int(source.get("accuracy", 62)),
			"reactions": int(source.get("reactions", 55)),
			"bravery": int(source.get("bravery", 55)),
			"rank": String(source.get("rank", "Rookie")),
			"missions": int(source.get("missions", 0)),
			"kills": 0,
			"weapon": weapon_name,
			"right_hand_item": weapon_name,
			"weapon_damage": int(weapon_profile.get("damage", 17)),
			"weapon_variance": int(weapon_profile.get("damage_variance", 8)),
			"weapon_range": int(weapon_profile.get("range", 7)),
			"fire_tu": int(weapon_profile.get("tu_cost", FIRE_TU)),
			"breach_damage": int(weapon_profile.get("breach_damage", 26)),
			"armor": armor_name,
			"damage_reduction": int(armor_profile.get("damage_reduction", 0)),
			"medkit_charges": 1 if bool(source.get("medkit", false)) else 0,
			"medkit_heal": int(medkit_profile.get("heal", MEDKIT_HEAL)),
			"medkit_tu": int(medkit_profile.get("tu_cost", MEDKIT_TU)),
			"grenade_charges": 1,
			"grenade_primed": false,
			"grenade_damage": int(grenade_profile.get("damage", GRENADE_CENTER_DAMAGE)),
			"grenade_edge_damage": int(grenade_profile.get("edge_damage", GRENADE_EDGE_DAMAGE)),
			"grenade_range": int(grenade_profile.get("range", GRENADE_RANGE)),
			"grenade_prime_tu": int(grenade_profile.get("prime_tu", GRENADE_PRIME_TU)),
			"grenade_throw_tu": int(grenade_profile.get("throw_tu", GRENADE_THROW_TU)),
			"grenade_breach_damage": int(grenade_profile.get("breach_damage", GRENADE_CENTER_BREACH)),
			"grenade_edge_breach_damage": int(grenade_profile.get("edge_breach_damage", GRENADE_EDGE_BREACH)),
			"active_hand": "right",
			"level": 0,
			"targeting_mode": "move",
			"facing": Vector2i(1, 0),
			"trail": [start_cell],
			"ai_role": "",
			"kneeling": false,
			"reserve_mode": "none",
			"reserve_tu": 0,
			"priority_civilian_id": ""
		})
	var alien_x := grid_width - 4 if transport_count == 1 else grid_width / 2 + 3
	var alien_defs: Array = [
		{"name":"Signal Leech","hp":24,"accuracy":42,"damage":10,"cell":Vector2i(alien_x,3)},
		{"name":"Glass Wraith","hp":30,"accuracy":48,"damage":12,"cell":Vector2i(alien_x + 1,grid_height / 2)},
		{"name":"Needle Drone","hp":36,"accuracy":52,"damage":13,"cell":Vector2i(alien_x - 2,grid_height - 3)}
	]
	for index in range(alien_defs.size()):
		var alien: Dictionary = alien_defs[index]
		units.append({
			"id": "alien-%d" % index,
			"name": alien.name,
			"team": "alien",
			"cell": alien.cell,
			"hp": alien.hp,
			"max_hp": alien.hp,
			"tu": 48,
			"max_tu": 48,
			"accuracy": alien.accuracy,
			"damage": alien.damage,
			"weapon_range": 5,
			"fire_tu": FIRE_TU,
			"revealed": false,
			"visible": false,
			"facing": Vector2i(-1, 0),
			"last_known_cell": Vector2i(-1, -1)
		})
	_generate_building()
	var civilian_names := ["Mara Venn", "Oren Pike", "Avery Shaw", "Morgan Vale", "Reese Arden", "Sam Calder"]
	var civilian_positions := _civilian_start_cells(int(map_profile.civilian_count))
	for civilian_index in range(civilian_positions.size()):
		units.append({"id":"civilian-%d" % civilian_index,"name":civilian_names[civilian_index % civilian_names.size()],"team":"civilian","cell":civilian_positions[civilian_index],"hp":20,"max_hp":20,"panic":false,"escort_id":"","priority_escort_id":"","approached_by_id":"","rescued":false,"revealed":false,"visible":false,"vip_tracker":required_rescues > 0})
	for placement in skyranger_placements:
		for cell in placement.ramp_cells:
			extraction_cells[AegisHexRules.key(cell)] = true
	_generate_cover()

func _build_skyranger_placements() -> void:
	skyranger_placements.clear()
	var center_y := grid_height / 2
	for index in range(transport_count):
		var left_side := index == 0
		var footprint: Array[Vector2i] = []
		var ramp_cells: Array[Vector2i] = []
		for y in range(center_y - 2, center_y + 3):
			for offset in range(5):
				footprint.append(Vector2i(offset if left_side else grid_width - 1 - offset, y))
		for y in range(center_y - 1, center_y + 2):
			for offset in range(1, 4):
				ramp_cells.append(Vector2i(offset if left_side else grid_width - 1 - offset, y))
		skyranger_placements.append({"index":index,"side":"left" if left_side else "right","footprint":footprint,"ramp_cells":ramp_cells})

func _soldier_start_cells() -> Array:
	var center_y := grid_height / 2
	var left := [Vector2i(4,center_y-3),Vector2i(4,center_y-2),Vector2i(4,center_y-1),Vector2i(5,center_y-3),Vector2i(5,center_y-2),Vector2i(5,center_y-1)]
	var right := [Vector2i(grid_width-5,center_y-3),Vector2i(grid_width-5,center_y-2),Vector2i(grid_width-5,center_y-1),Vector2i(grid_width-6,center_y-3),Vector2i(grid_width-6,center_y-2),Vector2i(grid_width-6,center_y-1)]
	return [left, right]

func _response_deployments() -> Array:
	var deployments: Variant = incident.get("response_squad_deployments", [])
	return deployments if deployments is Array else []

func _soldier_transport_index(source: Dictionary, roster_index: int) -> int:
	var deployments := _response_deployments()
	for index in range(mini(transport_count, deployments.size())):
		var deployment: Dictionary = deployments[index]
		if source.get("id", "") in deployment.get("soldier_ids", []):
			return index
	if transport_count <= 1:
		return 0
	return clampi(roster_index / maxi(1, int(ceil(float(roster.size()) / float(transport_count)))), 0, transport_count - 1)

func _transport_member_index(source: Dictionary, roster_index: int, transport_index: int) -> int:
	var deployments := _response_deployments()
	if transport_index < deployments.size():
		var soldier_ids: Array = deployments[transport_index].get("soldier_ids", [])
		var explicit_index := soldier_ids.find(source.get("id", ""))
		if explicit_index >= 0:
			return explicit_index
	var per_transport := maxi(1, int(ceil(float(roster.size()) / float(transport_count))))
	return roster_index % per_transport

func _civilian_start_cells(count: int) -> Array[Vector2i]:
	var result: Array[Vector2i] = []
	var seed_value := int(incident.get("seed", 1337))
	var occupied := _skyranger_footprint_cells()
	var attempts := 0
	while result.size() < count and attempts < grid_width * grid_height:
		var x := 3 + AegisHexRules.deterministic_roll(seed_value, attempts * 17, 0, maxi(1, grid_width - 6))
		var y := 3 + AegisHexRules.deterministic_roll(seed_value, attempts * 23, 1, maxi(1, grid_height - 6))
		var cell := Vector2i(x, y)
		if _inside(cell) and not occupied.has(cell) and not result.has(cell) and not covers.has(AegisHexRules.key(cell)):
			result.append(cell)
		attempts += 1
	return result

func _equipment_definition(catalog_key: String, item_name: String, fallback: Dictionary) -> Dictionary:
	for definition_value in equipment_catalog.get(catalog_key, []):
		if definition_value is Dictionary and String(definition_value.get("id", "")) == item_name:
			var definition: Dictionary = definition_value.duplicate(true)
			definition.merge(fallback, false)
			return definition
	return fallback.duplicate(true)

func _generate_building() -> void:
	_add_building_rectangle(Vector2i(10, 2), 7, 6, "outpost")
	var candidates := [
		{"origin":Vector2i(10, grid_height - 6),"width":6,"height":5},
		{"origin":Vector2i(grid_width - 8, 2),"width":6,"height":4},
		{"origin":Vector2i(grid_width - 8, grid_height - 6),"width":6,"height":5}
	]
	var wanted: int = int(_building_density_profile().get("wanted", 1))
	var created := 1
	for candidate_value in candidates:
		if created >= wanted:
			break
		var candidate: Dictionary = candidate_value
		var origin: Vector2i = candidate.origin
		var width := int(candidate.width)
		var height := int(candidate.height)
		if not _building_site_clear(origin, width, height):
			continue
		_add_building_rectangle(origin, width, height, "structure-%d" % created)
		created += 1

func _tactical_biome_key() -> String:
	var kind := String(incident.get("kind", incident.get("mission_intent", ""))).to_lower()
	if "terror" in kind or "city" in kind or "urban" in kind or "base assault" in kind:
		return "city"
	if "abduction" in kind or "town" in kind or "supply" in kind or "scout" in kind:
		return "town"
	if "harvest" in kind or "farm" in kind or "rural" in kind:
		return "farm"
	return "wilderness"

func _building_density_profile() -> Dictionary:
	var biome := _tactical_biome_key()
	var chance: int = int({"city":90,"town":70,"farm":42,"wilderness":24}.get(biome, 20))
	var opportunities := 1 + int(map_profile.get("structure_bonus", 0))
	var bonus := 0
	var seed_value := int(incident.get("seed", 1337))
	for slot in range(opportunities):
		if AegisHexRules.deterministic_roll(seed_value, 3300 + slot * 97, 0, 99) < chance:
			bonus += 1
	return {"biome":biome,"chance":chance,"opportunities":opportunities,"bonus":bonus,"wanted":1 + bonus}

func generated_building_count() -> int:
	var ids := {}
	for cover_value in covers.values():
		var building_id := String((cover_value as Dictionary).get("building", ""))
		if not building_id.is_empty():
			ids[building_id] = true
	return ids.size()

func _building_site_clear(origin: Vector2i, width: int, height: int) -> bool:
	for y in range(origin.y, origin.y + height):
		for x in range(origin.x, origin.x + width):
			var cell := Vector2i(x, y)
			if not _inside(cell) or covers.has(AegisHexRules.key(cell)):
				return false
			for craft_cell in _skyranger_footprint_cells():
				if AegisHexRules.distance(cell, craft_cell) <= 1:
					return false
	return true

func _add_building_rectangle(origin: Vector2i, width: int, height: int, building_id: String) -> void:
	var door_x := origin.x + width / 2
	for x in range(origin.x, origin.x + width):
		_add_wall(Vector2i(x, origin.y), "window" if (x - origin.x) % 3 == 1 else "wall", building_id)
		if x != door_x:
			_add_wall(Vector2i(x, origin.y + height - 1), "window" if (x - origin.x) % 4 == 1 else "wall", building_id)
	for y in range(origin.y + 1, origin.y + height - 1):
		_add_wall(Vector2i(origin.x, y), "window" if (y - origin.y) % 3 == 1 else "wall", building_id)
		_add_wall(Vector2i(origin.x + width - 1, y), "window" if (y - origin.y) % 3 == 2 else "wall", building_id)
	var furnishing := origin + Vector2i(maxi(1, width / 2 - 1), maxi(1, height / 2))
	covers[AegisHexRules.key(furnishing)] = {"cell":furnishing,"type":"furnishing","hard":false,"hp":18,"max_hp":18,"building":building_id}

func _add_wall(cell: Vector2i, wall_type: String, building_id: String = "outpost") -> void:
	covers[AegisHexRules.key(cell)] = {"cell":cell,"type":wall_type,"hard":true,"hp":50 if wall_type == "wall" else 34,"max_hp":50 if wall_type == "wall" else 34,"building":building_id}

func _generate_cover() -> void:
	var seed_value := int(incident.get("seed", 1337))
	var cover_count := 22 + (grid_width - GRID_WIDTH) * 2
	for index in range(cover_count):
		var x := 3 + AegisHexRules.deterministic_roll(seed_value, index * 7, 0, maxi(1, grid_width - 6))
		var y := 2 + AegisHexRules.deterministic_roll(seed_value, index * 11, 1, maxi(2, grid_height - 4))
		var cell := Vector2i(x, y)
		var key := AegisHexRules.key(cell)
		if covers.has(key) or _unit_at(cell) != null or _skyranger_footprint_cells().has(cell):
			continue
		covers[key] = {"cell":cell,"type":"tree" if index % 3 else "rock","hard":false,"hp":18,"max_hp":18}

func _skyranger_footprint_cells() -> Array[Vector2i]:
	var cells: Array[Vector2i] = []
	for placement in skyranger_placements:
		for cell in placement.footprint:
			if not cells.has(cell):
				cells.append(cell)
	return cells

func skyranger_clear_of_buildings() -> bool:
	for cover_value in covers.values():
		var cover: Dictionary = cover_value
		if String(cover.get("building", "")).is_empty() or int(cover.get("hp", 0)) <= 0:
			continue
		for craft_cell in _skyranger_footprint_cells():
			if AegisHexRules.distance(craft_cell, cover.cell) <= 1:
				return false
	return true

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion:
		hovered_cell = _cell_at(event.position)
		queue_redraw()
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		var cell := _cell_at(event.position)
		if _inside(cell):
			_handle_cell_click(cell)
			accept_event()

func _handle_cell_click(cell: Vector2i) -> void:
	if resolved or phase != "human":
		return
	var clicked_unit = _unit_at(cell)
	if clicked_unit != null and clicked_unit.get("team", "") == "human" and int(clicked_unit.get("hp", 0)) > 0:
		_select_unit(clicked_unit.get("id", ""))
		return
	var selected: Variant = _selected_unit()
	if selected == null:
		return
	var targeting_mode := String(selected.get("targeting_mode", "move"))
	if targeting_mode == "grenade":
		_try_throw_grenade(selected, cell)
		return
	if targeting_mode == "fire":
		if clicked_unit != null and clicked_unit.get("team", "") == "alien" and int(clicked_unit.get("hp", 0)) > 0 and clicked_unit.get("revealed", false):
			_try_shoot_unit(selected, clicked_unit)
			return
		var targeted_cover: Dictionary = covers.get(AegisHexRules.key(cell), {})
		if not targeted_cover.is_empty() and targeted_cover.get("hard", false):
			_try_shoot_cover(selected, targeted_cover)
			return
		_emit_log("No valid weapon target in that hex. Cancel targeting to move.")
		return
	if clicked_unit != null and clicked_unit.get("team", "") == "civilian" and int(clicked_unit.get("hp", 0)) > 0 and not clicked_unit.get("rescued", false):
		_try_contact_civilian(selected, clicked_unit)
		return
	if clicked_unit != null and clicked_unit.get("team", "") == "alien" and int(clicked_unit.get("hp", 0)) > 0 and clicked_unit.get("revealed", false):
		begin_selected_targeting("fire")
		_emit_log("Weapon targeting active. Select %s again to fire." % clicked_unit.name)
		return
	var cover: Dictionary = covers.get(AegisHexRules.key(cell), {})
	if not cover.is_empty() and cover.get("hard", false):
		begin_selected_targeting("fire")
		_emit_log("Weapon targeting active. Select the structure again to breach it.")
		return
	if reachable.has(AegisHexRules.key(cell)):
		_move_selected_to(selected, cell)

func _select_unit(unit_id: String) -> void:
	selected_id = unit_id
	var selected: Variant = _selected_unit()
	if selected != null:
		selected["targeting_mode"] = "move"
	_rebuild_reachable()
	_emit_state()
	queue_redraw()

func _rebuild_reachable() -> void:
	reachable.clear()
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human":
		return
	if String(selected.get("targeting_mode", "move")) != "move":
		return
	var steps := maxi(0, int(selected.get("tu", 0)) - int(selected.get("reserve_tu", 0))) / MOVE_TU
	reachable = AegisHexRules.reachable(selected.cell, steps, _blocked_cells(), _occupied_cells(selected.id), grid_width, grid_height)

func select_relative_soldier(direction: int) -> void:
	if resolved or phase != "human":
		return
	var soldiers := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	if soldiers.is_empty():
		return
	var current_index := 0
	for index in range(soldiers.size()):
		if soldiers[index].get("id", "") == selected_id:
			current_index = index
			break
	var next_index := posmod(current_index + (1 if direction >= 0 else -1), soldiers.size())
	_select_unit(String(soldiers[next_index].get("id", "")))

func set_selected_reserve_mode(mode: String) -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved:
		return false
	var fire_tu := maxi(0, int(selected.get("fire_tu", FIRE_TU)))
	var reserve := 0
	match mode:
		"snap":
			reserve = fire_tu
		"aimed":
			reserve = fire_tu + 8
		"auto":
			reserve = fire_tu + 12
		"kneel":
			reserve = 4
		_:
			mode = "none"
	selected.reserve_mode = mode
	selected.reserve_tu = mini(int(selected.get("max_tu", reserve)), reserve)
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func toggle_selected_kneeling() -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved:
		return false
	if int(selected.get("tu", 0)) < 4:
		_emit_log("%s needs 4 TU to change stance." % selected.callsign)
		return false
	selected.tu = int(selected.tu) - 4
	selected.kneeling = not selected.get("kneeling", false)
	_emit_log("%s %s." % [selected.callsign, "kneels" if selected.kneeling else "stands"])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func bleed_selected_tu() -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved:
		return false
	selected.tu = 0
	_emit_log("%s is marked done for this turn." % selected.callsign)
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func selected_inventory() -> Dictionary:
	var selected: Variant = _selected_unit()
	if selected == null:
		return {}
	return {
		"name":selected.get("name", "Soldier"),
		"rank":selected.get("rank", "Rookie"),
		"weapon":selected.get("weapon", "Unarmed"),
		"right_hand":selected.get("right_hand_item", selected.get("weapon", "Unarmed")) if not String(selected.get("right_hand_item", selected.get("weapon", ""))).is_empty() else "Empty",
		"left_hand":"Primed Frag Grenade" if selected.get("grenade_primed", false) else "Frag Grenade" if int(selected.get("grenade_charges", 0)) > 0 else "Empty",
		"armor":selected.get("armor", "No Armor"),
		"medkit_charges":int(selected.get("medkit_charges", 0)),
		"grenade_charges":int(selected.get("grenade_charges", 0)),
		"grenade_primed":bool(selected.get("grenade_primed", false)),
		"active_hand":String(selected.get("active_hand", "right")),
		"targeting_mode":String(selected.get("targeting_mode", "move")),
		"tu":int(selected.get("tu", 0)),
		"accuracy":int(selected.get("accuracy", 0)),
		"reactions":int(selected.get("reactions", 0)),
		"level":int(selected.get("level", 0)),
		"floor_items":floor_items_on_selected_cell(),
		"adjacent_allies":inventory_adjacent_allies(),
		"kneeling":bool(selected.get("kneeling", false)),
		"reserve_mode":String(selected.get("reserve_mode", "none"))
	}

func _inventory_slot_item(unit: Dictionary, slot: String) -> Dictionary:
	match slot:
		"right":
			var item_name := String(unit.get("right_hand_item", unit.get("weapon", "")))
			if item_name.is_empty() or item_name == "Unarmed":
				return {}
			return {
				"slot":"right", "item_name":item_name,
				"weapon_damage":int(unit.get("weapon_damage", 0)), "weapon_variance":int(unit.get("weapon_variance", 0)),
				"weapon_range":int(unit.get("weapon_range", 0)), "fire_tu":int(unit.get("fire_tu", FIRE_TU)),
				"breach_damage":int(unit.get("breach_damage", 0))
			}
		"left":
			if int(unit.get("grenade_charges", 0)) <= 0:
				return {}
			return {
				"slot":"left", "item_name":"Frag Grenade", "charges":int(unit.get("grenade_charges", 0)),
				"primed":bool(unit.get("grenade_primed", false)), "grenade_damage":int(unit.get("grenade_damage", GRENADE_CENTER_DAMAGE)),
				"grenade_edge_damage":int(unit.get("grenade_edge_damage", GRENADE_EDGE_DAMAGE)), "grenade_range":int(unit.get("grenade_range", GRENADE_RANGE)),
				"grenade_prime_tu":int(unit.get("grenade_prime_tu", GRENADE_PRIME_TU)), "grenade_throw_tu":int(unit.get("grenade_throw_tu", GRENADE_THROW_TU)),
				"grenade_breach_damage":int(unit.get("grenade_breach_damage", GRENADE_CENTER_BREACH)), "grenade_edge_breach_damage":int(unit.get("grenade_edge_breach_damage", GRENADE_EDGE_BREACH))
			}
		"belt":
			if int(unit.get("medkit_charges", 0)) <= 0:
				return {}
			return {"slot":"belt", "item_name":"Medkit", "charges":int(unit.get("medkit_charges", 0)), "medkit_heal":int(unit.get("medkit_heal", MEDKIT_HEAL)), "medkit_tu":int(unit.get("medkit_tu", MEDKIT_TU))}
	return {}

func _apply_inventory_slot(unit: Dictionary, slot: String, item: Dictionary) -> void:
	match slot:
		"right":
			if item.is_empty():
				unit.right_hand_item = ""
				unit.weapon = "Unarmed"
				unit.weapon_damage = 0
				unit.weapon_variance = 0
				unit.weapon_range = 0
				unit.breach_damage = 0
				unit.targeting_mode = "move"
			else:
				unit.right_hand_item = item.get("item_name", "Weapon")
				unit.weapon = item.get("item_name", "Weapon")
				for key in ["weapon_damage", "weapon_variance", "weapon_range", "fire_tu", "breach_damage"]:
					unit[key] = item.get(key, unit.get(key, 0))
		"left":
			unit.grenade_charges = 0 if item.is_empty() else int(item.get("charges", 1))
			unit.grenade_primed = false if item.is_empty() else bool(item.get("primed", false))
			if not item.is_empty():
				for key in ["grenade_damage", "grenade_edge_damage", "grenade_range", "grenade_prime_tu", "grenade_throw_tu", "grenade_breach_damage", "grenade_edge_breach_damage"]:
					unit[key] = item.get(key, unit.get(key, 0))
			if item.is_empty() and String(unit.get("active_hand", "right")) == "left":
				unit.active_hand = "right"
				unit.targeting_mode = "move"
		"belt":
			unit.medkit_charges = 0 if item.is_empty() else int(item.get("charges", 1))
			if not item.is_empty():
				unit.medkit_heal = int(item.get("medkit_heal", MEDKIT_HEAL))
				unit.medkit_tu = int(item.get("medkit_tu", MEDKIT_TU))

func inventory_adjacent_allies() -> Array[Dictionary]:
	var selected: Variant = _selected_unit()
	var result: Array[Dictionary] = []
	if selected == null:
		return result
	for unit in units:
		if unit.get("team", "") == "human" and unit.get("id", "") != selected.get("id", "") and int(unit.get("hp", 0)) > 0 and int(unit.get("level", 0)) == int(selected.get("level", 0)) and AegisHexRules.distance(unit.cell, selected.cell) == 1:
			result.append({"id":unit.get("id", ""), "name":unit.get("name", "Soldier"), "tu":unit.get("tu", 0)})
	result.sort_custom(func(left, right): return String(left.get("name", "")) < String(right.get("name", "")))
	return result

func transfer_selected_inventory_item(target_id: String, slot: String) -> bool:
	var selected: Variant = _selected_unit()
	var target: Variant = units.filter(func(unit): return unit.get("id", "") == target_id and unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0).front() if units.any(func(unit): return unit.get("id", "") == target_id and unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0) else null
	if selected == null or target == null or phase != "human" or resolved or slot not in ["right", "left", "belt"]:
		return false
	var item := _inventory_slot_item(selected, slot)
	if item.is_empty() or not _inventory_slot_item(target, slot).is_empty() or item.get("primed", false) or int(selected.get("tu", 0)) < INVENTORY_ACTION_TU or int(selected.get("level", 0)) != int(target.get("level", 0)) or AegisHexRules.distance(selected.cell, target.cell) != 1:
		return false
	_apply_inventory_slot(selected, slot, {})
	_apply_inventory_slot(target, slot, item)
	selected.tu = maxi(0, int(selected.get("tu", 0)) - INVENTORY_ACTION_TU)
	action_serial += 1
	_emit_log("%s transferred %s to %s for %d TU." % [selected.callsign, item.item_name, target.callsign, INVENTORY_ACTION_TU])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func drop_selected_inventory_item(slot: String) -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved or slot not in ["right", "left", "belt"]:
		return false
	var item := _inventory_slot_item(selected, slot)
	if item.is_empty() or item.get("primed", false) or int(selected.get("tu", 0)) < INVENTORY_ACTION_TU:
		return false
	action_serial += 1
	item["id"] = "floor-%s-%d" % [selected.get("id", "soldier"), action_serial]
	item["cell"] = selected.cell
	item["level"] = int(selected.get("level", 0))
	floor_items.append(item)
	_apply_inventory_slot(selected, slot, {})
	selected.tu = maxi(0, int(selected.get("tu", 0)) - INVENTORY_ACTION_TU)
	_emit_log("%s dropped %s at elevation %d." % [selected.callsign, item.item_name, item.level])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func floor_items_on_selected_cell() -> Array[Dictionary]:
	var selected: Variant = _selected_unit()
	var result: Array[Dictionary] = []
	if selected == null:
		return result
	for item in floor_items:
		if item.get("cell", Vector2i(-1, -1)) == selected.cell and int(item.get("level", 0)) == int(selected.get("level", 0)):
			result.append(item.duplicate(true))
	return result

func pickup_selected_floor_item(item_id: String) -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved or int(selected.get("tu", 0)) < INVENTORY_ACTION_TU:
		return false
	var item_index := -1
	for index in range(floor_items.size()):
		var item: Dictionary = floor_items[index]
		if item.get("id", "") == item_id and item.get("cell", Vector2i(-1, -1)) == selected.cell and int(item.get("level", 0)) == int(selected.get("level", 0)):
			item_index = index
			break
	if item_index < 0:
		return false
	var item: Dictionary = floor_items[item_index]
	var slot := String(item.get("slot", ""))
	if slot not in ["right", "left", "belt"] or not _inventory_slot_item(selected, slot).is_empty():
		return false
	floor_items.remove_at(item_index)
	_apply_inventory_slot(selected, slot, item)
	selected.tu = maxi(0, int(selected.get("tu", 0)) - INVENTORY_ACTION_TU)
	action_serial += 1
	_emit_log("%s picked up %s for %d TU." % [selected.callsign, item.item_name, INVENTORY_ACTION_TU])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func set_selected_active_hand(hand: String) -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved:
		return false
	var normalized := "left" if hand == "left" else "right"
	if normalized == "right" and _inventory_slot_item(selected, "right").is_empty():
		_emit_log("%s has no weapon in the right hand." % selected.callsign)
		return false
	selected["active_hand"] = normalized
	selected["targeting_mode"] = "grenade" if normalized == "left" and selected.get("grenade_primed", false) else "fire" if normalized == "right" else "move"
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func begin_selected_targeting(mode: String) -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved:
		return false
	if mode == "grenade":
		if int(selected.get("grenade_charges", 0)) <= 0 or not selected.get("grenade_primed", false):
			return false
		selected["active_hand"] = "left"
		selected["targeting_mode"] = "grenade"
	else:
		if int(selected.get("weapon_range", 0)) <= 0 or int(selected.get("weapon_damage", 0)) <= 0:
			_emit_log("%s has no weapon in the right hand." % selected.callsign)
			return false
		selected["active_hand"] = "right"
		selected["targeting_mode"] = "fire"
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func cancel_selected_targeting() -> bool:
	var selected: Variant = _selected_unit()
	if selected == null:
		return false
	selected["targeting_mode"] = "move"
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func selected_grenade_blocker() -> String:
	var selected: Variant = _selected_unit()
	if selected == null:
		return "Select a living soldier."
	if resolved or phase != "human":
		return "Grenades can only be prepared during the human turn."
	if int(selected.get("grenade_charges", 0)) <= 0:
		return "No Frag Grenade remains."
	if selected.get("grenade_primed", false):
		return ""
	var prime_tu := maxi(0, int(selected.get("grenade_prime_tu", GRENADE_PRIME_TU)))
	if int(selected.get("tu", 0)) < prime_tu:
		return "%d TU required to prime the Frag Grenade." % prime_tu
	return ""

func prime_selected_grenade() -> bool:
	var selected: Variant = _selected_unit()
	var blocker := selected_grenade_blocker()
	if selected == null or not blocker.is_empty():
		_emit_log(blocker)
		return false
	if not selected.get("grenade_primed", false):
		var prime_tu := maxi(0, int(selected.get("grenade_prime_tu", GRENADE_PRIME_TU)))
		selected["tu"] = int(selected.get("tu", 0)) - prime_tu
		selected["grenade_primed"] = true
		_emit_log("%s primes a Frag Grenade for %d TU." % [selected.callsign, prime_tu])
	selected["active_hand"] = "left"
	selected["targeting_mode"] = "grenade"
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func grenade_blast_cells(target: Vector2i) -> Array[Vector2i]:
	var cells: Array[Vector2i] = [target]
	for neighbor in AegisHexRules.neighbors(target, grid_width, grid_height):
		cells.append(neighbor)
	return cells

func _try_throw_grenade(thrower: Dictionary, target: Vector2i) -> bool:
	if int(thrower.get("grenade_charges", 0)) <= 0 or not thrower.get("grenade_primed", false):
		_emit_log("%s must prime a Frag Grenade first." % thrower.callsign)
		return false
	var throw_range := maxi(0, int(thrower.get("grenade_range", GRENADE_RANGE)))
	var throw_tu := maxi(0, int(thrower.get("grenade_throw_tu", GRENADE_THROW_TU)))
	var distance := AegisHexRules.distance(thrower.cell, target)
	if distance > throw_range:
		_emit_log("That hex is outside the %d-hex grenade range." % throw_range)
		return false
	if int(thrower.get("tu", 0)) < throw_tu:
		_emit_log("%s needs %d TU to throw the primed grenade." % [thrower.callsign, throw_tu])
		return false
	thrower["tu"] = int(thrower.get("tu", 0)) - throw_tu
	thrower["grenade_charges"] = int(thrower.get("grenade_charges", 0)) - 1
	thrower["grenade_primed"] = false
	thrower["targeting_mode"] = "move"
	thrower["active_hand"] = "right"
	thrower["facing"] = target - thrower.cell
	action_serial += 1
	var blast_cells := grenade_blast_cells(target)
	var blast_keys := {}
	for blast_cell in blast_cells:
		blast_keys[AegisHexRules.key(blast_cell)] = blast_cell == target
	var alien_kills := 0
	for unit in units:
		if int(unit.get("hp", 0)) <= 0 or unit.get("rescued", false):
			continue
		var unit_key := AegisHexRules.key(unit.cell)
		if not blast_keys.has(unit_key):
			continue
		var center_hit: bool = blast_keys[unit_key]
		var damage := int(thrower.get("grenade_damage", GRENADE_CENTER_DAMAGE)) if center_hit else int(thrower.get("grenade_edge_damage", GRENADE_EDGE_DAMAGE))
		damage += AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), 2100 + action_serial * 37 + unit.cell.x * 11 + unit.cell.y * 17, 0, 4)
		damage = maxi(0, damage - int(unit.get("damage_reduction", 0)))
		var was_alive := int(unit.get("hp", 0)) > 0
		unit["hp"] = maxi(0, int(unit.get("hp", 0)) - damage)
		if unit.get("team", "") != "human":
			unit["revealed"] = true
			unit["visible"] = true
		if was_alive and int(unit.get("hp", 0)) <= 0 and unit.get("team", "") == "alien":
			alien_kills += 1
	for cover_key in blast_keys:
		var cover: Dictionary = covers.get(cover_key, {})
		if cover.is_empty() or int(cover.get("hp", 0)) <= 0:
			continue
		var center_blast: bool = blast_keys[cover_key]
		var breach_damage := int(thrower.get("grenade_breach_damage", GRENADE_CENTER_BREACH)) if center_blast else int(thrower.get("grenade_edge_breach_damage", GRENADE_EDGE_BREACH))
		cover["hp"] = maxi(0, int(cover.get("hp", 0)) - breach_damage)
		if int(cover.get("hp", 0)) <= 0:
			cover["type"] = "rubble"
			cover["hard"] = false
	thrower["kills"] = int(thrower.get("kills", 0)) + alien_kills
	_emit_log("%s throws a Frag Grenade: %d bounded blast hexes, %d alien%s eliminated." % [thrower.callsign, blast_cells.size(), alien_kills, "" if alien_kills == 1 else "s"])
	_refresh_visibility()
	_rebuild_reachable()
	_emit_state()
	_check_resolution()
	queue_redraw()
	return true

func tactical_map_contacts() -> Dictionary:
	return {
		"humans":units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0).map(func(unit): return unit.get("cell", Vector2i.ZERO)),
		"aliens":units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0 and unit.get("visible", false)).map(func(unit): return unit.get("cell", Vector2i.ZERO)),
		"civilians":units.filter(func(unit): return unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false) and unit.get("visible", false)).map(func(unit): return unit.get("cell", Vector2i.ZERO))
	}

func _move_selected_to(selected: Dictionary, target: Vector2i) -> void:
	var path := AegisHexRules.path(selected.cell, target, _blocked_cells(), _occupied_cells(selected.id), grid_width, grid_height, int(selected.tu) / MOVE_TU)
	if path.size() < 2:
		return
	var cost := (path.size() - 1) * MOVE_TU
	if cost > int(selected.tu):
		return
	var old_cell: Vector2i = selected.cell
	selected.cell = target
	selected.tu = int(selected.tu) - cost
	selected.facing = target - old_cell
	var trail: Array = selected.get("trail", [])
	for step in path:
		trail.push_front(step)
	if trail.size() > 20:
		trail.resize(20)
	selected.trail = trail
	_advance_followers(selected, path)
	_emit_log("%s moved %d hex%s." % [selected.callsign, path.size() - 1, "" if path.size() == 2 else "es"])
	_refresh_visibility()
	_rebuild_reachable()
	_emit_state()
	_check_resolution()
	queue_redraw()

func _advance_followers(soldier: Dictionary, path: Array[Vector2i]) -> void:
	var followers := units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
	followers.sort_custom(func(a, b): return AegisHexRules.distance(a.cell, soldier.cell) < AegisHexRules.distance(b.cell, soldier.cell))
	var trail: Array = soldier.get("trail", path)
	for index in range(mini(4, followers.size())):
		var civilian: Dictionary = followers[index]
		var target_index := mini(trail.size() - 1, index + 1)
		var follow_target: Vector2i = trail[target_index]
		if not _blocked_cells().has(AegisHexRules.key(follow_target)):
			civilian.cell = follow_target
		if extraction_cells.has(AegisHexRules.key(civilian.cell)):
			civilian.rescued = true
			civilian.escort_id = ""
			rescued += 1
			_emit_log("%s reached the Skyranger ramp." % civilian.name)

func _try_contact_civilian(soldier: Dictionary, civilian: Dictionary) -> void:
	if AegisHexRules.distance(soldier.cell, civilian.cell) > 1:
		_emit_log("Move adjacent to %s to begin an escort." % civilian.name)
		return
	if int(soldier.tu) < ESCORT_TU:
		_emit_log("%s needs %d TU to contact a civilian." % [soldier.callsign, ESCORT_TU])
		return
	var followers := units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
	if followers.size() >= 4:
		_emit_log("%s is already leading four civilians." % soldier.callsign)
		return
	soldier.tu = int(soldier.tu) - ESCORT_TU
	soldier.priority_civilian_id = civilian.get("id", "")
	civilian.priority_escort_id = soldier.get("id", "")
	civilian.approached_by_id = soldier.get("id", "")
	action_serial += 1
	if civilian.get("panic", false) and AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial + turn_number * 17) <= 45:
		_emit_log("%s could not calm %s. Try contact again." % [soldier.callsign, civilian.name])
	else:
		civilian.panic = false
		civilian.escort_id = soldier.id
		civilian.revealed = true
		_emit_log("%s is now escorting %s." % [soldier.callsign, civilian.name])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()

func _try_shoot_unit(shooter: Dictionary, target: Dictionary) -> void:
	var weapon_range := maxi(0, int(shooter.get("weapon_range", 7)))
	var base_damage := maxi(0, int(shooter.get("weapon_damage", 17)))
	var fire_tu := maxi(0, int(shooter.get("fire_tu", FIRE_TU)))
	if weapon_range <= 0 or base_damage <= 0:
		_emit_log("%s is unarmed and cannot fire." % shooter.callsign)
		return
	var shot_range := AegisHexRules.distance(shooter.cell, target.cell)
	if shot_range > weapon_range:
		_emit_log("Target is outside %s range." % shooter.get("weapon", "weapon"))
		return
	if not _has_line_of_sight_from(shooter.cell, target.cell):
		_emit_log("Hard cover blocks line of sight to %s." % target.name)
		return
	if int(shooter.tu) < fire_tu:
		_emit_log("%s needs %d TU to fire %s." % [shooter.callsign, fire_tu, shooter.get("weapon", "weapon")])
		return
	shooter.tu = int(shooter.tu) - fire_tu
	if shooter.get("team", "") == "human":
		voice_requested.emit("Taking the shot steady professional.wav")
	action_serial += 1
	var chance := clampi(int(shooter.accuracy) + (10 if shooter.get("kneeling", false) else 0) - shot_range * 4, 18, 92)
	var roll := AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial * 23 + turn_number * 31)
	if roll <= chance:
		var variance := maxi(0, int(shooter.get("weapon_variance", 8)))
		var damage := base_damage + AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial * 41, 0, variance)
		target.hp = maxi(0, int(target.hp) - damage)
		_emit_log("%s hit %s for %d damage." % [shooter.callsign, target.name, damage])
		if int(target.hp) <= 0:
			shooter.kills = int(shooter.get("kills", 0)) + 1
			_emit_log("%s eliminated %s." % [shooter.callsign, target.name])
			voice_requested.emit("Target down steady professional.wav")
	else:
		_emit_log("%s missed %s." % [shooter.callsign, target.name])
		if shooter.get("team", "") == "human":
			voice_requested.emit("Missed steady professional.wav")
	_refresh_visibility()
	_rebuild_reachable()
	_emit_state()
	_check_resolution()
	queue_redraw()

func _try_shoot_cover(shooter: Dictionary, cover: Dictionary) -> void:
	var weapon_range := maxi(0, int(shooter.get("weapon_range", 8)))
	var breach_damage := maxi(0, int(shooter.get("breach_damage", 26)))
	var fire_tu := maxi(0, int(shooter.get("fire_tu", FIRE_TU)))
	if weapon_range <= 0 or breach_damage <= 0:
		_emit_log("%s is unarmed and cannot breach that wall." % shooter.callsign)
		return
	var shot_range := AegisHexRules.distance(shooter.cell, cover.cell)
	if shot_range > weapon_range or int(shooter.tu) < fire_tu:
		_emit_log("That breach shot requires %s range and %d TU." % [shooter.get("weapon", "weapon"), fire_tu])
		return
	shooter.tu = int(shooter.tu) - fire_tu
	cover.hp = maxi(0, int(cover.hp) - breach_damage)
	if int(cover.hp) <= 0:
		cover.type = "rubble"
		cover.hard = false
		_emit_log("%s destroyed the wall. The breach is now traversable." % shooter.callsign)
	else:
		_emit_log("%s damaged the wall (%d/%d)." % [shooter.callsign, cover.hp, cover.max_hp])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()

func selected_medkit_blocker() -> String:
	var selected: Variant = _selected_unit()
	if selected == null:
		return "Select a living soldier."
	if resolved or phase != "human":
		return "Medkits can only be used during the human turn."
	if int(selected.get("medkit_charges", 0)) <= 0:
		return "No Medkit is issued."
	if int(selected.get("hp", 0)) >= int(selected.get("max_hp", 0)):
		return "The selected soldier is already at full HP."
	var medkit_tu := maxi(0, int(selected.get("medkit_tu", MEDKIT_TU)))
	if int(selected.get("tu", 0)) < medkit_tu:
		return "%d TU required to use the Medkit." % medkit_tu
	return ""

func use_selected_medkit() -> bool:
	var selected: Variant = _selected_unit()
	var blocker := selected_medkit_blocker()
	if selected == null or not blocker.is_empty():
		_emit_log(blocker)
		return false
	var medkit_tu := maxi(0, int(selected.get("medkit_tu", MEDKIT_TU)))
	var heal_amount := maxi(1, int(selected.get("medkit_heal", MEDKIT_HEAL)))
	var hp_before := int(selected.get("hp", 0))
	selected["tu"] = int(selected.get("tu", 0)) - medkit_tu
	selected["hp"] = mini(int(selected.get("max_hp", hp_before)), hp_before + heal_amount)
	selected["medkit_charges"] = 0
	action_serial += 1
	_emit_log("%s used a Medkit and recovered %d HP." % [selected.get("callsign", selected.get("name", "Soldier")), int(selected.get("hp", 0)) - hp_before])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()
	return true

func _rank_index(rank_name: String) -> int:
	var index := RANK_ORDER.find(rank_name)
	return maxi(0, index)

func ai_doctrine_for_commander(soldier: Dictionary) -> Dictionary:
	var rank_index := _rank_index(String(soldier.get("rank", "Rookie")))
	var missions := maxi(0, int(soldier.get("missions", 0)))
	var learned: Dictionary = COMMAND_DOCTRINES[0]
	for doctrine_value in COMMAND_DOCTRINES:
		var doctrine: Dictionary = doctrine_value
		if rank_index >= _rank_index(String(doctrine.get("rank", "Rookie"))) and missions >= int(doctrine.get("missions", 0)):
			learned = doctrine
	return learned.duplicate(true)

func _commander_score(soldier: Dictionary) -> int:
	return _rank_index(String(soldier.get("rank", "Rookie"))) * 1000 + int(soldier.get("missions", 0)) * 20 + int(soldier.get("bravery", 55)) + int(soldier.get("reactions", 55))

func _select_ai_commander() -> Dictionary:
	var living := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	living.sort_custom(func(left, right):
		var score_difference := _commander_score(left) - _commander_score(right)
		return score_difference > 0 or score_difference == 0 and String(left.get("id", "")) < String(right.get("id", ""))
	)
	var commander: Dictionary = living[0] if not living.is_empty() else {}
	commander_id = String(commander.get("id", ""))
	commander_doctrine = ai_doctrine_for_commander(commander) if not commander.is_empty() else {}
	return commander

func _assign_ai_roles(commander: Dictionary) -> void:
	var soldiers := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	soldiers.sort_custom(func(left, right): return String(left.get("id", "")) < String(right.get("id", "")))
	var doctrine_key := String(commander_doctrine.get("key", "wedge"))
	var flank_index := 0
	for soldier in soldiers:
		if soldier.get("id", "") == commander.get("id", ""):
			soldier["ai_role"] = "commander"
			continue
		var role := "wedge_left" if flank_index % 2 == 0 else "wedge_right"
		if doctrine_key == "line":
			role = "line_left" if flank_index % 2 == 0 else "line_right"
		elif doctrine_key == "echelon":
			role = "flank_left" if turn_number % 2 == 0 else "flank_right"
		elif doctrine_key == "support_maneuver":
			role = "base_fire" if flank_index % 3 == 0 else "flank_left" if flank_index % 2 == 0 else "flank_right"
		elif doctrine_key == "diamond":
			role = ["screen_front", "screen_left", "screen_right", "screen_rear"][flank_index % 4]
		soldier["ai_role"] = role
		flank_index += 1

func ai_command_summary() -> String:
	var commander := _select_ai_commander()
	if commander.is_empty():
		return "No living commander"
	_assign_ai_roles(commander)
	return "%s leads with %s doctrine" % [commander.get("callsign", commander.get("name", "Commander")), commander_doctrine.get("label", "Protected Wedge")]

func _has_line_of_sight_from(origin: Vector2i, target: Vector2i) -> bool:
	var cells := AegisHexRules.line(origin, target)
	if cells.size() <= 2:
		return true
	for index in range(1, cells.size() - 1):
		var cover: Dictionary = covers.get(AegisHexRules.key(cells[index]), {})
		if cover.get("hard", false) and int(cover.get("hp", 0)) > 0:
			return false
	return true

func _cover_score(cell: Vector2i) -> int:
	var score := 0
	for neighbor in AegisHexRules.neighbors(cell, grid_width, grid_height):
		var cover: Dictionary = covers.get(AegisHexRules.key(neighbor), {})
		if int(cover.get("hp", 0)) <= 0:
			continue
		score = maxi(score, 24 if cover.get("hard", false) else 8)
	return score

func _cell_from_key(cell_key: String) -> Vector2i:
	var parts := cell_key.split(",")
	return Vector2i(int(parts[0]), int(parts[1]))

func _visible_alien_contacts() -> Array:
	return units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0 and unit.get("visible", false))

func _known_alien_contact_cells() -> Array[Vector2i]:
	var cells: Array[Vector2i] = []
	for alien in units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0 and unit.get("revealed", false)):
		var remembered: Vector2i = alien.get("last_known_cell", Vector2i(-1, -1))
		if _inside(remembered) and not cells.has(remembered):
			cells.append(remembered)
	return cells

func _record_tactical_distress(victim: Dictionary, attacker: Dictionary, hit: bool) -> void:
	if victim.get("team", "") != "human":
		return
	victim.distress_turn = turn_number
	victim.distress_cell = victim.get("cell", Vector2i(-1, -1))
	victim.distress_attacker_id = attacker.get("id", "")
	victim.distress_attacker_cell = attacker.get("cell", Vector2i(-1, -1))
	victim.distress_hit = hit

func _ai_distress_target(soldier: Dictionary) -> Dictionary:
	var contacts := units.filter(func(unit):
		var age := turn_number - int(unit.get("distress_turn", -99))
		return unit.get("team", "") == "human" and age >= 0 and age <= AI_DISTRESS_TURNS
	)
	contacts.sort_custom(func(left, right):
		var left_turn := int(left.get("distress_turn", -99))
		var right_turn := int(right.get("distress_turn", -99))
		if left_turn != right_turn:
			return left_turn > right_turn
		var left_distance := AegisHexRules.distance(soldier.cell, left.get("cell", Vector2i(-1, -1)))
		var right_distance := AegisHexRules.distance(soldier.cell, right.get("cell", Vector2i(-1, -1)))
		return left_distance < right_distance or left_distance == right_distance and String(left.get("id", "")) < String(right.get("id", ""))
	)
	if contacts.is_empty():
		return {}
	var contact: Dictionary = contacts[0]
	var casualty_cell: Vector2i = contact.get("cell", Vector2i(-1, -1)) if int(contact.get("hp", 0)) > 0 else contact.get("distress_cell", Vector2i(-1, -1))
	if not _inside(casualty_cell):
		return {}
	if AegisHexRules.distance(soldier.cell, casualty_cell) > 4:
		return {"cell":casualty_cell,"stage":"converge","victim_id":contact.get("id", "")}
	var attacker_id := String(contact.get("distress_attacker_id", ""))
	var attacker_alive := units.any(func(unit): return unit.get("id", "") == attacker_id and unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0)
	var attacker_cell: Vector2i = contact.get("distress_attacker_cell", Vector2i(-1, -1))
	if not attacker_alive or not _inside(attacker_cell):
		return {}
	return {"cell":attacker_cell,"stage":"search","victim_id":contact.get("id", ""),"attacker_id":attacker_id}

func _alien_threat_exposure(cell: Vector2i, threats: Array) -> int:
	var exposure := 0
	for threat_value in threats:
		var threat: Dictionary = threat_value
		if int(threat.get("hp", 0)) <= 0:
			continue
		if AegisHexRules.distance(cell, threat.cell) <= int(threat.get("weapon_range", 5)) and _has_line_of_sight_from(threat.cell, cell):
			exposure += 1
	return exposure

func _ai_threat_reachable(unit: Dictionary, available_steps: int, threats: Array) -> Array:
	var blocked := _blocked_cells()
	var occupied := _occupied_cells(String(unit.get("id", "")))
	var start_cell: Vector2i = unit.get("cell", Vector2i.ZERO)
	var start := {"cell":start_cell,"steps":0,"path":[start_cell],"threat_steps":0,"reentries":0,"exposure":_alien_threat_exposure(start_cell, threats)}
	var queue: Array = [start]
	var best_by_key := {AegisHexRules.key(start_cell):start}
	var head := 0
	while head < queue.size() and head < AI_MAX_CANDIDATES * 4:
		var current: Dictionary = queue[head]
		head += 1
		if int(current.get("steps", 0)) >= available_steps:
			continue
		for next_cell in AegisHexRules.neighbors(current.cell, grid_width, grid_height):
			var next_key := AegisHexRules.key(next_cell)
			if blocked.has(next_key) or occupied.has(next_key):
				continue
			var next_exposure := _alien_threat_exposure(next_cell, threats)
			var candidate := {
				"cell":next_cell,
				"steps":int(current.steps) + 1,
				"path":current.path + [next_cell],
				"threat_steps":int(current.threat_steps) + (1 if next_exposure > 0 else 0),
				"reentries":int(current.reentries) + (1 if int(current.exposure) == 0 and next_exposure > 0 else 0),
				"exposure":next_exposure
			}
			var previous: Dictionary = best_by_key.get(next_key, {})
			var improves := previous.is_empty() or int(candidate.reentries) < int(previous.reentries) or int(candidate.reentries) == int(previous.reentries) and (int(candidate.threat_steps) < int(previous.threat_steps) or int(candidate.threat_steps) == int(previous.threat_steps) and int(candidate.steps) < int(previous.steps))
			if not improves or previous.is_empty() and best_by_key.size() >= AI_MAX_CANDIDATES:
				continue
			best_by_key[next_key] = candidate
			queue.append(candidate)
	return best_by_key.values()

func _ai_patrol_plan(unit: Dictionary, reserve_tu: int) -> Dictionary:
	var available_steps := clampi((int(unit.get("tu", 0)) - maxi(0, reserve_tu)) / MOVE_TU, 0, AI_MAX_MOVE_STEPS)
	var reachable_cells := AegisHexRules.reachable(unit.cell, available_steps, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), grid_width, grid_height)
	var history: Array = unit.get("ai_move_history", [])
	var best_cell: Vector2i = unit.cell
	var best_score := -100000
	for cell_key in reachable_cells:
		var cell := _cell_from_key(String(cell_key))
		var steps := int(reachable_cells[cell_key])
		if steps <= 0:
			continue
		var score := steps * 8 + _cover_score(cell) - (200 if history.has(String(cell_key)) else 0)
		if score > best_score or score == best_score and String(cell_key) < AegisHexRules.key(best_cell):
			best_cell = cell
			best_score = score
	var path := AegisHexRules.path(unit.cell, best_cell, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), grid_width, grid_height, available_steps)
	return {"cell":best_cell,"path":path,"steps":maxi(0, path.size() - 1),"reserve":reserve_tu}

func _ai_movement_plan(unit: Dictionary, target_cell: Vector2i, reserve_tu: int, role: String, alien_move: bool = false, target_known: bool = true) -> Dictionary:
	var available_steps := clampi((int(unit.get("tu", 0)) - maxi(0, reserve_tu)) / MOVE_TU, 0, AI_MAX_MOVE_STEPS)
	if available_steps <= 0:
		return {"cell":unit.get("cell", Vector2i.ZERO),"path":[unit.get("cell", Vector2i.ZERO)],"steps":0,"reserve":reserve_tu}
	var target_bounds := _building_bounds_for_cell(target_cell)
	if not target_bounds.is_empty() and not _cell_inside_building_bounds(unit.cell, target_bounds):
		var target_unit: Variant = _unit_at(target_cell)
		var allow_id := String(target_unit.get("id", "")) if target_unit != null else ""
		var full_ingress: Array[Vector2i] = AegisHexRules.path(unit.cell, target_cell, _blocked_cells(), _occupied_cells(String(unit.get("id", "")), allow_id), grid_width, grid_height, grid_width + grid_height)
		if not full_ingress.is_empty():
			if target_unit != null and full_ingress.size() > 1:
				full_ingress.pop_back()
			var ingress_path: Array[Vector2i] = []
			for path_value in full_ingress.slice(0, available_steps + 1):
				ingress_path.append(path_value)
			if ingress_path.size() > 1:
				return {"cell":ingress_path[-1],"path":ingress_path,"steps":ingress_path.size() - 1,"reserve":reserve_tu,"door_route":true,"building_id":target_bounds.get("id", "")}
	var reachable_cells := AegisHexRules.reachable(unit.cell, available_steps, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), grid_width, grid_height)
	var candidates: Array = [{"cell":unit.cell,"steps":0}]
	for cell_key in reachable_cells:
		if candidates.size() >= AI_MAX_CANDIDATES:
			break
		candidates.append({"cell":_cell_from_key(String(cell_key)),"steps":int(reachable_cells[cell_key])})
	var commander: Variant = units.filter(func(candidate): return candidate.get("id", "") == commander_id and int(candidate.get("hp", 0)) > 0).front() if not commander_id.is_empty() and units.any(func(candidate): return candidate.get("id", "") == commander_id and int(candidate.get("hp", 0)) > 0) else null
	var origin_distance := AegisHexRules.distance(unit.cell, target_cell)
	var target_range := int(unit.get("weapon_range", 5)) if not alien_move else 5
	var best: Dictionary = candidates[0]
	var best_score := -100000.0
	var movement_history: Array = unit.get("ai_move_history", [])
	for candidate_value in candidates:
		var candidate: Dictionary = candidate_value
		var cell: Vector2i = candidate.cell
		var distance_to_target := AegisHexRules.distance(cell, target_cell)
		var score := float(_cover_score(cell))
		score += float(origin_distance - distance_to_target) * (6.0 if target_known else 4.0)
		score += float(candidate.steps) * (3.0 if not target_known else 0.8)
		if int(candidate.steps) > 0 and movement_history.has(AegisHexRules.key(cell)):
			score -= 120.0
		if target_known and _has_line_of_sight_from(cell, target_cell):
			score += 28.0
			if distance_to_target <= target_range:
				score += 34.0
			if distance_to_target <= 1:
				score -= 20.0
		if alien_move:
			var lateral := _hex_center(cell).y - _hex_center(target_cell).y
			score += absf(lateral) * 0.04
		elif role == "commander":
			var nearby_protectors := units.filter(func(ally): return ally.get("team", "") == "human" and ally.get("id", "") != unit.get("id", "") and int(ally.get("hp", 0)) > 0 and AegisHexRules.distance(ally.cell, cell) <= 3).size()
			score += float(nearby_protectors) * 10.0
			score -= float(maxi(0, distance_to_target - target_range)) * 0.5
		elif commander != null:
			var command_distance := AegisHexRules.distance(cell, commander.cell)
			score -= float(abs(command_distance - 3)) * 8.0
			if command_distance > 6:
				score -= float(command_distance - 6) * 18.0
			var commander_to_target := _hex_center(target_cell) - _hex_center(commander.cell)
			var commander_to_cell := _hex_center(cell) - _hex_center(commander.cell)
			var cross := commander_to_target.x * commander_to_cell.y - commander_to_target.y * commander_to_cell.x
			if role.contains("left"):
				score += cross * 0.035
			elif role.contains("right"):
				score -= cross * 0.035
			elif role == "base_fire" and target_known and _has_line_of_sight_from(cell, target_cell):
				score += 18.0 - float(candidate.steps) * 3.0
		if score > best_score or is_equal_approx(score, best_score) and AegisHexRules.key(cell) < AegisHexRules.key(best.cell):
			best = candidate
			best_score = score
	var path := AegisHexRules.path(unit.cell, best.cell, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), grid_width, grid_height, available_steps)
	return {"cell":best.cell,"path":path,"steps":maxi(0, path.size() - 1),"reserve":reserve_tu,"score":best_score}

func _ai_rescue_plan(unit: Dictionary, target_cells: Array, reserve_tu: int, stop_adjacent: bool, threats: Array = []) -> Dictionary:
	var available_steps := clampi((int(unit.get("tu", 0)) - maxi(0, reserve_tu)) / MOVE_TU, 0, AI_MAX_MOVE_STEPS)
	if target_cells.is_empty() or available_steps <= 0:
		return {"cell":unit.get("cell", Vector2i.ZERO),"path":[unit.get("cell", Vector2i.ZERO)],"steps":0,"reached":false}
	if threats.is_empty():
		var direct_routes: Array[Dictionary] = []
		for target_value in target_cells:
			var target: Vector2i = target_value
			var target_unit: Variant = _unit_at(target)
			var target_bounds := _building_bounds_for_cell(target)
			var needs_door_route := not target_bounds.is_empty() and not _cell_inside_building_bounds(unit.cell, target_bounds)
			if not stop_adjacent and not needs_door_route:
				continue
			var allow_id := String(target_unit.get("id", "")) if target_unit != null else ""
			var full_route: Array[Vector2i] = AegisHexRules.path(unit.cell, target, _blocked_cells(), _occupied_cells(String(unit.get("id", "")), allow_id), grid_width, grid_height, grid_width + grid_height)
			if full_route.is_empty():
				continue
			if (target_unit != null or stop_adjacent) and full_route.size() > 1:
				full_route.pop_back()
			direct_routes.append({"target":target,"path":full_route,"door_route":needs_door_route})
		direct_routes.sort_custom(func(left, right): return left.path.size() < right.path.size() or left.path.size() == right.path.size() and AegisHexRules.key(left.target) < AegisHexRules.key(right.target))
		if not direct_routes.is_empty():
			var direct: Dictionary = direct_routes[0]
			var direct_path: Array[Vector2i] = []
			for path_value in (direct.path as Array).slice(0, available_steps + 1):
				direct_path.append(path_value)
			if direct_path.is_empty():
				direct_path = [unit.cell]
			var direct_cell: Vector2i = direct_path[-1]
			return {"cell":direct_cell,"path":direct_path,"steps":maxi(0, direct_path.size() - 1),"reserve":reserve_tu,"reached":AegisHexRules.distance(direct_cell, direct.target) <= (1 if stop_adjacent else 0),"threat_steps":0,"reentries":0,"exposure":0,"door_route":direct.door_route}
	var candidates: Array = _ai_threat_reachable(unit, available_steps, threats) if not threats.is_empty() else [{"cell":unit.cell,"steps":0,"path":[unit.cell],"threat_steps":0,"reentries":0,"exposure":0}]
	if threats.is_empty():
		var reachable_cells := AegisHexRules.reachable(unit.cell, available_steps, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), grid_width, grid_height)
		for cell_key in reachable_cells:
			if candidates.size() >= AI_MAX_CANDIDATES:
				break
			candidates.append({"cell":_cell_from_key(String(cell_key)),"steps":int(reachable_cells[cell_key]),"threat_steps":0,"reentries":0,"exposure":0})
	var distance_to_target := func(cell: Vector2i) -> int:
		var nearest := 9999
		for target_value in target_cells:
			var target: Vector2i = target_value
			nearest = mini(nearest, AegisHexRules.distance(cell, target))
		return nearest
	var origin_distance: int = distance_to_target.call(unit.cell)
	var movement_history: Array = unit.get("ai_move_history", [])
	var best: Dictionary = candidates[0]
	var best_score := -100000.0
	var reached := false
	var start_exposure := _alien_threat_exposure(unit.cell, threats)
	var escaped_exists := start_exposure > 0 and candidates.any(func(candidate): return int(candidate.get("steps", 0)) > 0 and int(candidate.get("exposure", 0)) == 0)
	var safe_exists := start_exposure == 0 and candidates.any(func(candidate): return int(candidate.get("steps", 0)) > 0 and int(candidate.get("threat_steps", 0)) == 0 and int(candidate.get("reentries", 0)) == 0)
	for candidate_value in candidates:
		var candidate: Dictionary = candidate_value
		if int(candidate.get("steps", 0)) == 0 and candidates.size() > 1:
			continue
		if escaped_exists and int(candidate.get("exposure", 0)) > 0:
			continue
		if safe_exists and (int(candidate.get("threat_steps", 0)) > 0 or int(candidate.get("reentries", 0)) > 0):
			continue
		var cell: Vector2i = candidate.cell
		var distance: int = distance_to_target.call(cell)
		var goal: bool = distance <= 1 if stop_adjacent else distance == 0
		var score := (6000.0 if goal else 0.0) + float(origin_distance - distance) * 100.0 + float(candidate.steps) * 2.0
		score -= float(candidate.get("reentries", 0)) * 50000.0 + float(candidate.get("threat_steps", 0)) * 10000.0 + float(candidate.get("exposure", 0)) * 2000.0
		if not goal and movement_history.has(AegisHexRules.key(cell)):
			score -= 500.0
		if int(candidate.steps) == 0 and not goal:
			score -= 5.0
		if score > best_score or is_equal_approx(score, best_score) and AegisHexRules.key(cell) < AegisHexRules.key(best.cell):
			best = candidate
			best_score = score
			reached = goal
	var path: Array = best.get("path", AegisHexRules.path(unit.cell, best.cell, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), grid_width, grid_height, available_steps))
	return {"cell":best.cell,"path":path,"steps":maxi(0, path.size() - 1),"reserve":reserve_tu,"score":best_score,"reached":reached,"threat_steps":best.get("threat_steps", 0),"reentries":best.get("reentries", 0),"exposure":best.get("exposure", 0)}

func _building_bounds_for_cell(cell: Vector2i) -> Dictionary:
	var grouped := {}
	for cover_value in covers.values():
		var cover: Dictionary = cover_value
		var building_id := String(cover.get("building", ""))
		if building_id.is_empty():
			continue
		var cover_cell: Vector2i = cover.get("cell", Vector2i(-1, -1))
		if not grouped.has(building_id):
			grouped[building_id] = {"id":building_id,"min_x":cover_cell.x,"max_x":cover_cell.x,"min_y":cover_cell.y,"max_y":cover_cell.y}
		else:
			var bounds: Dictionary = grouped[building_id]
			bounds.min_x = mini(int(bounds.min_x), cover_cell.x)
			bounds.max_x = maxi(int(bounds.max_x), cover_cell.x)
			bounds.min_y = mini(int(bounds.min_y), cover_cell.y)
			bounds.max_y = maxi(int(bounds.max_y), cover_cell.y)
	for bounds_value in grouped.values():
		var bounds: Dictionary = bounds_value
		if cell.x >= int(bounds.min_x) and cell.x <= int(bounds.max_x) and cell.y >= int(bounds.min_y) and cell.y <= int(bounds.max_y):
			return bounds
	return {}

func _cell_inside_building_bounds(cell: Vector2i, bounds: Dictionary) -> bool:
	return not bounds.is_empty() and cell.x >= int(bounds.min_x) and cell.x <= int(bounds.max_x) and cell.y >= int(bounds.min_y) and cell.y <= int(bounds.max_y)

func _building_exit_candidates(bounds: Dictionary, unit: Dictionary) -> Array:
	var candidates: Array = []
	var seen_outside := {}
	var occupied := _occupied_cells(String(unit.get("id", "")))
	for follower in units.filter(func(other): return other.get("team", "") == "civilian" and other.get("escort_id", "") == unit.get("id", "")):
		occupied.erase(AegisHexRules.key(follower.cell))
	for y in range(int(bounds.min_y), int(bounds.max_y) + 1):
		for x in range(int(bounds.min_x), int(bounds.max_x) + 1):
			if x != int(bounds.min_x) and x != int(bounds.max_x) and y != int(bounds.min_y) and y != int(bounds.max_y):
				continue
			var opening := Vector2i(x, y)
			var cover: Dictionary = covers.get(AegisHexRules.key(opening), {})
			var is_door: bool = cover.is_empty()
			var is_breach: bool = not cover.is_empty() and (not bool(cover.get("hard", false)) or int(cover.get("hp", 0)) <= 0)
			if not is_door and not is_breach:
				continue
			for outside in AegisHexRules.neighbors(opening, grid_width, grid_height):
				var outside_key := AegisHexRules.key(outside)
				if _cell_inside_building_bounds(outside, bounds) or _blocked_cells().has(outside_key) or occupied.has(outside_key) or seen_outside.has(outside_key):
					continue
				seen_outside[outside_key] = true
				candidates.append({"opening":opening,"outside":outside,"exit_kind":"door" if is_door else "breach"})
	return candidates

func _ai_route_threat_stats(path: Array, threats: Array) -> Dictionary:
	if path.is_empty():
		return {"threat_steps":0,"reentries":0,"exposure":0}
	var previous_exposure := _alien_threat_exposure(path[0], threats)
	var threat_steps := 0
	var reentries := 0
	for index in range(1, path.size()):
		var exposure := _alien_threat_exposure(path[index], threats)
		if exposure > 0:
			threat_steps += 1
		if previous_exposure == 0 and exposure > 0:
			reentries += 1
		previous_exposure = exposure
	return {"threat_steps":threat_steps,"reentries":reentries,"exposure":previous_exposure}

func _ai_building_egress_plan(unit: Dictionary, reserve_tu: int, threats: Array = []) -> Dictionary:
	var available_steps := clampi((int(unit.get("tu", 0)) - maxi(0, reserve_tu)) / MOVE_TU, 0, AI_MAX_MOVE_STEPS)
	var bounds := _building_bounds_for_cell(unit.cell)
	if bounds.is_empty() or available_steps <= 0:
		return {"cell":unit.cell,"path":[unit.cell],"steps":0,"reserve":reserve_tu,"reached":bounds.is_empty(),"cleared_building":bounds.is_empty(),"building_id":bounds.get("id", "")}
	var occupied := _occupied_cells(String(unit.get("id", "")))
	for follower in units.filter(func(other): return other.get("team", "") == "civilian" and other.get("escort_id", "") == unit.get("id", "")):
		occupied.erase(AegisHexRules.key(follower.cell))
	var ramp_cells: Array[Vector2i] = []
	for ramp_key in extraction_cells:
		ramp_cells.append(_cell_from_key(String(ramp_key)))
	var candidates: Array = []
	for exit_value in _building_exit_candidates(bounds, unit).slice(0, 24):
		var exit: Dictionary = exit_value
		var route: Array[Vector2i] = AegisHexRules.path(unit.cell, exit.outside, _blocked_cells(), occupied, grid_width, grid_height, 32)
		if route.is_empty():
			continue
		var stats := _ai_route_threat_stats(route, threats)
		var ramp_distance := 0
		if not ramp_cells.is_empty():
			ramp_distance = 9999
			for ramp_cell in ramp_cells:
				ramp_distance = mini(ramp_distance, AegisHexRules.distance(route[-1], ramp_cell))
		candidates.append({"path":route,"opening":exit.opening,"outside":exit.outside,"exit_kind":exit.exit_kind,"ramp_distance":ramp_distance,"threat_steps":stats.threat_steps,"reentries":stats.reentries,"exposure":stats.exposure})
	candidates.sort_custom(func(left, right):
		if int(left.reentries) != int(right.reentries): return int(left.reentries) < int(right.reentries)
		if int(left.threat_steps) != int(right.threat_steps): return int(left.threat_steps) < int(right.threat_steps)
		if int(left.exposure) != int(right.exposure): return int(left.exposure) < int(right.exposure)
		if left.path.size() != right.path.size(): return left.path.size() < right.path.size()
		if int(left.ramp_distance) != int(right.ramp_distance): return int(left.ramp_distance) < int(right.ramp_distance)
		return AegisHexRules.key(left.outside) < AegisHexRules.key(right.outside)
	)
	if candidates.is_empty():
		return {"cell":unit.cell,"path":[unit.cell],"steps":0,"reserve":reserve_tu,"reached":false,"cleared_building":false,"building_id":bounds.id}
	var best: Dictionary = candidates[0]
	var path: Array = best.path.slice(0, available_steps + 1)
	var cell: Vector2i = path[-1]
	var cleared := not _cell_inside_building_bounds(cell, bounds)
	var path_stats := _ai_route_threat_stats(path, threats)
	return {"cell":cell,"path":path,"steps":path.size() - 1,"reserve":reserve_tu,"reached":cleared,"cleared_building":cleared,"building_id":bounds.id,"exit_kind":best.exit_kind,"opening":best.opening,"threat_steps":path_stats.threat_steps,"reentries":path_stats.reentries,"exposure":path_stats.exposure}

func _ai_extraction_corridors(unit: Dictionary) -> Array:
	var corridors: Array = []
	for placement_value in skyranger_placements:
		var placement: Dictionary = placement_value
		var ramp_cells: Array = placement.get("ramp_cells", [])
		if ramp_cells.is_empty():
			continue
		var left_side: bool = String(placement.get("side", "left")) == "left"
		var entry_x := int(ramp_cells.map(func(cell): return cell.x).max() if left_side else ramp_cells.map(func(cell): return cell.x).min())
		var rows: Array = ramp_cells.map(func(cell): return cell.y)
		rows = rows.reduce(func(result: Array, row):
			if not result.has(row): result.append(row)
			return result
		, [])
		rows.sort()
		if rows.size() > 1 and AegisHexRules.distance(unit.cell, Vector2i(entry_x, rows[-1])) < AegisHexRules.distance(unit.cell, Vector2i(entry_x, rows[0])):
			rows.reverse()
		var corridor: Array[Vector2i] = []
		for row_index in range(rows.size()):
			var row_cells: Array = ramp_cells.filter(func(cell): return cell.y == rows[row_index])
			row_cells.sort_custom(func(left, right): return left.x > right.x if left_side == (row_index % 2 == 0) else left.x < right.x)
			for ramp_cell in row_cells:
				corridor.append(ramp_cell)
		corridors.append({"placement":placement,"path":corridor,"entry":corridor[0],"distance":AegisHexRules.distance(unit.cell, corridor[0])})
	corridors.sort_custom(func(left, right): return int(left.distance) < int(right.distance) or int(left.distance) == int(right.distance) and AegisHexRules.key(left.entry) < AegisHexRules.key(right.entry))
	return corridors

func _ai_direct_extraction_plan(unit: Dictionary, reserve_tu: int, threats: Array = []) -> Dictionary:
	var corridors := _ai_extraction_corridors(unit)
	if corridors.is_empty():
		return {"cell":unit.get("cell", Vector2i.ZERO),"path":[unit.get("cell", Vector2i.ZERO)],"steps":0,"reserve":reserve_tu,"reached":false}
	var corridor: Array = corridors[0].path
	var corridor_index := corridor.find(unit.cell)
	var plan: Dictionary = {"cell":unit.cell,"path":[unit.cell],"steps":0,"reserve":reserve_tu,"reached":true} if corridor_index >= 0 else _ai_rescue_plan(unit, [corridor[0]], reserve_tu, false, threats)
	var path: Array = plan.get("path", []).duplicate()
	if not plan.get("reached", false):
		return plan
	var available_steps := clampi((int(unit.get("tu", 0)) - maxi(0, reserve_tu)) / MOVE_TU, 0, AI_MAX_MOVE_STEPS)
	var occupied := _occupied_cells(String(unit.get("id", "")))
	for follower in units.filter(func(other): return other.get("team", "") == "civilian" and other.get("escort_id", "") == unit.get("id", "")):
		occupied.erase(AegisHexRules.key(follower.cell))
	var remaining: Array = corridor.slice(corridor_index + 1 if corridor_index >= 0 else 1)
	for waypoint_value in remaining:
		if path.size() - 1 >= available_steps:
			plan.reached = false
			break
		var waypoint: Vector2i = waypoint_value
		var waypoint_key := AegisHexRules.key(waypoint)
		if _blocked_cells().has(waypoint_key) or occupied.has(waypoint_key) or AegisHexRules.distance(path[-1], waypoint) > 1:
			plan.reached = false
			break
		if not path.has(waypoint):
			path.append(waypoint)
	plan.reached = plan.get("reached", false) and path[-1] == corridor[-1]
	plan.path = path
	plan.cell = path[-1]
	plan.steps = maxi(0, path.size() - 1)
	plan.merge(_ai_route_threat_stats(path, threats), true)
	return plan

func _ai_extraction_plan(unit: Dictionary, reserve_tu: int, threats: Array = []) -> Dictionary:
	var available_steps := clampi((int(unit.get("tu", 0)) - maxi(0, reserve_tu)) / MOVE_TU, 0, AI_MAX_MOVE_STEPS)
	var egress := _ai_building_egress_plan(unit, reserve_tu, threats)
	if int(egress.get("steps", 0)) >= available_steps or not egress.get("cleared_building", false):
		return egress
	var staged_unit: Dictionary = unit.duplicate(true)
	staged_unit.cell = egress.cell
	staged_unit.tu = int(unit.get("tu", 0)) - int(egress.steps) * MOVE_TU
	var direct := _ai_direct_extraction_plan(staged_unit, reserve_tu, threats)
	var path: Array = egress.path.duplicate()
	path.append_array(direct.get("path", []).slice(1))
	direct.path = path
	direct.cell = path[-1]
	direct.steps = path.size() - 1
	direct.cleared_building = true
	direct.building_id = egress.get("building_id", "")
	direct.exit_kind = egress.get("exit_kind", "")
	direct.merge(_ai_route_threat_stats(path, threats), true)
	return direct

func _apply_ai_movement(unit: Dictionary, plan: Dictionary) -> void:
	var path: Array[Vector2i] = []
	for path_value in plan.get("path", []):
		if path_value is Vector2i:
			path.append(path_value)
	if path.size() < 2:
		return
	var old_cell: Vector2i = unit.cell
	unit.cell = plan.get("cell", unit.cell)
	unit.tu = maxi(0, int(unit.get("tu", 0)) - int(plan.get("steps", 0)) * MOVE_TU)
	unit.facing = unit.cell - old_cell
	var trail: Array = unit.get("trail", [])
	var movement_history: Array = unit.get("ai_move_history", []).duplicate()
	for step in path:
		trail.push_front(step)
		var step_key := AegisHexRules.key(step)
		if movement_history.has(step_key):
			movement_history.erase(step_key)
		movement_history.append(step_key)
	if trail.size() > 20:
		trail.resize(20)
	while movement_history.size() > 16:
		movement_history.pop_front()
	unit.trail = trail
	unit.ai_move_history = movement_history
	if ai_command_active and unit.get("team", "") == "human":
		voice_requested.emit("Moving steady professional.wav")
	_advance_followers(unit, path)
	_refresh_visibility()
	queue_redraw()

func _nearest_extraction_cell(origin: Vector2i) -> Vector2i:
	var result := origin
	var best_distance := 9999
	for cell_key in extraction_cells:
		var cell := _cell_from_key(String(cell_key))
		var distance := AegisHexRules.distance(origin, cell)
		if distance < best_distance:
			result = cell
			best_distance = distance
	return result

func _ai_exploration_cell(unit: Dictionary) -> Vector2i:
	var role := String(unit.get("ai_role", "wedge_left"))
	var y_offset := -4 if role.contains("left") else 4 if role.contains("right") else 0
	var sweep_x := clampi(grid_width / 2 + turn_number * 2, grid_width / 2, grid_width - 2)
	return Vector2i(sweep_x, clampi(grid_height / 2 + y_offset, 1, grid_height - 2))

func _active_vip_tracker_targets() -> Array:
	if required_rescues <= 0:
		return []
	return units.filter(func(unit): return unit.get("team", "") == "civilian" and bool(unit.get("vip_tracker", true)) and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))

func _passable_search_cell(cell: Vector2i, occupied: Dictionary) -> bool:
	var key := AegisHexRules.key(cell)
	return _inside(cell) and not _blocked_cells().has(key) and not occupied.has(key)

func _ai_secure_search_assignments(soldiers: Array) -> Dictionary:
	var assignments := {}
	var occupied := _occupied_cells()
	var available: Array = soldiers.filter(func(soldier):
		return not units.any(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
	)
	available.sort_custom(func(left, right): return String(left.get("id", "")) < String(right.get("id", "")))
	var trackers: Array = _active_vip_tracker_targets().filter(func(civilian): return not civilian.get("revealed", false) and String(civilian.get("escort_id", "")).is_empty())
	trackers.sort_custom(func(left, right): return String(left.get("id", "")) < String(right.get("id", "")))
	var tracker_targets: Array = trackers.duplicate()
	while not available.is_empty() and not trackers.is_empty():
		var best_soldier_index := -1
		var best_tracker_index := -1
		var best_distance := 9999
		var best_pair_key := ""
		for soldier_index in range(available.size()):
			for tracker_index in range(trackers.size()):
				var distance := AegisHexRules.distance(available[soldier_index].cell, trackers[tracker_index].cell)
				var pair_key := "%s:%s" % [available[soldier_index].get("id", ""), trackers[tracker_index].get("id", "")]
				if distance < best_distance or distance == best_distance and (best_pair_key.is_empty() or pair_key < best_pair_key):
					best_distance = distance
					best_pair_key = pair_key
					best_soldier_index = soldier_index
					best_tracker_index = tracker_index
		var tracker: Dictionary = trackers[best_tracker_index]
		var tracker_soldier: Dictionary = available[best_soldier_index]
		assignments[tracker_soldier.get("id", "")] = {"kind":"tracker","cell":tracker.cell,"tracker_id":tracker.get("id", ""),"zone_id":"tracker:%s" % tracker.get("id", "")}
		available.remove_at(best_soldier_index)
		trackers.remove_at(best_tracker_index)
	if not tracker_targets.is_empty():
		for soldier_value in available:
			var soldier: Dictionary = soldier_value
			var ordered_trackers: Array = tracker_targets.duplicate()
			ordered_trackers.sort_custom(func(left, right):
				var left_distance := AegisHexRules.distance(soldier.cell, left.cell)
				var right_distance := AegisHexRules.distance(soldier.cell, right.cell)
				return left_distance < right_distance or left_distance == right_distance and String(left.get("id", "")) < String(right.get("id", ""))
			)
			var tracker: Dictionary = ordered_trackers[0]
			assignments[soldier.get("id", "")] = {"kind":"tracker","cell":tracker.cell,"tracker_id":tracker.get("id", ""),"zone_id":"tracker-support:%s:%s" % [tracker.get("id", ""), soldier.get("id", "")]}
		return assignments

	var building_bounds := {}
	for cover_value in covers.values():
		var cover: Dictionary = cover_value
		var building_id := String(cover.get("building", ""))
		if building_id.is_empty() or not cover.get("hard", false) or int(cover.get("hp", 0)) <= 0:
			continue
		var cell: Vector2i = cover.cell
		if not building_bounds.has(building_id):
			building_bounds[building_id] = {"min_x":cell.x,"max_x":cell.x,"min_y":cell.y,"max_y":cell.y}
		else:
			var bounds: Dictionary = building_bounds[building_id]
			bounds.min_x = mini(int(bounds.min_x), cell.x)
			bounds.max_x = maxi(int(bounds.max_x), cell.x)
			bounds.min_y = mini(int(bounds.min_y), cell.y)
			bounds.max_y = maxi(int(bounds.max_y), cell.y)
	var building_ids: Array = building_bounds.keys()
	building_ids.sort()
	for building_id_value in building_ids:
		if available.is_empty():
			break
		var building_id := String(building_id_value)
		var bounds: Dictionary = building_bounds[building_id]
		var interior_cells: Array[Vector2i] = []
		for y in range(int(bounds.min_y) + 1, int(bounds.max_y)):
			for x in range(int(bounds.min_x) + 1, int(bounds.max_x)):
				var interior := Vector2i(x, y)
				if _passable_search_cell(interior, occupied) and not explored_cells.has(AegisHexRules.key(interior)):
					interior_cells.append(interior)
		if interior_cells.is_empty():
			continue
		var chosen_soldier_index := 0
		var chosen_cell := interior_cells[0]
		var chosen_distance := 9999
		for soldier_index in range(available.size()):
			for interior in interior_cells:
				var distance := AegisHexRules.distance(available[soldier_index].cell, interior)
				if distance < chosen_distance:
					chosen_distance = distance
					chosen_soldier_index = soldier_index
					chosen_cell = interior
		var building_soldier: Dictionary = available[chosen_soldier_index]
		assignments[building_soldier.get("id", "")] = {"kind":"building","cell":chosen_cell,"building_id":building_id,"zone_id":"building:%s" % building_id}
		available.remove_at(chosen_soldier_index)

	var used_target_keys := {}
	var used_sectors := {}
	for assignment_value in assignments.values():
		var assignment: Dictionary = assignment_value
		var target_cell: Vector2i = assignment.cell
		used_target_keys[AegisHexRules.key(target_cell)] = true
		used_sectors["%d,%d" % [target_cell.x / 5, target_cell.y / 4]] = true
	for soldier_value in available:
		var soldier: Dictionary = soldier_value
		var best_cell: Vector2i = soldier.get("cell", Vector2i.ZERO)
		var best_score: int = 999999
		var considered: int = 0
		var start_index: int = absi(turn_number * 37 + String(soldier.get("id", "")).hash()) % (grid_width * grid_height)
		for offset in range(grid_width * grid_height):
			var flat_index := (start_index + offset) % (grid_width * grid_height)
			var candidate := Vector2i(flat_index % grid_width, flat_index / grid_width)
			var candidate_key := AegisHexRules.key(candidate)
			if not _passable_search_cell(candidate, occupied) or used_target_keys.has(candidate_key):
				continue
			considered += 1
			if considered > AI_MAX_CANDIDATES:
				break
			var sector_id := "%d,%d" % [candidate.x / 5, candidate.y / 4]
			var score := (10000 if explored_cells.has(candidate_key) else 0) + (2500 if used_sectors.has(sector_id) else 0) + AegisHexRules.distance(soldier.cell, candidate) * 10
			if score < best_score:
				best_score = score
				best_cell = candidate
		if best_cell == soldier.cell:
			continue
		var best_sector := "%d,%d" % [best_cell.x / 5, best_cell.y / 4]
		assignments[soldier.get("id", "")] = {"kind":"sector","cell":best_cell,"sector_id":best_sector,"zone_id":"sector:%s" % best_sector}
		used_target_keys[AegisHexRules.key(best_cell)] = true
		used_sectors[best_sector] = true
	return assignments

func _soldier_engaged_with_alien(soldier: Dictionary) -> bool:
	var weapon_range := maxi(1, int(soldier.get("weapon_range", 0)))
	return units.any(func(unit):
		return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0 and unit.get("visible", false) and AegisHexRules.distance(soldier.cell, unit.cell) <= weapon_range and _has_line_of_sight_from(soldier.cell, unit.cell)
	)

func _ai_rescue_guard_assignments(soldiers: Array) -> Dictionary:
	var escorted_vips := units.filter(func(unit): return unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false) and unit.get("revealed", false) and not String(unit.get("escort_id", "")).is_empty())
	if escorted_vips.is_empty():
		return {}
	var escort_ids := {}
	for civilian in escorted_vips:
		escort_ids[String(civilian.get("escort_id", ""))] = true
	var guards: Array = soldiers.filter(func(soldier): return not escort_ids.has(String(soldier.get("id", ""))))
	guards.sort_custom(func(left, right): return String(left.get("id", "")) < String(right.get("id", "")))
	var occupied := _occupied_cells()
	var candidates := {}
	var anchors: Array[Vector2i] = []
	for civilian in escorted_vips:
		anchors.append(civilian.cell)
	for extraction_key in extraction_cells:
		anchors.append(_cell_from_key(String(extraction_key)))
	for anchor in anchors:
		var first_ring := AegisHexRules.neighbors(anchor, grid_width, grid_height)
		var guard_cells: Array = first_ring.duplicate()
		for first_cell in first_ring:
			guard_cells.append_array(AegisHexRules.neighbors(first_cell, grid_width, grid_height))
		for cell_value in guard_cells:
			var cell: Vector2i = cell_value
			if _passable_search_cell(cell, occupied):
				candidates[AegisHexRules.key(cell)] = cell
	var assignments := {}
	for guard in guards:
		var available: Array = candidates.values()
		if available.is_empty():
			break
		available.sort_custom(func(left, right):
			var distance_difference := AegisHexRules.distance(guard.cell, left) - AegisHexRules.distance(guard.cell, right)
			var cover_difference := _cover_score(right) - _cover_score(left)
			return distance_difference < 0 or distance_difference == 0 and (cover_difference < 0 or cover_difference == 0 and AegisHexRules.key(left) < AegisHexRules.key(right))
		)
		var target: Vector2i = available[0]
		candidates.erase(AegisHexRules.key(target))
		assignments[guard.get("id", "")] = {"kind":"guard","cell":target,"zone_id":"guard:%s" % guard.get("id", "")}
	return assignments

func _ai_contact_civilian(soldier: Dictionary, civilian: Dictionary) -> bool:
	if AegisHexRules.distance(soldier.cell, civilian.cell) > 1 or int(soldier.get("tu", 0)) < ESCORT_TU:
		return false
	var followers := units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
	if followers.size() >= 4:
		return false
	soldier.tu = int(soldier.tu) - ESCORT_TU
	soldier.priority_civilian_id = civilian.get("id", "")
	civilian.priority_escort_id = soldier.get("id", "")
	civilian.approached_by_id = soldier.get("id", "")
	action_serial += 1
	var follows: bool = not bool(civilian.get("panic", false)) or AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial + turn_number * 17) > 45
	civilian.revealed = true
	if follows:
		civilian.panic = false
		civilian.escort_id = soldier.id
		_emit_log("%s takes %s into the evacuation column." % [soldier.callsign, civilian.name])
		voice_requested.emit("On me steady professional.wav")
	else:
		_emit_log("%s cannot calm %s on the first attempt." % [soldier.callsign, civilian.name])
	return follows

func _run_ai_human_turn() -> void:
	if resolved or phase != "human":
		return
	var commander := _select_ai_commander()
	_assign_ai_roles(commander)
	var soldiers := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	soldiers.sort_custom(func(left, right): return String(left.get("id", "")) < String(right.get("id", "")))
	if soldiers.size() > 1:
		var rotated: Array = []
		var offset := (turn_number - 1) % soldiers.size()
		for index in range(soldiers.size()):
			rotated.append(soldiers[(offset + index) % soldiers.size()])
		soldiers = rotated
	ai_last_acted_ids.clear()
	var claimed_civilians := {}
	var secure_rescue := not units.any(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0) and rescued < required_rescues
	var active_vips := units.filter(func(unit): return unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
	var rescue_guard_phase := secure_rescue and not active_vips.is_empty() and active_vips.all(func(unit): return unit.get("revealed", false) and not String(unit.get("escort_id", "")).is_empty())
	var combat_priority := not _visible_alien_contacts().is_empty() or not _known_alien_contact_cells().is_empty()
	var tracker_guidance := rescued < required_rescues and not combat_priority and not _active_vip_tracker_targets().is_empty()
	var tactical_search_assignments: Dictionary = _ai_rescue_guard_assignments(soldiers) if rescue_guard_phase else _ai_secure_search_assignments(soldiers) if secure_rescue or tracker_guidance else {}
	for soldier in soldiers:
		if resolved or (ai_command_busy and not ai_command_active):
			break
		var action_before := action_serial
		var cell_before: Vector2i = soldier.cell
		var reserve_tu := maxi(0, int(soldier.get("fire_tu", FIRE_TU)))
		var followers := units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
		var visible_contacts := _visible_alien_contacts()
		var soldier_engaged := _soldier_engaged_with_alien(soldier)
		var rescue_target: Variant = null
		var search_assignment: Dictionary = {}
		if not followers.is_empty():
			rescue_target = {"cell":_nearest_extraction_cell(soldier.cell),"ramp":true}
		else:
			var priority_civilians := units.filter(func(unit): return not combat_priority and not soldier_engaged and unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false) and unit.get("priority_escort_id", "") == soldier.get("id", "") and (String(unit.get("approached_by_id", "")).is_empty() or unit.get("approached_by_id", "") == soldier.get("id", "")) and not claimed_civilians.has(unit.get("id", "")))
			priority_civilians.sort_custom(func(left, right): return AegisHexRules.distance(left.cell, soldier.cell) < AegisHexRules.distance(right.cell, soldier.cell))
			if not priority_civilians.is_empty():
				rescue_target = priority_civilians[0]
				claimed_civilians[rescue_target.get("id", "")] = true
		if rescue_target == null and not combat_priority and not soldier_engaged and rescued < required_rescues:
			var civilians := units.filter(func(unit): return unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false) and (String(unit.get("escort_id", "")).is_empty() or unit.get("escort_id", "") == soldier.get("id", "")) and (unit.get("visible", false) or unit.get("revealed", false)) and not claimed_civilians.has(unit.get("id", "")))
			civilians.sort_custom(func(left, right): return AegisHexRules.distance(left.cell, soldier.cell) < AegisHexRules.distance(right.cell, soldier.cell))
			if not civilians.is_empty():
				rescue_target = civilians[0]
				claimed_civilians[rescue_target.get("id", "")] = true
		if rescue_target == null and tactical_search_assignments.has(soldier.get("id", "")) and (secure_rescue or _ai_distress_target(soldier).is_empty()):
			search_assignment = tactical_search_assignments[soldier.get("id", "")]
			if search_assignment.get("kind", "") == "tracker":
				for civilian in units:
					if civilian.get("id", "") == search_assignment.get("tracker_id", "") and int(civilian.get("hp", 0)) > 0 and not civilian.get("rescued", false) and not civilian.get("revealed", false) and String(civilian.get("escort_id", "")).is_empty():
						rescue_target = civilian
						claimed_civilians[civilian.get("id", "")] = true
						break
			else:
				rescue_target = {"cell":search_assignment.get("cell", soldier.cell),"search":true,"kind":search_assignment.get("kind", "sector")}
		if rescue_target != null:
			var contacted := false
			if not rescue_target.get("ramp", false) and not rescue_target.get("search", false) and _visible_alien_contacts().is_empty() and _ai_contact_civilian(soldier, rescue_target):
				contacted = true
				followers = [rescue_target]
				rescue_target = {"cell":_nearest_extraction_cell(soldier.cell),"ramp":true}
			var rescue_cells: Array = []
			if rescue_target.get("ramp", false):
				for extraction_key in extraction_cells:
					rescue_cells.append(_cell_from_key(String(extraction_key)))
			else:
				rescue_cells.append(rescue_target.cell)
			var search_reserve := 0 if secure_rescue and rescue_target.get("search", false) else reserve_tu
			var rescue_plan := _ai_extraction_plan(soldier, reserve_tu, visible_contacts) if rescue_target.get("ramp", false) else _ai_rescue_plan(soldier, rescue_cells, search_reserve, not rescue_target.get("search", false), visible_contacts)
			_apply_ai_movement(soldier, rescue_plan)
			if rescue_target.get("search", false) and int(rescue_plan.get("steps", 0)) > 0:
				if rescue_target.get("kind", "") == "guard":
					_emit_log("%s forms up on the VIP and Skyranger rescue perimeter." % soldier.callsign)
				else:
					_emit_log("%s sweeps an unexplored %s zone for tracked civilians." % [soldier.callsign, rescue_target.get("kind", "search")])
			if not rescue_target.get("ramp", false) and not rescue_target.get("search", false) and _visible_alien_contacts().is_empty():
				contacted = _ai_contact_civilian(soldier, rescue_target) or contacted
			followers = units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
			if followers.is_empty() and not _visible_alien_contacts().is_empty():
				rescue_target = null
			var rescue_progressed: bool = contacted or int(rescue_plan.get("steps", 0)) > 0
			var rescue_stalls := 0 if rescue_progressed else int(soldier.get("ai_rescue_stalls", 0)) + 1
			soldier.ai_rescue_stalls = rescue_stalls
			if rescue_stalls >= 2 and not followers.is_empty():
				soldier.ai_rescue_stalls = 0
				soldier.ai_move_history = [AegisHexRules.key(soldier.cell)]
				_emit_log("%s retained the civilian column and reset its bounded route search." % soldier.callsign)
		var visible_aliens := _visible_alien_contacts()
		var combat_target: Variant = null
		var contact_target_cell := Vector2i(-1, -1)
		var distress_target: Dictionary = _ai_distress_target(soldier) if rescue_target == null else {}
		if not visible_aliens.is_empty():
			visible_aliens.sort_custom(func(left, right): return AegisHexRules.distance(left.cell, soldier.cell) < AegisHexRules.distance(right.cell, soldier.cell))
			combat_target = visible_aliens[0]
			contact_target_cell = combat_target.cell
		elif not distress_target.is_empty():
			contact_target_cell = distress_target.get("cell", Vector2i(-1, -1))
		elif alien_contact_seen:
			var remembered_cells := _known_alien_contact_cells()
			remembered_cells.sort_custom(func(left, right): return AegisHexRules.distance(left, soldier.cell) < AegisHexRules.distance(right, soldier.cell))
			if not remembered_cells.is_empty():
				contact_target_cell = remembered_cells[0]
		if rescue_target == null and _inside(contact_target_cell):
			var contact_plan := _ai_movement_plan(soldier, contact_target_cell, reserve_tu, String(soldier.get("ai_role", "")), false, combat_target != null)
			_apply_ai_movement(soldier, contact_plan)
			visible_aliens = _visible_alien_contacts()
			if not visible_aliens.is_empty():
				visible_aliens.sort_custom(func(left, right): return AegisHexRules.distance(left.cell, soldier.cell) < AegisHexRules.distance(right.cell, soldier.cell))
				combat_target = visible_aliens[0]
		elif combat_target == null and rescue_target == null:
			var exploration_cell := _ai_exploration_cell(soldier)
			var explore_plan := _ai_movement_plan(soldier, exploration_cell, reserve_tu, String(soldier.get("ai_role", "")), false, false)
			_apply_ai_movement(soldier, explore_plan)
		if combat_target != null and int(combat_target.get("hp", 0)) > 0 and AegisHexRules.distance(soldier.cell, combat_target.cell) <= int(soldier.get("weapon_range", 0)) and _has_line_of_sight_from(soldier.cell, combat_target.cell):
			_try_shoot_unit(soldier, combat_target)
		followers = units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
		if soldier.cell == cell_before and action_serial == action_before and followers.is_empty():
			var patrol_plan := _ai_patrol_plan(soldier, reserve_tu)
			_apply_ai_movement(soldier, patrol_plan)
		if soldier.cell != cell_before or action_serial > action_before:
			ai_last_acted_ids.append(String(soldier.get("id", "")))
		_emit_state()
		queue_redraw()
		await get_tree().create_timer(0.38 if soldier.cell != cell_before or action_serial > action_before else 0.08).timeout
	selected_id = ""
	reachable.clear()
	_emit_state()

func take_ai_command() -> void:
	if resolved or ai_command_busy:
		return
	ai_command_active = true
	ai_command_busy = true
	ai_command_changed.emit(true)
	voice_requested.emit("Copy steady professional.wav")
	_emit_log("AI COMMAND: %s. Live battlefield state retained." % ai_command_summary())
	while not resolved and ai_command_active and turn_number <= AI_MAX_TURNS:
		if phase == "human":
			await _run_ai_human_turn()
			if not ai_command_active:
				break
			if not resolved:
				await end_human_turn()
		else:
			await get_tree().create_timer(0.05).timeout
	if not resolved and turn_number > AI_MAX_TURNS:
		_emit_log("AI command paused at the bounded turn limit.")
	ai_command_active = false
	ai_command_busy = false
	ai_command_changed.emit(false)
	if not resolved and phase == "human":
		var living := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
		selected_id = String(living[0].get("id", "")) if not living.is_empty() else ""
		_rebuild_reachable()
	_emit_state()

func reclaim_ai_command() -> void:
	if not ai_command_active:
		return
	ai_command_active = false
	_emit_log("PLAYER COMMAND: AI control release requested. Current positions, damage, TU, civilians, and breached cover will be retained.")
	voice_requested.emit("Back with you steady professional.wav")
	ai_command_changed.emit(false)

func abort_battle() -> void:
	if resolved:
		return
	_emit_log("DUST OFF: Aegis One is aborting the incident with surviving personnel.")
	_finish_battle(false)

func end_human_turn() -> void:
	if resolved or phase != "human":
		return
	for soldier in units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0):
		soldier["targeting_mode"] = "move"
	phase = "alien"
	selected_id = ""
	reachable.clear()
	_emit_state()
	queue_redraw()
	await get_tree().create_timer(0.22).timeout
	_run_alien_turn()

func _reaction_fire_for_move(alien: Dictionary, reacted_ids: Dictionary) -> bool:
	var shooters := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0 and not reacted_ids.has(unit.get("id", "")) and int(unit.get("tu", 0)) >= int(unit.get("fire_tu", FIRE_TU)))
	shooters.sort_custom(func(left, right): return int(left.get("reactions", 55)) > int(right.get("reactions", 55)))
	for shooter in shooters:
		var distance := AegisHexRules.distance(shooter.cell, alien.cell)
		if distance > int(shooter.get("weapon_range", 0)) or not _has_line_of_sight_from(shooter.cell, alien.cell):
			continue
		action_serial += 1
		var reaction_chance := clampi(int(shooter.get("reactions", 55)) - distance * 2, 5, 95)
		var reaction_roll := AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), 900 + action_serial * 31 + turn_number * 47)
		if reaction_roll > reaction_chance:
			continue
		reacted_ids[shooter.get("id", "")] = true
		shooter.tu = maxi(0, int(shooter.get("tu", 0)) - int(shooter.get("fire_tu", FIRE_TU)))
		var hit_chance := clampi(int(shooter.get("accuracy", 60)) - distance * 4, 12, 92)
		var hit_roll := AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), 1200 + action_serial * 43 + turn_number * 59)
		if hit_roll <= hit_chance:
			var damage := int(shooter.get("weapon_damage", 17)) + AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), 1500 + action_serial * 17, 0, int(shooter.get("weapon_variance", 8)))
			alien.hp = maxi(0, int(alien.get("hp", 0)) - damage)
			alien.visible = true
			alien.revealed = true
			_emit_log("%s reaction fires and hits %s for %d damage." % [shooter.callsign, alien.name, damage])
			if int(alien.get("hp", 0)) <= 0:
				shooter.kills = int(shooter.get("kills", 0)) + 1
				_emit_log("%s stops %s during its advance." % [shooter.callsign, alien.name])
				return false
		else:
			_emit_log("%s reaction fires and misses %s." % [shooter.callsign, alien.name])
	return int(alien.get("hp", 0)) > 0

func _run_alien_turn() -> void:
	var reacted_ids := {}
	for alien in units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0):
		alien.tu = int(alien.get("max_tu", 48))
		var targets := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
		if targets.is_empty():
			break
		targets.sort_custom(func(a, b):
			var distance_difference := AegisHexRules.distance(a.cell, alien.cell) - AegisHexRules.distance(b.cell, alien.cell)
			return distance_difference < 0 or distance_difference == 0 and String(a.get("id", "")) < String(b.get("id", ""))
		)
		var target: Dictionary = targets[0]
		var distance := AegisHexRules.distance(alien.cell, target.cell)
		var can_fire := distance <= int(alien.get("weapon_range", 5)) and _has_line_of_sight_from(alien.cell, target.cell)
		if not can_fire:
			var plan := _ai_movement_plan(alien, target.cell, int(alien.get("fire_tu", FIRE_TU)), "alien_flank", true, true)
			var path: Array = plan.get("path", [])
			for step_index in range(1, path.size()):
				var previous_cell: Vector2i = alien.cell
				alien.cell = path[step_index]
				alien.facing = alien.cell - previous_cell
				alien.tu = maxi(0, int(alien.get("tu", 0)) - MOVE_TU)
				_refresh_visibility()
				if alien.get("visible", false):
					_emit_log("%s advances through cover toward the squad." % alien.name)
				queue_redraw()
				if not _reaction_fire_for_move(alien, reacted_ids):
					break
				await get_tree().create_timer(0.18 if alien.get("visible", false) else 0.01).timeout
			if int(alien.get("hp", 0)) <= 0:
				if _check_resolution():
					return
				continue
			distance = AegisHexRules.distance(alien.cell, target.cell)
			can_fire = distance <= int(alien.get("weapon_range", 5)) and _has_line_of_sight_from(alien.cell, target.cell)
		if can_fire and int(alien.get("tu", 0)) >= int(alien.get("fire_tu", FIRE_TU)):
			_alien_shoot(alien, target, distance)
		_refresh_visibility()
		await get_tree().create_timer(0.38 if alien.get("visible", false) else 0.02).timeout
		queue_redraw()
		if _check_resolution():
			return
	_move_panicked_civilians()
	turn_number += 1
	phase = "human"
	for soldier in units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0):
		soldier.tu = soldier.max_tu
	_emit_log("AEGIS turn %d begins." % turn_number)
	_emit_state()
	queue_redraw()

func _alien_shoot(alien: Dictionary, target: Dictionary, distance: int) -> void:
	alien.tu = maxi(0, int(alien.get("tu", 0)) - int(alien.get("fire_tu", FIRE_TU)))
	action_serial += 1
	var chance := clampi(int(alien.accuracy) - distance * 4 - (8 if target.get("kneeling", false) else 0), 14, 84)
	var roll := AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), 700 + action_serial * 29 + turn_number * 43)
	_record_tactical_distress(target, alien, roll <= chance)
	if roll > chance:
		_emit_log("%s fires and misses %s." % [alien.name, target.name])
		return
	var raw_damage := int(alien.damage) + AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial * 13, 0, 5)
	var reduction := maxi(0, int(target.get("damage_reduction", 0)))
	var damage := maxi(1, raw_damage - reduction)
	target.hp = maxi(0, int(target.hp) - damage)
	_emit_log("%s hit %s for %d damage%s." % [alien.name, target.name, damage, " after %s protection" % target.get("armor", "armor") if reduction > 0 else ""])
	if target.get("team", "") == "civilian" and int(target.hp) > 0:
		target.panic = true
		target.escort_id = ""
	if int(target.hp) <= 0:
		_emit_log("%s was killed." % target.name)
		if target.get("team", "") == "human":
			for civilian in units.filter(func(unit): return unit.get("escort_id", "") == target.get("id", "")):
				civilian.escort_id = ""
				civilian.panic = true

func _move_panicked_civilians() -> void:
	var aliens := units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0)
	for civilian in units.filter(func(unit): return unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and unit.get("panic", false) and not unit.get("rescued", false)):
		if aliens.is_empty():
			civilian.panic = false
			continue
		var nearest: Dictionary = aliens[0]
		for alien in aliens:
			if AegisHexRules.distance(civilian.cell, alien.cell) < AegisHexRules.distance(civilian.cell, nearest.cell):
				nearest = alien
		var options := AegisHexRules.neighbors(civilian.cell, grid_width, grid_height).filter(func(cell): return not _blocked_cells().has(AegisHexRules.key(cell)) and not _occupied_cells(civilian.id).has(AegisHexRules.key(cell)))
		options.sort_custom(func(a, b): return AegisHexRules.distance(a, nearest.cell) > AegisHexRules.distance(b, nearest.cell))
		if not options.is_empty():
			civilian.cell = options[0]
			_emit_log("%s runs in panic." % civilian.name)
		if AegisHexRules.distance(civilian.cell, nearest.cell) > 7:
			civilian.panic = false
			_emit_log("%s recovers after escaping the threat." % civilian.name)

func _refresh_visibility() -> void:
	var soldiers := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	_refresh_explored_cells(soldiers)
	var newly_spotted_civilians: Array = []
	var alien_visible_now := false
	for unit in units:
		if unit.get("team", "") == "human":
			unit.visible = true
			continue
		if unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false) and not String(unit.get("escort_id", "")).is_empty():
			unit.visible = true
			unit.revealed = true
			continue
		var was_revealed := bool(unit.get("revealed", false))
		unit.visible = false
		for soldier in soldiers:
			if AegisHexRules.distance(unit.cell, soldier.cell) <= 7 and _has_line_of_sight_from(soldier.cell, unit.cell):
				unit.visible = true
				unit.revealed = true
				if unit.get("team", "") == "alien":
					alien_visible_now = true
					unit.last_known_cell = unit.cell
				elif unit.get("team", "") == "civilian" and not was_revealed:
					newly_spotted_civilians.append(unit)
				break
	if alien_visible_now:
		alien_contact_seen = true
	elif not alien_contact_seen:
		for civilian in newly_spotted_civilians:
			_assign_precontact_civilian_claim(civilian, soldiers)

func _refresh_explored_cells(soldiers: Array) -> void:
	for soldier in soldiers:
		for y in range(grid_height):
			for x in range(grid_width):
				var cell := Vector2i(x, y)
				if AegisHexRules.distance(soldier.cell, cell) <= 7 and _has_line_of_sight_from(soldier.cell, cell):
					explored_cells[AegisHexRules.key(cell)] = true

func _assign_precontact_civilian_claim(civilian: Dictionary, soldiers: Array) -> void:
	if not String(civilian.get("escort_id", "")).is_empty() or not String(civilian.get("approached_by_id", "")).is_empty() or not String(civilian.get("priority_escort_id", "")).is_empty():
		return
	var available := soldiers.filter(func(soldier): return String(soldier.get("priority_civilian_id", "")).is_empty() and _has_line_of_sight_from(soldier.cell, civilian.cell))
	available.sort_custom(func(left, right):
		var distance_difference := AegisHexRules.distance(left.cell, civilian.cell) - AegisHexRules.distance(right.cell, civilian.cell)
		return distance_difference < 0 or distance_difference == 0 and String(left.get("id", "")) < String(right.get("id", ""))
	)
	if available.is_empty():
		return
	var escort: Dictionary = available[0]
	escort.priority_civilian_id = civilian.get("id", "")
	civilian.priority_escort_id = escort.get("id", "")
	_emit_log("%s marked spotted civilian %s as pre-contact rescue priority." % [escort.callsign, civilian.name])

func _check_resolution() -> bool:
	if resolved:
		return true
	var living_humans := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	var living_aliens := units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0)
	if living_humans.is_empty():
		_finish_battle(false)
		return true
	if living_aliens.is_empty() and rescued >= required_rescues:
		_finish_battle(true)
		return true
	if living_aliens.is_empty():
		_emit_log("Area secure. Escort %d more civilian%s to the ramp." % [required_rescues - rescued, "" if required_rescues - rescued == 1 else "s"])
	return false

func _finish_battle(success: bool) -> void:
	resolved = true
	phase = "resolved"
	selected_id = ""
	reachable.clear()
	var soldier_results := {}
	for soldier in units.filter(func(unit): return unit.get("team", "") == "human"):
		soldier_results[soldier.id] = {"hp": soldier.hp, "kills": soldier.kills, "medkit_charges":int(soldier.get("medkit_charges", 0))}
	var result := {"success":success,"rescued":rescued,"turns":turn_number,"soldiers":soldier_results}
	_emit_log("TACTICAL %s: %d civilian%s rescued in %d turns." % ["VICTORY" if success else "DEFEAT", rescued, "" if rescued == 1 else "s", turn_number])
	_emit_state()
	battle_finished.emit(result)
	queue_redraw()

func _blocked_cells() -> Dictionary:
	var blocked := {}
	for key in covers:
		var cover: Dictionary = covers[key]
		if cover.get("hard", false) and int(cover.get("hp", 0)) > 0:
			blocked[key] = true
	return blocked

func _occupied_cells(exclude_id: String = "", allow_id: String = "") -> Dictionary:
	var occupied := {}
	for unit in units:
		if unit.get("id", "") in [exclude_id, allow_id] or int(unit.get("hp", 0)) <= 0 or unit.get("rescued", false):
			continue
		occupied[AegisHexRules.key(unit.cell)] = true
	return occupied

func _unit_at(cell: Vector2i):
	for unit in units:
		if unit.get("cell", Vector2i(-1,-1)) == cell and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false):
			return unit
	return null

func _selected_unit():
	for unit in units:
		if unit.get("id", "") == selected_id and int(unit.get("hp", 0)) > 0:
			return unit
	return null

func _emit_log(message: String) -> void:
	event_log.push_front(message)
	if event_log.size() > 12:
		event_log.resize(12)
	log_added.emit(message)

func _emit_state() -> void:
	var living_aliens := units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0).size()
	var active_civilians := units.filter(func(unit): return unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false)).size()
	status_changed.emit({"phase":phase,"turn":turn_number,"aliens":living_aliens,"rescued":rescued,"required":required_rescues,"civilians":active_civilians,"resolved":resolved,"map_label":map_profile.label,"grid_width":grid_width,"grid_height":grid_height,"transports":transport_count})
	var selected: Variant = _selected_unit()
	selection_changed.emit(selected if selected != null else {})

func _inside(cell: Vector2i) -> bool:
	return cell.x > 0 and cell.y > 0 and cell.x < grid_width - 1 and cell.y < grid_height - 1

func _hex_center(cell: Vector2i) -> Vector2:
	return board_origin + Vector2(cell.x * hex_width + (hex_width * 0.5 if cell.y % 2 else 0.0), cell.y * row_step)

func _cell_at(point: Vector2) -> Vector2i:
	var best := Vector2i(-1, -1)
	var best_distance := hex_radius
	for y in range(grid_height):
		for x in range(grid_width):
			var cell := Vector2i(x, y)
			var distance := point.distance_to(_hex_center(cell))
			if distance < best_distance:
				best = cell
				best_distance = distance
	return best

func _hex_points(center: Vector2, radius: float = -1.0) -> PackedVector2Array:
	var points := PackedVector2Array()
	var resolved_radius := hex_radius - 1.0 if radius < 0.0 else radius
	for index in range(6):
		var angle := deg_to_rad(60.0 * index - 30.0)
		points.append(center + Vector2(cos(angle), sin(angle)) * resolved_radius)
	return points

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color("081418"), true)
	for y in range(grid_height):
		for x in range(grid_width):
			_draw_hex(Vector2i(x, y))
	_draw_tracker_pings()
	_draw_skyranger()
	_draw_connected_walls()
	for cover in covers.values():
		_draw_cover(cover)
	_draw_floor_items()
	for unit in units:
		_draw_unit(unit)
	if resolved:
		draw_rect(Rect2(Vector2(250, 265), Vector2(520, 115)), Color(0.02,0.06,0.07,0.9), true)
		draw_rect(Rect2(Vector2(250, 265), Vector2(520, 115)), Color("67e8f9"), false, 2.0)
		draw_string(get_theme_default_font(), Vector2(350, 315), "TACTICAL %s" % ("VICTORY" if rescued >= required_rescues else "DEFEAT"), HORIZONTAL_ALIGNMENT_LEFT, -1, 26, Color("fef3c7"))
		draw_string(get_theme_default_font(), Vector2(325, 350), "%d civilian%s rescued - %d turns" % [rescued, "" if rescued == 1 else "s", turn_number], HORIZONTAL_ALIGNMENT_LEFT, -1, 17, Color("d1fae5"))

func _draw_tracker_pings() -> void:
	if tracker_pulse_remaining <= 0.0:
		return
	var progress := clampf(1.0 - tracker_pulse_remaining / TRACKER_PULSE_DURATION, 0.0, 1.0)
	for civilian in _active_vip_tracker_targets():
		var center := _hex_center(civilian.cell)
		var pulse_color := Color("facc15")
		pulse_color.a = 0.95 * (1.0 - progress)
		draw_circle(center, 7.0, Color(0.98, 0.77, 0.08, 0.24))
		draw_arc(center, 10.0 + progress * 27.0, 0.0, TAU, 32, pulse_color, 3.0, true)
		var echo_color := pulse_color
		echo_color.a *= 0.5
		draw_arc(center, 6.0 + progress * 16.0, 0.0, TAU, 24, echo_color, 2.0, true)
		draw_string(get_theme_default_font(), center + Vector2(-9, -12), "VIP", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("fef3c7"))

func _draw_floor_items() -> void:
	var counts := {}
	for item in floor_items:
		if int(item.get("level", 0)) != 0:
			continue
		var key := AegisHexRules.key(item.get("cell", Vector2i(-1, -1)))
		counts[key] = int(counts.get(key, 0)) + 1
	for key_value in counts:
		var cell := _cell_from_key(String(key_value))
		var center := _hex_center(cell)
		draw_rect(Rect2(center + Vector2(5, 5), Vector2(18, 13)), Color("111827"), true)
		draw_rect(Rect2(center + Vector2(5, 5), Vector2(18, 13)), Color("fbbf24"), false, 1.0)
		draw_string(get_theme_default_font(), center + Vector2(7, 15), "EQ" if int(counts[key_value]) == 1 else "E%d" % int(counts[key_value]), HORIZONTAL_ALIGNMENT_LEFT, -1, 9, Color("fef3c7"))

func _draw_hex(cell: Vector2i) -> void:
	var center := _hex_center(cell)
	var terrain_roll: int = absi(cell.x * 17 + cell.y * 31 + int(incident.get("seed", 1))) % 9
	var color := Color("355f3b") if terrain_roll < 4 else Color("426c3b") if terrain_roll < 7 else Color("765f3f")
	var edge_cell := not _inside(cell)
	if edge_cell:
		color = Color("17232a")
	if cell.x in [7, 8, 9]:
		color = Color("52606a")
	if cell.x >= 10 and cell.x <= 16 and cell.y >= 2 and cell.y <= 7:
		color = Color("665f52")
	if extraction_cells.has(AegisHexRules.key(cell)):
		color = Color("146b76")
	if reachable.has(AegisHexRules.key(cell)):
		color = color.lightened(0.25)
	var selected: Variant = _selected_unit()
	var targeting_mode := String(selected.get("targeting_mode", "move")) if selected != null else "move"
	var target_range := int(selected.get("grenade_range", GRENADE_RANGE)) if targeting_mode == "grenade" else int(selected.get("weapon_range", 0)) if targeting_mode == "fire" else 0
	var targetable := selected != null and targeting_mode != "move" and AegisHexRules.distance(selected.cell, cell) <= target_range
	if targetable:
		color = color.lightened(0.12)
	if cell == hovered_cell:
		color = color.lightened(0.12)
	var points := _hex_points(center)
	draw_colored_polygon(points, color)
	draw_polyline(points + PackedVector2Array([points[0]]), Color("facc15") if edge_cell else Color(0.55,0.72,0.70,0.32), 1.5 if edge_cell else 1.0, true)
	if reachable.has(AegisHexRules.key(cell)):
		draw_polyline(points + PackedVector2Array([points[0]]), Color("a3e635"), 2.0, true)
	if targetable:
		draw_polyline(points + PackedVector2Array([points[0]]), Color("f59e0b") if targeting_mode == "grenade" else Color("fb7185"), 2.0, true)
	if targetable and cell == hovered_cell:
		draw_line(_hex_center(selected.cell), center, Color("fbbf24") if targeting_mode == "grenade" else Color("f87171"), 2.0, true)

func _draw_skyranger() -> void:
	var center_y := grid_height / 2
	var visual_scale := hex_radius / HEX_RADIUS
	for placement in skyranger_placements:
		var left_side: bool = placement.side == "left"
		var outer_x := 0 if left_side else grid_width - 1
		var shoulder_x := 3 if left_side else grid_width - 4
		var nose_x := 4 if left_side else grid_width - 5
		var direction := 1.0 if left_side else -1.0
		var hull_points := PackedVector2Array([
			_hex_center(Vector2i(outer_x,center_y-2)) + Vector2(-22.0*direction,-10.0)*visual_scale,
			_hex_center(Vector2i(shoulder_x,center_y-2)) + Vector2(18.0*direction,-20.0)*visual_scale,
			_hex_center(Vector2i(nose_x,center_y)) + Vector2(12.0*direction,0.0)*visual_scale,
			_hex_center(Vector2i(shoulder_x,center_y+2)) + Vector2(18.0*direction,20.0)*visual_scale,
			_hex_center(Vector2i(outer_x,center_y+2)) + Vector2(-22.0*direction,10.0)*visual_scale
		])
		draw_colored_polygon(hull_points, Color("334b55"))
		draw_polyline(hull_points + PackedVector2Array([hull_points[0]]), Color("94a3b8"), maxf(1.0, 3.0*visual_scale), true)
		var canopy_x := 2 if left_side else grid_width - 3
		var canopy := PackedVector2Array([_hex_center(Vector2i(outer_x,center_y-1)),_hex_center(Vector2i(canopy_x,center_y-1)),_hex_center(Vector2i(canopy_x,center_y+1)),_hex_center(Vector2i(outer_x,center_y+1))])
		draw_colored_polygon(canopy, Color("155e75"))
	for cell_key in extraction_cells:
		var parts := String(cell_key).split(",")
		var cell := Vector2i(int(parts[0]), int(parts[1]))
		draw_string(get_theme_default_font(), _hex_center(cell) + Vector2(-12, 4), "RAMP", HORIZONTAL_ALIGNMENT_LEFT, -1, maxi(7, int(9.0*visual_scale)), Color("cffafe"))

func _draw_connected_walls() -> void:
	for key in covers:
		var cover: Dictionary = covers[key]
		if not cover.get("hard", false) or cover.get("building", "") != "outpost":
			continue
		for neighbor in AegisHexRules.neighbors(cover.cell, grid_width, grid_height):
			var neighbor_key := AegisHexRules.key(neighbor)
			var neighbor_cover: Dictionary = covers.get(neighbor_key, {})
			if neighbor_cover.get("hard", false) and neighbor_cover.get("building", "") == "outpost" and key < neighbor_key:
				draw_line(_hex_center(cover.cell), _hex_center(neighbor), Color("9a765b"), 17.0, true)

func _draw_cover(cover: Dictionary) -> void:
	var center := _hex_center(cover.cell)
	match cover.get("type", ""):
		"wall":
			draw_circle(center, 10.0, Color("b08968"))
			draw_circle(center, 10.0, Color("e7c8a0"), false, 2.0)
		"window":
			draw_circle(center, 10.0, Color("5a7180"))
			draw_line(center - Vector2(9,0), center + Vector2(9,0), Color("67e8f9"), 4.0)
		"rubble":
			for offset in [Vector2(-8,5),Vector2(1,-5),Vector2(8,6),Vector2(-2,8)]:
				draw_circle(center + offset, 4.0, Color("78716c"))
		"tree":
			draw_circle(center + Vector2(0,5), 10.0, Color("14532d"))
			draw_circle(center + Vector2(-6,-2), 11.0, Color("166534"))
			draw_circle(center + Vector2(6,-3), 10.0, Color("15803d"))
		"rock":
			draw_colored_polygon(PackedVector2Array([center+Vector2(-11,7),center+Vector2(-6,-8),center+Vector2(7,-10),center+Vector2(12,5)]), Color("64748b"))
		"furnishing":
			draw_rect(Rect2(center-Vector2(11,7),Vector2(22,14)),Color("8b5a2b"),true)

func _draw_unit(unit: Dictionary) -> void:
	if int(unit.get("hp", 0)) <= 0 or unit.get("rescued", false):
		return
	if unit.get("team", "") != "human" and not resolved:
		if ai_command_active and not unit.get("visible", false):
			return
		if not ai_command_active and not unit.get("revealed", false):
			return
	var center := _hex_center(unit.cell)
	var team := String(unit.get("team", ""))
	var color := Color("2563eb") if team == "human" else Color("a855f7") if team == "alien" else Color("ef4444") if unit.get("panic", false) else Color("22d3ee") if not String(unit.get("escort_id", "")).is_empty() else Color("facc15")
	if unit.get("id", "") == selected_id:
		draw_arc(center, 19.0, 0, TAU, 32, Color("67e8f9"), 3.0)
	draw_circle(center, 14.0, Color(0.02,0.05,0.07,0.9))
	draw_circle(center, 11.0, color)
	var facing: Vector2i = unit.get("facing", Vector2i(0,-1))
	if team != "civilian":
		draw_line(center, center + Vector2(facing.x, facing.y).normalized() * 18.0, Color("f8fafc"), 3.0)
	var label := String(unit.get("callsign", unit.get("name", "Unit"))).split(" ")[0]
	draw_string(get_theme_default_font(), center + Vector2(-18, 27), label, HORIZONTAL_ALIGNMENT_CENTER, 36, 10, Color("f8fafc"))
	var health_ratio := clampf(float(unit.hp) / float(maxi(1, int(unit.max_hp))), 0.0, 1.0)
	draw_rect(Rect2(center + Vector2(-14,-21), Vector2(28,4)), Color("3f1d1d"), true)
	draw_rect(Rect2(center + Vector2(-14,-21), Vector2(28*health_ratio,4)), Color("4ade80") if health_ratio > 0.45 else Color("fb7185"), true)
