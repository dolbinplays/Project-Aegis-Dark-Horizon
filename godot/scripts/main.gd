extends Control

const NATIVE_BUILD := "v0.26.07.18.GODOT.0005_BASE_PERSONNEL_AND_RESEARCH_STAFFING_VERTICAL_SLICE"
const MAX_BROWSER_IMPORT_BYTES := 32 * 1024 * 1024

var content: Dictionary = {}
var campaign := AegisCampaignState.new()
var ui_root: Control
var music_player: AudioStreamPlayer
var sfx_player: AudioStreamPlayer
var music_enabled := true
var current_tab := "geoscape"
var selected_setup_region := "North America"
var base_name_input: LineEdit
var tactical_board: AegisTacticalBoard
var tactical_result: Dictionary = {}
var tactical_status_label: Label
var tactical_selection_label: Label
var tactical_log_box: VBoxContainer
var tactical_end_turn_button: Button
var tactical_return_button: Button
var command_content: Control

var color_bg := Color("071317")
var color_surface := Color("101f26")
var color_surface_alt := Color("162b32")
var color_border := Color("2b5964")
var color_cyan := Color("67e8f9")
var color_text := Color("e6f3f4")
var color_muted := Color("9bb4ba")
var color_gold := Color("fbbf24")
var color_green := Color("4ade80")
var color_red := Color("fb7185")

func _ready() -> void:
	content = _load_json("res://godot/data/content.json")
	campaign.configure(content)
	theme = _build_theme()
	_create_audio()
	ui_root = Control.new()
	ui_root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(ui_root)
	_show_start()

func _load_json(path: String) -> Dictionary:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		push_error("Could not load Aegis content: %s" % path)
		return {}
	var parsed = JSON.parse_string(file.get_as_text())
	return parsed if parsed is Dictionary else {}

func _create_audio() -> void:
	music_player = AudioStreamPlayer.new()
	music_player.name = "MusicPlayer"
	music_player.bus = &"Music"
	add_child(music_player)
	sfx_player = AudioStreamPlayer.new()
	sfx_player.name = "SfxPlayer"
	sfx_player.bus = &"SFX"
	add_child(sfx_player)

func _set_music(track: String) -> void:
	if not music_enabled:
		music_player.stop()
		return
	var paths := {
		"menu": "res://assets/audio/aegis_midi_menu.ogg",
		"geoscape": "res://assets/audio/aegis_midi_geoscape.ogg",
		"base": "res://assets/audio/aegis_midi_base.ogg",
		"missions": "res://assets/audio/aegis_midi_missions.ogg",
		"soldiers": "res://assets/audio/aegis_midi_soldiers.ogg",
		"research": "res://assets/audio/aegis_midi_research.ogg",
		"workshop": "res://assets/audio/aegis_midi_workshop.ogg",
		"reports": "res://assets/audio/aegis_midi_reports.ogg"
	}
	var path := String(paths.get(track, paths.geoscape))
	var stream = load(path)
	if stream == null:
		return
	if music_player.stream != stream:
		music_player.stream = stream
		music_player.play()
	elif not music_player.playing:
		music_player.play()

func _toggle_music() -> void:
	music_enabled = not music_enabled
	if music_enabled:
		_set_music(current_tab if campaign.has_campaign() else "menu")
	else:
		music_player.stop()
	if campaign.has_campaign():
		_show_command(current_tab)
	else:
		_show_start()

func _play_voice(file_name: String) -> void:
	var stream = load("res://assets/audio/dialogue/%s" % file_name)
	if stream == null:
		return
	sfx_player.stream = stream
	sfx_player.play()

func _clear_ui() -> void:
	for child in ui_root.get_children():
		ui_root.remove_child(child)
		child.queue_free()

func _background() -> ColorRect:
	var background := ColorRect.new()
	background.color = color_bg
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	ui_root.add_child(background)
	return background

func _show_start() -> void:
	current_tab = "menu"
	_clear_ui()
	_background()
	_set_music("menu")
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	ui_root.add_child(center)
	var shell := PanelContainer.new()
	shell.custom_minimum_size = Vector2(1040, 620)
	shell.add_theme_stylebox_override("panel", _stylebox(color_surface, color_border, 2, 6))
	center.add_child(shell)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 0)
	shell.add_child(row)
	var brand_band := VBoxContainer.new()
	brand_band.custom_minimum_size = Vector2(650, 0)
	brand_band.add_theme_constant_override("separation", 16)
	brand_band.add_theme_stylebox_override("panel", _stylebox(Color("0b2932"), color_border, 0, 0))
	row.add_child(_margin(brand_band, 56))
	brand_band.add_child(_label("PROJECT AEGIS", 18, color_cyan))
	brand_band.add_child(_label("DARK HORIZON", 58, color_text))
	brand_band.add_child(_label("ALIEN RESPONSE COMMAND", 21, color_gold))
	brand_band.add_child(_separator())
	brand_band.add_child(_label("Month 1. Two incidents. Six rookies. One chance to hold the line.", 18, color_muted, true))
	var readiness := HBoxContainer.new()
	readiness.add_theme_constant_override("separation", 12)
	for item in [["GLOBAL WATCH","ONLINE",color_green],["SKYRANGER","READY",color_cyan],["THREAT","UNKNOWN",color_red]]:
		readiness.add_child(_metric_card(item[0], item[1], item[2]))
	brand_band.add_child(readiness)
	brand_band.add_spacer(false)
	brand_band.add_child(_label(NATIVE_BUILD, 12, color_muted))
	var menu := VBoxContainer.new()
	menu.custom_minimum_size = Vector2(390, 0)
	menu.add_theme_constant_override("separation", 14)
	row.add_child(_margin(menu, 42))
	menu.add_child(_label("COMMAND UPLINK", 16, color_cyan))
	menu.add_child(_label("Native Godot 4 Vertical Slice", 25, color_text, true))
	menu.add_child(_separator())
	menu.add_child(_action_button("Start New Campaign", _show_base_setup, true))
	var load_button := _action_button("Load Native Campaign", _load_native_campaign)
	load_button.disabled = not FileAccess.file_exists(AegisCampaignState.SAVE_PATH)
	menu.add_child(load_button)
	var load_import_button := _action_button("Load Imported Copy", _load_imported_campaign)
	load_import_button.disabled = not FileAccess.file_exists(AegisCampaignState.IMPORTED_SAVE_PATH)
	menu.add_child(load_import_button)
	menu.add_child(_action_button("Import Browser Save", _open_browser_import))
	menu.add_child(_action_button("Build Health", _show_build_health))
	menu.add_child(_action_button("Music: %s" % ("On" if music_enabled else "Off"), _toggle_music))
	menu.add_spacer(false)
	menu.add_child(_label("HTML build 0137 remains available separately.", 13, color_muted, true))
	menu.add_child(_action_button("Exit", get_tree().quit))

func _show_base_setup() -> void:
	current_tab = "base_setup"
	_clear_ui()
	_background()
	_set_music("geoscape")
	var outer := VBoxContainer.new()
	outer.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	outer.add_theme_constant_override("separation", 14)
	ui_root.add_child(_margin(outer, 24))
	outer.add_child(_page_header("FIRST BASE SITE", "Choose Project Aegis command location", false))
	var body := HBoxContainer.new()
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_theme_constant_override("separation", 18)
	outer.add_child(body)
	var map_panel := _panel()
	map_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	body.add_child(map_panel)
	var map := AegisStrategicMap.new()
	map.configure(content.get("regions", []), content.get("incidents", []))
	map.selected_region = selected_setup_region
	map.region_selected.connect(func(region):
		selected_setup_region = region.get("name", "North America")
		_update_base_setup_summary()
	)
	map_panel.add_child(map)
	var side := VBoxContainer.new()
	side.custom_minimum_size = Vector2(390, 0)
	side.add_theme_constant_override("separation", 14)
	body.add_child(_panel_with(side, 24))
	side.add_child(_label("BASE DESIGNATION", 13, color_cyan))
	base_name_input = LineEdit.new()
	base_name_input.text = "Fort Aegis"
	base_name_input.placeholder_text = "Base name"
	base_name_input.custom_minimum_size.y = 46
	side.add_child(base_name_input)
	var region_summary := _label("", 20, color_text, true)
	region_summary.name = "RegionSummary"
	side.add_child(region_summary)
	var coverage := _label("", 14, color_muted, true)
	coverage.name = "CoverageSummary"
	side.add_child(coverage)
	side.add_child(_separator())
	side.add_child(_label("STARTING COMPLEMENT", 13, color_cyan))
	for text in ["1 Interceptor and 1 Skyranger", "6 ready rookies", "Shortwave radar coverage", "Laboratory, Sickbay, Stores"]:
		side.add_child(_status_row(text, "READY", color_green))
	side.add_spacer(false)
	side.add_child(_action_button("Confirm Site", _confirm_base_site, true))
	side.add_child(_action_button("Back", _show_start))
	_update_base_setup_summary()

