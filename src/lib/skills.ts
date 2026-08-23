// Logos for the home page skill grid.
//
// Paths come from simple-icons, which ships the official brand marks as plain
// 24x24 SVG path data (CC0). They are inlined into the HTML at build time, so
// nothing is fetched from a CDN and no image requests are made.
//
// A few marks are not in the set - C# and SQL Server were pulled over
// trademark policy, and gRPC was never added - so those fall back to a
// lettermark tile.

import {
  siClaude,
  siDocker,
  siDotnet,
  siElasticsearch,
  siGit,
  siJavascript,
  siMysql,
  siRedis,
  siTeamcity,
} from 'simple-icons';

export type Skill = {
  name: string;
  /** 24x24 fill path from simple-icons. Omit to render `text` instead. */
  path?: string;
  /** Short lettermark used when no logo exists. */
  text?: string;
  /** Brand colour, without the leading #. */
  hex: string;
  /** Override for dark mode, where near-black marks disappear. */
  darkHex?: string;
};

export const skillLogos: Skill[] = [
  { name: 'C#', text: 'C#', hex: '512BD4' },
  { name: '.NET', path: siDotnet.path, hex: siDotnet.hex },
  { name: 'JavaScript', path: siJavascript.path, hex: siJavascript.hex },
  { name: 'SQL Server', text: 'SQL', hex: 'CC2927' },
  { name: 'MySQL', path: siMysql.path, hex: siMysql.hex },
  { name: 'Redis', path: siRedis.path, hex: siRedis.hex },
  {
    name: 'Elasticsearch',
    path: siElasticsearch.path,
    hex: siElasticsearch.hex,
    darkHex: '43A5D6',
  },
  { name: 'gRPC', text: 'gRPC', hex: '2DA6B0' },
  { name: 'Docker', path: siDocker.path, hex: siDocker.hex },
  { name: 'Git', path: siGit.path, hex: siGit.hex },
  {
    name: 'TeamCity',
    path: siTeamcity.path,
    hex: siTeamcity.hex,
    darkHex: 'E2E8F0',
  },
  { name: 'Claude Code', path: siClaude.path, hex: siClaude.hex },
];
