---
title: Three ways to build the same integration service
date: 2026-08-23T10:00:00
summary: Layered, hexagonal, and message driven, built three times over and measured. What each one actually costs and what it buys you.
tags: ['Architecture', '.NET', 'Diploma']
---

For my diploma I built the same integration service three times, using a
different architecture each time, and then measured them. The service pulls
metrics from four public APIs and forwards them to a monitoring target. The
domain model, the data sources, and the target client are shared. The only thing
that changes between the three is how those pieces are put together.

The point was to stop arguing about architecture from taste and get some
numbers. Below is what each approach looks like, what it costs, and where it
pays off. The code and the raw CSVs are
[on GitHub](https://github.com/JermanLuka/integracijski-vzorci-diploma).

## Monolith (layered)

A sequential pipeline. Fetch from each source in turn, map the results, send
them on. No interfaces in the middle, no indirection.

**Good:** it is the smallest thing that works. 216 lines against 270 and 439 for
the others, the lowest cyclomatic complexity (25), and you can read the whole
flow top to bottom without jumping between files. For a service that will never
grow a fifth source, this is the correct answer and everything below is
overhead.

**Bad:** it resists change. Adding a fourth data source meant editing 31 lines
of existing code and modifying the core orchestration. That is the part that
worries me in a real codebase, because every one of those 31 lines is a chance
to break something that already worked. Its maintainability index was also the
lowest of the three (55), which surprised me until I looked at why: everything
being in one place makes the individual methods do more.

## Hexagonal (ports and adapters)

The core logic talks to interfaces. Adapters implement them. Adding a source
means writing a new adapter, not opening the core.

**Good:** this was the clear winner on change cost. The same fourth source
needed one new 35-line adapter and 2 lines of wiring, with no core changes at
all. Worth stating plainly, because the headline number flatters it: that is 37
lines against the monolith's 31, so hexagonal wrote slightly more code. What
changed is where the code lives. Nothing that already worked was edited.

It also scored highest on maintainability (72 against the monolith's 55)
and ran at the same speed as the monolith, 0.064ms against 0.067ms per cycle
over 500 iterations. I went in expecting abstraction to cost something
measurable, and here it did not.

**Bad:** the flow is harder to follow. Cyclomatic complexity nearly doubled
(44 against 25), and reading a request end to end means following interfaces
rather than method calls. The structure only pays for itself if things actually
change; if nothing ever gets added, you have bought indirection and received
nothing.

## Messaging (channel-based)

Fetching and sending are decoupled through in-process channels
(`System.Threading.Channels`). Producers fetch, a consumer delivers, and the two
sides do not wait on each other.

**Good:** it is the only version that survives a transient failure. When one
source rejects its first request and then recovers, messaging delivers 100% of
the metrics while the other two deliver 75% on average, because they fetch once
and lose whatever that source would have returned. Producers also run
concurrently instead of one after another.

**Bad:** it is the most expensive by every other measure. 439 lines, roughly
double the monolith. The worst class coupling (59 against 37). The highest
cyclomatic complexity (56). And about 65% slower per cycle, 0.111ms against
0.067ms. You also inherit a category of problem the other two do not have:
channel capacity, back-pressure, and knowing when the pipeline is actually
finished.

## Side by side

| | Lines | Maintainability | Cyclomatic | Coupling | Mean ms | Transient failure |
|---|---|---|---|---|---|---|
| Monolith | 216 | 55 | 25 | 37 | 0.067 | 75% |
| Hexagonal | 270 | 72 | 44 | 39 | 0.064 | 75% |
| Messaging | 439 | 65 | 56 | 59 | 0.111 | 100% |

## What I would take from this

The result I did not expect is that hexagonal is close to free. It cost 54 extra
lines over the monolith, ran at the same speed, scored better on
maintainability, and moved the cost of adding a source out of existing code and
into a new file: 31 lines edited in place became 2, for about the same amount of
code written.
The usual objection to ports and adapters is that you are paying for flexibility
you will not use. On these numbers the payment is small enough that the argument
mostly evaporates.

Messaging is a real trade, not a free one. You spend double the code and a
noticeable amount of speed, and what you get back is the pipeline continuing to
work when a dependency has a bad minute. Whether that is worth it depends
entirely on how much you care about the metrics you would otherwise drop.

## Two things worth being honest about

The performance numbers come from faked in-memory sources, so they measure
architectural overhead and nothing else. The monolith fetches sequentially while
messaging fetches concurrently, which means the ranking would likely flip under
real network latency, where waiting on I/O dominates everything else. Reading
"messaging is 65% slower" as a general claim would be wrong.

And the fault tolerance gap is there because only the messaging version
implements retry with exponential backoff. That was deliberate, since the retry
is the thing being measured, but it is worth stating plainly: nothing stops you
adding retry to a layered monolith. What the channel-based design gives you is a
natural place to put it.
