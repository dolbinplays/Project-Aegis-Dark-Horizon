class_name AegisHexRules
extends RefCounted

const EVEN_ROW := [Vector2i(1, 0), Vector2i(0, 1), Vector2i(-1, 1), Vector2i(-1, 0), Vector2i(-1, -1), Vector2i(0, -1)]
const ODD_ROW := [Vector2i(1, 0), Vector2i(1, 1), Vector2i(0, 1), Vector2i(-1, 0), Vector2i(0, -1), Vector2i(1, -1)]

static func neighbors(cell: Vector2i, width: int = 9999, height: int = 9999) -> Array[Vector2i]:
	var result: Array[Vector2i] = []
	var offsets = ODD_ROW if abs(cell.y) % 2 == 1 else EVEN_ROW
	for offset in offsets:
		var next_cell: Vector2i = cell + offset
		if next_cell.x > 0 and next_cell.y > 0 and next_cell.x < width - 1 and next_cell.y < height - 1:
			result.append(next_cell)
	return result

static func key(cell: Vector2i) -> String:
	return "%d,%d" % [cell.x, cell.y]

static func offset_to_cube(cell: Vector2i) -> Vector3i:
	var cube_x := cell.x - (cell.y - (cell.y & 1)) / 2
	var cube_z := cell.y
	var cube_y := -cube_x - cube_z
	return Vector3i(cube_x, cube_y, cube_z)

static func distance(a: Vector2i, b: Vector2i) -> int:
	var ac := offset_to_cube(a)
	var bc := offset_to_cube(b)
	return maxi(abs(ac.x - bc.x), maxi(abs(ac.y - bc.y), abs(ac.z - bc.z)))

static func cube_to_offset(cube: Vector3i) -> Vector2i:
	var row := cube.z
	var column := cube.x + (row - (row & 1)) / 2
	return Vector2i(column, row)

static func _cube_round(value: Vector3) -> Vector3i:
	var rounded := Vector3i(roundi(value.x), roundi(value.y), roundi(value.z))
	var x_difference := absf(float(rounded.x) - value.x)
	var y_difference := absf(float(rounded.y) - value.y)
	var z_difference := absf(float(rounded.z) - value.z)
	if x_difference > y_difference and x_difference > z_difference:
		rounded.x = -rounded.y - rounded.z
	elif y_difference > z_difference:
		rounded.y = -rounded.x - rounded.z
	else:
		rounded.z = -rounded.x - rounded.y
	return rounded

static func line(start: Vector2i, target: Vector2i) -> Array[Vector2i]:
	var length := distance(start, target)
	if length <= 0:
		return [start]
	var start_cube := Vector3(offset_to_cube(start))
	var target_cube := Vector3(offset_to_cube(target))
	var result: Array[Vector2i] = []
	for index in range(length + 1):
		var amount := float(index) / float(length)
		var cell := cube_to_offset(_cube_round(start_cube.lerp(target_cube, amount)))
		if result.is_empty() or result[-1] != cell:
			result.append(cell)
	return result

static func reachable(start: Vector2i, max_steps: int, blocked: Dictionary, occupied: Dictionary, width: int, height: int) -> Dictionary:
	var result := {}
	var visited := {key(start): true}
	var queue: Array = [{"cell": start, "steps": 0}]
	var head := 0
	while head < queue.size():
		var current: Dictionary = queue[head]
		head += 1
		if int(current.steps) >= max_steps:
			continue
		for next in neighbors(current.cell, width, height):
			var next_key := key(next)
			if visited.has(next_key) or blocked.has(next_key) or occupied.has(next_key):
				continue
			visited[next_key] = true
			result[next_key] = int(current.steps) + 1
			queue.append({"cell": next, "steps": int(current.steps) + 1})
	return result

static func path(start: Vector2i, target: Vector2i, blocked: Dictionary, occupied: Dictionary, width: int, height: int, max_steps: int = 64) -> Array[Vector2i]:
	if start == target:
		return [start]
	if target.x <= 0 or target.y <= 0 or target.x >= width - 1 or target.y >= height - 1:
		return []
	if blocked.has(key(target)) or occupied.has(key(target)):
		return []
	var queue: Array[Vector2i] = [start]
	var came_from := {key(start): Vector2i(-999, -999)}
	var head := 0
	while head < queue.size() and head < width * height:
		var current := queue[head]
		head += 1
		if distance(start, current) > max_steps:
			continue
		for next in neighbors(current, width, height):
			var next_key := key(next)
			if came_from.has(next_key) or blocked.has(next_key) or occupied.has(next_key):
				continue
			came_from[next_key] = current
			if next == target:
				var result: Array[Vector2i] = [target]
				var step := current
				while step != start:
					result.push_front(step)
					step = came_from[key(step)]
				result.push_front(start)
				return result
			queue.append(next)
	return []

static func deterministic_roll(seed_value: int, salt: int, minimum: int = 1, maximum: int = 100) -> int:
	var mixed: int = absi(seed_value * 1103515245 + salt * 12345 + 1013904223)
	return minimum + mixed % maxi(1, maximum - minimum + 1)
