class_name AegisTacticalBoard
extends Control

signal selection_changed(unit: Dictionary)
signal status_changed(status: Dictionary)
signal log_added(message: String)
signal battle_finished(result: Dictionary)
signal ai_command_changed(active: bool)

const GRID_WIDTH := 20
const GRID_HEIGHT := 14
const HEX_RADIUS := 27.0
const HEX_WIDTH := 46.765
const ROW_STEP := 40.5
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
const AI_MAX_MOVE_STEPS := 8
const AI_MAX_CANDIDATES := 128
const AI_MAX_TURNS := 24
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
var commander_id := ""
var commander_doctrine: Dictionary = {}

func _ready() -> void:
	custom_minimum_size = Vector2(990, 650)
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	clip_contents = true

func begin_battle(next_incident: Dictionary, next_roster: Array, next_equipment_catalog: Dictionary = {}) -> void:
	incident = next_incident.duplicate(true)
	roster = next_roster.duplicate(true)
	equipment_catalog = next_equipment_catalog.duplicate(true)
	required_rescues = maxi(0, int(incident.get("required_rescues", 1)))
	units.clear()
	covers.clear()
	extraction_cells.clear()
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
	commander_id = ""
	commander_doctrine = {}
	_generate_field()
	_emit_log("Aegis One deployed. Secure the incident and rescue at least %d civilian%s." % [required_rescues, "" if required_rescues == 1 else "s"])
	_refresh_visibility()
	_emit_state()
	queue_redraw()

func _generate_field() -> void:
	var starts := [Vector2i(4,4), Vector2i(4,5), Vector2i(4,6), Vector2i(5,4), Vector2i(5,5), Vector2i(5,6)]
	for index in range(mini(roster.size(), starts.size())):
		var source: Dictionary = roster[index]
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
			"cell": starts[index],
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
			"targeting_mode": "move",
			"facing": Vector2i(1, 0),
			"trail": [starts[index]],
			"ai_role": "",
			"kneeling": false,
			"reserve_mode": "none",
			"reserve_tu": 0
		})
	var alien_defs: Array = [
		{"name":"Signal Leech","hp":24,"accuracy":42,"damage":10,"cell":Vector2i(16,3)},
		{"name":"Glass Wraith","hp":30,"accuracy":48,"damage":12,"cell":Vector2i(17,8)},
		{"name":"Needle Drone","hp":36,"accuracy":52,"damage":13,"cell":Vector2i(14,11)}
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
			"facing": Vector2i(-1, 0)
		})
	units.append({"id":"civilian-0","name":"Mara Venn","team":"civilian","cell":Vector2i(12,5),"hp":20,"max_hp":20,"panic":false,"escort_id":"","rescued":false,"revealed":false,"visible":false})
	units.append({"id":"civilian-1","name":"Oren Pike","team":"civilian","cell":Vector2i(17,10),"hp":20,"max_hp":20,"panic":false,"escort_id":"","rescued":false,"revealed":false,"visible":false})
	_generate_building()
	_generate_cover()
	for cell in [Vector2i(1,6), Vector2i(2,6), Vector2i(3,6), Vector2i(1,7), Vector2i(2,7), Vector2i(3,7), Vector2i(1,8), Vector2i(2,8), Vector2i(3,8)]:
		extraction_cells[AegisHexRules.key(cell)] = true

func _equipment_definition(catalog_key: String, item_name: String, fallback: Dictionary) -> Dictionary:
	for definition_value in equipment_catalog.get(catalog_key, []):
		if definition_value is Dictionary and String(definition_value.get("id", "")) == item_name:
			var definition: Dictionary = definition_value.duplicate(true)
			definition.merge(fallback, false)
			return definition
	return fallback.duplicate(true)

func _generate_building() -> void:
	for x in range(10, 17):
		_add_wall(Vector2i(x, 2), "window" if x in [11, 14] else "wall")
		if x != 13:
			_add_wall(Vector2i(x, 7), "window" if x == 15 else "wall")
	for y in range(3, 7):
		_add_wall(Vector2i(10, y), "window" if y == 4 else "wall")
		_add_wall(Vector2i(16, y), "window" if y == 5 else "wall")
	for cell in [Vector2i(12,4), Vector2i(14,5), Vector2i(11,6)]:
		covers[AegisHexRules.key(cell)] = {"cell":cell,"type":"furnishing","hard":false,"hp":18,"max_hp":18}

