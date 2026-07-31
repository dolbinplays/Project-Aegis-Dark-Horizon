extends Control

const NATIVE_BUILD := "v0.26.07.31.GODOT.0015_VOICE_AUDIBILITY_NORMALIZATION_AND_MUSIC_DUCKING_VERTICAL_SLICE"
const MAX_BROWSER_IMPORT_BYTES := 32 * 1024 * 1024
const AUDIO_SETTINGS_PATH := "user://project_aegis_audio_settings.cfg"
const VOICE_MAKEUP_DB := 6.0
const VOICE_MUSIC_DUCK_DB := -16.0

var content: Dictionary = {}
var campaign := AegisCampaignState.new()
var ui_root: Control
var music_player: AudioStreamPlayer
var sfx_player: AudioStreamPlayer
var voice_player: AudioStreamPlayer
var voice_queue: Array[String] = []
var music_enabled := true
var voice_enabled := true
var voice_volume_percent := 80
var current_tab := "geoscape"
var selected_setup_region := "North America"
var base_name_input: LineEdit
var tactical_board: AegisTacticalBoard
var tactical_result: Dictionary = {}
var tactical_status_label: Label
var tactical_selection_label: Label
var tactical_log_box: VBoxContainer
var tactical_medkit_button: Button
var tactical_end_turn_button: Button
var tactical_return_button: Button
var tactical_ai_button: Button
var tactical_stance_button: Button
var tactical_right_hand_button: Button
var tactical_left_hand_button: Button
var tactical_prime_button: Button
var tactical_cancel_target_button: Button
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
	_load_audio_settings()
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
	voice_player = AudioStreamPlayer.new()
	voice_player.name = "VoicePlayer"
	voice_player.bus = &"Voices"
	voice_player.volume_db = VOICE_MAKEUP_DB
	add_child(voice_player)
	voice_player.finished.connect(_play_next_voice)
	_apply_voice_settings()

func _load_audio_settings() -> void:
	var config := ConfigFile.new()
	if config.load(AUDIO_SETTINGS_PATH) != OK:
		return
	voice_enabled = bool(config.get_value("voices", "enabled", true))
	voice_volume_percent = clampi(int(config.get_value("voices", "volume", 80)), 0, 100)

func _save_audio_settings() -> void:
	var config := ConfigFile.new()
	config.set_value("voices", "enabled", voice_enabled)
	config.set_value("voices", "volume", voice_volume_percent)
	config.save(AUDIO_SETTINGS_PATH)

func _apply_voice_settings() -> void:
	var bus_index := AudioServer.get_bus_index(&"Voices")
	if bus_index < 0:
		return
	AudioServer.set_bus_mute(bus_index, not voice_enabled)
	var linear_volume := maxf(float(voice_volume_percent) / 100.0, 0.0001)
	AudioServer.set_bus_volume_db(bus_index, linear_to_db(linear_volume))

func _set_voice_enabled(enabled: bool) -> void:
	voice_enabled = enabled
	if not voice_enabled:
		voice_queue.clear()
		if voice_player:
			voice_player.stop()
		_set_voice_music_duck(false)
	_apply_voice_settings()
	_save_audio_settings()

func _set_voice_volume(value: float) -> void:
	voice_volume_percent = clampi(int(round(value)), 0, 100)
	_apply_voice_settings()
	_save_audio_settings()

func _test_voice() -> void:
	if voice_enabled:
		_play_voice("Commander action required.wav")
		_play_voice("Skyranger ready.wav")
		_play_voice("Copy steady professional.wav")

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
	if file_name.is_empty() or not voice_enabled:
		return
	voice_queue.append(file_name)
	_play_next_voice()

func _play_next_voice() -> void:
	if not voice_enabled or voice_player == null:
		_set_voice_music_duck(false)
		return
	if voice_player.playing:
		return
	if voice_queue.is_empty():
		_set_voice_music_duck(false)
		return
	var file_name: String = voice_queue.pop_front()
	var stream = load("res://assets/audio/dialogue/%s" % file_name)
	if stream == null:
		_play_next_voice()
		return
	voice_player.stream = stream
	voice_player.volume_db = VOICE_MAKEUP_DB
	_set_voice_music_duck(true)
	voice_player.play()

func _set_voice_music_duck(active: bool) -> void:
	if music_player:
		music_player.volume_db = VOICE_MUSIC_DUCK_DB if active else 0.0

func _show_audio_settings() -> void:
	var dialog := AcceptDialog.new()
	dialog.title = "Audio Settings"
	dialog.ok_button_text = "Done"
	dialog.min_size = Vector2i(520, 260)
	var controls := VBoxContainer.new()
	controls.add_theme_constant_override("separation", 14)
	dialog.add_child(controls)
	var enabled_toggle := CheckBox.new()
	enabled_toggle.text = "Voices"
	enabled_toggle.button_pressed = voice_enabled
	controls.add_child(enabled_toggle)
	var volume_row := HBoxContainer.new()
	volume_row.add_theme_constant_override("separation", 12)
	volume_row.add_child(_label("Voice Volume", 13, color_muted))
	var volume_slider := HSlider.new()
	volume_slider.min_value = 0
	volume_slider.max_value = 100
	volume_slider.step = 1
	volume_slider.value = voice_volume_percent
	volume_slider.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	volume_slider.custom_minimum_size.x = 280
	volume_row.add_child(volume_slider)
	var volume_label := _label("%d%%" % voice_volume_percent, 13, color_text)
	volume_row.add_child(volume_label)
	controls.add_child(volume_row)
	var test_button := _action_button("Test Voices", _test_voice)
	test_button.disabled = not voice_enabled
	controls.add_child(test_button)
	enabled_toggle.toggled.connect(func(enabled: bool):
		_set_voice_enabled(enabled)
		volume_slider.editable = enabled
		test_button.disabled = not enabled
	)
	volume_slider.editable = voice_enabled
	volume_slider.value_changed.connect(func(value: float):
		_set_voice_volume(value)
		volume_label.text = "%d%%" % voice_volume_percent
	)
	ui_root.add_child(dialog)
	dialog.popup_centered()
	dialog.confirmed.connect(dialog.queue_free)

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
	menu.add_child(_action_button("Audio Settings", _show_audio_settings))
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
	row.add_child(_small_button("Audio", _show_audio_settings))
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
		["LOCAL PERSONNEL", "%d / %d%s" % [personnel_used, personnel_capacity, " (+%d)" % campaign.pending_personnel_count() if campaign.pending_personnel_count() > 0 else ""], capacity_color],
		["SOLDIERS", str(campaign.living_soldier_count()), color_cyan],
		["SCIENTISTS", "%d / %d" % [campaign.data.get("scientists", 0), campaign.scientist_capacity()], Color("c4b5fd")],
		["ENGINEERS", "%d / %d" % [campaign.data.get("engineers", 0), campaign.engineer_capacity()], color_gold]
	]:
		var metric_card := _metric_card(metric_data[0], metric_data[1], metric_data[2])
		metric_card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		summary.add_child(metric_card)
	root.add_child(summary)
	if personnel_used > personnel_capacity:
		root.add_child(_label("PERSONNEL CAPACITY EXCEEDED - %d staff require additional Living Quarters." % (personnel_used - personnel_capacity), 13, color_red, true))
	_render_facility_construction(root)
	_render_personnel_office(root)
	var advance_button := _action_button("Advance One Strategic Day", _advance_base_day, true)
	advance_button.disabled = not campaign.data.get("travel", {}).is_empty() or not campaign.data.get("interception", {}).is_empty()
	advance_button.tooltip_text = "Strategic time advance is unavailable during an active flight operation." if advance_button.disabled else "Advance personnel arrivals, construction, research, manufacturing, and aircraft service together."
	root.add_child(advance_button)
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
		"quarters":"%d / %d projected local personnel capacity." % [campaign.projected_personnel_used(), campaign.personnel_capacity()],
		"lab":"%d active + %d inbound / %d Scientists. %d assigned to %s." % [campaign.data.get("scientists", 0), campaign.pending_personnel_count("scientist"), campaign.scientist_capacity(), campaign.research_assigned_scientists(), research.get("active", "research")],
		"workshop":"%d active + %d inbound / %d Engineers." % [campaign.data.get("engineers", 0), campaign.pending_personnel_count("engineer"), campaign.engineer_capacity()],
		"sickbay":"0 / 4 beds occupied.",
		"stores":"Local equipment accounted for.",
		"hangar_interceptor":"Saber One ready.",
		"hangar_skyranger":"Aegis One ready.",
		"radar":"4,500 km coverage active."
	}
	return statuses.get(facility_id, "Facility ready.")

