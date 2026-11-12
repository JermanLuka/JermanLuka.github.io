---
title: Integration architecture comparison
status: In progress
kind: personal
summary: "My diploma project. The same .NET integration service built three ways (layered, hexagonal and message driven), then measured."
description: "One .NET integration service built three ways (layered, hexagonal, message driven), measured on extensibility, complexity, performance and fault tolerance."
tags: ['C#', '.NET', 'Architecture', 'xUnit']
repo: https://github.com/JermanLuka/integracijski-vzorci-diploma
order: 1
---

My diploma project. Architecture advice is usually opinion. I wanted numbers
instead:

- Build one service three ways.
- Make the same change to each.
- Measure what each version costs.

## What the service does

- Collects metrics from four public APIs: GitHub, StackOverflow, World Bank
  and OpenMeteo.
- Sends them on to a monitoring target.
- All three versions share the same domain model, data sources and target
  client. Only the wiring between them is different.

## The three versions

- **Monolith (layered):** the baseline. A simple pipeline that runs one step
  after another, with no abstractions.
- **Hexagonal (ports and adapters):** the core logic only talks to
  interfaces. Anything external can be swapped without touching the core.
- **Messaging (channel-based):** fetching and sending are separated with
  in-process `System.Threading.Channels`. The only version that retries a
  failed fetch.

## How it was measured

All tests use a fake HTTP handler and a mock target client. No network is
involved, so the results are the same on every run.

- **Extensibility:** from the git diff of the commit that added a fourth
  data source. It counts files touched, new lines against changed lines, and
  whether core logic had to change.
- **Complexity:** Visual Studio Code Metrics.
- **Performance:** 500 runs per architecture. Setting up the pipeline isn't
  timed.
- **Fault tolerance:** two tests.
  - Permanent outage: one source is down the whole time.
  - Short outage: one source fails on the first request, then recovers.

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

Fault tolerance:

- **Short outage:** monolith and hexagonal delivered 75% of metrics on
  average. Messaging delivered 100%.
- **Permanent outage:** all three delivered everything from the other
  sources. This test showed no difference.

## What I found

- **Hexagonal didn't touch the core.** Adding a source took 35 lines in a
  new adapter plus 2 lines of wiring. The monolith needed 31 lines edited in
  place.
- **The amount of code was about the same.** The difference is where it
  goes. Hexagonal adds a new file that can't break what already works. The
  monolith edits code that already works.
- **The abstraction was close to free.** Hexagonal scored higher on
  maintainability (72 against 55) at practically the same speed. I didn't
  expect that.
- **Messaging costs the most.** Twice the code of the monolith, the worst
  coupling score, and roughly 65% slower. In return, it's the only version
  that delivered everything through the short outage.

## Caveats

- **The timings only measure the architecture's own overhead.** The sources
  are faked in memory. The monolith fetches one source at a time, while the
  messaging producers run concurrently. With real network latency, that
  ranking would likely reverse.
- **The fault tolerance gap comes from retries.** Only the messaging version
  retries, with exponential backoff. That was on purpose. But it means the
  short outage test measures a retry policy as much as an architecture.

## Built with

C#, .NET, xUnit.

I wrote up the comparison in more detail
[on the blog](/blog/three-integration-architectures).
