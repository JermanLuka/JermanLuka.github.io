---
title: Getting eight direction locomotion to look right
date: 2026-08-31T18:00:00
series: Relic of Ruin devlog
part: 2
summary: "Two days on directional animation: clips out of phase, a blend space of the wrong shape, and an experiment flag left on in three scenes."
description: "Two days on directional animation: clips out of phase, a blend space of the wrong shape, and an experiment flag left on in three scenes."
tags: ['Godot', 'C#', 'Animation']
---

The character has animations now. It took two days, and almost none of it was
animation code.

## The problem

- The character aims separately from where it walks. So it needs eight
  directional clips instead of one run cycle.
- My bug report to myself: the animation looked wrong moving diagonally
  backwards. Later: it looked like short jumping jacks.
- I couldn't describe it better than that, which made guessing expensive.

## Measuring instead of guessing

I wrote scripts that run headless against the built character and print
numbers. There are four now. None of them run at play time.

- One reports what a downloaded clip actually contains: frame rate, whether it's
  in place, how fast it implies the character travels, and which way it goes.
- One reports where in its cycle each clip plants its left foot.
- One loads the built character, checks every animation track still resolves,
  and measures how far the swing moves each bone.
- One compares the retargeted poses against the Mixamo originals.

The first one paid for itself straight away:

- The pack had two files called "jog forward diagonal" and "jog forward diagonal
  (2)", with nothing saying which was which.
- A clip at the wrong corner of the blend space looks exactly like bad
  animation.
- Measuring where the hips go settled it: one at 45.0 degrees, the other at 45.4
  the other way.

## What was actually wrong

**1. The clips were out of phase.**

- A blend space crossfades by normalised time. It assumes halfway through one
  clip means the same as halfway through another.
- Mine didn't agree. Measured against the forward run, in fractions of a cycle:

| Clip | Before | After |
| --- | --- | --- |
| Right strafe | 0.353 | 0.004 |
| Forward right | 0.464 | 0.001 |
| Forward left | 0.417 | 0.000 |
| Left strafe | 0.129 | 0.000 |
| Back left | 0.168 | 0.000 |
| Backpedal | 0.179 | 0.001 |
| Back right | 0.276 | 0.001 |

- 0.5 would be the wrong foot entirely, so the two forward diagonals were close
  to it.
- Unreal calls the fix sync markers. Unity calls it cycle offset. Godot has
  neither, so the offset gets baked into the clips when they're retargeted.

**2. The blend space was the wrong shape.**

- I'd placed each clip at its measured speed. That sounds more honest than
  putting them all on a circle.
- But the measured speeds aren't close together. Among the jog clips, the
  slowest travels 2.29 metres per second and the fastest 3.01. The forward clip
  is a run at 4.38.
- So the space came out lopsided.
- A blend space handles an input past its edge by projecting it onto the nearest
  edge between two points. That only keeps the angle if the edge is a circular
  arc.
- Mine wasn't. A full speed 45 degree backward diagonal was landing at 28
  degrees. The character was drawn running at an angle it wasn't travelling.
- Putting every clip on a circle fixes it by construction. The input lands on
  the ring, so there's nothing left to project.
- The measured speeds moved to a node that scales playback instead.

**3. The character was outrunning the clips.**

- The jog set travels around 2.5 metres per second. The character ran at 7.
- So the legs were sped up nearly three times: roughly seven steps a second,
  where a sprinter does five.
- I dropped movement to 5.5 and capped the correction.
- Someone moving faster takes longer steps, not only quicker ones. Past a point,
  speeding a cycle up looks like a cartoon.

## Two mistakes

**1. Deleting the bad diagonals.**

- Two of the diagonal clips were measurably bad.
- Over one cycle, the forward clip swings the feet 1.43 m front to back and
  0.09 m sideways. That's a run.
- The forward diagonals swing them 1.06 m front to back and 1.02 m sideways.
  They were captured as side shuffles.
- So I deleted them and let the neighbouring clips blend across the gap.
- My sideways swing number improved everywhere. In play it was obviously worse.
- Removing two of eight points left 90 degree gaps. The straight edges between
  the remaining points cut inside the input circle.
