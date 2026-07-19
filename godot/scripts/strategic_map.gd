class_name AegisStrategicMap
extends Control

signal region_selected(region: Dictionary)
signal incident_selected(incident: Dictionary)
signal ufo_selected(ufo: Dictionary)

var regions: Array = []
var incidents: Array = []
var ufos: Array = []
var selected_region := "North America"
var selected_incident_id := ""
var selected_ufo_id := ""
var base_region := ""
var travel_progress := -1
var interception: Dictionary = {}
var hovered_region := ""
var hovered_incident_id := ""

func _ready() -> void:
	custom_minimum_size = Vector2(700, 470)
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	set_process(true)

func configure(next_regions: Array, next_incidents: Array, next_ufos: Array = []) -> void:
	regions = next_regions
	incidents = next_incidents
	ufos = next_ufos
	queue_redraw()

func _process(_delta: float) -> void:
	queue_redraw()

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion:
		var hovered_incident := _incident_at(event.position)
		hovered_incident_id = hovered_incident.get("id", "")
		hovered_region = "" if not hovered_incident.is_empty() else _region_at(event.position).get("name", "")
		queue_redraw()
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		var clicked_ufo := _ufo_at(event.position)
		if not clicked_ufo.is_empty():
			selected_ufo_id = clicked_ufo.get("id", "")
			ufo_selected.emit(clicked_ufo)
			queue_redraw()
			accept_event()
			return
		var clicked_incident := _incident_at(event.position)
		if not clicked_incident.is_empty():
			selected_incident_id = clicked_incident.get("id", "")
			incident_selected.emit(clicked_incident)
			queue_redraw()
			accept_event()
			return
		var clicked_region := _region_at(event.position)
		if not clicked_region.is_empty():
			selected_region = clicked_region.get("name", "")
			region_selected.emit(clicked_region)
			queue_redraw()
			accept_event()

func _draw() -> void:
	var bounds := Rect2(Vector2.ZERO, size)
	draw_rect(bounds, Color("101820"), true)
	_draw_grid(bounds)
	_draw_world_shape(bounds)
	for region in regions:
		_draw_region(region)
	for incident in incidents:
		_draw_incident(incident)
	for ufo in ufos:
		_draw_ufo(ufo)
	if not base_region.is_empty():
		_draw_base_and_route()

func _draw_grid(bounds: Rect2) -> void:
	var grid_color := Color(0.16, 0.34, 0.39, 0.24)
	for x in range(0, int(bounds.size.x) + 1, 48):
		draw_line(Vector2(x, 0), Vector2(x, bounds.size.y), grid_color, 1.0)
	for y in range(0, int(bounds.size.y) + 1, 48):
		draw_line(Vector2(0, y), Vector2(bounds.size.x, y), grid_color, 1.0)

func _draw_world_shape(bounds: Rect2) -> void:
	var ocean := Color("102b35")
	draw_circle(bounds.size * Vector2(0.5, 0.52), minf(bounds.size.x * 0.43, bounds.size.y * 0.47), ocean)
	var land := Color("2d594a")
	var coast := Color("65a77c")
	var shapes := [
		PackedVector2Array([Vector2(0.10,0.20),Vector2(0.33,0.16),Vector2(0.40,0.31),Vector2(0.31,0.48),Vector2(0.15,0.43)]),
		PackedVector2Array([Vector2(0.31,0.50),Vector2(0.43,0.55),Vector2(0.39,0.87),Vector2(0.28,0.73)]),
		PackedVector2Array([Vector2(0.46,0.21),Vector2(0.60,0.20),Vector2(0.66,0.31),Vector2(0.58,0.40),Vector2(0.47,0.34)]),
		PackedVector2Array([Vector2(0.46,0.40),Vector2(0.62,0.39),Vector2(0.66,0.70),Vector2(0.51,0.79),Vector2(0.43,0.56)]),
		PackedVector2Array([Vector2(0.62,0.20),Vector2(0.89,0.18),Vector2(0.93,0.49),Vector2(0.78,0.58),Vector2(0.65,0.42)]),
		PackedVector2Array([Vector2(0.76,0.65),Vector2(0.92,0.64),Vector2(0.94,0.82),Vector2(0.80,0.86)])
	]
	for normalized_shape in shapes:
		var points := PackedVector2Array()
		for point in normalized_shape:
			points.append(point * bounds.size)
		draw_colored_polygon(points, land)
		draw_polyline(points + PackedVector2Array([points[0]]), coast, 2.0, true)

