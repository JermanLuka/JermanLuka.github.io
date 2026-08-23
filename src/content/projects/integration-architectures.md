---
title: Integration architecture comparison
status: In progress
kind: personal
summary: The same .NET integration service built three times - layered, hexagonal, and message-driven - then measured on extensibility, complexity, performance, and fault tolerance.
tags: ['C#', '.NET', 'Architecture', 'xUnit']
repo: https://github.com/JermanLuka/integracijski-vzorci-diploma
order: 0
---

My diploma project. Architecture advice usually arrives as opinion, so I wanted
numbers instead: build one service three ways, change something, and measure
what each version costs you.

The service collects metrics from four public APIs (GitHub, StackOverflow,
World Bank, OpenMeteo) and forwards them to a monitoring target. All three
implementations share the same domain model, data sources, and target client.
They differ only in how those pieces are wired together.

## The three implementations

**Monolith (layered)** is the baseline. A sequential pipeline, no abstractions,
data flowing straight through the layers.

**Hexagonal (ports and adapters)** puts interfaces between the core logic and
everything external, so adapters can be swapped without the core noticing.

**Messaging (channel-based)** decouples fetching from sending with in-process
`System.Threading.Channels`, and is the only version that retries a failed
fetch.

## How it was measured

Everything runs against a fake HTTP handler and a mock target client, so results
are deterministic and no network is involved.

- **Extensibility** is computed from the git diff of the commit that added the
  fourth data source, counting files touched, new lines versus changed lines,
  and whether core logic had to change.
- **Complexity** comes from Visual Studio Code Metrics.
- **Performance** is 500 iterations per architecture, with pipeline construction
  outside the timed region.
- **Fault tolerance** covers a permanent source outage and a transient one that
  recovers after the first failed request.

## Results

Adding a fourth data source:

| | Files modified | New files | Lines in new files | Lines changed in existing code | Core changed |
|---|---|---|---|---|---|
| Monolith | 3 | 0 | 0 | 31 | Yes |
| Hexagonal | 2 | 1 | 35 | 2 | No |
| Messaging | 3 | 1 | 45 | 6 | No |

Complexity and speed:

| | Maintainability | Cyclomatic | Coupling | Lines | Mean ms |
|---|---|---|---|---|---|
| Monolith | 55 | 25 | 37 | 216 | 0.067 |
| Hexagonal | 72 | 44 | 39 | 270 | 0.064 |
| Messaging | 65 | 56 | 59 | 439 | 0.111 |

Metrics delivered when one source fails transiently and then recovers: monolith
and hexagonal 75% on average, messaging 100%. Under a permanent outage all three
deliver everything from the remaining sources, so that scenario separates
nothing.

## What came out of it

Hexagonal did not touch core logic. Adding a source meant 35 lines in a new
adapter plus 2 lines of wiring, against 31 lines edited in place in the
monolith. Roughly the same amount of code either way, which is the point worth
being careful about: the saving is not in volume, it is in where the code goes.
New file that cannot break what already works, rather than surgery on code that
already does.

It also scored higher on maintainability (72 against 55) at effectively
identical speed, which is the result I did not expect: the abstraction was close
to free.

Messaging is where the cost shows up. Twice the code of the monolith, the worst
coupling score, and roughly 65% slower. It buys the only implementation that
survives a transient failure intact.

Two caveats I would not want glossed over. The sources are faked in memory, so
the timings measure architectural overhead and nothing else; the monolith
fetches sequentially while messaging producers run concurrently, so real network
latency would likely reverse that ranking. And the fault tolerance gap exists
because only the messaging version implements retry with exponential backoff.
That was a deliberate choice, but it does mean scenario B measures a retry
policy as much as it measures an architecture.

I wrote up the comparison in more detail
[on the blog](/blog/three-integration-architectures).