- So a request for 70 degrees came back as 76, and 60 came back as 65, across
  the whole front half.
- The same projection bug as above, brought back about four hours after fixing
  it. The metric I was watching couldn't see it.

**2. Chasing a layering bug that wasn't there.**

- I spent an afternoon on upper body layering that turned out to work fine.
- My test said the sword swing moved no bones at all. It kept saying so with
  layering disabled, which seemed to rule the layering out.
- The test was wrong twice over. It read the authored bone pose, which the
  animation system never writes to. And it sampled a third of a second in,
  still inside the wind up.
- Measured properly, the hand moves 97 degrees and the upper arm 63. The thigh,
  foot and pelvis move 0.0.
- Later, a second thing seemed not to run. I pointed the same measurement at one
  of Godot's own built in nodes as a control. That read zero too.

## The flag

- There was an experiment in the player controller: a flag that made the
  character face the cursor at all times, instead of facing where it runs.
- Its own comment said it was off by default, and that turning it on changes
  what the game is.
- It was on. In three scenes.
- So the character had been strafing constantly. That put the strafe and
  diagonal clips, the weakest in the set, on screen almost all the time.
- Every bug I fixed was real. Every one had been made louder by a single
  boolean.

## Turning it back on

The next day I turned it on deliberately. Facing follows the cursor now.

It costs something specific:

- Melee needs the target inside a 140 degree cone.
- The cursor is already on the mob you clicked, so that check now passes
  almost always.

Why I did it anyway:

- Aiming while moving is the whole reason to own eight directional clips.
- Kiting should be the default state, not a button you hold through a fight.
- It's one dropdown to go back.

That meant the set had to hold up in every direction. Three things came out of
it.

**1. Orientation warping.**

- I switched on a skeleton modifier I'd written the day before and left off.
- It turns the hips towards the direction of travel and counter rotates the
  spine to put the chest back where it was. The legs can point one way while
  the upper body points another.
- Unreal ships this as orientation warping.
- With it on, the blend space only plays the four clips that were captured as
  what they claim to be. The legs rotate to cover every angle between them.
- The two side shuffle diagonals stopped playing at all.

**2. A stride bug.**

- It had been invisible until then.
- The code that speeds the gait up to match the ground was dividing by the
  authored speed of the direction being travelled. It should have used the clip
  actually playing.
- Those are the same number until the warp is on. With it on, they're half a
  sector apart.
- Just past 45 degrees the forward clip takes over, which travels 4.03 metres
  per second. The lookup was still reading about 3.0 off the true heading.
- The legs ran at the 1.8 cap, where 1.36 was correct. About a third too fast.

**3. The snap.**

- Rounding a heading to the nearest 90 degrees is a staircase. 44 degrees says
  strafe right, 46 says run forward, and there's nothing in between.
- Crossing a diagonal swapped one clip for a completely different one in a
  single frame.
- The legs kept pointing the right way, because the warp flipped sign by exactly
  as much. So what I saw was a change of pose, not of direction: a forward run
  turning into a side shuffle between two frames.
- The blend space now has its own heading that sweeps to the new gait instead
  of jumping to it.
- The warp angle is read back off it, so the two always add up to where the body
  is really going.
- It costs a fraction of a second of the mediocre diagonal clip on the way past.

## Next

The animation is good enough to stop looking at. That's all it needed to be.

The zone is further along than I tend to remember. All of it was generated by
scripts, not clicked in by hand:

- 900 metres square of real terrain in 16 regions.
- A boundary that leaks in 0 of 10 escape directions.
- A navmesh baked as 16 tiles.
- 103 placed things: 80 enemy bodies across 43 camps, 4 rares, the boss, 9
  chests, 5 ore veins and three vendors.

What it doesn't have is a reason to exist:

- No quests, no textures, no props, no dungeon interior.
- The camps were placed before any quests existed, which is backwards. Mobs
  should exist because quests exist, not the other way round.

So the next thing isn't code. It's deciding what the zone is about:

- Does the starting area get sealed off, the way Northshire Valley is?
- Does the hub move, so roads leave it in four directions instead of one?