func _render_facility_construction(root: VBoxContainer) -> void:
	var construction := VBoxContainer.new()
	construction.add_theme_constant_override("separation", 12)
	var orders := campaign.facility_construction_orders()
	construction.add_child(_label("FACILITY CONSTRUCTION", 18, color_cyan))
	construction.add_child(_label("%d/%d concurrent projects - Available funds $%dk" % [orders.size(), AegisCampaignState.MAX_FACILITY_CONSTRUCTION_ORDERS, campaign.data.get("funds", 0)], 13, color_muted, true))
	var catalog := GridContainer.new()
	catalog.columns = 3
	catalog.add_theme_constant_override("h_separation", 10)
	for definition_value in content.get("facilities", []):
		var definition: Dictionary = definition_value
		if int(definition.get("build_cost", 0)) <= 0 or int(definition.get("construction_days", 0)) <= 0:
			continue
		var facility_id := String(definition.get("id", ""))
		var blocker := campaign.facility_construction_blocker(facility_id)
		var card := VBoxContainer.new()
		card.custom_minimum_size = Vector2(250, 150)
		card.add_theme_constant_override("separation", 8)
		card.add_child(_label(definition.get("name", facility_id), 17, Color(definition.get("color", "#67e8f9")), true))
		card.add_child(_label("%s - %d day%s" % [definition.get("capacity_label", "Capacity expansion"), definition.get("construction_days", 0), "" if int(definition.get("construction_days", 0)) == 1 else "s"], 12, color_muted, true))
		card.add_child(_label("Operational %d - After projects %d" % [campaign.facility_count(facility_id), campaign.facility_count(facility_id) + campaign.pending_facility_count(facility_id)], 12, color_text, true))
		card.add_spacer(false)
		var build_button := _action_button("Build - $%dk" % definition.get("build_cost", 0), func(): _begin_facility_construction(facility_id), true)
		build_button.disabled = not blocker.is_empty()
		build_button.tooltip_text = blocker if build_button.disabled else "Prepay and begin this local facility project."
		card.add_child(build_button)
		catalog.add_child(_panel_with(card, 16))
	construction.add_child(catalog)
	if orders.is_empty():
		construction.add_child(_label("No facilities currently under construction.", 13, color_green))
	else:
		construction.add_child(_separator())
		construction.add_child(_label("ACTIVE CONSTRUCTION", 12, color_muted))
		for order_value in orders:
			var order: Dictionary = order_value
			var row := HBoxContainer.new()
			row.add_theme_constant_override("separation", 12)
			var text := VBoxContainer.new()
			text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			text.add_child(_label(order.get("label", "Facility"), 15, color_text))
			var progress := ProgressBar.new()
			var total_days := maxi(1, int(order.get("total_days", 1)))
			var days_remaining := clampi(int(order.get("days_remaining", total_days)), 0, total_days)
			progress.max_value = total_days
			progress.value = total_days - days_remaining
			progress.custom_minimum_size = Vector2(520, 26)
			text.add_child(progress)
			text.add_child(_label("%d day%s remaining - capacity activates on completion" % [days_remaining, "" if days_remaining == 1 else "s"], 12, color_muted, true))
			row.add_child(text)
			var order_id := String(order.get("id", ""))
			var refund := campaign.facility_construction_cancel_refund(order)
			var cancel_button := _small_button("Cancel +$%dk" % refund, func(): _cancel_facility_construction(order_id))
			cancel_button.tooltip_text = "Cancel this project and recover half of its prepaid cost."
			row.add_child(cancel_button)
			construction.add_child(row)
	root.add_child(_panel_with(construction, 20))

func _render_personnel_office(root: VBoxContainer) -> void:
	var office := VBoxContainer.new()
	office.add_theme_constant_override("separation", 12)
	var projected := campaign.projected_personnel_used()
	office.add_child(_label("PERSONNEL OFFICE", 18, color_cyan))
	office.add_child(_label("%d active + %d inbound = %d/%d projected Living Quarters occupancy." % [campaign.personnel_used(), campaign.pending_personnel_count(), projected, campaign.personnel_capacity()], 13, color_muted, true))
	var hiring_row := HBoxContainer.new()
	hiring_row.add_theme_constant_override("separation", 10)
	for type_value in ["soldier", "scientist", "engineer"]:
		var personnel_type := String(type_value)
		var definition: Dictionary = AegisCampaignState.PERSONNEL_HIRING[personnel_type]
		var blocker := campaign.personnel_hiring_blocker(personnel_type)
		var hire_button := _action_button("%s - $%dk" % ["Recruit Soldier" if personnel_type == "soldier" else "Hire %s" % definition.get("label", "Personnel"), definition.get("cost", 0)], func(): _hire_personnel(personnel_type), personnel_type == "soldier")
		hire_button.disabled = not blocker.is_empty()
		hire_button.tooltip_text = blocker if not blocker.is_empty() else "%s arrives in %d strategic days." % [definition.get("label", "Personnel"), AegisCampaignState.PERSONNEL_ARRIVAL_DAYS]
		hire_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		hiring_row.add_child(hire_button)
	office.add_child(hiring_row)
	var shown_blockers := {}
	for type_value in ["soldier", "scientist", "engineer"]:
		var personnel_type := String(type_value)
		var blocker := campaign.personnel_hiring_blocker(personnel_type)
		if not blocker.is_empty() and not shown_blockers.has(blocker):
			shown_blockers[blocker] = true
			office.add_child(_label(blocker, 11, color_gold, true))
	var orders := campaign.personnel_orders()
	if orders.is_empty():
		office.add_child(_label("No personnel currently in transit.", 13, color_green))
	else:
		office.add_child(_separator())
		office.add_child(_label("PENDING ARRIVALS", 12, color_muted))
		for order_value in orders:
			var order: Dictionary = order_value
			var row := HBoxContainer.new()
			row.add_theme_constant_override("separation", 10)
			var label := String(order.get("recruit", {}).get("name", AegisCampaignState.PERSONNEL_HIRING.get(order.get("type", ""), {}).get("label", "Personnel")))
			row.add_child(_label(label, 14, color_text))
			row.add_child(_label("%d day%s remaining" % [order.get("days_remaining", 0), "" if int(order.get("days_remaining", 0)) == 1 else "s"], 13, color_cyan))
			row.add_spacer(false)
			var order_id := String(order.get("id", ""))
			row.add_child(_small_button("Cancel (+$%dk)" % campaign.personnel_order_cancel_refund(order), func(): _cancel_personnel_order(order_id)))
			office.add_child(row)
	root.add_child(_panel_with(office, 20))

func _begin_facility_construction(facility_id: String) -> void:
	campaign.begin_facility_construction(facility_id)
	campaign.save_campaign()
	_show_command("base")

func _cancel_facility_construction(order_id: String) -> void:
	campaign.cancel_facility_construction(order_id)
	campaign.save_campaign()
	_show_command("base")

func _hire_personnel(personnel_type: String) -> void:
	campaign.hire_personnel(personnel_type)
	campaign.save_campaign()
	_show_command("base")

func _cancel_personnel_order(order_id: String) -> void:
	campaign.cancel_personnel_order(order_id)
	campaign.save_campaign()
	_show_command("base")

func _advance_base_day() -> void:
	campaign.advance_minutes(24 * 60)
	campaign.save_campaign()
	_show_command("base")

func _render_soldiers() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 14)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("SOLDIER ROSTER", "Fort Aegis ready personnel"))
	var armory := HBoxContainer.new()
	armory.add_theme_constant_override("separation", 24)
	armory.add_child(_label("LOCAL ARMORY - LOOSE STOCK", 13, color_cyan))
	for item_name in ["Ballistic Rifle", "Laser Rifle", "Field Suit", "Medkit"]:
		armory.add_child(_metric(item_name.to_upper(), str(campaign.loadout_stock(item_name)), color_gold if campaign.loadout_stock(item_name) > 0 else color_muted))
	armory.add_spacer(false)
	root.add_child(_panel_with(armory, 14))
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 12)
	root.add_child(grid)
	for soldier in campaign.data.get("soldiers", []):
		var row := HBoxContainer.new()
		row.custom_minimum_size = Vector2(450, 184)
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
		var soldier_status := campaign.soldier_status_text(soldier)
		var status_color := color_red if soldier_status == "KIA" else color_gold if soldier_status.begins_with("Wounded") else color_muted
		text.add_child(_label("%s - %s - %s" % [soldier.get("rank", "Rookie"), soldier.get("trait", "Steady"), soldier_status], 13, status_color, true))
		text.add_child(_label("ACC %d   TU %d   HP %d" % [soldier.get("accuracy",0), soldier.get("tu",0), soldier.get("health",0)], 13, color_cyan))
		row.add_child(text)
		var controls := VBoxContainer.new()
		controls.custom_minimum_size.x = 176
		var assigned := CheckButton.new()
		assigned.text = "Squad"
		assigned.button_pressed = soldier.get("assigned", false)
		assigned.disabled = soldier.get("status", "") != "Ready"
		var soldier_id := String(soldier.get("id", ""))
		assigned.toggled.connect(func(value):
			campaign.set_soldier_assigned(soldier_id, value)
			campaign.save_campaign()
		)
		controls.add_child(assigned)
		var medkit := CheckButton.new()
		medkit.text = "Medkit"
		medkit.button_pressed = bool(soldier.get("medkit", false))
		medkit.disabled = soldier.get("status", "") == "KIA" or (not medkit.button_pressed and campaign.loadout_stock("Medkit") <= 0)
		medkit.tooltip_text = "Return the issued Medkit to local stores." if medkit.button_pressed else "Issue one local Medkit to this soldier." if not medkit.disabled else "No loose Medkits are available."
		medkit.toggled.connect(func(value):
			if campaign.change_soldier_medkit(soldier_id, value):
				campaign.save_campaign()
				_show_command("soldiers")
			else:
				medkit.set_pressed_no_signal(not value)
		)
		controls.add_child(medkit)
		controls.add_child(_loadout_picker(soldier, "weapon"))
		controls.add_child(_loadout_picker(soldier, "armor"))
		row.add_child(controls)
		grid.add_child(_panel_with(row, 16))

