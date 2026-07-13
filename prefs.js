/**
 * Spotlight — preferences window
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gdk from 'gi://Gdk';

const SEARCH_ENGINES = [
  { id: 'google', label: 'Google' },
  { id: 'duckduckgo', label: 'DuckDuckGo' },
  { id: 'brave', label: 'Brave' },
  { id: 'bing', label: 'Bing' },
  { id: 'startpage', label: 'Startpage' },
];

export default class SpotlightPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: 'Spotlight',
      icon_name: 'system-search-symbolic',
    });

    // --- Shortcut group ---
    const shortcutGroup = new Adw.PreferencesGroup({
      title: 'Keyboard Shortcut',
      description: 'Set the shortcut to open Spotlight',
    });

    const shortcutRow = new Adw.ActionRow({
      title: 'Toggle shortcut',
      subtitle: 'Click here, then press a key combination',
    });

    const shortcutLabel = new Gtk.Label({
      label: this._formatShortcut(settings.get_strv('toggle-shortcut')),
      halign: Gtk.Align.END,
      valign: Gtk.Align.CENTER,
    });
    shortcutRow.add_suffix(shortcutLabel);
    shortcutRow.set_activatable(true);

    const eventController = new Gtk.EventControllerKey();
    let capturing = false;

    shortcutRow.connect('activated', () => {
      capturing = true;
      shortcutLabel.label = 'Press a key combination...';
      shortcutRow.grab_focus();
    });

    eventController.connect('key-pressed', (controller, keyval, keycode, state) => {
      if (!capturing) return false;

      if (keyval === Gdk.KEY_Control_L || keyval === Gdk.KEY_Control_R ||
          keyval === Gdk.KEY_Shift_L || keyval === Gdk.KEY_Shift_R ||
          keyval === Gdk.KEY_Alt_L || keyval === Gdk.KEY_Alt_R ||
          keyval === Gdk.KEY_Super_L || keyval === Gdk.KEY_Super_R ||
          keyval === Gdk.KEY_Caps_Lock) {
        return true;
      }

      let accelerator = '';
      if (state & Gdk.ModifierType.SUPER_MASK) accelerator += '<Super>';
      if (state & Gdk.ModifierType.CONTROL_MASK) accelerator += '<Control>';
      if (state & Gdk.ModifierType.SHIFT_MASK) accelerator += '<Shift>';
      if (state & Gdk.ModifierType.META_MASK) accelerator += '<Meta>';
      accelerator += Gdk.keyval_name(keyval);

      settings.set_strv('toggle-shortcut', [accelerator]);
      shortcutLabel.label = this._formatShortcut([accelerator]);
      capturing = false;
      return true;
    });

    eventController.connect('key-released', () => {
      if (capturing) {
        capturing = false;
        shortcutLabel.label = this._formatShortcut(settings.get_strv('toggle-shortcut'));
      }
    });

    shortcutRow.add_controller(eventController);
    shortcutGroup.add(shortcutRow);

    const resetRow = new Adw.ActionRow({
      title: 'Reset to default',
      subtitle: 'Set shortcut to Ctrl+Space',
    });
    const resetButton = new Gtk.Button({
      label: 'Reset',
      valign: Gtk.Align.CENTER,
    });
    resetButton.connect('clicked', () => {
      settings.set_strv('toggle-shortcut', ['<Control>space']);
      shortcutLabel.label = this._formatShortcut(settings.get_strv('toggle-shortcut'));
    });
    resetRow.add_suffix(resetButton);
    shortcutGroup.add(resetRow);

    page.add(shortcutGroup);

    // --- Appearance group ---
    const appearanceGroup = new Adw.PreferencesGroup({
      title: 'Appearance',
    });

    const widthRow = new Adw.SpinRow({
      title: 'Popup width',
      subtitle: 'Width in pixels',
      adjustment: new Gtk.Adjustment({
        lower: 400,
        upper: 1200,
        step_increment: 20,
        page_increment: 100,
        value: settings.get_int('popup-width'),
      }),
    });
    settings.bind('popup-width', widthRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    appearanceGroup.add(widthRow);

    const maxResultsRow = new Adw.SpinRow({
      title: 'Max results per category',
      adjustment: new Gtk.Adjustment({
        lower: 1,
        upper: 20,
        step_increment: 1,
        page_increment: 5,
        value: settings.get_int('max-results'),
      }),
    });
    settings.bind('max-results', maxResultsRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    appearanceGroup.add(maxResultsRow);

    page.add(appearanceGroup);

    // --- Web search group ---
    const webGroup = new Adw.PreferencesGroup({
      title: 'Web Search',
      description: 'Web search only appears when no apps or settings match',
    });

    const webSearchRow = new Adw.SwitchRow({
      title: 'Show web search fallback',
    });
    settings.bind('show-web-search', webSearchRow, 'active',
      Gio.SettingsBindFlags.DEFAULT);
    webGroup.add(webSearchRow);

    const engineModel = new Gtk.StringList();
    for (const engine of SEARCH_ENGINES) {
      engineModel.append(engine.label);
    }

    const engineRow = new Adw.ComboRow({
      title: 'Search engine',
      model: engineModel,
    });

    const currentEngine = settings.get_string('web-search-engine');
    const engineIndex = SEARCH_ENGINES.findIndex(e => e.id === currentEngine);
    if (engineIndex >= 0) engineRow.selected = engineIndex;

    engineRow.connect('notify::selected', () => {
      const selected = SEARCH_ENGINES[engineRow.selected];
      if (selected) settings.set_string('web-search-engine', selected.id);
    });

    webGroup.add(engineRow);
    page.add(webGroup);

    // --- About group ---
    const aboutGroup = new Adw.PreferencesGroup({ title: 'About' });
    aboutGroup.add(new Adw.ActionRow({
      title: 'Spotlight',
      subtitle: 'A compact macOS Spotlight inspired launcher for GNOME Shell.\n\nDefault shortcut: Super+Space\n\nType an app name to launch it. Press the "sudo" button to run as root.',
    }));
    page.add(aboutGroup);

    window.add(page);
    window.set_search_enabled(true);
  }

  _formatShortcut(shortcutArray) {
    if (!shortcutArray || shortcutArray.length === 0) return 'Not set (will default to Super+Space)';
    const shortcut = shortcutArray[0];
    return shortcut
      .replace(/<Super>/g, 'Super+')
      .replace(/<Control>/g, 'Ctrl+')
      .replace(/<Shift>/g, 'Shift+')
      .replace(/<Alt>/g, 'Alt+');
  }
}