func _update_base_setup_summary() -> void:
	var summary := ui_root.find_child("RegionSummary", true, false) as Label
	var coverage := ui_root.find_child("CoverageSummary", true, false) as Label
	if summary:
		summary.text = selected_setup_region
	if coverage:
		var incidents: Array = content.get("incidents", []).filter(func(item): return item.get("region", "") == selected_setup_region)
		coverage.text = "%d opening incident%s within practical Skyranger range." % [incidents.size(), "" if incidents.size() == 1 else "s"]

func _confirm_base_site() -> void:
	campaign.new_campaign(base_name_input.text, selected_setup_region)
	campaign.save_campaign()
	_show_command("geoscape")

func _load_native_campaign() -> void:
	if campaign.load_campaign():
		_show_command("geoscape")

func _load_imported_campaign() -> void:
	if campaign.load_campaign(AegisCampaignState.IMPORTED_SAVE_PATH):
		_show_command("geoscape")

func _open_browser_import() -> void:
	var dialog := FileDialog.new()
	dialog.title = "Select Project Aegis Browser Campaign Export"
	dialog.file_mode = FileDialog.FILE_MODE_OPEN_FILE
	dialog.access = FileDialog.ACCESS_FILESYSTEM
	dialog.filters = PackedStringArray(["*.project-aegis-save.json ; Project Aegis Campaign Saves", "*.json ; JSON Files"])
	var downloads_directory := OS.get_system_dir(OS.SYSTEM_DIR_DOWNLOADS)
	if not downloads_directory.is_empty():
		dialog.current_dir = downloads_directory
	dialog.min_size = Vector2i(920, 620)
	ui_root.add_child(dialog)
	dialog.file_selected.connect(func(path: String):
		dialog.queue_free()
		_review_browser_import_file(path)
	)
	dialog.canceled.connect(dialog.queue_free)
	dialog.popup_centered_ratio(0.82)

func _review_browser_import_file(path: String) -> void:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		_show_import_error("The selected file could not be opened for reading.")
		return
	if file.get_length() > MAX_BROWSER_IMPORT_BYTES:
		_show_import_error("The selected file exceeds the 32 MB import safety limit.")
		return
	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if not parsed is Dictionary:
		_show_import_error("The selected file is not valid JSON campaign data.")
		return
	_show_browser_import_review(parsed, path)

func _show_browser_import_review(payload: Dictionary, path: String) -> void:
	var preview := campaign.browser_import_preview(payload)
	if not preview.get("valid", false):
		_show_import_error(preview.get("error", "The selected campaign cannot be imported."))
		return
	var warning_lines: Array = preview.get("warnings", [])
	var replacement_note := "A previous imported copy will be replaced. Your native campaign remains untouched." if FileAccess.file_exists(AegisCampaignState.IMPORTED_SAVE_PATH) else "A new isolated imported-copy slot will be created. Your native campaign remains untouched."
	var review_lines := [
		"CAMPAIGN IMPORT REVIEW",
		"",
		"File: %s" % path.get_file(),
		"Campaign: %s" % preview.get("name", "Imported Campaign"),
		"Browser build: %s" % preview.get("source_build", "Unknown"),
		"Save format: %d" % preview.get("source_format", 0),
		"Campaign date: Month %d, Day %d" % [preview.get("month", 1), preview.get("day", 1)],
		"Funds: $%dk" % preview.get("funds", 0),
		"Selected base: %s, %s" % [preview.get("base_name", "Fort Aegis"), preview.get("base_region", "Unknown")],
		"Roster: %d soldiers" % preview.get("soldier_count", 0),
		"Compatible active incidents: %d" % preview.get("incident_count", 0),
		"",
		replacement_note,
		"The browser export is read only and will not be changed.",
		"",
		"COMPATIBILITY NOTES",
		"- " + "\n- ".join(warning_lines)
	]
	var dialog := ConfirmationDialog.new()
	dialog.title = "Import Browser Campaign as Native Copy"
	dialog.dialog_text = "\n".join(review_lines)
	dialog.ok_button_text = "Create Imported Copy"
	dialog.cancel_button_text = "Cancel"
	dialog.min_size = Vector2i(820, 650)
	ui_root.add_child(dialog)
	dialog.confirmed.connect(func():
		dialog.queue_free()
		_confirm_browser_import(payload, path)
	)
	dialog.canceled.connect(dialog.queue_free)
	dialog.popup_centered()

func _confirm_browser_import(payload: Dictionary, path: String) -> void:
	var imported_campaign := AegisCampaignState.new()
	imported_campaign.configure(content)
	if not imported_campaign.import_browser_save(payload, path.get_file()):
		_show_import_error("The campaign changed or failed validation before import.")
		return
	if not imported_campaign.save_campaign():
		_show_import_error("The imported copy could not be written to the Godot user-data folder.")
		return
	campaign = imported_campaign
	_show_command("geoscape")

func _show_import_error(message: String) -> void:
	var dialog := AcceptDialog.new()
	dialog.title = "Browser Save Import"
	dialog.dialog_text = message
	dialog.ok_button_text = "Return to Command Uplink"
	dialog.min_size = Vector2i(620, 220)
	ui_root.add_child(dialog)
	dialog.confirmed.connect(dialog.queue_free)
	dialog.popup_centered()

func _show_command(tab_name: String) -> void:
	if not campaign.has_campaign():
		_show_start()
		return
	current_tab = tab_name
	_clear_ui()
	_background()
	_set_music(tab_name)
	var outer := VBoxContainer.new()
	outer.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	outer.add_theme_constant_override("separation", 0)
	ui_root.add_child(outer)
	outer.add_child(_command_header())
	var body := HBoxContainer.new()
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_theme_constant_override("separation", 0)
	outer.add_child(body)
	body.add_child(_command_navigation())
	command_content = MarginContainer.new()
	command_content.add_theme_constant_override("margin_left", 24)
	command_content.add_theme_constant_override("margin_right", 24)
	command_content.add_theme_constant_override("margin_top", 22)
	command_content.add_theme_constant_override("margin_bottom", 22)
	command_content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	command_content.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_child(command_content)
	match tab_name:
		"geoscape": _render_geoscape()
		"base": _render_base()
		"soldiers": _render_soldiers()
		"research": _render_research()
		"workshop": _render_workshop()
		"squads": _render_squads()
		"missions": _render_missions()
		"reports": _render_reports()
		_: _render_geoscape()

func _command_header() -> Control:
	var header := PanelContainer.new()
	header.custom_minimum_size.y = 88
	header.add_theme_stylebox_override("panel", _stylebox(Color("0b1a20"), color_border, 0, 0))
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	header.add_child(_margin(row, 16))
	var brand := VBoxContainer.new()
	brand.custom_minimum_size.x = 210
	brand.add_child(_label("PROJECT AEGIS", 15, color_cyan))
	brand.add_child(_label("DARK HORIZON", 23, color_text))
	row.add_child(brand)
	row.add_child(_metric("FUNDS", "$%.2fM" % (float(campaign.data.get("funds", 0)) / 1000.0), color_gold))
	row.add_child(_metric("DATE", "M%d D%d" % [campaign.data.get("month",1), campaign.data.get("day",1)], color_text))
	row.add_child(_metric("TIME", campaign.clock_text(), color_cyan))
	row.add_child(_metric("SQUAD", "%d / 6" % campaign.assigned_soldiers().size(), color_green))
	row.add_spacer(false)
	row.add_child(_small_button("Build Health", _show_build_health))
	row.add_child(_small_button("Save Copy" if campaign.is_imported_copy() else "Save", _save_native_campaign))
	row.add_child(_small_button("Music %s" % ("On" if music_enabled else "Off"), _toggle_music))
	row.add_child(_small_button("Menu", _show_start))
	return header

