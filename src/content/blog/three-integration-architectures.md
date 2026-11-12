---
title: Three ways to build the same integration service
date: 2026-08-23T10:00:00
summary: "The same integration service built three times (layered, hexagonal and message driven) and measured. What each one costs and what it buys you."
tags: ['Architecture', '.NET', 'Diploma']
---

For my diploma I built the same integration service three times, with a
different architecture each time. Then I measured them.

- The service pulls metrics from four public APIs and forwards them to a
  monitoring target.
- The domain model, the data sources and the target client are shared.
- The only difference is how those pieces are put together.

I wanted numbers instead of arguing about architecture from taste. The code and
the raw CSVs are
[on GitHub](https://github.com/JermanLuka/integracijski-vzorci-diploma).

## Monolith (layered)

A sequential pipeline. Fetch from each source in turn, map the results, send
them on. No interfaces in the middle, no indirection.

**Good**

- It's the smallest thing that works: 216 lines, against 270 and 439 for the
  others.
- The lowest cyclomatic complexity (25).
- You can read the whole flow top to bottom without jumping between files.
- For a service that will never grow a fifth source, this is the right answer.
  Everything below is overhead.

**Bad**

- It resists change. Adding a fourth data source meant editing 31 lines of
  existing code and changing the core orchestration.
- That worries me in a real codebase. Each of those 31 lines is a chance to
  break something that already worked.
- Its maintainability index was the lowest of the three (55). That surprised me
  until I saw why: with everything in one place, each method does more.

## Hexagonal (ports and adapters)

The core logic talks to interfaces, and adapters implement them. Adding a source
means writing a new adapter. The core isn't opened.

**Good**

- The clear winner on the cost of change. The fourth source needed one new
  35-line adapter and 2 lines of wiring, with no core changes at all.
- The headline number flatters it, so to be fair: that's 37 lines against the
  monolith's 31. Hexagonal wrote slightly more code.
- What changed is where the code lives. Nothing that already worked was edited.
- The highest maintainability score (72, against the monolith's 55).
- The same speed as the monolith: 0.064ms against 0.067ms per cycle, over 500
  iterations.
- I expected the abstraction to cost something measurable. Here it didn't.

**Bad**

- The flow is harder to follow. Cyclomatic complexity nearly doubled (44
  against 25).
- Reading a request end to end means following interfaces instead of method
  calls.
- The structure only pays off if things actually change. If nothing ever gets
  added, you've bought indirection and got nothing back.

## Messaging (channel-based)

Fetching and sending are decoupled through in-process channels
(`System.Threading.Channels`). Producers fetch, a consumer delivers, and neither
side waits on the other.

**Good**

- It's the only version that survives a transient failure.
- When one source rejects its first request and then recovers, messaging
  delivers 100% of the metrics.
- The other two deliver 75% on average. They fetch once and lose whatever that
  source would have returned.
- Producers run concurrently instead of one after another.

**Bad**

- It's the most expensive by every other measure:
  - 439 lines, roughly double the monolith.
  - The worst class coupling (59 against 37).
  - The highest cyclomatic complexity (56).
  - About 65% slower per cycle: 0.111ms against 0.067ms.
- You also get problems the other two don't have: channel capacity,
  back-pressure, and knowing when the pipeline is actually finished.

## Side by side

| | Lines | Maintainability | Cyclomatic | Coupling | Mean ms | Transient failure |
|---|---|---|---|---|---|---|
| Monolith | 216 | 55 | 25 | 37 | 0.067 | 75% |
| Hexagonal | 270 | 72 | 44 | 39 | 0.064 | 75% |
| Messaging | 439 | 65 | 56 | 59 | 0.111 | 100% |

## What I'd take from this

**Hexagonal is close to free.** That's the result I didn't expect.

- It cost 54 extra lines over the monolith.
- It ran at the same speed and scored better on maintainability.
- It moved the cost of adding a source out of existing code and into a new
  file. 31 lines edited in place became 2, for about the same amount of code
  written.
- The usual objection to ports and adapters is paying for flexibility you won't
  use. On these numbers the cost is small enough that the argument mostly goes
  away.

**Messaging is a real trade.**

- You spend double the code and a noticeable amount of speed.
- In return, the pipeline keeps working when a dependency has a bad minute.
- Whether that's worth it depends on how much you care about the metrics you'd
  otherwise drop.

## Two things to be honest about

**The speed numbers only measure architectural overhead.**

- The sources are faked in memory.
- The monolith fetches one source at a time. Messaging fetches concurrently.
- Under real network latency, waiting on I/O dominates everything else. So the
  ranking would likely flip.
- Reading "messaging is 65% slower" as a general claim would be wrong.

**The fault tolerance gap comes from retries.**

- Only the messaging version retries, with exponential backoff.
- That was deliberate, since the retry is the thing being measured.
- But nothing stops you adding retry to a layered monolith. The channel-based
  design just gives you a natural place to put it.