func _loadout_picker(soldier: Dictionary, slot: String) -> OptionButton:
	var picker := OptionButton.new()
	picker.custom_minimum_size = Vector2(174, 34)
	var current_item := String(soldier.get(slot, campaign.loadout_empty_item(slot)))
	picker.add_item("%s: %s" % [slot.capitalize(), current_item])
	picker.set_item_metadata(0, current_item)
	for definition_value in campaign.loadout_definitions(slot):
		if not definition_value is Dictionary:
			continue
		var item_name := String(definition_value.get("id", ""))
		if item_name.is_empty() or item_name == current_item:
			continue
		var issued_item := bool(definition_value.get("issued_item", true))
		var stock := campaign.loadout_stock(item_name)
		if issued_item and stock <= 0:
			continue
		var label := "%s: %s" % [slot.capitalize(), item_name]
		if issued_item:
			label += " (%d stock)" % stock
		picker.add_item(label)
		picker.set_item_metadata(picker.item_count - 1, item_name)
	picker.disabled = String(soldier.get("status", "Ready")) == "KIA"
	var soldier_id := String(soldier.get("id", ""))
	picker.item_selected.connect(func(index):
		var selected_item := String(picker.get_item_metadata(index))
		if campaign.change_soldier_loadout(soldier_id, slot, selected_item):
			campaign.save_campaign()
			_show_command("soldiers")
	)
	return picker

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
	var active_definition := campaign._research_definition(String(research.get("active", "")))
	if not String(active_definition.get("description", "")).is_empty():
		card.add_child(_label(active_definition.get("description", ""), 13, color_muted, true))
	var bar := ProgressBar.new()
	bar.max_value = required_progress
	bar.value = int(research.get("progress", 0))
	bar.custom_minimum_size = Vector2(600, 32)
	card.add_child(bar)
	var state_text := "PROJECT COMPLETE - laboratory staff released." if completed else "%d research points per day - %s" % [daily_progress, "%d day%s remaining" % [days_remaining, "" if days_remaining == 1 else "s"] if days_remaining >= 0 else "No progress while unstaffed"]
	card.add_child(_label(state_text, 15, color_green if completed else color_muted, true))
	if completed:
		var unlock_labels := campaign.research_completion_unlock_labels(String(research.get("active", "")))
		if not unlock_labels.is_empty():
			card.add_child(_label("UNLOCKED: %s" % ", ".join(unlock_labels), 14, color_gold, true))
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
	var pipeline := VBoxContainer.new()
	pipeline.add_theme_constant_override("separation", 12)
	pipeline.add_child(_label("RESEARCH PIPELINE", 18, color_cyan))
	var completed_topics := campaign.completed_research()
	pipeline.add_child(_status_row("Completed", ", ".join(completed_topics) if not completed_topics.is_empty() else "None", color_green if not completed_topics.is_empty() else color_muted))
	var available_projects := campaign.available_research_projects()
	if available_projects.is_empty():
		pipeline.add_child(_label("No additional bounded-slice projects are currently available.", 13, color_muted, true))
	else:
		for project_value in available_projects:
			var project: Dictionary = project_value
			var project_id := String(project.get("id", ""))
			var row := HBoxContainer.new()
			row.add_theme_constant_override("separation", 12)
			var text := VBoxContainer.new()
			text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			text.add_child(_label(project_id, 17, Color("c4b5fd")))
			text.add_child(_label("%d points - %s" % [project.get("required", 0), project.get("description", "")], 12, color_muted, true))
			row.add_child(text)
			var begin_button := _action_button("Begin Project", func(): _start_research_project(project_id), true)
			begin_button.disabled = not completed
			begin_button.tooltip_text = "Complete the active project first." if not completed else "Open this project with zero assigned scientists."
			row.add_child(begin_button)
			pipeline.add_child(row)
	root.add_child(_panel_with(pipeline, 20))

func _advance_research_day() -> void:
	campaign.advance_minutes(24 * 60)
	campaign.save_campaign()
	_show_command("research")

func _start_research_project(topic: String) -> void:
	campaign.start_research_project(topic)
	campaign.save_campaign()
	_show_command("research")

func _render_workshop() -> void:
	var root := VBoxContainer.new()
	root.add_theme_constant_override("separation", 18)
	_mount_scrollable_command_page(root)
	root.add_child(_section_title("WORKSHOP", "Engineering production queue"))
	var stores: Dictionary = campaign.data.get("stores", {})
	var queue := campaign.manufacturing_queue()
	var assigned := campaign.manufacturing_assigned_engineers()
	var staff_limit := campaign.manufacturing_staff_limit()
	var daily_progress := campaign.manufacturing_daily_progress()
	var summary := GridContainer.new()
	summary.columns = 4
	summary.add_theme_constant_override("h_separation", 12)
	for metric_data in [
		["ENGINEERS", "%d / %d" % [campaign.data.get("engineers", 0), campaign.engineer_capacity()], color_text],
		["ASSIGNED", str(assigned), color_green if assigned > 0 else color_gold],
		["OUTPUT / DAY", str(daily_progress), color_cyan],
		["QUEUE", "%d / %d" % [queue.size(), campaign.MAX_MANUFACTURING_ORDERS], color_text]
	]:
		var metric_card := _metric_card(metric_data[0], metric_data[1], metric_data[2])
		metric_card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		summary.add_child(metric_card)
	root.add_child(summary)
	var staffing_card := VBoxContainer.new()
	staffing_card.add_theme_constant_override("separation", 12)
	staffing_card.add_child(_label("ENGINEERING STAFFING", 18, color_cyan))
	var staffing_row := HBoxContainer.new()
	staffing_row.add_theme_constant_override("separation", 12)
	staffing_row.add_child(_label("Assigned Engineers", 15, color_text))
	var staffing := SpinBox.new()
	staffing.min_value = 0
	staffing.max_value = staff_limit
	staffing.step = 1
	staffing.value = assigned
	staffing.custom_minimum_size = Vector2(150, 40)
	staffing.editable = not queue.is_empty()
	staffing.value_changed.connect(func(value: float): _set_manufacturing_staffing(int(value)))
	staffing_row.add_child(staffing)
	staffing_row.add_child(_label("of %d available Workshop positions" % staff_limit, 13, color_muted))
	staffing_card.add_child(staffing_row)
	staffing_card.add_child(_label("Each assigned Engineer contributes %d work per strategic day." % campaign.MANUFACTURING_PROGRESS_PER_ENGINEER_DAY, 13, color_muted, true))
	root.add_child(_panel_with(staffing_card, 20))
	var catalog := VBoxContainer.new()
	catalog.add_theme_constant_override("separation", 12)
	catalog.add_child(_label("PRODUCTION CATALOG", 18, color_cyan))
	for definition_value in content.get("manufacturing_items", []):
		var definition: Dictionary = definition_value
		var item_name := String(definition.get("id", "Item"))
		var blocker := campaign.manufacturing_order_blocker(item_name)
		var product_row := HBoxContainer.new()
		product_row.add_theme_constant_override("separation", 12)
		var product_text := VBoxContainer.new()
		product_text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		product_text.add_child(_label(item_name, 17, color_text))
		product_text.add_child(_label("%d work - %s - Local stores: %d" % [definition.get("work", 0), definition.get("description", ""), stores.get(item_name, 0)], 12, color_muted, true))
		product_row.add_child(product_text)
		var queue_button := _action_button("Queue - $%dk" % definition.get("cost", 0), func(): _queue_manufacturing_item(item_name), true)
		queue_button.disabled = not blocker.is_empty()
		queue_button.tooltip_text = blocker if queue_button.disabled else "Prepay and append one %s to the local FIFO queue." % item_name
		product_row.add_child(queue_button)
		catalog.add_child(product_row)
	root.add_child(_panel_with(catalog, 20))
	var queue_card := VBoxContainer.new()
	queue_card.add_theme_constant_override("separation", 12)
	queue_card.add_child(_label("MANUFACTURING QUEUE", 18, color_cyan))
	if queue.is_empty():
		queue_card.add_child(_label("No orders queued. Engineers are available for reassignment.", 13, color_muted, true))
	else:
		for order_index in range(queue.size()):
			var order: Dictionary = queue[order_index]
			var order_row := HBoxContainer.new()
			order_row.add_theme_constant_override("separation", 12)
			var order_text := VBoxContainer.new()
			order_text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			var order_name := String(order.get("item_name", "Item"))
			order_text.add_child(_label("%s  %s" % ["ACTIVE" if order_index == 0 else "QUEUED", order_name], 15, color_green if order_index == 0 else color_text))
			var progress := ProgressBar.new()
			progress.max_value = maxi(1, int(order.get("work_required", 1)))
			progress.value = int(order.get("progress", 0))
			progress.custom_minimum_size = Vector2(480, 26)
			order_text.add_child(progress)
			var days_remaining := campaign.manufacturing_queue_days_remaining(String(order.get("id", "")))
			var eta_text := "%d day%s through FIFO" % [days_remaining, "" if days_remaining == 1 else "s"] if days_remaining >= 0 else "Paused - assign Engineers"
			order_text.add_child(_label("%d work remaining - %s" % [campaign.manufacturing_order_remaining_work(order), eta_text], 12, color_muted, true))
			order_row.add_child(order_text)
			var order_id := String(order.get("id", ""))
			var refund := campaign.manufacturing_order_cancel_refund(order)
			var cancel_button := _small_button("Cancel +$%dk" % refund, func(): _cancel_manufacturing_order(order_id))
			cancel_button.tooltip_text = "Cancel this order and recover half of its prepaid cost."
			order_row.add_child(cancel_button)
			queue_card.add_child(order_row)
	var advance_button := _action_button("Advance One Day", _advance_manufacturing_day, true)
	advance_button.disabled = not campaign.data.get("travel", {}).is_empty() or not campaign.data.get("interception", {}).is_empty()
	queue_card.add_child(advance_button)
	if advance_button.disabled:
		queue_card.add_child(_label("Strategic time advance is unavailable during an active flight operation.", 12, color_gold, true))
	root.add_child(_panel_with(queue_card, 20))

func _queue_manufacturing_item(item_name: String) -> void:
	campaign.queue_manufacturing(item_name)
	campaign.save_campaign()
	_show_command("workshop")

func _cancel_manufacturing_order(order_id: String) -> void:
	campaign.cancel_manufacturing_order(order_id)
	campaign.save_campaign()
	_show_command("workshop")

func _set_manufacturing_staffing(amount: int) -> void:
	if campaign.set_manufacturing_staffing(amount):
		campaign.save_campaign()
		_show_command("workshop")

