---
title: Relic of Ruin
status: In development
kind: personal
summary: A single player 3D RPG in Godot 4 and C#. Tab target combat, a fixed 3/4 top down camera, and the slow, deliberate feel of classic vanilla WoW.
description: "A single player 3D RPG in Godot 4 and C#, with tab target combat, a fixed top down camera and the slow, deliberate feel of classic vanilla WoW."
tags: ['Godot', 'C#', '.NET', 'Game design']
devlog: Relic of Ruin devlog
order: 3
draft: false
---

A single player 3D RPG, built in Godot 4 with C#.

## The idea

- **Camera:** a fixed, angled 3/4 top down view. It never rotates. That's on
  purpose.
- **Combat:** tab target. You select a target and abilities hit it. Nothing
  to aim.
- **Positioning is manual.** To use an ability you need to be in range,
  facing the target (within a 140 degree cone) and in line of sight. If you
  aren't, the game tells you which of the three you failed. It doesn't turn
  you around for you.
- **The feel:** classic vanilla World of Warcraft combat. Slow swings, tight
  resources, and a two-handed crit as the payoff. Not a fast action game,
  and not modern WoW.
- **Tone:** dark and gritty, with loot as the thing that keeps you playing.

## Scope

- One class: a warrior that runs on rage.
- One handcrafted zone, with several bosses across it and its dungeon.
- The plan was three zones. I cut it on purpose: art, animation and quest
  writing cost far more than systems do. One finished zone beats three
  unfinished ones.

## Where it is

Playable, and played. The core loop passed its two go/no-go tests:

- Does manual facing melee feel right with a fixed camera?
- Does one zone hold up for an hour of real play?

Built so far:

- **Combat:** targeting, range, facing and line of sight checks. Rage, a
  1.5s global cooldown, and a full hit table with misses, dodges and parries.
  Critical strikes, and cast and channel timers.
- **Loot and gear:** rarity tiers, hand-made uniques, and greens with random
  suffixes. Item level comes from the mob that dropped it. A grid inventory
  with real bags and stacking. Gear has durability, loses it when you die,
  and is repaired for gold.
- **Progression:** levels and experience on vanilla's curve. Enemy levels
  change colour by how tough the enemy is for you. An ability trainer sells the core
  rotation. Weapon proficiencies start at zero and grow as you land hits.
  Relics are found items that are catalogued the first time you own them,
  and can be recovered forever after.
- **Saving:** level, gold, gear, bags, action bar, position, world flags,
  running cooldowns and buffs. Cooldowns freeze when you log out, so logging
  out can't skip one.
- **Enemies:** a navigation mesh baked at load, wander states so a camp isn't
  a row of statues, level scaling and leashing. The first boss has a ramping
  enrage. It punishes a slow kill without hard stopping it.
- **Economy:** copper, silver and gold. Prices come from item level. A vendor
  with buy, sell and buyback, and a blacksmith who charges per durability
  point.

Roughly 27,000 lines of C# across 134 files, with 67 systems and 59 content
resources.

## How it's built

Two rules do most of the work.

**1. Systems are code, content is data.**

- Anything that cuts across the game (combat, rage, loot, saving, facing)
  lives in `systems/` and knows nothing about specific content.
- Abilities, items, drop tables, suffixes and creatures are Godot resource
  files under `data/`.
- A new sword or a new mob is new data. No new code.

**2. Build one thing completely before repeating it.**

- One zone before three. One ability system before ten abilities.
- Tackle the riskiest unknown first, while being wrong is still cheap.
- The first milestone only answered one question: does the combat feel
  good? Grey boxes, no loot, no menus. If the answer had been no, very
  little would have been wasted.

**Tests.** Unusual for a hobby game, and worth it.

- gdUnit4 runs inside a headless Godot, driven by `dotnet test`.
- It covers the pure logic: the hit table, the item budget, the level curve,
  the facing solver, money formatting, bags and the quest log.
- Visual things aren't covered, on purpose.
- The first test suite found a real bug.

## What it's taught me

- Scope creep is a bigger risk than difficulty.
- Writing decisions down, including the rejected ones, is what keeps the
  project going across sessions.
- The hard part isn't the code. The systems for a much larger zone are
  close. The blocker is authoring, so the next milestone is tooling instead
  of a new feature.

## Built with

Godot 4, C#, .NET, gdUnit4.

I'm documenting the rest as it grows, instead of writing it all up at the
end. The entries are below.
