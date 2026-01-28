# Featured Videos Ranking

## Ranking formula
Featured videos are ranked by a deterministic engagement score with a recency decay:

```
featured_score = (
  view_count * 0.4
  + favorites_count * 5
  + playlist_add_count * 3
) * (1 / (1 + days_since_created / 30))
```

### Rationale
- **Favorites** and **playlist adds** are strong intent signals, so they carry higher weights.
- **Views** still matter but are a weaker signal.
- **Recency decay** (30-day half-life style) prevents older videos from dominating forever while still honoring sustained engagement.

## Data sources
- `view_count` increments once per video per user/session per day.
- `favorites_count` is maintained from the `favorites` table.
- `playlist_add_count` is maintained from the `playlist_videos` table.

## Manual verification (dev)
1. Start the app (`npm run dev`).
2. Open the homepage and note the featured ordering.
3. As an authenticated user, favorite a video and add it to a playlist.
4. Refresh the homepage and confirm the video bubbles up in the featured list.
5. Click the same video multiple times in the same day and confirm the view count does not increase more than once for that session.