func _advance_manufacturing_day() -> void:
	campaign.advance_minutes(24 * 60)
	campaign.save_campaign()
	_show_command("workshop")

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
	side.custom_minimum_size.x = 300
	side.add_theme_constant_override("separation", 12)
	body.add_child(_panel_with(side, 16))
	side.add_child(_label("BATTLE LOG", 12, color_cyan))
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	tactical_log_box = VBoxContainer.new()
	tactical_log_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	tactical_log_box.add_theme_constant_override("separation", 7)
	scroll.add_child(tactical_log_box)
	side.add_child(scroll)
	var console := HBoxContainer.new()
	console.custom_minimum_size.y = 174
	console.add_theme_constant_override("separation", 12)
	var unit_controls := VBoxContainer.new()
	unit_controls.custom_minimum_size.x = 340
	unit_controls.add_child(_label("UNIT", 11, color_cyan))
	var cycle_row := HBoxContainer.new()
	cycle_row.add_child(_small_button("Previous", func(): tactical_board.select_relative_soldier(-1)))
	cycle_row.add_child(_small_button("Next", func(): tactical_board.select_relative_soldier(1)))
	cycle_row.add_child(_small_button("Map", _show_tactical_map))
	unit_controls.add_child(cycle_row)
	unit_controls.add_child(_label("HANDS", 10, color_muted))
	var hands_row := HBoxContainer.new()
	tactical_right_hand_button = _small_button("RIGHT: WEAPON", func(): tactical_board.set_selected_active_hand("right"))
	tactical_right_hand_button.disabled = true
	hands_row.add_child(tactical_right_hand_button)
	tactical_left_hand_button = _small_button("LEFT: FRAG x1", func(): tactical_board.set_selected_active_hand("left"))
	tactical_left_hand_button.disabled = true
	hands_row.add_child(tactical_left_hand_button)
	unit_controls.add_child(hands_row)
	var target_row := HBoxContainer.new()
	tactical_prime_button = _small_button("Prime 4 TU", func(): tactical_board.prime_selected_grenade())
	tactical_prime_button.disabled = true
	target_row.add_child(tactical_prime_button)
	tactical_cancel_target_button = _small_button("Cancel Target", func(): tactical_board.cancel_selected_targeting())
	tactical_cancel_target_button.disabled = true
	target_row.add_child(tactical_cancel_target_button)
	unit_controls.add_child(target_row)
	var equipment_row := HBoxContainer.new()
	equipment_row.add_child(_small_button("Inventory", _show_tactical_inventory))
	tactical_stance_button = _small_button("Kneel", func(): tactical_board.toggle_selected_kneeling())
	tactical_stance_button.disabled = true
	equipment_row.add_child(tactical_stance_button)
	tactical_medkit_button = _small_button("Medkit", func(): tactical_board.use_selected_medkit())
	tactical_medkit_button.disabled = true
	equipment_row.add_child(tactical_medkit_button)
	unit_controls.add_child(equipment_row)
	console.add_child(_panel_with(unit_controls, 10))
	var soldier_data := VBoxContainer.new()
	soldier_data.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	soldier_data.add_child(_label("SOLDIER DATA", 11, color_cyan))
	tactical_selection_label = _label("Select a soldier.", 14, color_text, true)
	tactical_selection_label.custom_minimum_size.y = 86
	soldier_data.add_child(tactical_selection_label)
	console.add_child(_panel_with(soldier_data, 10))
	var reserve_controls := VBoxContainer.new()
	reserve_controls.custom_minimum_size.x = 360
	reserve_controls.add_child(_label("RESERVE TIME UNITS", 11, color_cyan))
	var reserve_row := HBoxContainer.new()
	reserve_row.add_child(_small_button("None", func(): tactical_board.set_selected_reserve_mode("none")))
	reserve_row.add_child(_small_button("Snap", func(): tactical_board.set_selected_reserve_mode("snap")))
	reserve_row.add_child(_small_button("Aimed", func(): tactical_board.set_selected_reserve_mode("aimed")))
	reserve_row.add_child(_small_button("Auto", func(): tactical_board.set_selected_reserve_mode("auto")))
	reserve_controls.add_child(reserve_row)
	var turn_row := HBoxContainer.new()
	turn_row.add_child(_small_button("Reserve Kneel", func(): tactical_board.set_selected_reserve_mode("kneel")))
	turn_row.add_child(_small_button("Done", func(): tactical_board.bleed_selected_tu()))
	tactical_end_turn_button = _small_button("End Turn", func(): tactical_board.end_human_turn())
	turn_row.add_child(tactical_end_turn_button)
	reserve_controls.add_child(turn_row)
	console.add_child(_panel_with(reserve_controls, 10))
	var command_controls := VBoxContainer.new()
	command_controls.custom_minimum_size.x = 180
	command_controls.add_child(_label("COMMAND", 11, color_cyan))
	tactical_ai_button = _action_button("AI Command", _toggle_tactical_ai_command, true)
	command_controls.add_child(tactical_ai_button)
	tactical_return_button = _action_button("Dust Off", _request_tactical_dust_off)
	command_controls.add_child(tactical_return_button)
	console.add_child(_panel_with(command_controls, 10))
	outer.add_child(console)
	tactical_board.ai_command_changed.connect(_on_tactical_ai_command_changed)
	tactical_board.voice_requested.connect(_play_voice)
	tactical_board.begin_battle(campaign.selected_incident(), campaign.assigned_soldiers(), content)

func _on_tactical_selection(unit: Dictionary) -> void:
	if tactical_selection_label == null:
		return
	if unit.is_empty():
		tactical_selection_label.text = "Select a living soldier to move, escort, breach, or fire."
	else:
		var medkit_status := "Medkit ready" if int(unit.get("medkit_charges", 0)) > 0 else "No medkit"
		var stance := "Kneeling" if unit.get("kneeling", false) else "Standing"
		var reserve := String(unit.get("reserve_mode", "none")).capitalize()
		var targeting := String(unit.get("targeting_mode", "move")).capitalize()
		tactical_selection_label.text = "%s | %s\n%s | %s\nHP %d/%d  TU %d/%d  REA %d\n%s | Reserve %s | %s | Kills %d" % [unit.get("name","Soldier"), unit.get("rank","Rookie"), unit.get("weapon","Ballistic Rifle"), unit.get("armor","Field Suit"), unit.get("hp",0), unit.get("max_hp",0), unit.get("tu",0), unit.get("max_tu",0), unit.get("reactions",0), stance, reserve, targeting, unit.get("kills",0)]
	if tactical_medkit_button:
		var blocker := tactical_board.selected_medkit_blocker() if tactical_board else "Select a living soldier."
		tactical_medkit_button.disabled = not blocker.is_empty()
		tactical_medkit_button.tooltip_text = blocker if not blocker.is_empty() else "Spend 12 TU and consume the issued Medkit to restore up to 12 HP."
	if tactical_stance_button:
		tactical_stance_button.disabled = unit.is_empty()
		tactical_stance_button.text = "Stand" if unit.get("kneeling", false) else "Kneel"
	if tactical_right_hand_button:
		tactical_right_hand_button.disabled = unit.is_empty()
		tactical_right_hand_button.text = "RIGHT: %s" % String(unit.get("weapon", "Weapon")).to_upper() if not unit.is_empty() else "RIGHT: WEAPON"
	if tactical_left_hand_button:
		var grenade_count := int(unit.get("grenade_charges", 0))
		tactical_left_hand_button.disabled = unit.is_empty() or grenade_count <= 0
		tactical_left_hand_button.text = "LEFT: %s" % ("PRIMED FRAG" if unit.get("grenade_primed", false) else "FRAG x%d" % grenade_count)
	if tactical_prime_button:
		var grenade_blocker := tactical_board.selected_grenade_blocker() if tactical_board else "Select a living soldier."
		tactical_prime_button.disabled = unit.is_empty() or not grenade_blocker.is_empty() and not unit.get("grenade_primed", false)
		tactical_prime_button.text = "Target Grenade" if unit.get("grenade_primed", false) else "Prime 4 TU"
		tactical_prime_button.tooltip_text = grenade_blocker if not grenade_blocker.is_empty() else "Prime the left-hand Frag Grenade for 4 TU, then select a hex within six."
	if tactical_cancel_target_button:
		tactical_cancel_target_button.disabled = unit.is_empty() or String(unit.get("targeting_mode", "move")) == "move"

func _on_tactical_status(status: Dictionary) -> void:
	if tactical_status_label:
		tactical_status_label.text = "Turn %d | %s | Aliens %d | Rescue %d/%d" % [status.get("turn",1), String(status.get("phase","human")).capitalize(), status.get("aliens",0), status.get("rescued",0), status.get("required",0)]
	if tactical_end_turn_button:
		tactical_end_turn_button.disabled = status.get("phase", "") != "human" or status.get("resolved", false)
	if tactical_ai_button:
		tactical_ai_button.disabled = status.get("resolved", false) or status.get("phase", "") != "human" and not tactical_board.ai_command_active

func _toggle_tactical_ai_command() -> void:
	if tactical_board.ai_command_active:
		tactical_board.reclaim_ai_command()
	else:
		tactical_board.take_ai_command()

func _on_tactical_ai_command_changed(active: bool) -> void:
	if tactical_ai_button:
		tactical_ai_button.disabled = false
		tactical_ai_button.text = "Take Back Control" if active else "AI Command"
	if tactical_end_turn_button:
		tactical_end_turn_button.disabled = active
	if tactical_medkit_button:
		tactical_medkit_button.disabled = active or not tactical_board.selected_medkit_blocker().is_empty()
	if tactical_stance_button:
		tactical_stance_button.disabled = active or tactical_board.selected_inventory().is_empty()
	for button in [tactical_right_hand_button, tactical_left_hand_button, tactical_prime_button, tactical_cancel_target_button]:
		if button:
			button.disabled = active or button.disabled

