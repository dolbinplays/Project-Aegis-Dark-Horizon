class_name AegisTacticalBoard
extends Control

signal selection_changed(unit: Dictionary)
signal status_changed(status: Dictionary)
signal log_added(message: String)
signal battle_finished(result: Dictionary)

const GRID_WIDTH := 20
const GRID_HEIGHT := 14
const HEX_RADIUS := 27.0
const HEX_WIDTH := 46.765
const ROW_STEP := 40.5
const MOVE_TU := 4
const FIRE_TU := 16
const ESCORT_TU := 8

var incident: Dictionary = {}
var roster: Array = []
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

func _ready() -> void:
	custom_minimum_size = Vector2(990, 650)
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	clip_contents = true

func begin_battle(next_incident: Dictionary, next_roster: Array) -> void:
	incident = next_incident.duplicate(true)
	roster = next_roster.duplicate(true)
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
	_generate_field()
	_emit_log("Aegis One deployed. Secure the incident and rescue at least %d civilian%s." % [required_rescues, "" if required_rescues == 1 else "s"])
	_refresh_visibility()
	_emit_state()
	queue_redraw()

func _generate_field() -> void:
	var starts := [Vector2i(4,4), Vector2i(4,5), Vector2i(4,6), Vector2i(5,4), Vector2i(5,5), Vector2i(5,6)]
	for index in range(mini(roster.size(), starts.size())):
		var source: Dictionary = roster[index]
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
			"kills": 0,
			"weapon": source.get("weapon", "Ballistic Rifle"),
			"facing": Vector2i(1, 0),
			"trail": [starts[index]]
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
			"revealed": false,
			"facing": Vector2i(-1, 0)
		})
	units.append({"id":"civilian-0","name":"Mara Venn","team":"civilian","cell":Vector2i(12,5),"hp":20,"max_hp":20,"panic":false,"escort_id":"","rescued":false,"revealed":false})
	units.append({"id":"civilian-1","name":"Oren Pike","team":"civilian","cell":Vector2i(17,10),"hp":20,"max_hp":20,"panic":false,"escort_id":"","rescued":false,"revealed":false})
	_generate_building()
	_generate_cover()
	for cell in [Vector2i(1,6), Vector2i(2,6), Vector2i(3,6), Vector2i(1,7), Vector2i(2,7), Vector2i(3,7), Vector2i(1,8), Vector2i(2,8), Vector2i(3,8)]:
		extraction_cells[AegisHexRules.key(cell)] = true

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
	if clicked_unit != null and clicked_unit.get("team", "") == "civilian" and int(clicked_unit.get("hp", 0)) > 0 and not clicked_unit.get("rescued", false):
		_try_contact_civilian(selected, clicked_unit)
		return
	if clicked_unit != null and clicked_unit.get("team", "") == "alien" and int(clicked_unit.get("hp", 0)) > 0 and clicked_unit.get("revealed", false):
		_try_shoot_unit(selected, clicked_unit)
		return
	var cover: Dictionary = covers.get(AegisHexRules.key(cell), {})
	if not cover.is_empty() and cover.get("hard", false):
		_try_shoot_cover(selected, cover)
		return
	if reachable.has(AegisHexRules.key(cell)):
		_move_selected_to(selected, cell)

func _select_unit(unit_id: String) -> void:
	selected_id = unit_id
	var selected: Variant = _selected_unit()
	_rebuild_reachable()
	selection_changed.emit(selected if selected != null else {})
	_emit_state()
	queue_redraw()