func _add_wall(cell: Vector2i, wall_type: String) -> void:
	covers[AegisHexRules.key(cell)] = {"cell":cell,"type":wall_type,"hard":true,"hp":50 if wall_type == "wall" else 34,"max_hp":50 if wall_type == "wall" else 34,"building":"outpost"}

func _generate_cover() -> void:
	var seed_value := int(incident.get("seed", 1337))
	for index in range(22):
		var x := 6 + AegisHexRules.deterministic_roll(seed_value, index * 7, 0, 12)
		var y := AegisHexRules.deterministic_roll(seed_value, index * 11, 1, 12)
		var cell := Vector2i(x, y)
		var key := AegisHexRules.key(cell)
		if covers.has(key) or _unit_at(cell) != null or extraction_cells.has(key):
			continue
		covers[key] = {"cell":cell,"type":"tree" if index % 3 else "rock","hard":false,"hp":18,"max_hp":18}

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
	reachable = AegisHexRules.reachable(selected.cell, steps, _blocked_cells(), _occupied_cells(selected.id), GRID_WIDTH, GRID_HEIGHT)

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
		"right_hand":selected.get("weapon", "Unarmed"),
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
		"kneeling":bool(selected.get("kneeling", false)),
		"reserve_mode":String(selected.get("reserve_mode", "none"))
	}

func set_selected_active_hand(hand: String) -> bool:
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human" or resolved:
		return false
	var normalized := "left" if hand == "left" else "right"
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
	for neighbor in AegisHexRules.neighbors(target, GRID_WIDTH, GRID_HEIGHT):
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
	var path := AegisHexRules.path(selected.cell, target, _blocked_cells(), _occupied_cells(selected.id), GRID_WIDTH, GRID_HEIGHT, int(selected.tu) / MOVE_TU)
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
	else:
		_emit_log("%s missed %s." % [shooter.callsign, target.name])
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
	for neighbor in AegisHexRules.neighbors(cell, GRID_WIDTH, GRID_HEIGHT):
		var cover: Dictionary = covers.get(AegisHexRules.key(neighbor), {})
		if int(cover.get("hp", 0)) <= 0:
			continue
		score = maxi(score, 24 if cover.get("hard", false) else 8)
	return score

func _cell_from_key(cell_key: String) -> Vector2i:
	var parts := cell_key.split(",")
	return Vector2i(int(parts[0]), int(parts[1]))

func _ai_movement_plan(unit: Dictionary, target_cell: Vector2i, reserve_tu: int, role: String, alien_move: bool = false, target_known: bool = true) -> Dictionary:
	var available_steps := clampi((int(unit.get("tu", 0)) - maxi(0, reserve_tu)) / MOVE_TU, 0, AI_MAX_MOVE_STEPS)
	if available_steps <= 0:
		return {"cell":unit.get("cell", Vector2i.ZERO),"path":[unit.get("cell", Vector2i.ZERO)],"steps":0,"reserve":reserve_tu}
	var reachable_cells := AegisHexRules.reachable(unit.cell, available_steps, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), GRID_WIDTH, GRID_HEIGHT)
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
	for candidate_value in candidates:
		var candidate: Dictionary = candidate_value
		var cell: Vector2i = candidate.cell
		var distance_to_target := AegisHexRules.distance(cell, target_cell)
		var score := float(_cover_score(cell))
		score += float(origin_distance - distance_to_target) * (6.0 if target_known else 4.0)
		score += float(candidate.steps) * (3.0 if not target_known else 0.8)
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
	var path := AegisHexRules.path(unit.cell, best.cell, _blocked_cells(), _occupied_cells(String(unit.get("id", ""))), GRID_WIDTH, GRID_HEIGHT, available_steps)
	return {"cell":best.cell,"path":path,"steps":maxi(0, path.size() - 1),"reserve":reserve_tu,"score":best_score}

