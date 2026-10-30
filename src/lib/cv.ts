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

/** The "About" section at the top of /cv. */
export const intro = [
  "I've worked across three fairly different domains: satellite vessel monitoring for fisheries authorities and fleet operators, ERP systems for manufacturing and logistics, and most recently an enterprise document management and certified archiving platform used by banks, healthcare providers, and financial institutions.",
  'The work I find most interesting is the kind that requires understanding a system before changing it. Tracing a production incident through logs to its actual cause, extending an API that enterprise clients depend on without breaking them, or replacing an aging component while keeping its behaviour identical.',
  'Currently finishing a diploma thesis comparing monolithic, hexagonal, and message driven architectures in .NET integration systems, measured on extensibility, complexity, performance, and fault tolerance.',
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
    focus: 'Backend',
    period: 'Apr 2025 to present',
    blurb:
      'An enterprise document management and certified archiving platform used by banks, healthcare providers, and financial institutions across the region.',
    notes: [
      'Owned the gRPC service and the protocol between service and workers in a team rebuild of the script execution sandbox, replacing an aging component. Scripts compiled with Roslyn streamed to isolated worker processes over pipes, invoked by reflection, with heartbeats to detect failures. The new sandbox handles 1,500 scripts per second on two instances, twice the old throughput, and a script can no longer stop an instance or reach the machine it runs on.',
      'Rewrote the PDF digital signing library against a newer cryptography vendor API, making signature validation 2.9x faster (1,053ms to 363ms) while returning results identical to the previous implementation.',
      "Extended the platform's external integration API with JWT authentication and implicit process context passing, with full backwards compatibility for enterprise integrations running in production.",
      'Diagnosed a distributed race in the background job system: cleanup batches outran their Redis heartbeat TTL, spawning duplicate workers that raced on the same records. Fixed with batch caps, cancellation propagation, and a mapping from each job to its worker.',
      "Fixed a multitenant audit logging defect where a shared retry buffer let one tenant drain another's failed entries, mislabelling production error logs. Partitioned retry state per tenant.",
      'Scoped and documented tickets independently, working directly with product owners and architects.',
    ],
    stack: [
      'C#',
      '.NET',
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
      "The application customers use for BlueTraker, EMA's satellite vessel monitoring system (VMS), used by fisheries authorities and fleet operators.",
    notes: [
      'Built vessel tracking, event timelines, and interactive maps on top of telemetry from BlueTraker, NetSenz, and GearSenz devices, transmitted over Iridium satellite at sea and GSM/GPRS in coastal range.',
      'Implemented fishing effort tracking by combining gear sensor readings with vessel speed and position patterns, and map views showing where a fleet had concentrated effort in a given area.',
      'Built automated generation of the compliance documents a Mexican customer was required to file with their national fisheries regulator, covering vessel activity, status, and position.',
      'Handled client communication and requirements gathering directly, through to implementation.',
      'Applied DTO, DAO, repository, unit of work, and dependency injection patterns across the stack.',
    ],
    stack: [
      'C#',
      '.NET',
      'JavaScript',
      'MSSQL',
      'REST',
      'MVC',
      'Entity Framework',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'Tom PIT',
    focus: 'Full stack',
    period: 'Oct 2022 to May 2024',
    blurb:
      'ERP systems for manufacturing clients, specialising in production and logistics modules.',
    notes: [
      'Delivered on multiple client projects across the full stack, from requirements gathering through to implementation.',
      'The longest of these was an ERP rollout for a Slovenian food manufacturer, where I was the sole developer working alongside the project manager: gathering requirements from the client, reviewing technical solutions, and contributing to system design.',
      "Built the software layer for the production line's IoT weighing scales, processing their readings and rendering them accurately on the operator screen at each station so raw material consumption was captured automatically.",
    ],
    stack: [
      'C#',
      '.NET',
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
    period: '2024 to 2026',
    note: 'Programming patterns and architectures in integration systems. Studied while working full time.',
  },
  {
    what: "Bachelor's Degree, Computer Science / Information Technology (not finished)",
    org: 'University of Maribor, FERI',
    period: '2019 to 2022',
    note: 'Started in Computer Science, switched to Information Technology after the first year. Left at the end of my second year in the IT program to take a software development role.',
  },
];

export const skills = [
  { group: 'Languages', items: ['C#', 'JavaScript', 'SQL'] },
  {
    group: 'Frameworks',
    items: ['.NET', 'ASP.NET MVC', 'Entity Framework', 'gRPC'],
  },
  { group: 'Data', items: ['SQL Server', 'MySQL', 'Redis', 'Elasticsearch'] },
  { group: 'Tooling', items: ['Docker', 'TeamCity', 'Git', 'Claude Code'] },
  {
    group: 'Areas',
    items: [
      'API design',
      'Message queues',
      'Background job processing',
      'Event driven architecture',
    ],
  },
];
