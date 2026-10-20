---
title: Relic of Ruin
status: In development
kind: personal
summary: A single player 3D RPG in Godot 4 and C#, with tab target combat and a fixed 3/4 top down camera, chasing the slow, deliberate weight of classic vanilla WoW rather than modern action game speed.
tags: ['Godot', 'C#', '.NET', 'Game design']
devlog: Relic of Ruin devlog
order: 2
draft: false
---

A single-player 3D RPG built in Godot 4 with C#, played from a fixed, angled 3/4
top-down camera. It never rotates or spins, which is a locked decision rather
than something unfinished.

Combat is tab-target, not action combat: you select a target and abilities
resolve against it, with nothing to aim. What is manual is your position. An
ability still needs you inside range, facing the target within a 140 degree cone,
and with line of sight, and it tells you which of the three you failed rather
than quietly turning you around. Targeting is automatic, footwork is not.

The target is a specific feel rather than a genre: classic vanilla World of Warcraft combat, where
a swing is slow, resources are tight, and a two-handed crit is the payoff. Not a
fast action game, and not modern WoW. Dark and gritty, with loot as the engine that
keeps you playing.

The design is deliberately narrow. One class (warrior, rage-driven) and one
handcrafted zone, with several bosses across it and its dungeon. Three zones was
the original plan and got cut on purpose: art, animation and quest writing cost
far more than systems do, and one finished zone beats three unfinished ones.

## Where it is

Playable, and played. The core loop passed its two go/no-go tests: whether
manual-facing melee feels right in a fixed camera, and whether one zone holds up
for an hour of real play.

Built so far:

- **Combat.** The targeting, range, facing and line-of-sight checks above, plus
  rage, a 1.5s global cooldown, a full hit table with misses, dodges and parries,
  critical strikes, and cast and channel timers.
- **Loot and gear.** Rarity tiers, hand-authored uniques and randomly suffixed
  greens, item level derived from the mob that dropped it, and a grid inventory
  with real bags and stacking. Gear carries durability, loses it on death, and is
  mended for gold.
- **Progression.** Levels and experience on vanilla's curve, con colours, an
  ability trainer that sells the core rotation, weapon proficiencies that start at
  zero and are earned by landing blows, and relics: found items that are
  catalogued the first time you own them and recoverable forever afterwards.
- **A world that remembers.** Saving covers level, gold, gear, bags, action bar,
  position, world flags, running cooldowns and buffs. Cooldowns freeze on logout
  rather than resetting, so logging out cannot skip one.
- **Enemies.** A navigation mesh baked at load, wander states so a camp is not a
  row of statues, level scaling, leashing, and the first boss, with a ramping
  enrage that punishes a slow kill rather than hard-stopping it.
- **An economy.** Copper, silver and gold, prices derived from item level, a
  vendor with buy, sell and buyback, and a blacksmith charging per durability
  point.

Roughly 27,000 lines of C# across 134 files, with 67 systems and 59 content
resources.

## How it is built

Two rules do most of the work.

**Systems are code, content is data.** Anything cross-cutting - combat, rage,
loot, saving, facing - lives in `systems/` and knows nothing about specific
content. Abilities, items, drop tables, suffixes and creatures are Godot resource
files under `data/`. Adding a new sword or a new mob is adding data, not writing
code.

**Build one thing completely before repeating it.** One zone before three, one
ability system before ten abilities. The riskiest unknown gets attacked first,
while being wrong is still cheap: the first milestone existed only to answer
whether the combat felt good, in grey boxes, with no loot and no menus. If the
answer had been no, very little would have been wasted.

There are automated tests, which is unusual for a hobby game and turned out to be
worth it. gdUnit4 runs inside a headless Godot, driven by `dotnet test`, covering
the parts that are pure logic: the hit table, the item budget, the level curve,
the facing solver, money formatting, bags and the quest log. Visual things are
deliberately not covered. The first suite written found a real bug.

## What the process has taught me

Scope creep is the failure mode rather than difficulty. Writing decisions down,
including the ones that were rejected, is what makes the project survivable
across sessions. And the hard part is not the code: systems-wise a much larger
zone is close, the blocker is authoring, which is why the next milestone is
tooling rather than a feature.

I am documenting the rest as it grows rather than writing it up once at the end.
The entries are listed below.
