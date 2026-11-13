// CV data, rendered by /cv: the full record and the years of experience.

/** Start of my first professional role. Drives every "4+ years" on the site. */
const careerStart = new Date(2022, 9, 1);

/**
 * Whole years since the first role, rounded down so "4+" only becomes "5+"
 * once the fifth year is actually done. Pages call this at build time.
 */
export function yearsOfExperience(now = new Date()) {
  const year = 365.25 * 24 * 60 * 60 * 1000;
  return Math.floor((now.getTime() - careerStart.getTime()) / year);
}

/**
 * The "About" section at the top of /cv. A string is a paragraph; a list of
 * strings is a bullet list under the paragraph before it.
 */
export const intro: (string | string[])[] = [
  "I'm a full stack software engineer with a backend focus, experienced in C# and .NET. I've worked on:",
  [
    'Satellite vessel monitoring, for fisheries authorities and fleet operators.',
    'ERP systems for manufacturing and logistics.',
    'An enterprise document management platform used by banks, healthcare providers and financial institutions.',
  ],
  'I also automate work with AI agents and scripts. I keep the AI in check, so the results are reliable:',
  [
    "Scripts calculate the numbers, so the AI doesn't guess them.",
    "The data is checked against a template/schema before it's used.",
    "A person approves every change before it's applied.",
    'Regression tests catch anything that breaks.',
  ],
  'The work I find most interesting needs me to understand a system before changing it. For example:',
  [
    'Tracing a production incident through the logs to its real cause.',
    'Extending an API that enterprise clients depend on, without breaking them.',
    'Replacing a component while keeping its behaviour identical.',
  ],
  "I'm finishing a diploma thesis that compares monolithic, hexagonal and message driven architectures in .NET integration systems. Each one is measured on extensibility, complexity, performance and fault tolerance.",
];

export type Job = {
  role: string;
  org: string;
  focus: string;
  period: string;
  blurb: string;
  notes: string[];
  stack: string[];
};

