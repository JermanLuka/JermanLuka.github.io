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
  "I'm a software engineer focused on backend and integration work: APIs, data and the systems that connect them. I also deploy to Linux and Windows servers.",
  "I've spent four years on backend and full stack systems in C# and .NET, across three fairly different domains:",
  [
    'Satellite vessel monitoring, for fisheries authorities and fleet operators.',
    'ERP systems for manufacturing and logistics.',
    'An enterprise document management and certified archiving platform used by banks, healthcare providers and financial institutions.',
  ],
  'Recently I have also built tooling and automation:',
  [
    'A pipeline that narrowed 185,584 companies to 12 qualified leads.',
    'A tool that turns client scope documents into project estimates.',
    'SEO and performance work on the agency site, with a monthly agent that suggests improvements.',
  ],
  'I like understanding a system before changing it. For example:',
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
    focus: 'Backend, integrations & deployment',
    period: 'Oct 2026 to present',
    blurb:
      'Backend work, integrations and deployments for client projects, plus internal tools for the agency.',
    notes: [
      'Owned a client request end to end on the Django CMS behind a retail client\'s mobile app. Found that the reported "bug" was a feature that had never been built, then scoped and delivered it (18 tests). Coordinated server access with the client\'s system engineer. Did our team\'s first production deploy over VPN, with a database backup and written step-by-step deploy instructions.',
      "Led SEO for the agency's website: 6 PRs, mobile PageSpeed from no score to 78, and 100 in Accessibility, Best Practices and SEO. As an extra, automated the monthly review with an agent that pulls Search Console and PostHog data and recommends improvements. A person reviews every change.",
      'Built a data pipeline in Python on public business registers, drive-time maps and job APIs. It narrowed 185,584 UK companies to 12 qualified leads.',
      "Built an estimation tool that turns a client's scope document into the agency's Excel estimate, cutting up to a day of manual work to about 20 minutes plus review. A Python script does the maths, with JSON Schema validation and 39 tests. Merged into the company's shared repo after code review.",
    ],
    stack: [
      'Python',
      'Django',
      'Linux',
      'nginx',
      'Docker',
      'JSON Schema',
      'Google Search Console API',
      'GA4',
      'PostHog',
      'Astro',
      'Claude Code',
    ],
  },
  {
    role: 'Software Engineer',
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
      'Roslyn',
      'Pipe-based IPC',
      'JWT',
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
      "The app customers use for BlueTraker, EMA's satellite vessel monitoring system (VMS), which collects data from IoT devices on vessels. It's used by fisheries authorities and fleet operators.",
    notes: [
      "Built event timelines for vessels, which the system didn't have before.",
      'Refactored and modernised the backend for vessel tracking and interactive maps, on telemetry from BlueTraker, NetSenz and GearSenz devices (Iridium satellite at sea, GSM/GPRS in coastal range). The code became simpler, clearer and easier to maintain.',
      'Built fishing effort tracking by combining IoT gear sensor readings with vessel speed and position patterns. Added map views showing where a fleet had concentrated its effort in an area.',
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
      'ERP systems for manufacturing clients, mainly production and logistics modules, including IoT device integration on the production line.',
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
    what: "Associate's Degree, Computer Science and Informatics",
    org: 'DOBA Higher Vocational College',
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

// Backend leads, automation comes near the end: that's the positioning. The
// JSON-LD on the home page lists every item here as knowsAbout, so this is the
// one place to edit, and an item should appear in only one group.
export const skills = [
  {
    group: '.NET backend',
    items: ['C#', '.NET', 'ASP.NET Core / MVC', 'Entity Framework', 'gRPC'],
  },
  { group: 'Data', items: ['SQL', 'SQL Server', 'MySQL', 'Redis', 'Elasticsearch'] },
  { group: 'Beyond .NET', items: ['Python', 'Django', 'JavaScript', 'React'] },
  {
    group: 'Deployment & CI',
    items: ['GitHub Actions', 'TeamCity', 'Docker', 'Linux', 'nginx', 'Git'],
  },
  {
    group: 'Areas',
    items: [
      'Integration systems',
      'API design',
      'IoT and sensor data',
      'Message queues',
      'Background job processing',
      'Event driven architecture',
      'SEO (Search Console, GA4)',
    ],
  },
  {
    group: 'Automation',
    items: ['AI agents', 'Claude Code', 'JSON Schema'],
  },
  {
    group: 'Working with clients',
    items: ['Client communication', 'Requirements gathering'],
  },
];
