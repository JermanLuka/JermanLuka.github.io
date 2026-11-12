---
title: AI estimation skill
status: Merged
kind: internal
summary: "A Claude Code skill that turns a client's scope document into the agency's Excel estimate. A Python script does the maths."
tags: ['Claude Code', 'Python', 'JSON Schema', 'AI agents']
order: 2
---

Built at extra.dev for internal use. The code isn't public.

## The problem

- Clients send a scope document: what they want built.
- Someone has to turn it into an estimate in the agency's Excel workbook.
- The numbers can't be AI guesses.

## How it works

- Claude reads the scope document.
- A Python script does the maths and builds the workbook.
- JSON Schema checks the data is in the right format.
- 20 reusable work presets.
- 39 tests.

## Results

- Checked and adjusted against 3 real projects.
- Passed code review and merged into the company's shared skills repo.

## Built with

Claude Code, Python, JSON Schema, Excel.