func _command_navigation() -> Control:
	var panel := PanelContainer.new()
	panel.custom_minimum_size.x = 220
	panel.add_theme_stylebox_override("panel", _stylebox(Color("0c1b21"), color_border, 0, 0))
	var nav := VBoxContainer.new()
	nav.add_theme_constant_override("separation", 7)
	panel.add_child(_margin(nav, 16))
	nav.add_child(_label("COMMAND SECTIONS", 12, color_muted))
	for entry in [["geoscape","Geoscape"],["base","Base"],["soldiers","Soldiers"],["research","Research"],["workshop","Workshop"],["squads","Squads"],["missions","Missions"],["reports","Reports"]]:
		var key := String(entry[0])
		var button := _action_button(entry[1], func(): _show_command(key))
		button.button_pressed = key == current_tab
		button.toggle_mode = true
		nav.add_child(button)
	nav.add_spacer(false)
	nav.add_child(_label(campaign.save_slot_label().to_upper(), 11, color_gold if campaign.is_imported_copy() else color_green, true))
	nav.add_child(_label("SAVE FORMAT 4", 11, color_muted))
	nav.add_child(_label(NATIVE_BUILD, 10, color_muted, true))
	return panel

func _render_geoscape() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 16)
	command_content.add_child(root)
	root.add_child(_section_title("GEOSCAPE", "Global Watch and active response operations"))
	if campaign.is_imported_copy():
		var origin: Dictionary = campaign.data.get("save_origin", {})
		var import_strip := HBoxContainer.new()
		import_strip.add_theme_constant_override("separation", 14)
		import_strip.add_child(_label("IMPORTED COPY", 13, color_gold))
		import_strip.add_child(_label("%s - %s - browser file remains unchanged" % [origin.get("source_name", "Browser export"), origin.get("source_build", "Unknown build")], 13, color_muted, true))
		root.add_child(_panel_with(import_strip, 12))
	var body := HBoxContainer.new()
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_theme_constant_override("separation", 18)
	root.add_child(body)
	var map_panel := _panel()
	map_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	body.add_child(map_panel)
	var map := AegisStrategicMap.new()
	map.configure(content.get("regions", []), campaign.data.get("incidents", []), campaign.data.get("ufo_contacts", []))
	map.base_region = campaign.data.get("base", {}).get("region", "")
	map.selected_incident_id = campaign.data.get("selected_incident_id", "")
	map.selected_ufo_id = campaign.data.get("selected_ufo_id", "")
	var travel: Dictionary = campaign.data.get("travel", {})
	map.travel_progress = int(travel.get("progress", -1))
	map.interception = campaign.data.get("interception", {})
	map.incident_selected.connect(func(incident):
		campaign.select_incident(incident.get("id", ""))
		_show_command("geoscape")
	)
	map.ufo_selected.connect(func(ufo):
		campaign.select_ufo(ufo.get("id", ""))
		_show_command("geoscape")
	)
	map_panel.add_child(map)
	var side_scroll := ScrollContainer.new()
	side_scroll.custom_minimum_size.x = 350
	side_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var side := VBoxContainer.new()
	side.custom_minimum_size.x = 310
	side.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	side.add_theme_constant_override("separation", 13)
	side_scroll.add_child(side)
	body.add_child(_panel_with(side_scroll, 16))
	_render_air_defense(side)
	side.add_child(_separator())
	side.add_child(_label("GROUND RESPONSE", 13, color_cyan))
	var incident := campaign.selected_incident()
	if incident.is_empty():
		side.add_child(_label("No active alien incidents.", 17, color_green, true))
	else:
		side.add_child(_label(incident.get("name", "Incident"), 20, color_text, true))
		side.add_child(_status_row("Region", incident.get("region", "Unknown"), color_text))
		if travel.is_empty():
			side.add_child(_action_button("Open Mission Control", func(): _show_command("missions"), true))
		else:
			var progress := int(travel.get("progress", 0))
			side.add_child(_label("AEGIS ONE EN ROUTE", 14, color_cyan))
			var bar := ProgressBar.new()
			bar.value = progress
			bar.show_percentage = true
			bar.custom_minimum_size.y = 26
			side.add_child(bar)
			side.add_child(_label("%d%% to %s" % [progress, incident.get("name", "incident")], 14, color_muted))
			side.add_child(_action_button("Advance 30 Minutes", _advance_to_incident, true))
	side.add_child(_separator())
	side.add_child(_label("GLOBAL CLOCK", 12, color_muted))
	side.add_child(_action_button("Advance 1 Hour", func():
		campaign.advance_minutes(60)
		campaign.save_campaign()
		_show_command("geoscape")
	))

func _render_air_defense(side: VBoxContainer) -> void:
	side.add_child(_label("AIR DEFENSE", 13, color_cyan))
	var craft := campaign.interceptor()
	var ufo := campaign.selected_ufo()
	var operation: Dictionary = campaign.data.get("interception", {})
	if ufo.is_empty() and not operation.is_empty():
		ufo = campaign._ufo_by_id(operation.get("ufo_id", ""))
	if craft.is_empty():
		side.add_child(_label("No interceptor assigned.", 16, color_red, true))
		return
	side.add_child(_label(craft.get("name", "Interceptor"), 20, color_text))
	side.add_child(_status_row("Status", craft.get("status", "Unknown"), color_green if craft.get("status", "") == "Ready" else color_gold))
	side.add_child(_status_row("Hull", "%d/%d" % [craft.get("hp",0), craft.get("max_hp",0)], color_text))
	side.add_child(_status_row("Fuel", "%d%%" % craft.get("fuel",0), color_cyan))
	side.add_child(_status_row("Missiles", "%d/%d" % [craft.get("ammo",0), craft.get("max_ammo",0)], color_gold))
	if ufo.is_empty():
		side.add_child(_label("No active UFO contact.", 15, color_green, true))
		_render_last_interception(side)
		return
	side.add_child(_label(ufo.get("name", "UFO Contact"), 18, color_gold, true))
	side.add_child(_status_row("Class", ufo.get("class", "Unknown"), color_muted))
	side.add_child(_status_row("Region", ufo.get("region", "Unknown"), color_text))
	side.add_child(_status_row("UFO hull", "%d/%d" % [ufo.get("hull",0), ufo.get("max_hull",0)], color_red))
	if operation.is_empty():
		var stance_row := HBoxContainer.new()
		stance_row.add_theme_constant_override("separation", 6)
		for stance_name in ["Cautious", "Standard", "Aggressive"]:
			var stance := String(stance_name)
			var stance_button := _small_button(stance, func(): _set_interception_stance(stance))
			stance_button.toggle_mode = true
			stance_button.button_pressed = campaign.data.get("interception_stance", "Standard") == stance
			stance_row.add_child(stance_button)
		side.add_child(stance_row)
		var blocker := campaign.interception_launch_blocker()
		if not blocker.is_empty():
			side.add_child(_label(blocker, 12, color_red, true))
		var launch := _action_button("Launch Saber One", _launch_interceptor, true)
		launch.disabled = not blocker.is_empty()
		side.add_child(launch)
		_render_last_interception(side)
	else:
		var phase := String(operation.get("phase", "outbound"))
		side.add_child(_label("%s - %s" % [phase.to_upper(), operation.get("stance", "Standard")], 14, color_cyan))
		var progress := ProgressBar.new()
		progress.value = int(operation.get("progress", 0))
		progress.show_percentage = true
		progress.custom_minimum_size.y = 24
		side.add_child(progress)
		for event_text in operation.get("combat_log", []):
			side.add_child(_label(event_text, 11, color_muted, true))
		side.add_child(_action_button("Advance 10 Minutes", _advance_air_operation, true))

