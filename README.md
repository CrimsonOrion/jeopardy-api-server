# Jeopardy API Server

The game-content server. It holds the static clue/category data for Jeopardy
games (and their media) and serves it as JSON over HTTP. It doesn't know
anything about live game state (scores, whose turn it is, which round) —
that's `jeopardy-game-server`'s job, which fetches from this server through
its own `/api/*` proxy routes (see `routes/api.js`, `RESOURCE_SERVER` env var).

## Content layout

```
game-content/
  seasons.json                      list of seasons
  <season-id>/
    overview.json                   list of games in that season
    <game-id>/
      game.json                     the categories/clues for that game
      media/                        optional audio/image/video files
```

A `game.json` is a flat object keyed by category and clue:

```json
{
  "id": "final-fantasy---final-fantasy-game-1",
  "game_title": "#1 created 2023-11-23",
  "description": "First test game using Final Fantasy",
  "game_complete": true,
  "category_J_1": {
    "category_name": "PICTURE OF PERFECTION",
    "category_comments": "(Must name the character you see.)",
    "clue_count": 5
  },
  "clue_J_1_1": {
    "id": "359675",
    "clue_html": "The Scion pictured <a href=\"...\">here</a> is a personal favorite of Asmongold.",
    "clue_text": "The Scion pictured here is a personal favorite of Asmongold.",
    "correct_response": "Y'shtola",
    "media": ["./media/img/final-fantasy-game-1-j-1-1.jpg"]
  }
}
```

Key naming follows `category_<ROUND>_<COL>` / `clue_<ROUND>_<COL>_<ROW>`,
where `<ROUND>` is `J` (Jeopardy), `DJ` (Double Jeopardy), or `FJ` (Final
Jeopardy — which only has one category, `category_FJ_1`, and one clue,
`clue_FJ`, with no `clue_count`/column/row).

A clue can optionally include:
- `media` (array) / `audio` / `video` (string) — paths relative to that
  game's folder (e.g. `"./media/audio/clip.mp3"`); the server rewrites
  these into absolute URLs based on the request host when a game is
  fetched, so content authors never hardcode a domain
- `daily_double: true`
- `triple_stumper: true`

## Endpoints

| Method | Path                          | Returns                                   |
|--------|-------------------------------|--------------------------------------------|
| GET    | `/status`                     | `{ "Status": "Running" }`                 |
| GET    | `/game-content/seasons`       | contents of `seasons.json`                |
| GET    | `/game-content/seasons/:id`   | contents of `<season-id>/overview.json`   |
| GET    | `/game-content/games/:id`     | a game's `game.json`, with media URLs resolved. `:id` is `<season-id>---<game-id>` |

Media files themselves are also served directly under `/game-content/...`
via static file serving.

## Adding a new season or game

1. Add an entry to `game-content/seasons.json` with a new `id`.
2. Create `game-content/<season-id>/overview.json` listing the games in
   that season (each with an `id` of `<season-id>---<game-id>`).
3. Create `game-content/<season-id>/<game-id>/game.json` with the
   categories and clues.
4. Drop any media files under `game-content/<season-id>/<game-id>/media/`
   and reference them with relative paths in `game.json`.

## Usage

```bash
npm install
cp .env.example .env   # adjust PORT if needed
node app.js
```

Listens on port `3001` by default (override with the `PORT` env var).
