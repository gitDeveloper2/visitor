## Content Quality and Ranking Configuration

This document explains how blog/app quality is evaluated and how list ranking works, and how you can tune them via environment variables.

### Overview

- Blogs get a server-side quality score when they are created or updated. The score and a breakdown are stored in the database (`qualityScore`, `qualityBreakdown`).
- Listings (e.g., `/blogs`) prefer the stored `qualityScore` for ordering. If missing, a runtime fallback is computed.
- High-quality blogs (above a configurable threshold) are auto-considered for the Featured section.
- Apps use a separate ranking function with time decay, engagement, content depth, and media signals.

---

## Environment Variables

Place these in your `.env` or `.env.local` file. Restart the server after changes.

```dotenv
# Blog quality targets
NEXT_PUBLIC_BLOG_WORD_IDEAL_MIN=900
NEXT_PUBLIC_BLOG_WORD_IDEAL_MAX=2000
NEXT_PUBLIC_BLOG_MAX_LINKS=10

# Blog quality weights (sum does not need to be 1.0)
NEXT_PUBLIC_BLOG_Q_W_WORDS=0.4
NEXT_PUBLIC_BLOG_Q_W_HEADINGS=0.25
NEXT_PUBLIC_BLOG_Q_W_LINKS=0.15
NEXT_PUBLIC_BLOG_Q_W_IMAGES=0.1
NEXT_PUBLIC_BLOG_Q_W_TAGS=0.1

# Auto-feature threshold (0..1). Blogs at/above are regularly featured
NEXT_PUBLIC_BLOG_QUALITY_FEATURE_THRESHOLD=0.82

# Ranking time decay half-lives (hours)
NEXT_PUBLIC_RANK_BLOG_HALFLIFE_HOURS=168     # 7 days
NEXT_PUBLIC_RANK_APP_HALFLIFE_HOURS=336      # 14 days
```

### What each variable controls

- **NEXT_PUBLIC_BLOG_WORD_IDEAL_MIN / NEXT_PUBLIC_BLOG_WORD_IDEAL_MAX**: Ideal word-count window for blogs. Content within this range scores highest for the word-count factor.
- **NEXT_PUBLIC_BLOG_MAX_LINKS**: Soft cap for links. Exceeding this count gradually reduces the links factor to discourage link-heavy posts.
- **NEXT_PUBLIC_BLOG_Q_W_WORDS / NEXT_PUBLIC_BLOG_Q_W_HEADINGS / NEXT_PUBLIC_BLOG_Q_W_LINKS / NEXT_PUBLIC_BLOG_Q_W_IMAGES / NEXT_PUBLIC_BLOG_Q_W_TAGS**: Relative weights for each quality sub-score. Increase a weight to make that factor matter more.
- **NEXT_PUBLIC_BLOG_QUALITY_FEATURE_THRESHOLD**: Blogs whose total quality score is at/above this value are auto-considered for Featured. The page then fills remaining Featured slots with a rotation algorithm for diversity.
- **NEXT_PUBLIC_RANK_BLOG_HALFLIFE_HOURS / NEXT_PUBLIC_RANK_APP_HALFLIFE_HOURS**: Time-decay speed for ranking. Lower values make freshness matter more; higher values make content age slower.

---

## How Quality Is Calculated (Blogs)

Quality score is a weighted sum of sub-scores (each 0..1):

- **Word Count**: Peaks when total words are between `BLOG_WORD_IDEAL_MIN` and `BLOG_WORD_IDEAL_MAX`.
- **Heading Structure**: Requires an H1 and rewards sensible progression (penalizes jumps like H2 → H4).
- **Links**: Penalizes excessive links above `BLOG_MAX_LINKS`.
- **Images**: Small boost if an image is present.
- **Tags**: Best between 3 and 8 tags.

The final score is stored as `qualityScore` alongside `qualityBreakdown` (wordCount, headingsScore, linksScore, imagesScore, tagsScore).

Where implemented:
- Compute-and-store on submit: `src/app/api/user-blogs/route.ts`
- Recompute on update: `src/app/api/user-blogs/[slug]/route.ts`

---

## How Ranking Works

Ranking combines freshness (time decay), engagement, and content quality:

- **Blogs**: `/blogs` orders by stored `qualityScore` (fallback to runtime) and uses time decay/rotation for Featured selection.
- **Apps**: `/launch` orders the main list with a score that considers time decay, engagement, content depth, features, and gallery; Premium gets a bounded boost.

Configurable decay half-life via `NEXT_PUBLIC_RANK_BLOG_HALFLIFE_HOURS` and `NEXT_PUBLIC_RANK_APP_HALFLIFE_HOURS`.

---

## Tuning Guidance

- Want more emphasis on structure? Increase `NEXT_PUBLIC_BLOG_Q_W_HEADINGS`.
- Too many link-heavy posts surfacing? Decrease `NEXT_PUBLIC_BLOG_MAX_LINKS` or increase `NEXT_PUBLIC_BLOG_Q_W_LINKS`.
- Want shorter/longer blogs to score better? Adjust `NEXT_PUBLIC_BLOG_WORD_IDEAL_MIN/MAX`.
- Feature fewer/more posts automatically? Raise/lower `NEXT_PUBLIC_BLOG_QUALITY_FEATURE_THRESHOLD`.
- Prefer fresher content? Lower `NEXT_PUBLIC_RANK_BLOG_HALFLIFE_HOURS` (blogs) or `NEXT_PUBLIC_RANK_APP_HALFLIFE_HOURS` (apps).

After changing environment variables, restart the server. Quality will be recomputed on next create/update of a blog; for existing content, you can add an admin task to batch recompute if needed.

---

## FAQs

- **Do I need to recompute quality after changing weights?**
  Not strictly—lists still work. But to reflect new weights for older posts, recompute on edit or run an admin job.

- **What if I want hard enforcement (e.g., reject too many links)?**
  Current logic is scoring-based. You can add additional validation in the submit step to hard-block if desired.