func _render_last_interception(side: VBoxContainer) -> void:
	var last: Dictionary = campaign.data.get("last_interception", {})
	if last.is_empty():
		return
	side.add_child(_label("LAST ENGAGEMENT", 11, color_muted))
	side.add_child(_label("%s - %s" % ["VICTORY" if last.get("success", false) else "CONTACT LOST", last.get("stance", "Standard")], 13, color_green if last.get("success", false) else color_gold))
	var combat_log: Array = last.get("combat_log", [])
	for event_index in range(maxi(0, combat_log.size() - 3), combat_log.size()):
		side.add_child(_label(combat_log[event_index], 11, color_muted, true))

func _set_interception_stance(stance: String) -> void:
	campaign.data["interception_stance"] = stance
	campaign.save_campaign()
	_show_command("geoscape")

func _launch_interceptor() -> void:
	if campaign.begin_interception(campaign.data.get("interception_stance", "Standard")):
		_play_voice("Lifting off.wav")
		campaign.save_campaign()
	_show_command("geoscape")

func _advance_air_operation() -> void:
	var before: Dictionary = campaign.data.get("interception", {}).duplicate(true)
	campaign.advance_minutes(10)
	var after: Dictionary = campaign.data.get("interception", {})
	if before.get("phase", "") == "outbound" and after.get("phase", "") == "returning":
		_play_voice("Mission successful.wav" if after.get("success", false) else "Breaking off.wav")
	elif before.get("phase", "") == "returning" and after.is_empty():
		_play_voice("Returning to base.wav")
	campaign.save_campaign()
	_show_command("geoscape")

func _advance_to_incident() -> void:
	var arrived := campaign.advance_minutes(30)
	campaign.save_campaign()
	if arrived:
		_show_tactical()
	else:
		_show_command("geoscape")

func _render_base() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 16)
	_mount_scrollable_command_page(root)
	var base: Dictionary = campaign.data.get("base", {})
	root.add_child(_section_title(base.get("name", "Fort Aegis").to_upper(), "%s command installation" % base.get("region", "Unknown")))
	var personnel_used := campaign.personnel_used()
	var personnel_capacity := campaign.personnel_capacity()
	var capacity_color := color_red if personnel_used > personnel_capacity else color_green
	var summary := GridContainer.new()
	summary.columns = 4
	summary.add_theme_constant_override("h_separation", 12)
	for metric_data in [
		["LOCAL PERSONNEL", "%d / %d" % [personnel_used, personnel_capacity], capacity_color],
		["SOLDIERS", str(campaign.living_soldier_count()), color_cyan],
		["SCIENTISTS", "%d / %d" % [campaign.data.get("scientists", 0), campaign.scientist_capacity()], Color("c4b5fd")],
		["ENGINEERS", str(campaign.data.get("engineers", 0)), color_gold]
	]:
		var metric_card := _metric_card(metric_data[0], metric_data[1], metric_data[2])
		metric_card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		summary.add_child(metric_card)
	root.add_child(summary)
	if personnel_used > personnel_capacity:
		root.add_child(_label("PERSONNEL CAPACITY EXCEEDED - %d staff require additional Living Quarters." % (personnel_used - personnel_capacity), 13, color_red, true))
	var grid := GridContainer.new()
	grid.columns = 3
	grid.size_flags_vertical = Control.SIZE_EXPAND_FILL
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 14)
	root.add_child(grid)
	for facility_id in base.get("facilities", []):
		var definition := _content_by_id(content.get("facilities", []), facility_id)
		var card := VBoxContainer.new()
		card.custom_minimum_size = Vector2(230, 150)
		card.add_theme_constant_override("separation", 10)
		card.add_child(_label(definition.get("name", facility_id), 19, Color(definition.get("color", "#67e8f9")), true))
		card.add_child(_label("Operational", 14, color_green))
		card.add_spacer(false)
		card.add_child(_label(_facility_status(facility_id), 13, color_muted, true))
		grid.add_child(_panel_with(card, 18))

func _facility_status(facility_id: String) -> String:
	var research: Dictionary = campaign.data.get("research", {})
	var statuses := {
		"access":"Primary surface entry secure.",
		"quarters":"%d / %d local personnel capacity." % [campaign.personnel_used(), campaign.personnel_capacity()],
		"lab":"%d / %d Scientists assigned to %s." % [campaign.research_assigned_scientists(), campaign.scientist_capacity(), research.get("active", "research")],
		"sickbay":"0 / 4 beds occupied.",
		"stores":"Local equipment accounted for.",
		"hangar_interceptor":"Saber One ready.",
		"hangar_skyranger":"Aegis One ready.",
		"radar":"4,500 km coverage active."
	}
	return statuses.get(facility_id, "Facility ready.")

func _render_soldiers() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 14)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("SOLDIER ROSTER", "Fort Aegis ready personnel"))
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 12)
	root.add_child(grid)
	for soldier in campaign.data.get("soldiers", []):
		var row := HBoxContainer.new()
		row.custom_minimum_size = Vector2(480, 118)
		row.add_theme_constant_override("separation", 14)
		var badge := Label.new()
		badge.text = String(soldier.get("callsign", "A")).left(1)
		badge.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		badge.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		badge.custom_minimum_size = Vector2(64, 64)
		badge.add_theme_font_size_override("font_size", 28)
		badge.add_theme_color_override("font_color", color_cyan)
		badge.add_theme_stylebox_override("normal", _stylebox(Color("12323c"), color_border, 2, 4))
		row.add_child(badge)
		var text := VBoxContainer.new()
		text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		text.add_child(_label(soldier.get("name", "Soldier"), 19, color_text))
		var soldier_status := String(soldier.get("status", "Ready"))
		var status_color := color_red if soldier_status == "KIA" else color_gold if soldier_status == "Wounded" else color_muted
		text.add_child(_label("%s - %s - %s" % [soldier.get("rank", "Rookie"), soldier.get("trait", "Steady"), soldier_status], 13, status_color, true))
		text.add_child(_label("ACC %d   TU %d   HP %d" % [soldier.get("accuracy",0), soldier.get("tu",0), soldier.get("health",0)], 13, color_cyan))
		row.add_child(text)
		var assigned := CheckButton.new()
		assigned.text = "Squad"
		assigned.button_pressed = soldier.get("assigned", false)
		assigned.disabled = soldier.get("status", "") != "Ready"
		var soldier_id := String(soldier.get("id", ""))
		assigned.toggled.connect(func(value):
			campaign.set_soldier_assigned(soldier_id, value)
			campaign.save_campaign()
		)
		row.add_child(assigned)
		grid.add_child(_panel_with(row, 16))

func _render_research() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 18)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("RESEARCH", "Laboratory program"))
	var research: Dictionary = campaign.data.get("research", {})
	var assigned := campaign.research_assigned_scientists()
	var staff_limit := campaign.research_staff_limit()
	var daily_progress := campaign.research_daily_progress()
	var days_remaining := campaign.research_days_remaining()
	var required_progress := campaign.research_required_progress()
	var completed := bool(research.get("completed", false)) or int(research.get("progress", 0)) >= required_progress
	var summary := GridContainer.new()
	summary.columns = 4
	summary.add_theme_constant_override("h_separation", 12)
	for metric_data in [
		["SCIENTISTS", str(campaign.data.get("scientists", 0)), Color("c4b5fd")],
		["LAB CAPACITY", str(campaign.scientist_capacity()), color_cyan],
		["ASSIGNED", str(assigned), color_green if assigned > 0 else color_gold],
		["AVAILABLE", str(maxi(0, int(campaign.data.get("scientists", 0)) - assigned)), color_text]
	]:
		var metric_card := _metric_card(metric_data[0], metric_data[1], metric_data[2])
		metric_card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		summary.add_child(metric_card)
	root.add_child(summary)
	var card := VBoxContainer.new()
	card.add_theme_constant_override("separation", 14)
	card.add_child(_label(research.get("active", "Laser Weapons"), 28, Color("c4b5fd")))
	var bar := ProgressBar.new()
	bar.max_value = required_progress
	bar.value = int(research.get("progress", 0))
	bar.custom_minimum_size = Vector2(600, 32)
	card.add_child(bar)
	var state_text := "PROJECT COMPLETE - laboratory staff released." if completed else "%d research points per day - %s" % [daily_progress, "%d day%s remaining" % [days_remaining, "" if days_remaining == 1 else "s"] if days_remaining >= 0 else "No progress while unstaffed"]
	card.add_child(_label(state_text, 15, color_green if completed else color_muted, true))
	var staffing_row := HBoxContainer.new()
	staffing_row.add_theme_constant_override("separation", 12)
	staffing_row.add_child(_label("Assigned Scientists", 15, color_text))
	var staffing := SpinBox.new()
	staffing.min_value = 0
	staffing.max_value = staff_limit
	staffing.step = 1
	staffing.value = assigned
	staffing.custom_minimum_size = Vector2(150, 40)
	staffing.editable = not completed
	staffing.value_changed.connect(func(value: float):
		if campaign.set_research_staffing(int(value)):
			campaign.save_campaign()
			_show_command("research")
	)
	staffing_row.add_child(staffing)
	staffing_row.add_child(_label("of %d available laboratory positions" % staff_limit, 13, color_muted))
	card.add_child(staffing_row)
	var advance_button := _action_button("Advance One Day", _advance_research_day, true)
	advance_button.disabled = not campaign.data.get("travel", {}).is_empty() or not campaign.data.get("interception", {}).is_empty()
	card.add_child(advance_button)
	if advance_button.disabled:
		card.add_child(_label("Strategic time advance is unavailable during an active flight operation.", 12, color_gold, true))
	root.add_child(_panel_with(card, 24))