func _apply_ai_movement(unit: Dictionary, plan: Dictionary) -> void:
	var path: Array = plan.get("path", [])
	if path.size() < 2:
		return
	var old_cell: Vector2i = unit.cell
	unit.cell = plan.get("cell", unit.cell)
	unit.tu = maxi(0, int(unit.get("tu", 0)) - int(plan.get("steps", 0)) * MOVE_TU)
	unit.facing = unit.cell - old_cell
	var trail: Array = unit.get("trail", [])
	for step in path:
		trail.push_front(step)
	if trail.size() > 20:
		trail.resize(20)
	unit.trail = trail
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
	var sweep_x := clampi(10 + turn_number * 2, 10, GRID_WIDTH - 2)
	return Vector2i(sweep_x, clampi(GRID_HEIGHT / 2 + y_offset, 1, GRID_HEIGHT - 2))

func _ai_contact_civilian(soldier: Dictionary, civilian: Dictionary) -> bool:
	if AegisHexRules.distance(soldier.cell, civilian.cell) > 1 or int(soldier.get("tu", 0)) < ESCORT_TU:
		return false
	var followers := units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
	if followers.size() >= 4:
		return false
	soldier.tu = int(soldier.tu) - ESCORT_TU
	action_serial += 1
	var follows: bool = not bool(civilian.get("panic", false)) or AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial + turn_number * 17) > 45
	civilian.revealed = true
	if follows:
		civilian.panic = false
		civilian.escort_id = soldier.id
		_emit_log("%s takes %s into the evacuation column." % [soldier.callsign, civilian.name])
	else:
		_emit_log("%s cannot calm %s on the first attempt." % [soldier.callsign, civilian.name])
	return follows

func _run_ai_human_turn() -> void:
	if resolved or phase != "human":
		return
	var commander := _select_ai_commander()
	_assign_ai_roles(commander)
	var soldiers := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	soldiers.sort_custom(func(left, right):
		if left.get("id", "") == commander_id:
			return false
		if right.get("id", "") == commander_id:
			return true
		return String(left.get("id", "")) < String(right.get("id", ""))
	)
	var claimed_civilians := {}
	for soldier in soldiers:
		if resolved:
			break
		var reserve_tu := maxi(0, int(soldier.get("fire_tu", FIRE_TU)))
		var followers := units.filter(func(unit): return unit.get("team", "") == "civilian" and unit.get("escort_id", "") == soldier.get("id", "") and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
		var rescue_target: Variant = null
		if not followers.is_empty():
			rescue_target = {"cell":_nearest_extraction_cell(soldier.cell),"ramp":true}
		elif rescued < required_rescues:
			var civilians := units.filter(func(unit): return unit.get("team", "") == "civilian" and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false) and (unit.get("visible", false) or not units.any(func(alien): return alien.get("team", "") == "alien" and int(alien.get("hp", 0)) > 0)) and not claimed_civilians.has(unit.get("id", "")))
			civilians.sort_custom(func(left, right): return AegisHexRules.distance(left.cell, soldier.cell) < AegisHexRules.distance(right.cell, soldier.cell))
			if not civilians.is_empty():
				rescue_target = civilians[0]
				claimed_civilians[rescue_target.get("id", "")] = true
		if rescue_target != null:
			if not rescue_target.get("ramp", false) and _ai_contact_civilian(soldier, rescue_target):
				followers = [rescue_target]
				rescue_target = {"cell":_nearest_extraction_cell(soldier.cell),"ramp":true}
			var rescue_plan := _ai_movement_plan(soldier, rescue_target.cell, reserve_tu, String(soldier.get("ai_role", "")), false, true)
			_apply_ai_movement(soldier, rescue_plan)
			if not rescue_target.get("ramp", false):
				_ai_contact_civilian(soldier, rescue_target)
		var visible_aliens := units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0 and unit.get("visible", false))
		var combat_target: Variant = null
		if not visible_aliens.is_empty():
			visible_aliens.sort_custom(func(left, right): return AegisHexRules.distance(left.cell, soldier.cell) < AegisHexRules.distance(right.cell, soldier.cell))
			combat_target = visible_aliens[0]
		if combat_target == null and rescue_target == null:
			var exploration_cell := _ai_exploration_cell(soldier)
			var explore_plan := _ai_movement_plan(soldier, exploration_cell, reserve_tu, String(soldier.get("ai_role", "")), false, false)
			_apply_ai_movement(soldier, explore_plan)
			visible_aliens = units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0 and unit.get("visible", false))
			if not visible_aliens.is_empty():
				visible_aliens.sort_custom(func(left, right): return AegisHexRules.distance(left.cell, soldier.cell) < AegisHexRules.distance(right.cell, soldier.cell))
				combat_target = visible_aliens[0]
		elif combat_target != null and rescue_target == null:
			var combat_plan := _ai_movement_plan(soldier, combat_target.cell, reserve_tu, String(soldier.get("ai_role", "")), false, true)
			_apply_ai_movement(soldier, combat_plan)
		if combat_target != null and int(combat_target.get("hp", 0)) > 0 and AegisHexRules.distance(soldier.cell, combat_target.cell) <= int(soldier.get("weapon_range", 0)) and _has_line_of_sight_from(soldier.cell, combat_target.cell):
			_try_shoot_unit(soldier, combat_target)
		await get_tree().create_timer(0.06).timeout
	selected_id = ""
	reachable.clear()
	_emit_state()