func _show_tactical_inventory() -> void:
	if tactical_board == null:
		return
	var inventory := tactical_board.selected_inventory()
	var dialog := AcceptDialog.new()
	dialog.title = "Field Equipment"
	dialog.dialog_text = "Select a living soldier to inspect equipment." if inventory.is_empty() else "%s - %s\n\nRIGHT HAND  %s\nLEFT HAND   %s\nBODY        %s\nBELT        %s\n\nTU %d   Accuracy %d   Reactions %d\nStance %s   Reserve %s   Targeting %s" % [
		inventory.get("name", "Soldier"),
		inventory.get("rank", "Rookie"),
		inventory.get("right_hand", "Unarmed"),
		inventory.get("left_hand", "Empty"),
		inventory.get("armor", "No Armor"),
		"Medkit (%d)" % inventory.get("medkit_charges", 0) if int(inventory.get("medkit_charges", 0)) > 0 else "Empty",
		inventory.get("tu", 0),
		inventory.get("accuracy", 0),
		inventory.get("reactions", 0),
		"Kneeling" if inventory.get("kneeling", false) else "Standing",
		String(inventory.get("reserve_mode", "none")).capitalize(),
		String(inventory.get("targeting_mode", "move")).capitalize()
	]
	dialog.min_size = Vector2i(520, 330)
	ui_root.add_child(dialog)
	dialog.popup_centered()
	dialog.confirmed.connect(dialog.queue_free)

func _show_tactical_map() -> void:
	if tactical_board == null:
		return
	var contacts := tactical_board.tactical_map_contacts()
	var human_cells: Array = contacts.get("humans", [])
	var alien_cells: Array = contacts.get("aliens", [])
	var civilian_cells: Array = contacts.get("civilians", [])
	var rows: Array[String] = []
	for y in range(AegisTacticalBoard.GRID_HEIGHT):
		var row := ""
		for x in range(AegisTacticalBoard.GRID_WIDTH):
			var cell := Vector2i(x, y)
			row += "H" if human_cells.has(cell) else "A" if alien_cells.has(cell) else "C" if civilian_cells.has(cell) else "."
		rows.append(row)
	var dialog := AcceptDialog.new()
	dialog.title = "Tactical Map - Current Observations"
	dialog.dialog_text = "%s\n\nH Aegis   A visible alien   C visible civilian\nUnobserved contacts remain hidden." % "\n".join(rows)
	dialog.min_size = Vector2i(580, 520)
	ui_root.add_child(dialog)
	dialog.popup_centered()
	dialog.confirmed.connect(dialog.queue_free)

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
	if tactical_medkit_button:
		tactical_medkit_button.disabled = true
	if tactical_return_button:
		tactical_return_button.text = "Return to Base"
		tactical_return_button.disabled = false
	if tactical_end_turn_button:
		tactical_end_turn_button.disabled = true
	if tactical_ai_button:
		tactical_ai_button.disabled = true
	if tactical_stance_button:
		tactical_stance_button.disabled = true
	for button in [tactical_right_hand_button, tactical_left_hand_button, tactical_prime_button, tactical_cancel_target_button]:
		if button:
			button.disabled = true