func _advance_research_day() -> void:
	campaign.advance_minutes(24 * 60)
	campaign.save_campaign()
	_show_command("research")

func _render_workshop() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 18)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("WORKSHOP", "Engineering and field supply"))
	var stores: Dictionary = campaign.data.get("stores", {})
	var card := VBoxContainer.new()
	card.add_theme_constant_override("separation", 14)
	card.add_child(_status_row("Engineers", "5 / 10", color_text))
	card.add_child(_status_row("Medkits", str(stores.get("Medkit",0)), color_green))
	card.add_child(_status_row("Available funds", "$%dk" % campaign.data.get("funds",0), color_gold))
	card.add_child(_separator())
	var build_button := _action_button("Build Medkit - $40k", func():
		if int(campaign.data.get("funds",0)) < 40:
			campaign.add_report("Workshop order blocked: insufficient funds.")
		else:
			campaign.data["funds"] = int(campaign.data.get("funds",0)) - 40
			stores["Medkit"] = int(stores.get("Medkit",0)) + 1
			campaign.data["stores"] = stores
			campaign.add_report("Workshop completed one Medkit.")
		campaign.save_campaign()
		_show_command("workshop")
	, true)
	card.add_child(build_button)
	root.add_child(_panel_with(card, 24))

func _render_squads() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 16)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("ANACONDA SQUAD", "Aegis One response force"))
	var assigned := campaign.assigned_soldiers()
	var summary := HBoxContainer.new()
	summary.add_theme_constant_override("separation", 14)
	summary.add_child(_metric_card("ASSIGNED", "%d / 6" % assigned.size(), color_green))
	summary.add_child(_metric_card("TRANSPORT", "AEGIS ONE", color_cyan))
	summary.add_child(_metric_card("READINESS", "READY" if not assigned.is_empty() else "EMPTY", color_green if not assigned.is_empty() else color_red))
	root.add_child(summary)
	var lineup := HBoxContainer.new()
	lineup.add_theme_constant_override("separation", 10)
	for soldier in assigned:
		var card := VBoxContainer.new()
		card.custom_minimum_size = Vector2(150, 150)
		card.add_child(_label(soldier.get("callsign", "Soldier"), 18, color_text))
		card.add_child(_label(soldier.get("rank", "Rookie"), 13, color_cyan))
		card.add_spacer(false)
		card.add_child(_label(soldier.get("weapon", "Ballistic Rifle"), 12, color_muted, true))
		lineup.add_child(_panel_with(card, 14))
	root.add_child(lineup)
	root.add_child(_action_button("Edit Roster", func(): _show_command("soldiers")))

func _render_missions() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 16)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("MISSION CONTROL", "Active alien incidents"))
	var incidents: Array = campaign.data.get("incidents", [])
	if incidents.is_empty():
		root.add_child(_panel_with(_label("No active incidents. Global Watch remains active.", 20, color_green), 24))
		return
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 16)
	grid.add_theme_constant_override("v_separation", 16)
	root.add_child(grid)
	for incident in incidents:
		var card := VBoxContainer.new()
		card.custom_minimum_size = Vector2(470, 230)
		card.add_theme_constant_override("separation", 10)
		card.add_child(_label(incident.get("name", "Incident"), 23, color_text))
		card.add_child(_status_row("Region", incident.get("region", "Unknown"), color_muted))
		card.add_child(_status_row("Threat", "Level %d" % incident.get("threat",1), color_red))
		card.add_child(_status_row("Reward", "$%dk" % incident.get("reward",0), color_gold))
		card.add_child(_status_row("Rescue", "%d required" % incident.get("required_rescues",0), color_cyan))
		var incident_id := String(incident.get("id", ""))
		card.add_spacer(false)
		card.add_child(_action_button("Select Incident", func():
			campaign.select_incident(incident_id)
			_show_command("missions")
		, campaign.data.get("selected_incident_id", "") != incident_id))
		grid.add_child(_panel_with(card, 20))
	var selected := campaign.selected_incident()
	var launch_row := HBoxContainer.new()
	launch_row.add_theme_constant_override("separation", 14)
	launch_row.add_child(_label("Selected: %s" % selected.get("name", "None"), 17, color_cyan))
	launch_row.add_spacer(false)
	var launch := _action_button("Launch Aegis One", _launch_selected_mission, true)
	launch.disabled = campaign.assigned_soldiers().is_empty() or not campaign.data.get("travel", {}).is_empty() or not campaign.data.get("interception", {}).is_empty()
	launch_row.add_child(launch)
	root.add_child(_panel_with(launch_row, 16))

func _launch_selected_mission() -> void:
	if campaign.begin_mission_travel():
		campaign.save_campaign()
		_show_command("geoscape")

func _render_reports() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 14)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("COMMAND REPORTS", "Operational record"))
	for report in campaign.data.get("reports", []):
		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 14)
		row.add_child(_label("M%d D%d" % [campaign.data.get("month",1), campaign.data.get("day",1)], 12, color_cyan))
		row.add_child(_label(report, 15, color_text, true))
		root.add_child(_panel_with(row, 14))

func _show_tactical() -> void:
	current_tab = "missions"
	_clear_ui()
	_background()
	_set_music("missions")
	tactical_result = {}
	var outer := VBoxContainer.new()
	outer.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	outer.add_theme_constant_override("separation", 10)
	ui_root.add_child(_margin(outer, 14))
	var top := HBoxContainer.new()
	top.custom_minimum_size.y = 38
	top.add_theme_constant_override("separation", 14)
	top.add_child(_label("TACTICAL INCIDENT", 21, color_cyan))
	top.add_child(_label(campaign.selected_incident().get("name", "Incident"), 25, color_text))
	top.add_spacer(false)
	tactical_status_label = _label("Human turn", 14, color_gold)
	top.add_child(tactical_status_label)
	outer.add_child(_panel_with(top, 12))
	var body := HBoxContainer.new()
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_theme_constant_override("separation", 12)
	outer.add_child(body)
	var board_panel := _panel()
	board_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	board_panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_child(board_panel)
	tactical_board = AegisTacticalBoard.new()
	tactical_board.selection_changed.connect(_on_tactical_selection)
	tactical_board.status_changed.connect(_on_tactical_status)
	tactical_board.log_added.connect(_on_tactical_log)
	tactical_board.battle_finished.connect(_on_tactical_finished)
	board_panel.add_child(tactical_board)
	var side := VBoxContainer.new()
	side.custom_minimum_size.x = 360
	side.add_theme_constant_override("separation", 12)
	body.add_child(_panel_with(side, 16))
	side.add_child(_label("TACTICAL CONTROL", 13, color_cyan))
	tactical_selection_label = _label("Select a soldier.", 15, color_text, true)
	tactical_selection_label.custom_minimum_size.y = 105
	side.add_child(tactical_selection_label)
	side.add_child(_separator())
	tactical_end_turn_button = _action_button("End Turn", func(): tactical_board.end_human_turn(), true)
	side.add_child(tactical_end_turn_button)
	tactical_return_button = _action_button("Return to Base", _complete_tactical_return, true)
	tactical_return_button.disabled = true
	side.add_child(tactical_return_button)
	side.add_child(_separator())
	side.add_child(_label("BATTLE LOG", 12, color_muted))
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	tactical_log_box = VBoxContainer.new()
	tactical_log_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	tactical_log_box.add_theme_constant_override("separation", 7)
	scroll.add_child(tactical_log_box)
	side.add_child(scroll)
	tactical_board.begin_battle(campaign.selected_incident(), campaign.assigned_soldiers())