func _rebuild_reachable() -> void:
	reachable.clear()
	var selected: Variant = _selected_unit()
	if selected == null or phase != "human":
		return
	var steps := int(selected.get("tu", 0)) / MOVE_TU
	reachable = AegisHexRules.reachable(selected.cell, steps, _blocked_cells(), _occupied_cells(selected.id), GRID_WIDTH, GRID_HEIGHT)

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
	var range := AegisHexRules.distance(shooter.cell, target.cell)
	if range > 7:
		_emit_log("Target is outside rifle range.")
		return
	if int(shooter.tu) < FIRE_TU:
		_emit_log("%s needs %d TU to fire." % [shooter.callsign, FIRE_TU])
		return
	shooter.tu = int(shooter.tu) - FIRE_TU
	action_serial += 1
	var chance := clampi(int(shooter.accuracy) - range * 4, 18, 92)
	var roll := AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial * 23 + turn_number * 31)
	if roll <= chance:
		var damage := 17 + AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial * 41, 0, 8)
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
	var range := AegisHexRules.distance(shooter.cell, cover.cell)
	if range > 8 or int(shooter.tu) < FIRE_TU:
		_emit_log("That breach shot requires rifle range and %d TU." % FIRE_TU)
		return
	shooter.tu = int(shooter.tu) - FIRE_TU
	var damage := 26
	cover.hp = maxi(0, int(cover.hp) - damage)
	if int(cover.hp) <= 0:
		cover.type = "rubble"
		cover.hard = false
		_emit_log("%s destroyed the wall. The breach is now traversable." % shooter.callsign)
	else:
		_emit_log("%s damaged the wall (%d/%d)." % [shooter.callsign, cover.hp, cover.max_hp])
	_rebuild_reachable()
	_emit_state()
	queue_redraw()

func end_human_turn() -> void:
	if resolved or phase != "human":
		return
	phase = "alien"
	selected_id = ""
	reachable.clear()
	selection_changed.emit({})
	_emit_state()
	queue_redraw()
	await get_tree().create_timer(0.22).timeout
	_run_alien_turn()

func _run_alien_turn() -> void:
	for alien in units.filter(func(unit): return unit.get("team", "") == "alien" and int(unit.get("hp", 0)) > 0):
		var targets := units.filter(func(unit): return unit.get("team", "") in ["human", "civilian"] and int(unit.get("hp", 0)) > 0 and not unit.get("rescued", false))
		if targets.is_empty():
			break
		targets.sort_custom(func(a, b): return AegisHexRules.distance(a.cell, alien.cell) < AegisHexRules.distance(b.cell, alien.cell))
		var target: Dictionary = targets[0]
		var distance := AegisHexRules.distance(alien.cell, target.cell)
		if distance <= 5:
			_alien_shoot(alien, target, distance)
		else:
			var path := AegisHexRules.path(alien.cell, target.cell, _blocked_cells(), _occupied_cells(alien.id, target.id), GRID_WIDTH, GRID_HEIGHT, 40)
			if path.size() > 1:
				var step_index := mini(2, path.size() - 2)
				alien.facing = path[step_index] - alien.cell
				alien.cell = path[step_index]
				_emit_log("%s advances through the incident." % alien.name)
		_refresh_visibility()
		await get_tree().create_timer(0.16).timeout
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
	action_serial += 1
	var chance := clampi(int(alien.accuracy) - distance * 4, 14, 84)
	var roll := AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), 700 + action_serial * 29 + turn_number * 43)
	if roll > chance:
		_emit_log("%s fires and misses %s." % [alien.name, target.name])
		return
	var damage := int(alien.damage) + AegisHexRules.deterministic_roll(int(incident.get("seed", 1)), action_serial * 13, 0, 5)
	target.hp = maxi(0, int(target.hp) - damage)
	_emit_log("%s hit %s for %d damage." % [alien.name, target.name, damage])
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
			continue
		for soldier in soldiers:
			if AegisHexRules.distance(unit.cell, soldier.cell) <= 7:
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
		soldier_results[soldier.id] = {"hp": soldier.hp, "kills": soldier.kills}
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
	if cell == hovered_cell:
		color = color.lightened(0.12)
	var points := _hex_points(center)
	draw_colored_polygon(points, color)
	draw_polyline(points + PackedVector2Array([points[0]]), Color(0.55,0.72,0.70,0.32), 1.0, true)
	if reachable.has(AegisHexRules.key(cell)):
		draw_polyline(points + PackedVector2Array([points[0]]), Color("a3e635"), 2.0, true)

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
	if unit.get("team", "") != "human" and not unit.get("revealed", false) and not resolved:
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