func _request_tactical_dust_off() -> void:
	if not tactical_result.is_empty():
		_complete_tactical_return()
		return
	var dialog := ConfirmationDialog.new()
	dialog.title = "Dust Off"
	dialog.dialog_text = "Abort this incident and extract the surviving squad?"
	dialog.ok_button_text = "Dust Off"
	ui_root.add_child(dialog)
	dialog.popup_centered()
	dialog.confirmed.connect(func():
		tactical_board.abort_battle()
		dialog.queue_free()
	)
	dialog.canceled.connect(dialog.queue_free)

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
	test_board.begin_battle(test_campaign.selected_incident(), test_campaign.assigned_soldiers(), content)
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
	var doctrine_board := AegisTacticalBoard.new()
	doctrine_board.begin_battle(test_campaign.selected_incident(), test_campaign.assigned_soldiers(), content)
	var doctrine_humans: Array = doctrine_board.units.filter(func(unit): return unit.get("team", "") == "human")
	var doctrine_aliens: Array = doctrine_board.units.filter(func(unit): return unit.get("team", "") == "alien")
	doctrine_humans[0]["rank"] = "Captain"
	doctrine_humans[0]["missions"] = 12
	var doctrine_summary := doctrine_board.ai_command_summary()
	var rookie_doctrine: Dictionary = doctrine_board.ai_doctrine_for_commander({"rank":"Rookie","missions":0})
	var veteran_doctrine: Dictionary = doctrine_board.ai_doctrine_for_commander({"rank":"Captain","missions":12})
	var commander_doctrine_ready: bool = rookie_doctrine.get("key", "") == "wedge" and veteran_doctrine.get("key", "") == "diamond" and doctrine_summary.contains("Diamond Security")
	doctrine_humans[1]["tu"] = 62
	var doctrine_plan: Dictionary = doctrine_board._ai_movement_plan(doctrine_humans[1], doctrine_aliens[0].cell, int(doctrine_humans[1].get("fire_tu", 14)), String(doctrine_humans[1].get("ai_role", "")))
	var formation_reserve_ready := int(doctrine_plan.get("steps", 0)) <= doctrine_board.AI_MAX_MOVE_STEPS and int(doctrine_plan.get("steps", 0)) * doctrine_board.MOVE_TU <= 62 - int(doctrine_humans[1].get("fire_tu", 14)) and not String(doctrine_humans[1].get("ai_role", "")).is_empty()
	var reaction_shooter: Dictionary = doctrine_humans[1]
	var reaction_target: Dictionary = doctrine_aliens[0]
	reaction_shooter["cell"] = Vector2i(6, 10)
	reaction_target["cell"] = Vector2i(7, 10)
	reaction_shooter["tu"] = 62
	reaction_shooter["reactions"] = 100
	reaction_shooter["accuracy"] = 100
	for serial in range(100):
		if AegisHexRules.deterministic_roll(int(doctrine_board.incident.get("seed", 1)), 900 + (serial + 1) * 31 + doctrine_board.turn_number * 47) <= 95:
			doctrine_board.action_serial = serial
			break
	var reaction_tu_before := int(reaction_shooter.get("tu", 0))
	doctrine_board._reaction_fire_for_move(reaction_target, {})
	var reaction_fire_ready := int(reaction_shooter.get("tu", 0)) == reaction_tu_before - int(reaction_shooter.get("fire_tu", 14))
	for hidden_alien in doctrine_aliens:
		hidden_alien["visible"] = false
	var ai_fog_ready: bool = doctrine_board.tactical_map_contacts().get("aliens", []).is_empty()
	var console_soldier: Dictionary = doctrine_humans[2]
	doctrine_board._select_unit(String(console_soldier.get("id", "")))
	var console_tu_before := int(console_soldier.get("tu", 0))
	var classic_console_ready := doctrine_board.set_selected_reserve_mode("snap") and doctrine_board.toggle_selected_kneeling()
	var console_inventory := doctrine_board.selected_inventory()
	classic_console_ready = classic_console_ready and int(console_soldier.get("tu", 0)) == console_tu_before - 4 and console_inventory.get("reserve_mode", "") == "snap" and console_inventory.get("kneeling", false) and doctrine_board.bleed_selected_tu()
	console_soldier["tu"] = 60
	console_soldier["reserve_mode"] = "none"
	console_soldier["reserve_tu"] = 0
	doctrine_board._select_unit(String(console_soldier.get("id", "")))
	var hand_inventory := doctrine_board.selected_inventory()
	var hand_slots_ready: bool = hand_inventory.get("right_hand", "") == console_soldier.get("weapon", "") and hand_inventory.get("left_hand", "") == "Frag Grenade" and int(hand_inventory.get("grenade_charges", 0)) == 1
	var grenade_prime_tu_before := int(console_soldier.get("tu", 0))
	var grenade_prime_ready: bool = doctrine_board.prime_selected_grenade() and int(console_soldier.get("tu", 0)) == grenade_prime_tu_before - doctrine_board.GRENADE_PRIME_TU and console_soldier.get("grenade_primed", false) and console_soldier.get("targeting_mode", "") == "grenade"
	var grenade_target := Vector2i(8, 8)
	var grenade_wall_key := AegisHexRules.key(grenade_target)
	doctrine_board.covers[grenade_wall_key] = {"cell":grenade_target,"type":"wall","hard":true,"hp":30,"max_hp":30,"building":"health"}
	var grenade_alien: Dictionary = doctrine_aliens[1]
	grenade_alien["cell"] = Vector2i(8, 9)
	grenade_alien["hp"] = 30
	var grenade_throw_tu_before := int(console_soldier.get("tu", 0))
	var grenade_blast_ready: bool = doctrine_board.grenade_blast_cells(grenade_target).size() == 7 and doctrine_board._try_throw_grenade(console_soldier, grenade_target) and int(console_soldier.get("tu", 0)) == grenade_throw_tu_before - doctrine_board.GRENADE_THROW_TU and int(console_soldier.get("grenade_charges", -1)) == 0 and int(grenade_alien.get("hp", 0)) < 30 and not doctrine_board._blocked_cells().has(grenade_wall_key)
	var recovery_board := AegisTacticalBoard.new()
	recovery_board.begin_battle(test_campaign.selected_incident(), test_campaign.assigned_soldiers(), content)
	var recovery_unit: Dictionary = recovery_board.units.filter(func(unit): return unit.get("team", "") == "human")[0]
	recovery_board.units = [recovery_unit]
	recovery_board.covers.clear()
	recovery_unit["cell"] = Vector2i(6, 7)
	recovery_unit["tu"] = 60
	recovery_unit["ai_move_history"] = [AegisHexRules.key(Vector2i(6, 7))]
	var recovery_plan: Dictionary = recovery_board._ai_extraction_plan(recovery_unit, int(recovery_unit.get("fire_tu", 14)))
	var recovery_route_keys := {}
	for recovery_cell in recovery_plan.get("path", []):
		recovery_route_keys[AegisHexRules.key(recovery_cell)] = true
	var recovery_crosses_ramp: bool = recovery_plan.get("path", []).any(func(cell): return recovery_board.extraction_cells.has(AegisHexRules.key(cell)))
	var rescue_route_ready: bool = int(recovery_plan.get("steps", 0)) > 0 and recovery_plan.get("reached", false) and recovery_crosses_ramp and recovery_route_keys.size() == recovery_plan.get("path", []).size()
	var recovery_cell_before: Vector2i = recovery_unit.cell
	var recovery_tu_before := int(recovery_unit.get("tu", 0))
	var recovery_voice_events: Array[String] = []
	recovery_board.voice_requested.connect(func(file_name: String): recovery_voice_events.append(file_name))
	recovery_board.ai_command_active = true
	recovery_board.reclaim_ai_command()
	var ai_reclaim_ready: bool = not recovery_board.ai_command_active and recovery_unit.cell == recovery_cell_before and int(recovery_unit.get("tu", 0)) == recovery_tu_before
	var tactical_voice_ready: bool = recovery_voice_events.has("Back with you steady professional.wav") and has_method("_play_next_voice") and voice_queue is Array
	var dedicated_voice_controls_ready: bool = has_method("_show_audio_settings") and has_method("_set_voice_enabled") and has_method("_set_voice_volume") and ResourceLoader.exists("res://godot/default_bus_layout.tres")
	var voice_audibility_mix_ready: bool = has_method("_set_voice_music_duck") and VOICE_MAKEUP_DB >= 6.0 and VOICE_MUSIC_DUCK_DB <= -12.0
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
	var import_maps_campaign: bool = imported_base.get("name", "") == "Pacific Aegis" and imported_base.get("region", "") == "Oceania" and imported_base.get("facilities", []).has("radar") and imported_base.get("facilities", []).has("hangar_interceptor") and imported_campaign.facility_count("quarters") == 2 and imported_campaign.personnel_capacity() == 24 and imported_campaign.personnel_used() == 20 and imported_campaign.scientist_capacity() == 10 and int(imported_campaign.data.get("month", 0)) == 4 and int(imported_campaign.data.get("day", 0)) == 12 and int(imported_campaign.data.get("funds", 0)) == 3180 and imported_research.get("active", "") == "Laser Power Output 1" and imported_campaign.research_assigned_scientists() == 10 and imported_campaign.research_required_progress() == 180 and imported_campaign.completed_research().has("Laser Weapons") and imported_campaign.has_technology_unlock("laser_rifle_production")
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
	var personnel_capacity_ready: bool = management_campaign.personnel_capacity() == 12 and management_campaign.personnel_used() == 11 and management_campaign.scientist_capacity() == 10 and management_campaign.engineer_capacity() == 10
	var management_legacy := management_campaign.data.duplicate(true)
	management_legacy.erase("scientists")
	management_legacy.erase("engineers")
	management_legacy.erase("manufacturing_queue")
	management_legacy.erase("manufacturing_assigned_engineers")
	management_legacy.erase("next_manufacturing_order_id")
	management_legacy.erase("facility_construction_orders")
	management_legacy.erase("next_facility_construction_order_id")
	management_legacy["base"].erase("facility_counts")
	management_legacy["research"] = {"active": "Laser Weapons", "progress": 8}
	var management_migrated := management_campaign.normalize_save(management_legacy)
	var management_migration_ready: bool = int(management_migrated.get("scientists", 0)) == 5 and int(management_migrated.get("engineers", -1)) == 0 and int(management_migrated.get("base", {}).get("facility_counts", {}).get("quarters", 0)) == 1 and int(management_migrated.get("base", {}).get("facility_counts", {}).get("workshop", 0)) == 1 and int(management_migrated.get("research", {}).get("assigned_scientists", 0)) == 5 and management_migrated.get("personnel_orders", []).is_empty() and management_migrated.get("manufacturing_queue", []).is_empty() and int(management_migrated.get("manufacturing_assigned_engineers", -1)) == 0 and management_migrated.get("facility_construction_orders", []).is_empty()
	management_campaign.set_research_staffing(3)
	var research_staffing_ready: bool = management_campaign.research_assigned_scientists() == 3 and management_campaign.research_daily_progress() == 6
	var management_progress_before := int(management_campaign.data.get("research", {}).get("progress", 0))
	management_campaign.advance_minutes(24 * 60)
	var research_clock_ready: bool = int(management_campaign.data.get("day", 0)) == 2 and int(management_campaign.data.get("research", {}).get("progress", 0)) == management_progress_before + 6
	management_campaign.data["research"]["progress"] = 99
	management_campaign.data["research"]["completed"] = false
	management_campaign.set_research_staffing(5)
	management_campaign.advance_minutes(24 * 60)
	var research_unlock_ready: bool = management_campaign.completed_research().has("Laser Weapons") and management_campaign.has_technology_unlock("laser_rifle_production") and management_campaign.available_research_projects().any(func(project): return project.get("id", "") == "Laser Power Output 1")
	var follow_on_research_ready: bool = management_campaign.start_research_project("Laser Power Output 1") and management_campaign.research_required_progress() == 180 and management_campaign.research_assigned_scientists() == 0
	management_campaign.data["engineers"] = 10
	var laser_funds_before := int(management_campaign.data.get("funds", 0))
	var laser_stores_before := int(management_campaign.data.get("stores", {}).get("Laser Rifle", 0))
	var laser_queued: bool = management_campaign.queue_manufacturing("Laser Rifle") and int(management_campaign.data.get("funds", 0)) == laser_funds_before - 180 and int(management_campaign.data.get("stores", {}).get("Laser Rifle", 0)) == laser_stores_before
	management_campaign.advance_minutes(24 * 60)
	var laser_waits_for_work: bool = int(management_campaign.data.get("stores", {}).get("Laser Rifle", 0)) == laser_stores_before and int(management_campaign.manufacturing_queue()[0].get("progress", 0)) == 30
	management_campaign.advance_minutes(24 * 60)
	var laser_production_ready: bool = management_campaign.manufacturing_queue().is_empty() and int(management_campaign.data.get("stores", {}).get("Laser Rifle", 0)) == laser_stores_before + 1
	var loadout_roster: Array = management_campaign.data.get("soldiers", [])
	var loadout_soldier: Dictionary = loadout_roster[0]
	var loadout_second: Dictionary = loadout_roster[1]
	var loadout_exchange_ready: bool = management_campaign.change_soldier_loadout(String(loadout_soldier.get("id", "")), "weapon", "Laser Rifle") and loadout_soldier.get("weapon", "") == "Laser Rifle" and management_campaign.loadout_stock("Laser Rifle") == 0 and management_campaign.loadout_stock("Ballistic Rifle") == 1 and management_campaign.change_soldier_loadout(String(loadout_soldier.get("id", "")), "armor", "No Armor") and management_campaign.loadout_stock("Field Suit") == 1 and management_campaign.change_soldier_loadout(String(loadout_soldier.get("id", "")), "armor", "Field Suit") and management_campaign.loadout_stock("Field Suit") == 0
	var unavailable_loadout_blocked: bool = not management_campaign.change_soldier_loadout(String(loadout_second.get("id", "")), "weapon", "Laser Rifle") and loadout_second.get("weapon", "") == "Ballistic Rifle" and management_campaign.loadout_stock("Laser Rifle") == 0
	var medkit_stock_before := management_campaign.loadout_stock("Medkit")
	var medkit_exchange_ready: bool = management_campaign.change_soldier_medkit(String(loadout_soldier.get("id", "")), true) and management_campaign.loadout_stock("Medkit") == medkit_stock_before - 1 and management_campaign.change_soldier_medkit(String(loadout_soldier.get("id", "")), true) and management_campaign.loadout_stock("Medkit") == medkit_stock_before - 1 and management_campaign.change_soldier_medkit(String(loadout_soldier.get("id", "")), false) and management_campaign.loadout_stock("Medkit") == medkit_stock_before and management_campaign.change_soldier_medkit(String(loadout_soldier.get("id", "")), true)
	var loadout_board := AegisTacticalBoard.new()
	loadout_board.begin_battle(management_campaign.selected_incident(), management_campaign.assigned_soldiers(), content)
	var loadout_unit: Dictionary = loadout_board.units.filter(func(unit): return unit.get("team", "") == "human")[0]
	var tactical_loadout_ready: bool = loadout_unit.get("weapon", "") == "Laser Rifle" and int(loadout_unit.get("weapon_damage", 0)) == 22 and int(loadout_unit.get("weapon_range", 0)) == 9 and int(loadout_unit.get("fire_tu", 0)) == 14 and loadout_unit.get("armor", "") == "Field Suit" and int(loadout_unit.get("damage_reduction", 0)) == 2 and int(loadout_unit.get("medkit_charges", 0)) == 1
	var loadout_tu_updates: Array = []
	loadout_board.selection_changed.connect(func(unit: Dictionary):
		if not unit.is_empty():
			loadout_tu_updates.append(int(unit.get("tu", -1)))
	)
	var loadout_target: Dictionary = loadout_board.units.filter(func(unit): return unit.get("team", "") == "alien")[0]
	loadout_unit["cell"] = Vector2i(6, 10)
	loadout_target["cell"] = Vector2i(14, 10)
	loadout_target["revealed"] = true
	loadout_unit["tu"] = 62
	loadout_board._select_unit(String(loadout_unit.get("id", "")))
	loadout_board._try_shoot_unit(loadout_unit, loadout_target)
	var tactical_tu_feedback_ready: bool = loadout_tu_updates.size() >= 2 and int(loadout_tu_updates[0]) == 62 and int(loadout_tu_updates[-1]) == 48 and int(loadout_unit.get("tu", -1)) == 48
	loadout_unit["hp"] = int(loadout_unit.get("max_hp", 1)) - 20
	var tactical_medkit_ready: bool = loadout_board.use_selected_medkit() and int(loadout_unit.get("hp", 0)) == int(loadout_unit.get("max_hp", 0)) - 8 and int(loadout_unit.get("tu", 0)) == 36 and int(loadout_unit.get("medkit_charges", -1)) == 0 and not loadout_board.use_selected_medkit()
	var recovery_campaign := AegisCampaignState.new()
	recovery_campaign.configure(content)
	recovery_campaign.new_campaign("Recovery Test", "North America")
	var recovery_soldier: Dictionary = recovery_campaign.data.get("soldiers", [])[0]
	recovery_campaign.data["stores"]["Laser Rifle"] = 1
	recovery_campaign.change_soldier_loadout(String(recovery_soldier.get("id", "")), "weapon", "Laser Rifle")
	recovery_campaign.change_soldier_medkit(String(recovery_soldier.get("id", "")), true)
	recovery_campaign.complete_mission({"success":true,"rescued":1,"soldiers":{String(recovery_soldier.get("id", "")):{"hp":0,"kills":0,"medkit_charges":1}}})
	var mission_recovery_ready: bool = recovery_soldier.get("status", "") == "KIA" and recovery_soldier.get("weapon", "") == "Unarmed" and recovery_soldier.get("armor", "") == "No Armor" and not recovery_soldier.get("medkit", true) and recovery_campaign.loadout_stock("Laser Rifle") == 1 and recovery_campaign.loadout_stock("Field Suit") == 1 and recovery_campaign.loadout_stock("Medkit") == 2
	var loss_campaign := AegisCampaignState.new()
	loss_campaign.configure(content)
	loss_campaign.new_campaign("Loss Test", "North America")
	var lost_soldier: Dictionary = loss_campaign.data.get("soldiers", [])[0]
	loss_campaign.change_soldier_medkit(String(lost_soldier.get("id", "")), true)
	loss_campaign.complete_mission({"success":false,"rescued":0,"soldiers":{String(lost_soldier.get("id", "")):{"hp":0,"kills":0,"medkit_charges":1}}})
	var mission_medkit_loss_ready: bool = not lost_soldier.get("medkit", true) and loss_campaign.loadout_stock("Medkit") == 1 and loss_campaign.data.get("reports", []).any(func(report): return String(report).contains("FIELD LOSS") and String(report).contains("Medkit"))
	var wound_campaign := AegisCampaignState.new()
	wound_campaign.configure(content)
	wound_campaign.new_campaign("Wound Test", "North America")
	var wounded_soldier: Dictionary = wound_campaign.data.get("soldiers", [])[0]
	wound_campaign.change_soldier_medkit(String(wounded_soldier.get("id", "")), true)
	wound_campaign.complete_mission({"success":true,"rescued":1,"soldiers":{String(wounded_soldier.get("id", "")):{"hp":int(wounded_soldier.get("health", 1)) - 11,"kills":0,"medkit_charges":0}}})
	var wound_admission_ready: bool = wounded_soldier.get("status", "") == "Wounded" and int(wounded_soldier.get("recovery_days", 0)) == 2 and not wounded_soldier.get("medkit", true) and wound_campaign.assigned_soldiers().size() == 5
	wound_campaign.advance_minutes(24 * 60)
	var wound_midnight_ready: bool = wounded_soldier.get("status", "") == "Wounded" and int(wounded_soldier.get("recovery_days", 0)) == 1
	var wound_normalized := wound_campaign.normalize_save(wound_campaign.data)
	var wound_persistence_ready: bool = wound_normalized.get("soldiers", [])[0].get("status", "") == "Wounded" and int(wound_normalized.get("soldiers", [])[0].get("recovery_days", 0)) == 1
	wound_campaign.advance_minutes(24 * 60)
	var wound_clearance_ready: bool = wounded_soldier.get("status", "") == "Ready" and int(wounded_soldier.get("recovery_days", -1)) == 0 and wound_campaign.assigned_soldiers().size() == 6
	var medical_legacy := management_campaign.data.duplicate(true)
	medical_legacy["soldiers"][0]["status"] = "Sickbay - 3 days"
	medical_legacy["soldiers"][0].erase("recovery_days")
	medical_legacy["soldiers"][0]["medkit"] = 1
	medical_legacy["stores"]["Medkit"] = -4
	var medical_migrated := management_campaign.normalize_save(medical_legacy)
	var medical_migration_ready: bool = medical_migrated.get("soldiers", [])[0].get("status", "") == "Wounded" and int(medical_migrated.get("soldiers", [])[0].get("recovery_days", 0)) == 3 and medical_migrated.get("soldiers", [])[0].get("medkit", false) and int(medical_migrated.get("stores", {}).get("Medkit", -1)) == 0
	var personnel_campaign := AegisCampaignState.new()
	personnel_campaign.configure(content)
	personnel_campaign.new_campaign("Queue Test", "North America")
	personnel_campaign.data["base"]["facility_counts"]["workshop"] = 0
	var engineer_requires_workshop: bool = not personnel_campaign.personnel_hiring_blocker("engineer").is_empty()
	personnel_campaign.data["base"]["facilities"].append("quarters")
	personnel_campaign.data["base"]["facility_counts"]["quarters"] = 2
	personnel_campaign.data["base"]["facility_counts"]["workshop"] = 1
	var personnel_funds_before := int(personnel_campaign.data.get("funds", 0))
	var locked_laser_production_blocked: bool = not personnel_campaign.queue_manufacturing("Laser Rifle") and int(personnel_campaign.data.get("funds", 0)) == personnel_funds_before and int(personnel_campaign.data.get("stores", {}).get("Laser Rifle", 0)) == 0
	var personnel_orders_ready: bool = personnel_campaign.hire_personnel("soldier") and personnel_campaign.hire_personnel("scientist") and personnel_campaign.hire_personnel("engineer") and personnel_campaign.pending_personnel_count() == 3 and personnel_campaign.projected_personnel_used() == 14 and int(personnel_campaign.data.get("funds", 0)) == personnel_funds_before - 305
	var engineer_order: Dictionary = personnel_campaign.personnel_orders().filter(func(order): return order.get("type", "") == "engineer")[0]
	var personnel_cancellation_ready: bool = personnel_campaign.cancel_personnel_order(engineer_order.get("id", "")) and personnel_campaign.pending_personnel_count() == 2 and int(personnel_campaign.data.get("funds", 0)) == personnel_funds_before - 260
	personnel_campaign.advance_minutes(2 * 24 * 60)
	var personnel_waits_three_days: bool = personnel_campaign.pending_personnel_count() == 2 and personnel_campaign.living_soldier_count() == 6 and int(personnel_campaign.data.get("scientists", 0)) == 5
	personnel_campaign.advance_minutes(24 * 60)
	var arrived_recruit: Dictionary = personnel_campaign.data.get("soldiers", [])[-1]
	var personnel_arrival_ready: bool = personnel_campaign.pending_personnel_count() == 0 and personnel_campaign.living_soldier_count() == 7 and int(personnel_campaign.data.get("scientists", 0)) == 6 and not arrived_recruit.get("assigned", true) and arrived_recruit.get("weapon", "") == "Unarmed" and arrived_recruit.get("armor", "") == "No Armor"
	var specialist_campaign := AegisCampaignState.new()
	specialist_campaign.configure(content)
	specialist_campaign.new_campaign("Specialist Capacity Test", "North America")
	specialist_campaign.data["base"]["facility_counts"]["quarters"] = 3
	specialist_campaign.data["scientists"] = 10
	specialist_campaign.data["engineers"] = 10
	var specialist_capacity_ready: bool = specialist_campaign.projected_personnel_used() == 26 and specialist_campaign.personnel_capacity() == 36 and specialist_campaign.personnel_hiring_blocker("soldier").is_empty() and specialist_campaign.personnel_hiring_blocker("scientist").contains("Laboratory full") and specialist_campaign.personnel_hiring_blocker("engineer").contains("Workshop full")
	var construction_campaign := AegisCampaignState.new()
	construction_campaign.configure(content)
	construction_campaign.new_campaign("Construction Test", "North America")
	construction_campaign.data["scientists"] = 10
	construction_campaign.data["engineers"] = 10
	var construction_funds_before := int(construction_campaign.data.get("funds", 0))
	var construction_queue_ready: bool = construction_campaign.begin_facility_construction("quarters") and construction_campaign.begin_facility_construction("lab") and construction_campaign.begin_facility_construction("workshop") and construction_campaign.facility_construction_orders().size() == 3 and int(construction_campaign.data.get("funds", 0)) == construction_funds_before - 1150
	var construction_queue_funds := int(construction_campaign.data.get("funds", 0))
	var construction_waits_ready: bool = not construction_campaign.begin_facility_construction("quarters") and int(construction_campaign.data.get("funds", 0)) == construction_queue_funds and construction_campaign.personnel_capacity() == 12 and construction_campaign.scientist_capacity() == 10 and construction_campaign.engineer_capacity() == 10 and construction_campaign.projected_personnel_capacity() == 24 and construction_campaign.projected_scientist_capacity() == 20 and construction_campaign.projected_engineer_capacity() == 20
	construction_campaign.advance_minutes(2 * 24 * 60)
	var construction_normalized := construction_campaign.normalize_save(construction_campaign.data)
	var construction_persistence_ready: bool = construction_normalized.get("facility_construction_orders", []).map(func(order): return int(order.get("days_remaining", 0))) == [1, 3, 2]
	construction_campaign.advance_minutes(24 * 60)
	var quarters_completion_ready: bool = construction_campaign.facility_count("quarters") == 2 and construction_campaign.personnel_capacity() == 24 and construction_campaign.facility_construction_orders().size() == 2
	construction_campaign.advance_minutes(2 * 24 * 60)
	var specialist_construction_ready: bool = construction_campaign.facility_construction_orders().is_empty() and construction_campaign.scientist_capacity() == 20 and construction_campaign.engineer_capacity() == 20
	var construction_cancel_funds := int(construction_campaign.data.get("funds", 0))
	construction_campaign.begin_facility_construction("quarters")
	var cancelled_construction: Dictionary = construction_campaign.facility_construction_orders()[0]
	var construction_cancellation_ready: bool = construction_campaign.cancel_facility_construction(String(cancelled_construction.get("id", ""))) and construction_campaign.facility_construction_orders().is_empty() and int(construction_campaign.data.get("funds", 0)) == construction_cancel_funds - 150
	construction_campaign.begin_facility_construction("quarters")
	construction_campaign.advance_minutes(3 * 24 * 60)
	var specialist_hiring_reopens: bool = construction_campaign.personnel_capacity() == 36 and construction_campaign.personnel_hiring_blocker("scientist").is_empty() and construction_campaign.personnel_hiring_blocker("engineer").is_empty()
	var manufacturing_campaign := AegisCampaignState.new()
	manufacturing_campaign.configure(content)
	manufacturing_campaign.new_campaign("Manufacturing Test", "North America")
	manufacturing_campaign.data["engineers"] = 4
	var medkits_before := int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0))
	var manufacturing_funds_before := int(manufacturing_campaign.data.get("funds", 0))
	var manufacturing_queue_ready: bool = manufacturing_campaign.queue_manufacturing("Medkit") and manufacturing_campaign.queue_manufacturing("Medkit") and manufacturing_campaign.manufacturing_queue().size() == 2 and int(manufacturing_campaign.data.get("funds", 0)) == manufacturing_funds_before - 80
	var manufacturing_staffing_ready: bool = manufacturing_campaign.manufacturing_assigned_engineers() == 4 and manufacturing_campaign.manufacturing_daily_progress() == 12 and not manufacturing_campaign.set_manufacturing_staffing(20)
	manufacturing_campaign.advance_minutes(24 * 60)
	var manufacturing_midnight_ready: bool = int(manufacturing_campaign.manufacturing_queue()[0].get("progress", 0)) == 12 and int(manufacturing_campaign.manufacturing_queue()[1].get("progress", 0)) == 0 and int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0)) == medkits_before
	manufacturing_campaign.advance_minutes(24 * 60)
	var manufacturing_fifo_ready: bool = manufacturing_campaign.manufacturing_queue().size() == 1 and int(manufacturing_campaign.manufacturing_queue()[0].get("progress", 0)) == 6 and int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0)) == medkits_before + 1
	manufacturing_campaign.set_manufacturing_staffing(2)
	manufacturing_campaign.advance_minutes(2 * 24 * 60)
	var manufacturing_completion_ready: bool = manufacturing_campaign.manufacturing_queue().is_empty() and manufacturing_campaign.manufacturing_assigned_engineers() == 0 and int(manufacturing_campaign.data.get("stores", {}).get("Medkit", 0)) == medkits_before + 2
	var cancellation_funds_before := int(manufacturing_campaign.data.get("funds", 0))
	manufacturing_campaign.queue_manufacturing("Medkit")
	var cancellation_order: Dictionary = manufacturing_campaign.manufacturing_queue()[0]
	var manufacturing_cancellation_ready: bool = manufacturing_campaign.cancel_manufacturing_order(String(cancellation_order.get("id", ""))) and manufacturing_campaign.manufacturing_queue().is_empty() and int(manufacturing_campaign.data.get("funds", 0)) == cancellation_funds_before - 20
	manufacturing_campaign.queue_manufacturing("Medkit")
	manufacturing_campaign.set_manufacturing_staffing(2)
	manufacturing_campaign.advance_minutes(24 * 60)
	var manufacturing_normalized := manufacturing_campaign.normalize_save(manufacturing_campaign.data)
	var manufacturing_persistence_ready: bool = manufacturing_normalized.get("manufacturing_queue", []).size() == 1 and int(manufacturing_normalized.get("manufacturing_queue", [])[0].get("progress", 0)) == 6 and int(manufacturing_normalized.get("manufacturing_assigned_engineers", 0)) == 2
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
		{"name":"Experienced commanders unlock advanced formation doctrine", "pass":commander_doctrine_ready},
		{"name":"AI formation movement is bounded and preserves shot TU", "pass":formation_reserve_ready},
		{"name":"Reaction stat drives TU-consuming fire during alien movement", "pass":reaction_fire_ready},
		{"name":"AI-command tactical contacts preserve live fog of war", "pass":ai_fog_ready},
		{"name":"AI command can return the live battle to player control", "pass":ai_reclaim_ready},
		{"name":"AI rescue routing rotates soldiers and rejects two-cell loops", "pass":rescue_route_ready and recovery_board.ai_last_acted_ids is Array},
		{"name":"AI tactical soldier voices are queued and audio-unlocked", "pass":tactical_voice_ready},
		{"name":"Dedicated voice bus exposes persistent mute volume and playback test controls", "pass":dedicated_voice_controls_ready},
		{"name":"Recorded voices receive bounded makeup gain while active speech ducks music", "pass":voice_audibility_mix_ready},
		{"name":"Classic reserve stance inventory and Done controls mutate tactical state", "pass":classic_console_ready},
		{"name":"Tactical deployment exposes functional right and left hand slots", "pass":hand_slots_ready},
		{"name":"Frag Grenade preparation spends four TU and enters explicit targeting", "pass":grenade_prime_ready},
		{"name":"Frag Grenade blast is seven-hex bounded and opens traversable rubble", "pass":grenade_blast_ready},
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
		{"name":"Strategic midnight advances research by deterministic staff output", "pass":research_clock_ready},
		{"name":"Engineer hiring requires a local Workshop", "pass":engineer_requires_workshop},
		{"name":"Personnel orders reserve quarters and deduct established hiring costs", "pass":personnel_orders_ready},
		{"name":"Pending personnel cancellation releases capacity with bounded refund", "pass":personnel_cancellation_ready},
		{"name":"Personnel arrivals wait for three strategic midnights", "pass":personnel_waits_three_days},
		{"name":"Personnel arrivals are unassigned and draw no free equipment", "pass":personnel_arrival_ready},
		{"name":"Spare quarters do not bypass full Laboratory or Workshop capacity", "pass":specialist_capacity_ready},
		{"name":"Facility construction prepays established costs into three bounded slots", "pass":construction_queue_ready},
		{"name":"Pending facilities show future capacity without granting it early", "pass":construction_waits_ready},
		{"name":"Concurrent facility countdowns normalize with exact progress", "pass":construction_persistence_ready},
		{"name":"Facility capacity activates on each exact completion day", "pass":quarters_completion_ready and specialist_construction_ready},
		{"name":"Facility cancellation returns half of prepaid construction cost", "pass":construction_cancellation_ready},
		{"name":"Completed expansion reopens Laboratory and Workshop hiring", "pass":specialist_hiring_reopens},
		{"name":"Laser Weapons completion unlocks production and its follow-on project", "pass":research_unlock_ready and follow_on_research_ready},
		{"name":"Laser Rifle production stays blocked before research completion", "pass":locked_laser_production_blocked},
		{"name":"Manufacturing staffing clamps to local engineers and Workshop capacity", "pass":manufacturing_staffing_ready},
		{"name":"Manufacturing orders prepay into a bounded FIFO queue", "pass":manufacturing_queue_ready},
		{"name":"Strategic midnight advances only the active manufacturing order", "pass":manufacturing_midnight_ready},
		{"name":"Manufacturing completion carries overflow into the next FIFO order", "pass":manufacturing_fifo_ready},
		{"name":"Empty manufacturing queues release assigned engineers", "pass":manufacturing_completion_ready},
		{"name":"Manufacturing cancellation returns half of prepaid cost", "pass":manufacturing_cancellation_ready},
		{"name":"Partially completed manufacturing state normalizes exactly", "pass":manufacturing_persistence_ready},
		{"name":"Unlocked Laser Rifle production requires two staffed strategic days", "pass":laser_queued and laser_waits_for_work and laser_production_ready},
		{"name":"Local weapon and armor exchanges conserve loose base stock", "pass":loadout_exchange_ready},
		{"name":"Unavailable local equipment cannot duplicate into another loadout", "pass":unavailable_loadout_blocked},
		{"name":"Medkit issue return and idempotent reissue conserve local stock", "pass":medkit_exchange_ready},
		{"name":"Saved weapon armor and Medkit profiles enter tactical combat rules", "pass":tactical_loadout_ready},
		{"name":"Selected soldier TU feedback refreshes after tactical actions", "pass":tactical_tu_feedback_ready},
		{"name":"Tactical Medkits heal spend TU consume once and refresh selection", "pass":tactical_medkit_ready},
		{"name":"Mission injuries create bounded unavailable recovery records", "pass":wound_admission_ready},
		{"name":"Strategic midnights persist and complete wound recovery", "pass":wound_midnight_ready and wound_persistence_ready and wound_clearance_ready},
		{"name":"Legacy Sickbay text and Medkit ownership migrate conservatively", "pass":medical_migration_ready},
		{"name":"Successful missions recover fallen equipment and unused Medkits", "pass":mission_recovery_ready},
		{"name":"Failed missions lose unused Medkits carried by fallen soldiers", "pass":mission_medkit_loss_ready}
	]
	test_board.free()
	doctrine_board.free()
	recovery_board.free()
	loadout_board.free()
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