func _on_tactical_selection(unit: Dictionary) -> void:
	if tactical_selection_label == null:
		return
	if unit.is_empty():
		tactical_selection_label.text = "Select a living soldier to move, escort, breach, or fire."
	else:
		tactical_selection_label.text = "%s\n%s\nHP %d/%d   TU %d/%d\nKills %d" % [unit.get("name","Soldier"), unit.get("weapon","Ballistic Rifle"), unit.get("hp",0), unit.get("max_hp",0), unit.get("tu",0), unit.get("max_tu",0), unit.get("kills",0)]

func _on_tactical_status(status: Dictionary) -> void:
	if tactical_status_label:
		tactical_status_label.text = "Turn %d | %s | Aliens %d | Rescue %d/%d" % [status.get("turn",1), String(status.get("phase","human")).capitalize(), status.get("aliens",0), status.get("rescued",0), status.get("required",0)]
	if tactical_end_turn_button:
		tactical_end_turn_button.disabled = status.get("phase", "") != "human" or status.get("resolved", false)

func _on_tactical_log(message: String) -> void:
	if tactical_log_box == null:
		return
	var entry := _label(message, 12, color_text, true)
	tactical_log_box.add_child(entry)
	tactical_log_box.move_child(entry, 0)
	while tactical_log_box.get_child_count() > 10:
		var oldest_entry := tactical_log_box.get_child(tactical_log_box.get_child_count() - 1)
		tactical_log_box.remove_child(oldest_entry)
		oldest_entry.free()

func _on_tactical_finished(result: Dictionary) -> void:
	tactical_result = result
	if tactical_return_button:
		tactical_return_button.disabled = false
	if tactical_end_turn_button:
		tactical_end_turn_button.disabled = true

func _complete_tactical_return() -> void:
	if tactical_result.is_empty():
		return
	campaign.complete_mission(tactical_result)
	campaign.save_campaign()
	_show_command("reports")

func _save_native_campaign() -> void:
	campaign.add_report("%s save completed." % campaign.save_slot_label())
	campaign.save_campaign()
	_show_command(current_tab)

func _show_build_health() -> void:
	var checks := _run_self_tests()
	var passed := checks.filter(func(check): return check.pass).size()
	var dialog := AcceptDialog.new()
	dialog.title = "Godot Vertical Slice Build Health"
	dialog.dialog_text = "%d/%d checks passing\n\n%s" % [passed, checks.size(), "\n".join(checks.map(func(check): return "%s  %s" % ["OK" if check.pass else "FAIL", check.name]))]
	dialog.min_size = Vector2i(720, 480)
	ui_root.add_child(dialog)
	dialog.popup_centered()
	dialog.confirmed.connect(dialog.queue_free)