func _draw_region(region: Dictionary) -> void:
	var point := _map_point(region.get("map", [0.5, 0.5]))
	var name := String(region.get("name", "Region"))
	var active := name == selected_region
	var hover := name == hovered_region
	var radius := 11.0 if active else 8.0
	var color := Color("67e8f9") if active else Color("a7f3d0") if hover else Color("d1fae5")
	draw_circle(point, radius + 4.0, Color(0.04, 0.1, 0.12, 0.8))
	draw_circle(point, radius, color)
	draw_string(get_theme_default_font(), point + Vector2(15, 5), name, HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color("e5f4ef"))

func _draw_incident(incident: Dictionary) -> void:
	var region := _region_named(incident.get("region", ""))
	if region.is_empty():
		return
	var point := _incident_point(incident)
	var pulse := 3.0 + sin(Time.get_ticks_msec() / 220.0) * 2.0
	var selected: bool = incident.get("id", "") == selected_incident_id
	draw_circle(point, 13.0 + pulse, Color(0.96, 0.25, 0.20, 0.13))
	draw_circle(point, 9.0, Color("fb7185") if not selected else Color("fbbf24"))
	if selected or incident.get("id", "") == hovered_incident_id:
		var incident_name := String(incident.get("name", "Incident"))
		draw_string(get_theme_default_font(), _bounded_marker_label_position(point, incident_name, -10.0, 13), incident_name, HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("ffe4e6"))

func _draw_ufo(ufo: Dictionary) -> void:
	if ufo.get("status", "") not in ["Tracked", "Damaged"]:
		return
	var point := _ufo_point(ufo)
	var pulse := 4.0 + sin(Time.get_ticks_msec() / 180.0) * 2.0
	var selected: bool = ufo.get("id", "") == selected_ufo_id
	draw_circle(point, 15.0 + pulse, Color(0.96, 0.62, 0.12, 0.13))
	var diamond := PackedVector2Array([point + Vector2(0,-10), point + Vector2(12,0), point + Vector2(0,10), point + Vector2(-12,0)])
	draw_colored_polygon(diamond, Color("fbbf24") if selected else Color("fb923c"))
	draw_polyline(diamond + PackedVector2Array([diamond[0]]), Color("fff7ed"), 2.0, true)
	var ufo_name := String(ufo.get("name", "UFO contact"))
	draw_string(get_theme_default_font(), _bounded_marker_label_position(point, ufo_name, 5.0, 13), ufo_name, HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("ffedd5"))

func _bounded_marker_label_position(point: Vector2, marker_text: String, y_offset: float, font_size: int) -> Vector2:
	var font := get_theme_default_font()
	var text_width := font.get_string_size(marker_text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size).x
	var x_position := point.x + 16.0
	if x_position + text_width > size.x - 8.0:
		x_position = point.x - text_width - 16.0
	return Vector2(maxf(8.0, x_position), point.y + y_offset)

