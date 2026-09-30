# Diamond Gate Bridge — Website Analytics Baseline v1.0

**Status:** FROZEN  
**Version:** `DGB-WEB-ANALYTICS-BASELINE-v1.0`  
**Effective date:** 2026-09-20  
**Source authority:** Cloudflare Web Analytics screenshots / screen recordings reviewed in-chat  
**Purpose:** Durable historical baseline for future website-traffic comparisons.

## Important interpretation rules

- **Visits** are not the same as unique people. One person can generate multiple visits.
- **Page views** are total page loads/views and can exceed visits substantially.
- **Page views per visit** below is a simple ratio, not a formal Cloudflare session-depth metric.
- Current-period data for Aug. 26–Sep. 20 is a partial period of roughly 26 days and should not be treated as a full 30-day month.
- Cloudflare Web Analytics is privacy-first; it does not identify individual visitors by name.
- Traffic-source and geography data are used only to establish whether traffic is clearly broader than owner testing.
- The dashboard explicitly excluded bots in the reviewed views.

---

# Window A — Approx. Aug. 26, 2026 through Sep. 20, 2026

**Approximate duration:** 26 days

## Core traffic

- Visits: **~1.14k**
- Page views: **~3.61k**
- Simple page-views-per-visit ratio: **~3.2**

## Referrer/source mix

- Google: **~570 visits**
- Direct / no referrer: **~560 visits**
- Bing: **~10 visits**

## Geography

- United States: **~1.1k visits**
- Japan: **~20 visits**
- Brazil: **~20 visits**

## Device mix

- Mobile: **~430**
- Tablet: **~430**
- Desktop: **~280**

## Browser mix

Observed browser families included:

- Chrome: **~660**
- Mobile browser families
- Mobile Safari
- Edge
- Unknown / other

## Interpretation

- Traffic is clearly broader than owner-only testing.
- Google is a major identifiable source.
- The site is operating at roughly a 1.1k-visit / 3.6k-page-view level over this partial current period.
- Multiple countries, devices, and browser families establish meaningful external traffic.

---

# Window B — Approx. Jul. 27, 2026 through Aug. 25, 2026

**Approximate duration:** 30 days

## Core traffic

- Visits: **~1.26k**
- Page views: **~3.66k**
- Simple page-views-per-visit ratio: **~2.9**

## Referrer/source mix

- Google: **~700 visits**
- Direct / no referrer: **~550 visits**
- Small additional traffic from Bing and other sources

## Interpretation

- The ~1.1k+ traffic level is not a one-off spike.
- This prior full 30-day window was slightly higher in visits than the later partial window.
- Google discovery remained a major contributor.

---

# Window C — Approx. late Jun. 2026 through late Jul. 2026

**Reviewed range appeared to cover roughly Jun. 24–Jul. 24.**

## Core traffic

- Visits: **~700**
- Page views: **~3.03k**
- Simple page-views-per-visit ratio: **~4.3**

## Referrer/source mix

- Google: **~370 visits**
- Direct / no referrer: **~330 visits**

## Geography

- United States: **~690 visits**
- Philippines: **~10 visits**

## Top paths observed

- Homepage `/`: **~520 visits**
- `/products/archcoin/`: **~80 visits**
- prototype / universal-computing path: **~30 visits**
- `/showroom/globe/`: **~10 visits**
- `/door/`: **~10 visits**

## Interpretation

- Google was already a major discovery source before the recent relaunch.
- Traffic appears to have increased materially from the ~700-visit level into the later ~1.1k–1.3k range.
- The homepage dominated navigation, with ARCHCOIN already showing notable interest relative to secondary routes.

---

# Recent 24-hour snapshot reviewed on Sep. 20, 2026

This snapshot sits inside Window A and must **not** be added to Window A totals.

Observed:

- Page views: **~139–141**
- Visits: **~23–25**
- Simple page-views-per-visit ratio: **~5.6**

This was used as a live operational snapshot only.

---

# Established baseline

Based on the currently recovered Cloudflare evidence:

## Current traffic band

The website appears to be operating at approximately:

- **~1.1k–1.3k visits per month**
- **~3.6k page views per month**

with a prior earlier period around:

- **~700 visits**
- **~3.0k page views**

## Growth signal

The currently observed sequence is approximately:

`~700 visits → ~1.26k visits → ~1.14k visits in ~26 days`

This supports a working hypothesis of meaningful traffic growth, but future equal-length windows should be used to confirm the trend.

## External-traffic signal

A substantial portion of traffic is clearly external because:

- Google contributes hundreds of visits per period.
- Bing contributes some additional visits.
- Traffic comes from multiple countries.
- Traffic spans multiple device classes and browser families.

The data therefore does **not** support the hypothesis that the traffic is primarily owner testing.

## Search-discovery signal

Google appears to be the strongest identifiable traffic source in the reviewed windows:

- ~370 Google visits in the earlier ~700-visit period
- ~700 Google visits in the following ~1.26k-visit period
- ~570 Google visits in the Aug. 26–Sep. 20 partial period

This makes organic/search discovery a central metric for future analysis.

---

# Forward comparison law

Future website-analytics reviews should compare new Cloudflare windows against this baseline using:

1. Visits
2. Page views
3. Page views / visit ratio
4. Google referrals
5. Direct / no-referrer traffic
6. Other referrers
7. Top paths
8. Countries
9. Device classes
10. Browser families
11. Traffic spikes after specific social-post times

Do not compare partial periods to full 30-day periods without explicitly labeling the difference.

---

# Recommended next historical window

For continued non-overlapping history, retrieve the next ~30-day block immediately preceding Window C.

The purpose is to determine whether the ~700-visit period was itself a stable baseline or already part of the growth curve.

---

# Canonical short form

> DiamondGateBridge.com currently shows a durable Cloudflare baseline of roughly 1.1k–1.3k visits and ~3.6k page views per month, up from an earlier ~700-visit period, with Google consistently accounting for a large share of identifiable traffic and clear evidence that traffic is broader than owner testing.