func _run_self_tests() -> Array:
	var test_campaign := AegisCampaignState.new()
	test_campaign.configure(content)
	test_campaign.new_campaign("Test Aegis", "North America")
	var blocked := {AegisHexRules.key(Vector2i(2,1)): true}
	var closed_path := AegisHexRules.path(Vector2i(2,0), Vector2i(2,1), blocked, {}, 6, 6, 4)
	var open_path := AegisHexRules.path(Vector2i(2,0), Vector2i(2,1), {}, {}, 6, 6, 4)
	var test_board := AegisTacticalBoard.new()
	test_board.begin_battle(test_campaign.selected_incident(), test_campaign.assigned_soldiers())
	var tactical_humans := test_board.units.filter(func(unit): return unit.get("team", "") == "human")
	var tactical_civilians := test_board.units.filter(func(unit): return unit.get("team", "") == "civilian")
	var wall_key := AegisHexRules.key(Vector2i(10, 2))
	var wall: Dictionary = test_board.covers.get(wall_key, {})
	var shooter: Dictionary = tactical_humans[0]
	shooter["cell"] = Vector2i(8, 2)
	shooter["tu"] = 64
	test_board._try_shoot_cover(shooter, wall)
	test_board._try_shoot_cover(shooter, wall)
	var civilian: Dictionary = tactical_civilians[0]
	shooter["cell"] = civilian.get("cell", Vector2i.ZERO) + Vector2i(-1, 0)
	shooter["tu"] = 16
	test_board._try_contact_civilian(shooter, civilian)
	for alien in test_board.units.filter(func(unit): return unit.get("team", "") == "alien"):
		alien["hp"] = 0
	var rescue_gate_holds := not test_board._check_resolution() and not test_board.resolved
	test_board.rescued = test_board.required_rescues
	var rescue_gate_completes := test_board._check_resolution() and test_board.resolved
	var previous_log_box: VBoxContainer = tactical_log_box
	var test_log_box := VBoxContainer.new()
	tactical_log_box = test_log_box
	for log_index in range(24):
		_on_tactical_log("Bounded tactical log entry %d" % log_index)
	var tactical_log_is_bounded := test_log_box.get_child_count() == 10
	tactical_log_box = previous_log_box
	test_log_box.free()
	var air_campaign := AegisCampaignState.new()
	air_campaign.configure(content)
	air_campaign.new_campaign("Air Test", "North America")
	var air_defaults_ready: bool = air_campaign.interceptor().get("status", "") == "Ready" and air_campaign.active_ufos().size() == 1
	var air_launch_ready: bool = air_campaign.begin_interception("Aggressive") and int(air_campaign.interceptor().get("fuel", 0)) == 66
	air_campaign.advance_minutes(10)
	var air_midflight_normalizes: bool = int(air_campaign.data.get("interception", {}).get("progress", 0)) == 50 and air_campaign.normalize_save(air_campaign.data).get("interception", {}).get("phase", "") == "outbound"
	air_campaign.advance_minutes(10)
	var air_operation: Dictionary = air_campaign.data.get("interception", {})
	var air_combat_resolves: bool = air_operation.get("phase", "") == "returning" and air_operation.get("success", false) and not air_operation.get("combat_log", []).is_empty()
	var air_crash_created: bool = air_campaign.data.get("incidents", []).any(func(incident): return String(incident.get("id", "")).begins_with("crash_"))
	air_campaign.advance_minutes(20)
	var air_return_services: bool = air_campaign.data.get("interception", {}).is_empty() and air_campaign.interceptor().get("status", "") == "Servicing"
	air_campaign.advance_minutes(30)
	var air_service_restores: bool = air_campaign.interceptor().get("status", "") == "Ready" and int(air_campaign.interceptor().get("hp", 0)) == int(air_campaign.interceptor().get("max_hp", 0))
	var browser_payload := _browser_import_test_payload()
	var import_preview := test_campaign.browser_import_preview(browser_payload)
	var future_payload := browser_payload.duplicate(true)
	future_payload["saveFormatVersion"] = AegisCampaignState.SAVE_FORMAT + 1
	var unsupported_imports_rejected: bool = not test_campaign.browser_import_preview(future_payload).get("valid", false) and not test_campaign.browser_import_preview({"kind": AegisCampaignState.BROWSER_SLOT_BACKUP_KIND, "slots": []}).get("valid", false)
	var imported_campaign := AegisCampaignState.new()
	imported_campaign.configure(content)
	var browser_import_succeeds := imported_campaign.import_browser_save(browser_payload, "health-fixture.project-aegis-save.json")
	var imported_base: Dictionary = imported_campaign.data.get("base", {})
	var imported_roster: Array = imported_campaign.data.get("soldiers", [])
	var imported_incident: Dictionary = imported_campaign.selected_incident()
	var imported_research: Dictionary = imported_campaign.data.get("research", {})
	var import_maps_campaign: bool = imported_base.get("name", "") == "Pacific Aegis" and imported_base.get("region", "") == "Oceania" and imported_base.get("facilities", []).has("radar") and imported_base.get("facilities", []).has("hangar_interceptor") and imported_campaign.facility_count("quarters") == 2 and imported_campaign.personnel_capacity() == 24 and imported_campaign.personnel_used() == 20 and imported_campaign.scientist_capacity() == 10 and int(imported_campaign.data.get("month", 0)) == 4 and int(imported_campaign.data.get("day", 0)) == 12 and int(imported_campaign.data.get("funds", 0)) == 3180 and imported_research.get("active", "") == "Laser Power Output 1" and imported_campaign.research_assigned_scientists() == 10 and imported_campaign.research_required_progress() == 180
	var import_maps_roster: bool = imported_roster.size() == 8 and imported_campaign.assigned_soldiers().size() == 6 and int(imported_roster[0].get("accuracy", 0)) == 74 and int(imported_roster[0].get("tu", 0)) == 63 and imported_roster[0].get("callsign", "") == "Nested" and imported_roster[0].get("trait", "") == "Methodical"
	var import_maps_incident: bool = imported_incident.get("name", "") == "Port Meridian Attack" and int(imported_incident.get("required_rescues", 0)) == 2 and imported_campaign.begin_mission_travel()
	var import_slot_isolated: bool = imported_campaign.is_imported_copy() and imported_campaign.active_save_path == AegisCampaignState.IMPORTED_SAVE_PATH and AegisCampaignState.IMPORTED_SAVE_PATH != AegisCampaignState.SAVE_PATH and imported_campaign.data.get("save_origin", {}).get("source_name", "") == "health-fixture.project-aegis-save.json"
	var dense_map := AegisStrategicMap.new()
	dense_map.size = Vector2(700, 470)
	var dense_incidents: Array = []
	for dense_index in range(4):
		dense_incidents.append({"id": "dense_%d" % dense_index, "name": "Dense %d" % dense_index, "region": "Oceania"})
	dense_map.configure(content.get("regions", []), dense_incidents)
	var dense_positions := {}
	for dense_incident in dense_incidents:
		var dense_point := dense_map._incident_point(dense_incident)
		dense_positions["%.1f,%.1f" % [dense_point.x, dense_point.y]] = true
	var dense_incidents_separate: bool = dense_positions.size() == dense_incidents.size()
	var management_campaign := AegisCampaignState.new()
	management_campaign.configure(content)
	management_campaign.new_campaign("Capacity Test", "North America")
	var personnel_capacity_ready: bool = management_campaign.personnel_capacity() == 12 and management_campaign.personnel_used() == 11 and management_campaign.scientist_capacity() == 10
	var management_legacy := management_campaign.data.duplicate(true)
	management_legacy.erase("scientists")
	management_legacy.erase("engineers")
	management_legacy["base"].erase("facility_counts")
	management_legacy["research"] = {"active": "Laser Weapons", "progress": 8}
	var management_migrated := management_campaign.normalize_save(management_legacy)
	var management_migration_ready: bool = int(management_migrated.get("scientists", 0)) == 5 and int(management_migrated.get("engineers", -1)) == 0 and int(management_migrated.get("base", {}).get("facility_counts", {}).get("quarters", 0)) == 1 and int(management_migrated.get("research", {}).get("assigned_scientists", 0)) == 5
	management_campaign.set_research_staffing(3)
	var research_staffing_ready: bool = management_campaign.research_assigned_scientists() == 3 and management_campaign.research_daily_progress() == 6
	var management_progress_before := int(management_campaign.data.get("research", {}).get("progress", 0))
	management_campaign.advance_minutes(24 * 60)
	var research_clock_ready: bool = int(management_campaign.data.get("day", 0)) == 2 and int(management_campaign.data.get("research", {}).get("progress", 0)) == management_progress_before + 6
	var checks := [
		{"name":"Godot content manifest loads", "pass":not content.is_empty()},
		{"name":"Save format remains version 4", "pass":int(content.get("save_format",0)) == 4 and AegisCampaignState.SAVE_FORMAT == 4},
		{"name":"New campaign creates a named base", "pass":test_campaign.data.get("base",{}).get("name","") == "Test Aegis"},
		{"name":"Six soldiers form the opening response squad", "pass":test_campaign.assigned_soldiers().size() == 6},
		{"name":"Hex cells expose six bounded neighbors", "pass":AegisHexRules.neighbors(Vector2i(3,3),8,8).size() == 6},
		{"name":"Intact walls block direct movement", "pass":closed_path.is_empty()},
		{"name":"Destroyed wall cells become traversable", "pass":not open_path.is_empty() and open_path.has(Vector2i(2,1))},
		{"name":"Mission travel starts from an assigned squad", "pass":test_campaign.begin_mission_travel()},
		{"name":"Thirty minutes reaches the opening incident", "pass":test_campaign.advance_minutes(30)},
		{"name":"Tactical board deploys six soldiers and two civilians", "pass":tactical_humans.size() == 6 and tactical_civilians.size() == 2},
		{"name":"Skyranger exposes a nine-cell rescue ramp", "pass":test_board.extraction_cells.size() == 9},
		{"name":"Civilian contact links an escort and spends eight TU", "pass":civilian.get("escort_id", "") == shooter.get("id", "") and int(shooter.get("tu", 0)) == 8},
		{"name":"Destroyed tactical wall becomes nonblocking rubble", "pass":wall.get("type", "") == "rubble" and not test_board._blocked_cells().has(wall_key)},
		{"name":"Area security waits for mandatory rescue", "pass":rescue_gate_holds},
		{"name":"Mandatory rescue completion resolves victory", "pass":rescue_gate_completes},
		{"name":"Tactical battle log trims immediately at ten entries", "pass":tactical_log_is_bounded},
		{"name":"Native campaign starts with interceptor and tracked UFO", "pass":air_defaults_ready},
		{"name":"Interception launch commits stance fuel and outbound state", "pass":air_launch_ready},
		{"name":"Mid-interception save state normalizes at exact progress", "pass":air_midflight_normalizes},
		{"name":"Deterministic air combat resolves into a return leg", "pass":air_combat_resolves},
		{"name":"Downed UFO creates a tactical recovery incident", "pass":air_crash_created},
		{"name":"Returned interceptor enters bounded base service", "pass":air_return_services},
		{"name":"Aircraft service restores fuel hull ammo and readiness", "pass":air_service_restores},
		{"name":"HTML campaign export wrapper produces a valid import preview", "pass":import_preview.get("valid", false) and import_preview.get("source_build", "") == "v0.26.07.17.0137_TEST_FIXTURE"},
		{"name":"Unsupported browser backup and future save formats are rejected", "pass":unsupported_imports_rejected},
		{"name":"Browser import creates a compatible campaign copy", "pass":browser_import_succeeds and import_maps_campaign},
		{"name":"Browser soldier stats and active squad map into native readiness", "pass":import_maps_roster},
		{"name":"Browser rescue incident maps into a launchable native mission", "pass":import_maps_incident},
		{"name":"Imported campaign uses an isolated save slot with provenance", "pass":import_slot_isolated},
		{"name":"Browser save picker uses a bounded review-before-write flow", "pass":MAX_BROWSER_IMPORT_BYTES == 32 * 1024 * 1024 and has_method("_open_browser_import") and has_method("_show_browser_import_review") and has_method("_confirm_browser_import")},
		{"name":"Dense strategic incidents receive distinct marker and hit positions", "pass":dense_incidents_separate},
		{"name":"Large imported command lists use page-owned scrolling", "pass":has_method("_mount_scrollable_command_page") and imported_roster.size() > 6},
		{"name":"Living Quarters and Laboratories expose exact local capacity", "pass":personnel_capacity_ready},
		{"name":"Legacy native saves receive conservative personnel staffing defaults", "pass":management_migration_ready},
		{"name":"Research assignments clamp to scientists and laboratory capacity", "pass":research_staffing_ready},
		{"name":"Strategic midnight advances research by deterministic staff output", "pass":research_clock_ready}
	]
	test_board.free()
	dense_map.free()
	return checks