func take_ai_command() -> void:
	if resolved or ai_command_busy:
		return
	ai_command_active = true
	ai_command_busy = true
	ai_command_changed.emit(true)
	_emit_log("AI COMMAND: %s. Live battlefield state retained." % ai_command_summary())
	while not resolved and ai_command_active and turn_number <= AI_MAX_TURNS:
		if phase == "human":
			await _run_ai_human_turn()
			if not resolved:
				await end_human_turn()
		else:
			await get_tree().create_timer(0.05).timeout
	if not resolved and turn_number > AI_MAX_TURNS:
		_emit_log("AI command paused at the bounded turn limit.")
	ai_command_active = false
	ai_command_busy = false
	ai_command_changed.emit(false)
	_emit_state()

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
				await get_tree().create_timer(0.06).timeout
			if int(alien.get("hp", 0)) <= 0:
				if _check_resolution():
					return
				continue
			distance = AegisHexRules.distance(alien.cell, target.cell)
			can_fire = distance <= int(alien.get("weapon_range", 5)) and _has_line_of_sight_from(alien.cell, target.cell)
		if can_fire and int(alien.get("tu", 0)) >= int(alien.get("fire_tu", FIRE_TU)):
			_alien_shoot(alien, target, distance)
		_refresh_visibility()
		await get_tree().create_timer(0.12).timeout
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
		var options := AegisHexRules.neighbors(civilian.cell, GRID_WIDTH, GRID_HEIGHT).filter(func(cell): return not _blocked_cells().has(AegisHexRules.key(cell)) and not _occupied_cells(civilian.id).has(AegisHexRules.key(cell)))
		options.sort_custom(func(a, b): return AegisHexRules.distance(a, nearest.cell) > AegisHexRules.distance(b, nearest.cell))
		if not options.is_empty():
			civilian.cell = options[0]
			_emit_log("%s runs in panic." % civilian.name)
		if AegisHexRules.distance(civilian.cell, nearest.cell) > 7:
			civilian.panic = false
			_emit_log("%s recovers after escaping the threat." % civilian.name)

func _refresh_visibility() -> void:
	var soldiers := units.filter(func(unit): return unit.get("team", "") == "human" and int(unit.get("hp", 0)) > 0)
	for unit in units:
		if unit.get("team", "") == "human":
			unit.visible = true
			continue
		unit.visible = false
		for soldier in soldiers:
			if AegisHexRules.distance(unit.cell, soldier.cell) <= 7 and _has_line_of_sight_from(soldier.cell, unit.cell):
				unit.visible = true
				unit.revealed = true
				break

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
	status_changed.emit({"phase":phase,"turn":turn_number,"aliens":living_aliens,"rescued":rescued,"required":required_rescues,"civilians":active_civilians,"resolved":resolved})
	var selected: Variant = _selected_unit()
	selection_changed.emit(selected if selected != null else {})