/** Newest first. The first entry is treated as the current role. */
export const experience: Job[] = [
  {
    role: 'Software Engineer',
    org: 'extra.dev',
    focus: 'AI tooling & client projects',
    period: 'Oct 2026 to Nov 2026',
    blurb:
      'Internal AI tools, pre-sales, and smaller client projects, after the main client engagement ended.',
    notes: [
      "Built a Claude Code skill that turns a client's scope document into the agency's Excel estimate. A Python script does the maths, with JSON Schema validation, 20 reusable presets and 39 tests. Checked and adjusted against 3 real projects, then merged into the company's shared skills repo after code review.",
      'Owned a client request end to end on the Django CMS behind a retail client\'s mobile app. Found that the reported "bug" was a feature that had never been built, then scoped and delivered it (18 tests). Coordinated server access with the client\'s system engineer. Did our team\'s first production deploy over VPN, with a database backup and written step-by-step deploy instructions.',
      'Built a lead generation pipeline in Python on public business registers, drive-time maps and job APIs. It narrowed 185,584 UK companies to 12 qualified leads. Also built a research skill that writes source-linked company reports.',
      "Led SEO for the agency's website: 6 PRs, mobile PageSpeed from no score to 78, and 100 in Accessibility, Best Practices and SEO. Also built a monthly SEO agent that proposes changes for a person to approve.",
    ],
    stack: [
      'Python',
      'Django',
      'Claude Code',
      'JSON Schema',
      'Docker',
      'Linux',
      'Google Search Console API',
      'GA4',
      'PostHog',
      'Astro',
    ],
  },
  {
    role: 'Back-End Developer',
    org: 'extra.dev',
    focus: 'Enterprise document management',
    period: 'Apr 2025 to Sep 2026',
    blurb:
      'An enterprise document management platform used by banks, healthcare providers and financial institutions.',
    notes: [
      "Helped rebuild the platform's script sandbox, and owned the gRPC service and its protocol to the workers. Scripts are compiled with Roslyn, streamed to isolated worker processes over pipes and invoked by reflection. Heartbeats detect when a worker fails. The new sandbox handles 1,500 scripts per second on two instances, twice the old throughput. A script can no longer stop an instance or reach the machine it runs on.",
      'Rewrote the PDF digital signing library on a newer cryptography vendor API. Signature validation became 2.9x faster (1,053ms to 363ms), with results identical to the old library.',
      "Extended the platform's external integration API with JWT authentication and implicit process context passing. Fully backwards compatible with the enterprise integrations already running in production.",
      'Tracked down a distributed race in the background job system. Cleanup batches ran longer than their Redis heartbeat TTL, so duplicate workers started and raced on the same records. Fixed it with batch caps, cancellation propagation, and a mapping from each job to its worker.',
      "Fixed a multitenant audit logging bug. A shared retry buffer let one tenant drain another tenant's failed entries, so production error logs were mislabelled. Split the retry state per tenant.",
      'Scoped and documented tickets on my own, working directly with product owners and architects.',
    ],
    stack: [
      'C#',
      '.NET',
      'ASP.NET Core',
      'gRPC',
      'Pipe-based IPC',
      'Redis',
      'Elasticsearch',
      'SQL Server',
      'Docker',
      'TeamCity',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'EMA d.o.o.',
    focus: 'Full stack',
    period: 'May 2024 to Apr 2025',
    blurb:
      "The app customers use for BlueTraker, EMA's satellite vessel monitoring system (VMS). It's used by fisheries authorities and fleet operators.",
    notes: [
      'Built vessel tracking, event timelines and interactive maps on telemetry from BlueTraker, NetSenz and GearSenz devices. The devices send data over Iridium satellite at sea, and over GSM/GPRS in coastal range.',
      'Built fishing effort tracking by combining gear sensor readings with vessel speed and position patterns. Added map views showing where a fleet had concentrated its effort in an area.',
      'Automated the compliance documents a Mexican customer had to file with their national fisheries regulator, covering vessel activity, status and position.',
      'Talked to clients directly, from gathering requirements through to implementation.',
      'Used DTO, DAO, repository, unit of work and dependency injection patterns across the stack.',
    ],
    stack: [
      'C#',
      '.NET',
      'ASP.NET MVC',
      'JavaScript',
      'React',
      'MSSQL',
      'REST',
      'Entity Framework',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'Tom PIT',
    focus: 'Full stack',
    period: 'Oct 2022 to May 2024',
    blurb:
      'ERP systems for manufacturing clients, mainly production and logistics modules.',
    notes: [
      'Worked on several client projects across the full stack, from requirements through to implementation.',
      'The longest was an ERP rollout for a Slovenian food manufacturer. I was the only developer, working with the project manager: gathering requirements from the client, reviewing technical solutions and helping with system design.',
      "Built the software layer for the production line's IoT weighing scales. It processes their readings and shows them accurately on the operator screen at each station, so raw material use is recorded automatically.",
    ],
    stack: [
      'C#',
      '.NET',
      'ASP.NET MVC',
      'JavaScript',
      'MSSQL',
      'Docker',
      'Microservices',
      'Event driven architecture',
    ],
  },
];

export const education = [
  {
    what: "Associate's Degree, Computer Science",
    org: 'DOBA University of Applied Sciences',
    period: '2024 to 2027 (expected)',
    note: 'Programming patterns and architectures in integration systems. Studied while working full time.',
  },
  {
    what: "Bachelor's Degree, Computer Science / Information Technology (not finished)",
    org: 'University of Maribor, FERI',
    period: '2019 to 2022',
    note: 'Started in Computer Science and switched to Information Technology after the first year. Left at the end of my second year in IT to take a software development role.',
  },
];

// .NET stays the first group: it is the main stack. The JSON-LD on the home
// page lists every item here as knowsAbout, so this is the one place to edit.
export const skills = [
  {
    group: '.NET backend',
    items: ['C#', '.NET', 'ASP.NET Core / MVC', 'Entity Framework', 'gRPC'],
  },
  { group: 'Data', items: ['SQL', 'SQL Server', 'MySQL', 'Redis', 'Elasticsearch'] },
  { group: 'Beyond .NET', items: ['Python', 'Django', 'JavaScript', 'React'] },
  {
    group: 'Tooling',
    items: ['Docker', 'Linux', 'Git', 'TeamCity', 'AI agents / Claude Code'],
  },
  {
    group: 'Areas',
    items: [
      'Integration systems',
      'API design',
      'Message queues',
      'Background job processing',
      'Event driven architecture',
      'SEO (Search Console, GA4)',
    ],
  },
  {
    group: 'Working with clients',
    items: ['Client communication', 'Requirements gathering'],
  },
];