func _browser_import_test_payload() -> Dictionary:
	var soldiers: Array = []
	for soldier_index in range(8):
		var fixture_soldier := {
			"id": "browser_%d" % soldier_index,
			"baseId": "base_pacific",
			"name": "Browser Soldier %d" % (soldier_index + 1),
			"callsign": "B%d" % (soldier_index + 1),
			"rank": "Corporal" if soldier_index == 0 else "Rookie",
			"status": "Sickbay - 3 days" if soldier_index == 5 else "Ready",
			"aim": 74 - soldier_index,
			"bravery": 58 + soldier_index,
			"maxHp": 42 + soldier_index,
			"timeUnits": 63 - soldier_index,
			"missions": 3,
			"kills": soldier_index,
			"weapon": {"name": "Ballistic Rifle"},
			"armor": {"name": "Field Suit"}
		}
		if soldier_index == 0:
			fixture_soldier.erase("callsign")
			fixture_soldier.erase("aim")
			fixture_soldier.erase("bravery")
			fixture_soldier.erase("maxHp")
			fixture_soldier.erase("timeUnits")
			fixture_soldier["stats"] = {"accuracy": 74, "bravery": 58, "health": 42, "tu": 63}
			fixture_soldier["identity"] = {"callsign": "Nested", "trait": "Methodical"}
		soldiers.append(fixture_soldier)
	return {
		"kind": AegisCampaignState.BROWSER_CAMPAIGN_KIND,
		"saveFormatVersion": 4,
		"gameBuild": "v0.26.07.17.0137_TEST_FIXTURE",
		"name": "Pacific Watch",
		"month": 4,
		"dayOfMonth": 12,
		"funds": 3180,
		"data": {
			"saveFormatVersion": 4,
			"gameBuild": "v0.26.07.17.0137_TEST_FIXTURE",
			"month": 4,
			"dayOfMonth": 12,
			"funds": 3180,
			"geoscapeMinuteOfDay": 845,
			"scientists": 10,
			"engineers": 2,
			"bases": [
				{"id": "base_old", "name": "Atlantic Aegis", "region": "Europe", "facilities": []},
				{"id": "base_pacific", "name": "Pacific Aegis", "region": "Oceania", "grid": [["access", "lab", "quarters"], ["shortradar", "hangar-browser", "quarters"]]}
			],
			"selectedBaseId": "base_pacific",
			"soldiers": soldiers,
			"squads": [{"id": "squad_active", "soldierIds": ["browser_0", "browser_1", "browser_2", "browser_3", "browser_4", "browser_5", "browser_6", "browser_7"]}],
			"activeSquadId": "squad_active",
			"missions": [{
				"id": "port_meridian",
				"name": "Port Meridian Attack",
				"region": "Oceania",
				"kind": "Terror Raid",
				"threat": 3,
				"reward": 720,
				"biome": "Urban District",
				"civilianObjective": {"required": 2},
				"seed": 7103
			}],
			"gearInventory": {"Medkit": 4},
			"research": {"topic": "Laser Power Output 1", "progress": 46, "assignedScientists": 10},
			"reports": ["Browser fixture ready for native import."]
		}
	}

func _content_by_id(items: Array, item_id: String) -> Dictionary:
	for item in items:
		if item.get("id", "") == item_id:
			return item
	return {}

func _mount_scrollable_command_page(page: Control) -> void:
	var scroll := ScrollContainer.new()
	scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	page.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(page)
	command_content.add_child(scroll)

func _build_theme() -> Theme:
	var game_theme := Theme.new()
	game_theme.set_default_font_size(15)
	game_theme.set_color("font_color", "Label", color_text)
	game_theme.set_color("font_color", "Button", color_text)
	game_theme.set_color("font_hover_color", "Button", Color.WHITE)
	game_theme.set_color("font_pressed_color", "Button", color_cyan)
	game_theme.set_stylebox("normal", "Button", _stylebox(Color("14262d"), color_border, 1, 4))
	game_theme.set_stylebox("hover", "Button", _stylebox(Color("1b3943"), color_cyan, 1, 4))
	game_theme.set_stylebox("pressed", "Button", _stylebox(Color("0e4b58"), color_cyan, 2, 4))
	game_theme.set_stylebox("focus", "Button", _stylebox(Color("14262d"), color_cyan, 2, 4))
	game_theme.set_stylebox("normal", "LineEdit", _stylebox(Color("081418"), color_border, 1, 4))
	game_theme.set_stylebox("focus", "LineEdit", _stylebox(Color("081418"), color_cyan, 2, 4))
	game_theme.set_color("font_color", "LineEdit", color_text)
	game_theme.set_color("font_placeholder_color", "LineEdit", color_muted)
	return game_theme

func _stylebox(fill: Color, border: Color, width: int = 1, radius: int = 4) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(width)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 10
	style.content_margin_bottom = 10
	return style

func _margin(child: Control, amount: int) -> MarginContainer:
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", amount)
	margin.add_theme_constant_override("margin_right", amount)
	margin.add_theme_constant_override("margin_top", amount)
	margin.add_theme_constant_override("margin_bottom", amount)
	margin.add_child(child)
	return margin

func _panel() -> PanelContainer:
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _stylebox(color_surface, color_border, 1, 5))
	return panel

func _panel_with(child: Control, padding: int = 16) -> PanelContainer:
	var panel := _panel()
	panel.add_child(_margin(child, padding))
	return panel

func _label(text: String, size_value: int = 15, color: Color = Color.WHITE, wrap: bool = false) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", size_value)
	label.add_theme_color_override("font_color", color)
	label.text_overrun_behavior = TextServer.OVERRUN_NO_TRIMMING
	if wrap:
		label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		label.text_overrun_behavior = TextServer.OVERRUN_NO_TRIMMING
		label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		label.custom_minimum_size.y = ceilf(float(size_value) * 2.2)
		label.vertical_alignment = VERTICAL_ALIGNMENT_TOP
	return label

func _action_button(text: String, callback: Callable, primary: bool = false) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size.y = 46
	button.alignment = HORIZONTAL_ALIGNMENT_LEFT
	if primary:
		button.add_theme_stylebox_override("normal", _stylebox(Color("075568"), color_cyan, 1, 4))
		button.add_theme_stylebox_override("hover", _stylebox(Color("08758a"), Color.WHITE, 1, 4))
	button.pressed.connect(callback)
	return button

func _small_button(text: String, callback: Callable) -> Button:
	var button := _action_button(text, callback)
	button.custom_minimum_size = Vector2(84, 38)
	button.alignment = HORIZONTAL_ALIGNMENT_CENTER
	return button

func _separator() -> HSeparator:
	var separator := HSeparator.new()
	separator.add_theme_constant_override("separation", 12)
	return separator

func _metric(label_text: String, value: String, color: Color) -> Control:
	var box := VBoxContainer.new()
	box.custom_minimum_size.x = 96
	box.add_child(_label(label_text, 10, color_muted))
	box.add_child(_label(value, 17, color))
	return box

func _metric_card(label_text: String, value: String, color: Color) -> Control:
	var box := VBoxContainer.new()
	box.custom_minimum_size = Vector2(150, 82)
	box.add_child(_label(label_text, 10, color_muted))
	box.add_child(_label(value, 18, color, true))
	return _panel_with(box, 12)

func _status_row(label_text: String, value: String, value_color: Color) -> Control:
	var row := HBoxContainer.new()
	row.add_child(_label(label_text, 14, color_muted))
	row.add_spacer(false)
	row.add_child(_label(value, 14, value_color, true))
	return row

func _page_header(kicker: String, title_text: String, compact: bool = true) -> Control:
	var row := HBoxContainer.new()
	row.custom_minimum_size.y = 64 if compact else 78
	var text := VBoxContainer.new()
	text.add_child(_label(kicker, 12, color_cyan))
	text.add_child(_label(title_text, 27, color_text))
	row.add_child(text)
	return row

func _section_title(title_text: String, subtitle: String) -> Control:
	var row := HBoxContainer.new()
	var text := VBoxContainer.new()
	text.add_child(_label(title_text, 27, color_text))
	text.add_child(_label(subtitle, 14, color_muted))
	row.add_child(text)
	row.add_spacer(false)
	return row