func _inside(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.y >= 0 and cell.x < GRID_WIDTH and cell.y < GRID_HEIGHT

func _hex_center(cell: Vector2i) -> Vector2:
	return board_origin + Vector2(cell.x * HEX_WIDTH + (HEX_WIDTH * 0.5 if cell.y % 2 else 0.0), cell.y * ROW_STEP)

func _cell_at(point: Vector2) -> Vector2i:
	var best := Vector2i(-1, -1)
	var best_distance := HEX_RADIUS
	for y in range(GRID_HEIGHT):
		for x in range(GRID_WIDTH):
			var cell := Vector2i(x, y)
			var distance := point.distance_to(_hex_center(cell))
			if distance < best_distance:
				best = cell
				best_distance = distance
	return best

func _hex_points(center: Vector2, radius: float = HEX_RADIUS - 1.0) -> PackedVector2Array:
	var points := PackedVector2Array()
	for index in range(6):
		var angle := deg_to_rad(60.0 * index - 30.0)
		points.append(center + Vector2(cos(angle), sin(angle)) * radius)
	return points

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color("081418"), true)
	for y in range(GRID_HEIGHT):
		for x in range(GRID_WIDTH):
			_draw_hex(Vector2i(x, y))
	_draw_skyranger()
	_draw_connected_walls()
	for cover in covers.values():
		_draw_cover(cover)
	for unit in units:
		_draw_unit(unit)
	if resolved:
		draw_rect(Rect2(Vector2(250, 265), Vector2(520, 115)), Color(0.02,0.06,0.07,0.9), true)
		draw_rect(Rect2(Vector2(250, 265), Vector2(520, 115)), Color("67e8f9"), false, 2.0)
		draw_string(get_theme_default_font(), Vector2(350, 315), "TACTICAL %s" % ("VICTORY" if rescued >= required_rescues else "DEFEAT"), HORIZONTAL_ALIGNMENT_LEFT, -1, 26, Color("fef3c7"))
		draw_string(get_theme_default_font(), Vector2(325, 350), "%d civilian%s rescued - %d turns" % [rescued, "" if rescued == 1 else "s", turn_number], HORIZONTAL_ALIGNMENT_LEFT, -1, 17, Color("d1fae5"))

func _draw_hex(cell: Vector2i) -> void:
	var center := _hex_center(cell)
	var terrain_roll: int = absi(cell.x * 17 + cell.y * 31 + int(incident.get("seed", 1))) % 9
	var color := Color("355f3b") if terrain_roll < 4 else Color("426c3b") if terrain_roll < 7 else Color("765f3f")
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
	draw_polyline(points + PackedVector2Array([points[0]]), Color(0.55,0.72,0.70,0.32), 1.0, true)
	if reachable.has(AegisHexRules.key(cell)):
		draw_polyline(points + PackedVector2Array([points[0]]), Color("a3e635"), 2.0, true)
	if targetable:
		draw_polyline(points + PackedVector2Array([points[0]]), Color("f59e0b") if targeting_mode == "grenade" else Color("fb7185"), 2.0, true)
	if targetable and cell == hovered_cell:
		draw_line(_hex_center(selected.cell), center, Color("fbbf24") if targeting_mode == "grenade" else Color("f87171"), 2.0, true)

func _draw_skyranger() -> void:
	var hull_points := PackedVector2Array([
		_hex_center(Vector2i(0,5)) + Vector2(-22,-10),
		_hex_center(Vector2i(3,5)) + Vector2(18,-20),
		_hex_center(Vector2i(4,7)) + Vector2(12,0),
		_hex_center(Vector2i(3,9)) + Vector2(18,20),
		_hex_center(Vector2i(0,9)) + Vector2(-22,10)
	])
	draw_colored_polygon(hull_points, Color("334b55"))
	draw_polyline(hull_points + PackedVector2Array([hull_points[0]]), Color("94a3b8"), 3.0, true)
	var canopy := PackedVector2Array([_hex_center(Vector2i(0,6)),_hex_center(Vector2i(2,6)),_hex_center(Vector2i(2,8)),_hex_center(Vector2i(0,8))])
	draw_colored_polygon(canopy, Color("155e75"))
	for cell_key in extraction_cells:
		var parts := String(cell_key).split(",")
		var cell := Vector2i(int(parts[0]), int(parts[1]))
		draw_string(get_theme_default_font(), _hex_center(cell) + Vector2(-16, 5), "RAMP", HORIZONTAL_ALIGNMENT_LEFT, -1, 9, Color("cffafe"))

func _draw_connected_walls() -> void:
	for key in covers:
		var cover: Dictionary = covers[key]
		if not cover.get("hard", false) or cover.get("building", "") != "outpost":
			continue
		for neighbor in AegisHexRules.neighbors(cover.cell, GRID_WIDTH, GRID_HEIGHT):
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
