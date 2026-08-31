---
title: Getting eight direction locomotion to look right
date: 2026-08-31T18:00:00
series: Relic of Ruin devlog
part: 2
summary: 'Two days on directional animation. Clips out of phase, a blend space that was the wrong shape, and an experiment flag that had been left on in three scenes.'
tags: ['Godot', 'C#', 'Animation']
---

The character has animations now. It took two days and almost none of it was
animation code.

The character aims independently of where it walks, so it needs eight directional
clips rather than one run cycle. My bug report to myself was that the animation
looked wrong moving diagonally backwards, and later that it looked like short
jumping jacks. I could not describe it better than that, which made guessing
expensive.

So I wrote scripts that run headless against the built character and print numbers.
There are four now. One reports what a downloaded clip actually contains: frame
rate, whether it is in place, how fast it implies the character travels, and which
way it goes. One reports where in its cycle each clip plants its left foot. One
loads the built character and checks every animation track still resolves, then
measures how far the swing moves each bone. One compares the retargeted poses
against the Mixamo originals. None of them run at play time.

The first paid for itself immediately. The pack included two files called "jog
forward diagonal" and "jog forward diagonal (2)" with nothing saying which was
which, and a clip at the wrong corner of the blend space looks exactly like bad
animation. Measuring where the hips go settled it: one at 45.0 degrees, the other
at 45.4 the other way.

## What was actually wrong

The clips were out of phase. A blend space crossfades by normalised time, which
assumes halfway through one clip means the same thing as halfway through another.
Mine did not agree. Measured against the forward run, in fractions of a cycle:

| Clip | Before | After |
| --- | --- | --- |
| Right strafe | 0.353 | 0.004 |
| Forward right | 0.464 | 0.001 |
| Forward left | 0.417 | 0.000 |
| Left strafe | 0.129 | 0.000 |
| Back left | 0.168 | 0.000 |
| Backpedal | 0.179 | 0.001 |
| Back right | 0.276 | 0.001 |

0.5 would be the wrong foot entirely, so the two forward diagonals were close to
it. Unreal calls the fix sync markers and Unity calls it cycle offset. Godot has
neither, so the offset gets baked into the clips when they are retargeted.

The blend space was also the wrong shape. I had placed each clip at its measured
speed, which sounds more honest than putting them all on a circle. The measured
speeds are not close together: among the jog clips the slowest travels 2.29 metres
per second and the fastest 3.01, and the forward clip is a run at 4.38. So the
space came out lopsided, and a blend space handles an input past its edge by
projecting it onto the nearest edge between two points. That projection only keeps
the angle if the edge is a circular arc. Mine was not, and a full speed 45 degree
backward diagonal was landing at 28 degrees, so the character was drawn running at
an angle it was not travelling. Putting every clip on a circle fixes it by
construction, because the input lands on the ring and there is nothing left to
project. The measured speeds moved to a node that scales playback instead.

And the character was outrunning the clips. The jog set travels around 2.5 metres
per second and the character ran at 7, so the legs were being sped up nearly three
times, roughly seven steps a second where a sprinter does five. I dropped movement
to 5.5 and capped the correction. Someone moving faster takes longer steps, not
only quicker ones, and past a point speeding a cycle up reads as a cartoon.

## Two mistakes

Two of the diagonal clips were measurably bad. Over one cycle the forward clip
swings the feet 1.43 m front to back and 0.09 m sideways, which is a run. The
forward diagonals swing them 1.06 m front to back and 1.02 m sideways, because they
were captured as side shuffles. So I deleted them and let the neighbouring clips
blend across the gap. My sideways swing number improved everywhere, and it was
obviously worse in play. Removing two of eight points left 90 degree gaps, and the
straight edges between the remaining points cut inside the input circle, so a
request for 70 degrees came back as 76 and 60 came back as 65, across the whole
front half. Same projection bug as above, reintroduced about four hours after
fixing it. The metric I was watching could not see it.

Then I spent an afternoon on upper body layering that turned out to work fine. My
test said the sword swing moved no bones at all, and kept saying so with layering
disabled, which seemed to rule the layering out. The test was wrong twice over: it
read the authored bone pose, which the animation system never writes to, and it
sampled a third of a second in, still inside the wind up. Measured properly the
hand moves 97 degrees and the upper arm 63, while the thigh, foot and pelvis move
0.0. Later, when a second thing appeared not to run, I pointed the same measurement
at one of Godot's own built in nodes as a control. That read zero too.

## The flag

There was an experiment sitting in the player controller: a flag making the
character face the cursor at all times instead of facing where it runs. Its own
comment said it was off by default and that turning it on changes what the game is.

It was on. In three scenes.

So the character had been strafing constantly, which put the strafe and diagonal
clips, the weakest in the set, on screen almost all the time. Every bug I fixed was
real, and every one had been made louder by a single boolean.

## Turning it back on

The next day I turned it on deliberately. Facing follows the cursor now.

It costs something specific. Melee needs the target inside a 140 degree cone, and
the cursor is already on the mob you clicked, so that check now passes essentially
always. I did it because aiming while moving is the entire reason to own eight
directional clips, and because kiting should be the default state rather than a
button you hold through a fight. It is one dropdown to go back.

That meant the set had to hold up in every direction, and three things came out of
it.

I switched on a skeleton modifier written the day before and left off. It yaws the
hips toward the direction of travel and counter rotates the spine to put the chest
back where it was, so the legs can point one way while the upper body points
another. Unreal ships this as orientation warping. With it on, the blend space only
plays the four clips that were captured as what they claim to be, and the legs
rotate to cover every angle between them. The two side shuffle diagonals stopped
playing at all.

That exposed a stride bug that had been invisible until then. The code that speeds
the gait up to match the ground was dividing by the authored speed of the direction
being travelled rather than of the clip actually playing. Those are the same number
until the warp is on. With it on they are half a sector apart: just past 45 degrees
the forward clip takes over, which travels 4.03 metres per second, while the lookup
was still reading about 3.0 off the true heading. The legs ran at the 1.8 cap where
1.36 was correct, about a third too fast.

Then it snapped. Rounding a heading to the nearest 90 degrees is a staircase: 44
degrees says strafe right, 46 says run forward, nothing in between. Crossing a
diagonal swapped one clip for a completely different one in a single frame. The legs
kept pointing the right way, because the warp flipped sign by exactly as much, so
what I saw was not a change of direction but a change of pose, a forward run
becoming a side shuffle between two frames. The blend space now has its own heading
that sweeps to the new gait instead of jumping to it, with the warp angle read back
off it so the two always sum to where the body is really going. It costs a fraction
of a second of the mediocre diagonal clip on the way past.

## Next

The animation is good enough to stop looking at, which is all it needed to be.

The zone is further along than I tend to remember. 900 metres square of real
terrain in 16 regions, a boundary that leaks in 0 of 10 escape directions, a
navmesh baked as 16 tiles, and 103 placed things: 80 enemy bodies across 43 camps,
4 rares, the boss, 9 chests, 5 ore veins and three vendors. All of it generated by
scripts rather than clicked in by hand.

What it does not have is a reason to exist. No quests, no textures, no props, no
dungeon interior. The camps were also placed before any quests existed, which is
backwards. So the next thing is not code. It is deciding what the zone is about:
whether the starting area gets sealed off the way Northshire Valley is, and whether
the hub moves so that roads leave it in four directions instead of one. Mobs should
exist because quests exist, not the other way round.
