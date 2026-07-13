# Spotlight v1.0

A compact macOS Spotlight inspired launcher for GNOME Shell 50.

## Default shortcut: **Ctrl + Space**

## What it does (in priority order)

1. **Apps** — the main feature. Type an app name, press Enter to launch.
2. **Calculator** — type `12 * 8 + 3`, press Enter to copy the result.
3. **Settings** — type `wifi`, `bluetooth`, `display`, etc. to open GNOME Settings.
4. **Web search** — only appears when no apps or settings match (last resort).

## Features

- **App search** using GNOME's AppSystem — same backend as GNOME's own search
- **Search icon** on the left side of the entry (macOS Spotlight style)
- **Very rounded** — 32px corner radius on popup, 16px on result rows
- **Apple dark gray** background (`#1C1C1E`) — not pure black, not blue
- **Blackish selection** — subtle white overlay, not blue
- **No overlay, no backdrop, no blur** — just the popup floating
- **No border line** — clean edges, only a subtle drop shadow
- **Always centered** on the primary monitor
- **Compact** — 600px wide, minimal padding

## What was removed (by design)

- ❌ Terminal commands feature
- ❌ Filter buttons (All/Apps/Settings/Web)
- ❌ Recent searches in main menu
- ❌ Blur effect
- ❌ Sudo/run-as-root feature
- ❌ Border line around popup

## Install

```bash
# 1. Extract
cd ~/Downloads
unzip spotlight@ninx.zip -d spotlight@ninx

# 2. Move to extensions dir
mkdir -p ~/.local/share/gnome-shell/extensions/
mv spotlight@ninx ~/.local/share/gnome-shell/extensions/

# 3. Log out and log back in (Wayland restart)

# 4. Enable
gnome-extensions enable spotlight@ninx

# 5. Press Ctrl+Space
```

## How to use

| Action | How |
|---|---|
| Open Spotlight | `Ctrl+Space` |
| Search apps | Type the app name → press `Enter` |
| Calculate | Type `12 * 8 + 3` → press `Enter` (result copied to clipboard) |
| Open settings | Type `wifi` / `bluetooth` / `display` → press `Enter` |
| Web search | Type something that doesn't match any app → press `Enter` |
| Navigate | `↑` `↓` arrows |
| Close | `Esc` |

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Ctrl+Space` | Open / close Spotlight |
| `↑` `↓` | Move selection |
| `Enter` | Open selected |
| `Esc` | Close |

## Preferences

Open with `gnome-extensions prefs spotlight@ninx`:
- **Shortcut** — click row, press key combo to set
- **Popup width** — 400 to 1200px (default 600)
- **Max results per category** — 1 to 20 (default 6)
- **Web search engine** — Google / DuckDuckGo / Brave / Bing / Startpage
- **Show web search fallback** — on/off

## Verification

| Check | Tool | Result |
|---|---|---|
| **Shexli** (official e.g.o review tool) | 0 errors, 1 warning (gschemas.compiled) | PASS |
| **GJS SpiderMonkey** runtime | 9/9 checks (enable → open → close → disable) | PASS |
| **Extended search priority tests** | 10/10 (apps first, web last, no sudo/terminal/filter/recent/blur) | PASS |
| Calculator unit tests | 12 cases | 12/12 PASS |

## License

GPL-2.0-or-later