func _draw_base_and_route() -> void:
	var region := _region_named(base_region)
	if region.is_empty():
		return
	var point := _map_point(region.get("map", [0.5, 0.5]))
	draw_circle(point, 16.0, Color(0.22, 0.83, 0.96, 0.18))
	draw_circle(point, 6.0, Color("38bdf8"))
	draw_line(point - Vector2(10, 0), point + Vector2(10, 0), Color.WHITE, 2.0)
	draw_line(point - Vector2(0, 10), point + Vector2(0, 10), Color.WHITE, 2.0)
	if not interception.is_empty():
		var ufo := _ufo_by_id(interception.get("ufo_id", ""))
		if ufo.is_empty():
			return
		var target := _ufo_point(ufo)
		draw_dashed_line(point, target, Color("fbbf24"), 2.0, 8.0)
		var ratio := clampf(float(interception.get("progress", 0)) / 100.0, 0.0, 1.0)
		if interception.get("phase", "") == "returning":
			ratio = 1.0 - ratio
		var craft := point.lerp(target, ratio)
		draw_colored_polygon(PackedVector2Array([craft + Vector2(11,0), craft + Vector2(-8,-7), craft + Vector2(-4,0), craft + Vector2(-8,7)]), Color("fbbf24"))
		return
	if travel_progress < 0:
		return
	var incident := _incident_by_id(selected_incident_id)
	var incident_region := _region_named(incident.get("region", ""))
	if incident_region.is_empty():
		return
	var target := _incident_point(incident)
	draw_dashed_line(point, target, Color("7dd3fc"), 2.0, 8.0)
	var craft := point.lerp(target, clampf(float(travel_progress) / 100.0, 0.0, 1.0))
	draw_colored_polygon(PackedVector2Array([craft + Vector2(10,0), craft + Vector2(-7,-6), craft + Vector2(-4,0), craft + Vector2(-7,6)]), Color("f8fafc"))

func _map_point(normalized) -> Vector2:
	return Vector2(float(normalized[0]), float(normalized[1])) * size

func _region_named(name: String) -> Dictionary:
	for region in regions:
		if region.get("name", "") == name:
			return region
	return {}

func _incident_by_id(incident_id: String) -> Dictionary:
	for incident in incidents:
		if incident.get("id", "") == incident_id:
			return incident
	return {}

func _incident_point(incident: Dictionary) -> Vector2:
	var region := _region_named(incident.get("region", ""))
	if region.is_empty():
		return size * Vector2(0.5, 0.5)
	var same_region: Array = incidents.filter(func(candidate): return candidate.get("region", "") == incident.get("region", ""))
	var incident_index := 0
	for index in range(same_region.size()):
		if same_region[index].get("id", "") == incident.get("id", ""):
			incident_index = index
			break
	var offsets := [
		Vector2(44, -42), Vector2(-44, -42),
		Vector2(52, -12), Vector2(-52, -12),
		Vector2(52, 20), Vector2(-52, 20),
		Vector2(42, 50), Vector2(-42, 50)
	]
	var ring_index := incident_index / offsets.size()
	var offset: Vector2 = offsets[incident_index % offsets.size()]
	if ring_index > 0:
		offset *= 1.0 + float(ring_index) * 0.55
	var point := _map_point(region.get("map", [0.5, 0.5])) + offset
	return Vector2(clampf(point.x, 18.0, size.x - 18.0), clampf(point.y, 18.0, size.y - 18.0))

func _ufo_by_id(ufo_id: String) -> Dictionary:
	for ufo in ufos:
		if ufo.get("id", "") == ufo_id:
			return ufo
	return {}

func _ufo_point(ufo: Dictionary) -> Vector2:
	var region := _region_named(ufo.get("region", ""))
	if region.is_empty():
		return size * Vector2(0.5, 0.5)
	var offset_seed: int = absi(String(ufo.get("id", "")).hash()) % 3
	return _map_point(region.get("map", [0.5, 0.5])) + Vector2(-34 - offset_seed * 10, 28 + offset_seed * 8)

func _region_at(mouse_position: Vector2) -> Dictionary:
	for region in regions:
		if mouse_position.distance_to(_map_point(region.get("map", [0.5, 0.5]))) <= 30.0:
			return region
	return {}

func _incident_at(mouse_position: Vector2) -> Dictionary:
	for incident in incidents:
		if mouse_position.distance_to(_incident_point(incident)) <= 22.0:
			return incident
	return {}

func _ufo_at(mouse_position: Vector2) -> Dictionary:
	for ufo in ufos:
		if ufo.get("status", "") in ["Tracked", "Damaged"] and mouse_position.distance_to(_ufo_point(ufo)) <= 24.0:
			return ufo
	return {}
