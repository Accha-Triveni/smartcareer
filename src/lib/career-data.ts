import { ADDITIONAL_ROLE_ROADMAPS } from "./role-roadmaps";
import { EXTENDED_ROLE_ROADMAPS } from "./extended-roadmaps";

export type CareerCategory =
  | "Data"
  | "Software"
  | "Cloud"
  | "Design"
  | "Management"
  | "Security"
  | "Mobile";

export type CareerStream =
  | "B.Tech / Engineering"
  | "MCA / Applications"
  | "MBA / Management"
  | "Cross-Disciplinary";

export type Career = {
  id: string;
  title: string;
  emoji: string;
  category: CareerCategory;
  summary: string;
  salary: string;
  skills: string[];
  interests: string[];
  degreeFit?: string[];
  stream?: CareerStream;
  areaKeywords?: string[];
};

export type CareerAreaOption = {
  id: string;
  name: string;
  emoji: string;
  stream: CareerStream;
  badge: string;
  degrees: string[];
  description: string;
  popularRoles: string[];
};

export const CAREER_AREAS: CareerAreaOption[] = [
  // B.Tech / Engineering Areas
  {
    id: "btech-software",
    name: "Software & Systems Engineering",
    emoji: "💻",
    stream: "B.Tech / Engineering",
    badge: "B.Tech Core",
    degrees: ["B.Tech / B.E.", "MCA"],
    description: "Core algorithms, distributed systems, backend microservices, and high-performance software architecture.",
    popularRoles: ["Software Engineer (SDE-1)", "Backend Engineer", "Systems Developer"],
  },
  {
    id: "btech-cloud",
    name: "Cloud, DevOps & Infrastructure",
    emoji: "☁️",
    stream: "B.Tech / Engineering",
    badge: "B.Tech & Cloud",
    degrees: ["B.Tech / B.E.", "MCA"],
    description: "Architecting cloud pipelines (AWS/Azure/GCP), Kubernetes container orchestration, and continuous deployment.",
    popularRoles: ["Cloud Engineer", "DevOps Engineer", "Site Reliability Engineer (SRE)"],
  },
  {
    id: "btech-ai",
    name: "AI & Machine Learning Engineering",
    emoji: "🤖",
    stream: "B.Tech / Engineering",
    badge: "B.Tech Advanced",
    degrees: ["B.Tech / B.E.", "MCA"],
    description: "Deep learning models, computer vision, natural language processing, and production ML pipelines.",
    popularRoles: ["AI/ML Engineer", "Machine Learning Scientist", "GenAI Specialist"],
  },
  {
    id: "btech-security",
    name: "Cybersecurity & Network Defense",
    emoji: "🛡️",
    stream: "B.Tech / Engineering",
    badge: "B.Tech Specialized",
    degrees: ["B.Tech / B.E.", "MCA"],
    description: "Information security, ethical hacking, vulnerability audits, SIEM defense, and network protocols.",
    popularRoles: ["Cybersecurity Analyst", "Security Engineer", "SOC Analyst"],
  },

  // MCA / Computer Applications Areas
  {
    id: "mca-fullstack",
    name: "Full Stack & Web Application Dev",
    emoji: "⚡",
    stream: "MCA / Applications",
    badge: "MCA High Demand",
    degrees: ["MCA", "B.Tech / B.E.", "BCA"],
    description: "End-to-end full stack web platforms, responsive client apps (React), and scalable backend APIs (Node/Express).",
    popularRoles: ["Full Stack Developer", "MERN Stack Engineer", "Web Applications Lead"],
  },
  {
    id: "mca-java",
    name: "Enterprise Java & Spring Solutions",
    emoji: "☕",
    stream: "MCA / Applications",
    badge: "MCA Enterprise",
    degrees: ["MCA", "B.Tech / B.E."],
    description: "Enterprise software services, Spring Boot REST APIs, Hibernate ORM, and enterprise systems.",
    popularRoles: ["Java Developer", "Spring Boot Engineer", "Backend Specialist"],
  },
  {
    id: "mca-mobile",
    name: "Mobile App Development",
    emoji: "📱",
    stream: "MCA / Applications",
    badge: "MCA & Mobile",
    degrees: ["MCA", "B.Tech / B.E.", "BCA"],
    description: "Cross-platform and native smartphone apps for iOS and Android using Flutter, React Native, and mobile cloud.",
    popularRoles: ["Flutter Developer", "React Native Developer", "Mobile App Engineer"],
  },
  {
    id: "mca-database",
    name: "Database Administration & SQL",
    emoji: "🗄️",
    stream: "MCA / Applications",
    badge: "MCA & Data",
    degrees: ["MCA", "BCA", "B.Tech / B.E."],
    description: "Relational database schema modeling, query performance tuning, PostgreSQL/Oracle, and database security.",
    popularRoles: ["Database Administrator (DBA)", "SQL Developer", "Data Warehouse Engineer"],
  },
  {
    id: "mca-qa",
    name: "QA Automation & Testing (SDET)",
    emoji: "🧪",
    stream: "MCA / Applications",
    badge: "MCA Quality",
    degrees: ["MCA", "BCA", "B.Tech / B.E."],
    description: "Automated test suites (Selenium/Cypress), API test assertions, continuous testing, and quality assurance.",
    popularRoles: ["QA Automation Engineer", "SDET", "Software Test Analyst"],
  },

  // MBA / Management & Product Areas
  {
    id: "mba-product",
    name: "Product Management (APM / PM)",
    emoji: "🚀",
    stream: "MBA / Management",
    badge: "MBA Top Choice",
    degrees: ["MBA", "B.Tech / B.E."],
    description: "Product vision, roadmaps, PRD specifications, customer discovery, wireframes, and cross-functional leadership.",
    popularRoles: ["Associate Product Manager (APM)", "Product Owner", "Technical PM"],
  },
  {
    id: "mba-analytics",
    name: "Business Analysis & Tech Consulting",
    emoji: "📈",
    stream: "MBA / Management",
    badge: "MBA Consulting",
    degrees: ["MBA", "B.Tech / B.E.", "MCA"],
    description: "Bridging executive stakeholders and tech teams through requirement modeling, SQL data insights, and strategy.",
    popularRoles: ["Business Analyst", "IT Strategy Consultant", "Management Trainee"],
  },
  {
    id: "mba-project",
    name: "IT Project Management & Scrum",
    emoji: "📋",
    stream: "MBA / Management",
    badge: "MBA Delivery",
    degrees: ["MBA", "MCA", "B.Tech / B.E."],
    description: "Leading Agile/Scrum sprints, Jira backlog orchestration, budget/timeline tracking, and stakeholder reporting.",
    popularRoles: ["Scrum Master", "IT Project Manager", "Agile Delivery Lead"],
  },
  {
    id: "mba-growth",
    name: "Product Marketing & Growth Strategy",
    emoji: "🎯",
    stream: "MBA / Management",
    badge: "MBA Marketing",
    degrees: ["MBA"],
    description: "Go-to-market campaigns, customer acquisition funnels, CAC/LTV optimization, and brand positioning.",
    popularRoles: ["Product Marketing Specialist", "Growth Manager", "Performance Strategist"],
  },

  // Cross-Disciplinary / All Streams
  {
    id: "all-data",
    name: "Data Analytics & Business Intelligence",
    emoji: "📊",
    stream: "Cross-Disciplinary",
    badge: "All Streams Fit",
    degrees: ["B.Tech / B.E.", "MCA", "MBA", "BCA", "B.Sc"],
    description: "Mining structured databases, building Power BI/Tableau executive dashboards, and deriving business ROI.",
    popularRoles: ["Data Analyst", "BI Developer", "Operations Analyst"],
  },
  {
    id: "all-design",
    name: "UI/UX & Digital Product Design",
    emoji: "🎨",
    stream: "Cross-Disciplinary",
    badge: "All Streams Fit",
    degrees: ["B.Tech / B.E.", "MCA", "MBA", "BCA", "B.Sc"],
    description: "User research, wireframing, high-fidelity prototypes in Figma, and crafting intuitive user interfaces.",
    popularRoles: ["UI/UX Designer", "Product Designer", "User Researcher"],
  },
];

export const CAREERS: Career[] = [
  // Cross-Disciplinary & Analytics
  {
    id: "data-analyst",
    title: "Data Analyst",
    emoji: "📊",
    category: "Data",
    stream: "Cross-Disciplinary",
    degreeFit: ["B.Tech", "MCA", "MBA", "BCA", "B.Sc"],
    summary: "Turn raw data into clear business insights using dashboards, SQL and executive reports.",
    salary: "₹4–8 LPA",
    skills: ["Python", "SQL", "Excel", "Power BI", "Statistics"],
    interests: ["Data", "Problem solving", "Business"],
    areaKeywords: ["Data & Analytics", "Data Analytics", "Business Intelligence", "Analytics"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    emoji: "🤖",
    category: "Data",
    stream: "B.Tech / Engineering",
    degreeFit: ["B.Tech", "MCA", "B.Sc"],
    summary: "Build predictive models and machine learning systems from complex multi-source data.",
    salary: "₹6–14 LPA",
    skills: ["Python", "Statistics", "Machine Learning", "SQL", "Pandas"],
    interests: ["Data", "AI", "Research"],
    areaKeywords: ["AI & Machine Learning", "Data Science", "Machine Learning"],
  },
  {
    id: "software-developer",
    title: "Software Developer (SDE-1)",
    emoji: "💻",
    category: "Software",
    stream: "B.Tech / Engineering",
    degreeFit: ["B.Tech", "MCA", "BCA"],
    summary: "Design, build and maintain core applications, algorithms, and microservices.",
    salary: "₹4–12 LPA",
    skills: ["Java", "Python", "DSA", "Git", "SQL"],
    interests: ["Coding", "Problem solving"],
    areaKeywords: ["Software & Systems", "Software Development", "Engineering"],
  },
  {
    id: "backend-engineer",
    title: "Backend & Systems Engineer",
    emoji: "⚙️",
    category: "Software",
    stream: "B.Tech / Engineering",
    degreeFit: ["B.Tech", "MCA"],
    summary: "Build high-throughput REST/gRPC APIs, distributed databases, and server-side architectures.",
    salary: "₹5–14 LPA",
    skills: ["Java", "Node.js", "SQL", "Docker", "REST APIs", "Git"],
    interests: ["Coding", "Infrastructure", "Problem solving"],
    areaKeywords: ["Software & Systems", "Backend", "Systems Engineering"],
  },
  {
    id: "ai-ml-engineer",
    title: "AI & Machine Learning Engineer",
    emoji: "🧠",
    category: "Data",
    stream: "B.Tech / Engineering",
    degreeFit: ["B.Tech", "MCA"],
    summary: "Develop neural network architectures, LLM pipelines, and production machine learning models.",
    salary: "₹7–16 LPA",
    skills: ["Python", "Machine Learning", "PyTorch", "TensorFlow", "Statistics", "Git"],
    interests: ["AI", "Research", "Coding"],
    areaKeywords: ["AI & Machine Learning", "Artificial Intelligence", "ML"],
  },
  {
    id: "cloud-engineer",
    title: "Cloud & DevOps Engineer",
    emoji: "☁️",
    category: "Cloud",
    stream: "B.Tech / Engineering",
    degreeFit: ["B.Tech", "MCA"],
    summary: "Deploy and orchestrate reliable infrastructure, Docker containers, and CI/CD on AWS/Azure.",
    salary: "₹5–13 LPA",
    skills: ["Linux", "Networking", "AWS", "DevOps", "Docker", "Python"],
    interests: ["Infrastructure", "Cloud", "Problem solving"],
    areaKeywords: ["Cloud, DevOps & Infrastructure", "Cloud", "DevOps"],
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    emoji: "🛡️",
    category: "Security",
    stream: "B.Tech / Engineering",
    degreeFit: ["B.Tech", "MCA"],
    summary: "Defend networks, conduct vulnerability assessments, ethical hacking, and monitor threat incidents.",
    salary: "₹5–12 LPA",
    skills: ["Linux", "Networking", "Python", "Cybersecurity", "Security Tools"],
    interests: ["Security", "Infrastructure", "Problem solving"],
    areaKeywords: ["Cybersecurity & Network Defense", "Security", "Ethical Hacking"],
  },

  // MCA / Computer Applications Roles
  {
    id: "fullstack-developer",
    title: "Full Stack Developer",
    emoji: "⚡",
    category: "Software",
    stream: "MCA / Applications",
    degreeFit: ["MCA", "B.Tech", "BCA"],
    summary: "Deliver end-to-end web platforms integrating React client UIs with Node.js and database engines.",
    salary: "₹4.5–12 LPA",
    skills: ["React", "Node.js", "JavaScript", "SQL", "MongoDB", "Git"],
    interests: ["Coding", "Design", "Problem solving"],
    areaKeywords: ["Full Stack & Web Application Dev", "Full Stack", "Web Development"],
  },
  {
    id: "java-enterprise-dev",
    title: "Enterprise Java & Spring Developer",
    emoji: "☕",
    category: "Software",
    stream: "MCA / Applications",
    degreeFit: ["MCA", "B.Tech"],
    summary: "Build enterprise services, secure banking APIs, and scalable backends using Spring Boot.",
    salary: "₹4.5–11 LPA",
    skills: ["Java", "Spring Boot", "SQL", "Hibernate", "REST APIs", "Git"],
    interests: ["Coding", "Problem solving"],
    areaKeywords: ["Enterprise Java & Spring Solutions", "Java Enterprise", "Backend"],
  },
  {
    id: "mobile-developer",
    title: "Mobile App Developer",
    emoji: "📱",
    category: "Mobile",
    stream: "MCA / Applications",
    degreeFit: ["MCA", "B.Tech", "BCA"],
    summary: "Create fast, engaging native and cross-platform apps for iOS & Android with Flutter or React Native.",
    salary: "₹4–11 LPA",
    skills: ["Flutter", "Dart", "React Native", "JavaScript", "Mobile UI", "Git"],
    interests: ["Mobile Apps", "Coding", "Design"],
    areaKeywords: ["Mobile App Development", "Flutter", "Mobile"],
  },
  {
    id: "db-admin",
    title: "Database Administrator & SQL Engineer",
    emoji: "🗄️",
    category: "Data",
    stream: "MCA / Applications",
    degreeFit: ["MCA", "BCA", "B.Tech"],
    summary: "Architect database schemas, optimize complex SQL queries, and safeguard transactional integrity.",
    salary: "₹4–9.5 LPA",
    skills: ["SQL", "Database Design", "PostgreSQL", "Performance Tuning", "Linux"],
    interests: ["Data", "Infrastructure", "Problem solving"],
    areaKeywords: ["Database Administration & SQL", "Database", "DBA"],
  },
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer & SDET",
    emoji: "🧪",
    category: "Software",
    stream: "MCA / Applications",
    degreeFit: ["MCA", "BCA", "B.Tech"],
    summary: "Build robust test automation pipelines with Selenium & Cypress to guarantee zero-defect releases.",
    salary: "₹3.8–9 LPA",
    skills: ["Selenium", "Java", "Python", "Manual Testing", "API Testing", "Git"],
    interests: ["Problem solving", "Coding"],
    areaKeywords: ["QA Automation & Testing (SDET)", "Testing", "QA"],
  },
  {
    id: "web-developer",
    title: "Frontend Developer",
    emoji: "🌐",
    category: "Software",
    stream: "Cross-Disciplinary",
    degreeFit: ["B.Tech", "MCA", "BCA", "B.Sc"],
    summary: "Craft fast, accessible and pixel-perfect interactive web interfaces using React and modern CSS.",
    salary: "₹3.5–10 LPA",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Tailwind CSS"],
    interests: ["Coding", "Design"],
    areaKeywords: ["Full Stack & Web Application Dev", "Frontend", "Web"],
  },

  // MBA / Management & Product Roles
  {
    id: "product-manager",
    title: "Associate Product Manager (APM)",
    emoji: "🚀",
    category: "Management",
    stream: "MBA / Management",
    degreeFit: ["MBA", "B.Tech"],
    summary: "Define product features, drive sprint roadmaps, and balance user experience with business metrics.",
    salary: "₹7–16 LPA",
    skills: ["Product Management", "Agile & Scrum", "Wireframing", "Market Research", "SQL", "User Research"],
    interests: ["Product", "Business", "Problem solving"],
    areaKeywords: ["Product Management (APM / PM)", "Product Management", "APM"],
  },
  {
    id: "business-analyst",
    title: "Business Analyst & Tech Consultant",
    emoji: "📈",
    category: "Management",
    stream: "MBA / Management",
    degreeFit: ["MBA", "B.Tech", "MCA"],
    summary: "Translate complex business challenges into clear technical specs, KPI models, and process flows.",
    salary: "₹5.5–12 LPA",
    skills: ["Business Analysis", "SQL", "Excel", "Power BI", "Stakeholder Management", "Documentation"],
    interests: ["Business", "Data", "Problem solving"],
    areaKeywords: ["Business Analysis & Tech Consulting", "Business Analyst", "Consulting"],
  },
  {
    id: "it-project-manager",
    title: "IT Project Manager & Scrum Master",
    emoji: "📋",
    category: "Management",
    stream: "MBA / Management",
    degreeFit: ["MBA", "MCA", "B.Tech"],
    summary: "Orchestrate sprint ceremonies, eliminate roadblocks, manage budgets, and ensure on-time delivery.",
    salary: "₹6–14 LPA",
    skills: ["Agile & Scrum", "Jira", "Sprint Planning", "Risk Management", "Stakeholder Management"],
    interests: ["Management", "Business", "Problem solving"],
    areaKeywords: ["IT Project Management & Scrum", "Project Management", "Scrum"],
  },
  {
    id: "growth-marketing-manager",
    title: "Product Marketing & Growth Strategist",
    emoji: "🎯",
    category: "Management",
    stream: "MBA / Management",
    degreeFit: ["MBA"],
    summary: "Drive go-to-market execution, user acquisition funnels, retention loops, and product adoption.",
    salary: "₹5–12 LPA",
    skills: ["Growth Marketing", "SEO", "Google Analytics", "Content Strategy", "A/B Testing"],
    interests: ["Business", "Design", "Research"],
    areaKeywords: ["Product Marketing & Growth Strategy", "Marketing", "Growth"],
  },

  // Creative & Design
  {
    id: "ui-designer",
    title: "UI/UX Designer",
    emoji: "🎨",
    category: "Design",
    stream: "Cross-Disciplinary",
    degreeFit: ["B.Tech", "MCA", "MBA", "BCA", "B.Sc", "Other"],
    summary: "Conduct user interviews, design design systems in Figma, and build intuitive digital interfaces.",
    salary: "₹3.5–9 LPA",
    skills: ["Figma", "User Research", "Prototyping", "HTML", "CSS", "Wireframing"],
    interests: ["Design", "Business"],
    areaKeywords: ["UI/UX & Digital Product Design", "Design", "UI/UX"],
  },
];

export const ALL_SKILLS = Array.from(new Set(CAREERS.flatMap((c) => c.skills))).sort();
export const ALL_INTERESTS = [
  "Coding",
  "Data",
  "AI",
  "Cloud",
  "Security",
  "Design",
  "Business",
  "Management",
  "Product",
  "Mobile Apps",
  "Research",
  "Infrastructure",
  "Problem solving",
];

export type Profile = {
  name: string;
  education: string;
  experience: string;
  interest: string;
  skills: string[];
  interests: string[];
};

export type Match = { career: Career; score: number; have: string[]; missing: string[] };

/** Score = 70% skill overlap + 30% interest overlap, with degree & area affinity boosts. */
export function matchCareers(
  p: Pick<Profile, "skills" | "interests"> & Partial<Pick<Profile, "interest" | "education">>
): Match[] {
  return CAREERS.map((career) => {
    const have = career.skills.filter((s) => p.skills.includes(s));
    const missing = career.skills.filter((s) => !p.skills.includes(s));
    const intHit = career.interests.filter((i) => p.interests.includes(i)).length;

    let baseScore = Math.round(
      (have.length / Math.max(career.skills.length, 1)) * 70 +
      (intHit / Math.max(career.interests.length, 1)) * 30
    );

    // Boost score if career aligns with selected career area
    if (p.interest) {
      const area = p.interest.toLowerCase();
      if (
        career.title.toLowerCase().includes(area) ||
        career.category.toLowerCase().includes(area) ||
        (career.stream && career.stream.toLowerCase().includes(area)) ||
        (career.areaKeywords &&
          career.areaKeywords.some(
            (k) => area.includes(k.toLowerCase()) || k.toLowerCase().includes(area)
          ))
      ) {
        baseScore = Math.min(baseScore + 12, 98);
      }
    }

    // Boost score if career fits candidate's education degree
    if (p.education && career.degreeFit) {
      const eduShort = p.education.toLowerCase();
      if (career.degreeFit.some((deg) => eduShort.includes(deg.toLowerCase()))) {
        baseScore = Math.min(baseScore + 6, 98);
      }
    }

    const score = Math.min(Math.max(baseScore, 15), 98);
    return { career, score, have, missing };
  }).sort((a, b) => b.score - a.score);
}

export const scoreCareers = matchCareers;

export type JobPlatform = "LinkedIn" | "Unstop" | "Indeed" | "Naukri" | "Wellfound" | "Internshala";

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Internship";
  career: "Data" | "Software" | "Cloud" | "Design" | "Management" | "Security" | "Mobile";
  skills: string[];
  platform: JobPlatform;
  postedAgo: string;
  salary: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  applyUrl: string;
  description: string;
  eligibility: string;
  applicantsCount: number;
  featured?: boolean;
};

export const JOBS: JobListing[] = [
  // MBA & Management Roles
  {
    id: "job-mba-1",
    title: "Associate Product Manager (APM)",
    company: "Zepto",
    location: "Bengaluru",
    type: "Full-time",
    career: "Management",
    skills: ["Product Management", "Agile & Scrum", "Wireframing", "SQL", "Market Research"],
    platform: "LinkedIn",
    postedAgo: "1 hour ago",
    salary: "₹9–15 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Associate+Product+Manager+Zepto",
    description: "Drive quick-commerce delivery experience and catalog search optimizations. Write PRDs, analyze funnel metrics, and work with engineering squads.",
    eligibility: "MBA / B.Tech Freshers or 0-2 yrs product experience",
    applicantsCount: 92,
    featured: true,
  },
  {
    id: "job-mba-2",
    title: "Business Analyst - Tech Consulting",
    company: "Deloitte",
    location: "Gurugram",
    type: "Full-time",
    career: "Management",
    skills: ["Business Analysis", "SQL", "Excel", "Power BI", "Stakeholder Management"],
    platform: "Unstop",
    postedAgo: "Active hiring",
    salary: "₹7.5–12 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://unstop.com/jobs?searchTerm=Business+Analyst+Deloitte",
    description: "Consult Fortune 500 clients on digital transformation roadmaps. Document requirements, develop financial feasibility models, and present executive summaries.",
    eligibility: "MBA / MCA / B.Tech 2024–2026 Batch Graduates",
    applicantsCount: 230,
    featured: true,
  },
  // MCA & Application Roles
  {
    id: "job-mca-1",
    title: "Full Stack Developer Trainee (MERN)",
    company: "PhonePe",
    location: "Bengaluru",
    type: "Full-time",
    career: "Software",
    skills: ["React", "Node.js", "JavaScript", "SQL", "MongoDB", "Git"],
    platform: "LinkedIn",
    postedAgo: "2 hours ago",
    salary: "₹7–12 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Developer+PhonePe",
    description: "Develop merchant onboarding dashboards and payment gateway SDK interfaces using React, Node.js microservices, and high-concurrency databases.",
    eligibility: "MCA / B.Tech / BCA graduates with strong web projects",
    applicantsCount: 145,
    featured: true,
  },
  {
    id: "job-mca-2",
    title: "Flutter Mobile Developer Intern",
    company: "Paytm",
    location: "Noida",
    type: "Internship",
    career: "Mobile",
    skills: ["Flutter", "Dart", "React Native", "Mobile UI", "REST APIs"],
    platform: "Internshala",
    postedAgo: "5 hours ago",
    salary: "₹35,000/mo",
    workplaceType: "Hybrid",
    applyUrl: "https://internshala.com/internships/flutter-development-internship/",
    description: "Build interactive mobile features for Paytm's consumer super-app. Work with Dart, state management (Bloc/Provider), and custom Flutter UI animations.",
    eligibility: "MCA / B.Tech students & recent graduates",
    applicantsCount: 180,
  },
  // B.Tech Engineering & Security
  {
    id: "job-btech-1",
    title: "Cybersecurity Analyst Trainee",
    company: "Cisco",
    location: "Bengaluru",
    type: "Full-time",
    career: "Security",
    skills: ["Networking", "Linux", "Python", "Cybersecurity", "Security Tools"],
    platform: "LinkedIn",
    postedAgo: "3 hours ago",
    salary: "₹8–13 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Cybersecurity+Analyst+Cisco",
    description: "Analyze security telemetry, investigate automated intrusion alerts, perform vulnerability testing, and secure cloud perimeter firewalls.",
    eligibility: "B.Tech (CSE/IT/ECE) or MCA with networking foundations",
    applicantsCount: 110,
    featured: true,
  },
  {
    id: "job-li-1",
    title: "Junior Data Analyst",
    company: "Swiggy",
    location: "Bengaluru",
    type: "Full-time",
    career: "Data",
    skills: ["SQL", "Python", "Power BI", "Excel", "A/B Testing"],
    platform: "LinkedIn",
    postedAgo: "2 hours ago",
    salary: "₹6.5–10 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Junior+Data+Analyst+Swiggy",
    description: "Collaborate with consumer analytics squads. Query Snowflake/PostgreSQL warehouses, build executive Power BI dashboards, and analyze checkout funnel drop-offs.",
    eligibility: "B.Tech / BCA / B.Sc or graduates with SQL & Python portfolio",
    applicantsCount: 54,
    featured: true,
  },
  {
    id: "job-un-1",
    title: "Data Analyst National Hiring Challenge 2026",
    company: "Tata Steel",
    location: "Kolkata",
    type: "Full-time",
    career: "Data",
    skills: ["Excel", "SQL", "Power BI", "Statistics"],
    platform: "Unstop",
    postedAgo: "Active hiring",
    salary: "₹6.5–9 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://unstop.com/jobs?searchTerm=Data+Analyst+Tata+Steel",
    description: "Official campus & fresher hiring challenge hosted on Unstop. Qualify through online SQL assessments and business case studies for direct recruitment.",
    eligibility: "Open to 2024, 2025 & 2026 Batch Graduates across India",
    applicantsCount: 380,
    featured: true,
  },
  {
    id: "job-li-2",
    title: "Associate Frontend Engineer",
    company: "Razorpay",
    location: "Bengaluru",
    type: "Full-time",
    career: "Software",
    skills: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "Git"],
    platform: "LinkedIn",
    postedAgo: "4 hours ago",
    salary: "₹8–14 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Frontend+Engineer+Razorpay",
    description: "Build high-speed merchant checkout interfaces and financial analytics dashboards using React 19, TypeScript, and modern component systems.",
    eligibility: "0–1 years experience or graduates with strong React & TS projects",
    applicantsCount: 88,
    featured: true,
  },
  {
    id: "job-un-2",
    title: "Frontend Developer Internship (PPO Opportunity)",
    company: "Lenskart",
    location: "Remote",
    type: "Internship",
    career: "Software",
    skills: ["React", "JavaScript", "CSS", "Tailwind CSS"],
    platform: "Unstop",
    postedAgo: "1 day ago",
    salary: "₹30,000/mo",
    workplaceType: "Remote",
    applyUrl: "https://unstop.com/internships?searchTerm=Frontend+Developer+Lenskart",
    description: "3-month frontend engineering internship with fast-track PPO offer. Work on consumer web catalogs, responsive product pages, and virtual AR frame trials.",
    eligibility: "College students and 2025/2026 batch freshers",
    applicantsCount: 245,
    featured: true,
  },
  {
    id: "job-li-3",
    title: "Data Analyst - Growth Insights",
    company: "Zomato",
    location: "Gurugram",
    type: "Full-time",
    career: "Data",
    skills: ["SQL", "Pandas", "Tableau", "Statistics", "A/B Testing"],
    platform: "LinkedIn",
    postedAgo: "6 hours ago",
    salary: "₹7–11 LPA",
    workplaceType: "On-site",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Data+Analyst+Zomato",
    description: "Examine dining & delivery transaction trends, conduct statistical hypothesis tests for delivery speed experiments, and craft leadership presentations.",
    eligibility: "Freshers welcome with demonstrated SQL & data storytelling abilities",
    applicantsCount: 115,
  },
  {
    id: "job-un-3",
    title: "Applied AI & Python Developer Trainee",
    company: "Deloitte",
    location: "Bengaluru",
    type: "Full-time",
    career: "Data",
    skills: ["Python", "Pandas", "Machine Learning", "Git"],
    platform: "Unstop",
    postedAgo: "3 hours ago",
    salary: "₹7.5–10.5 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://unstop.com/jobs?searchTerm=Deloitte+Python+Developer",
    description: "Innovation hiring track on Unstop. Implement automated web scraping pipelines, build predictive data transformations in Pandas, and assist in client AI deployments.",
    eligibility: "B.Tech/BE/BCA/MCA fresh graduates with Python foundation",
    applicantsCount: 210,
  },
  {
    id: "job-li-4",
    title: "Cloud Support Associate",
    company: "Amazon Web Services (AWS)",
    location: "Hyderabad",
    type: "Full-time",
    career: "Cloud",
    skills: ["Linux", "AWS", "Networking", "Bash", "Troubleshooting"],
    platform: "LinkedIn",
    postedAgo: "5 hours ago",
    salary: "₹5.5–8.5 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Cloud+Support+Associate+AWS",
    description: "Provide enterprise technical advisory for AWS services (EC2, S3, VPC, CloudWatch). Diagnose Linux OS kernel, network routing, and security policies.",
    eligibility: "2024–2026 Batch Graduates, any technical degree stream",
    applicantsCount: 160,
  },
  {
    id: "job-un-4",
    title: "Web Engineering Intern - Creator Suite",
    company: "Paytm",
    location: "Noida",
    type: "Internship",
    career: "Software",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    platform: "Unstop",
    postedAgo: "Just now",
    salary: "₹25,000/mo",
    workplaceType: "Remote",
    applyUrl: "https://unstop.com/internships?searchTerm=Paytm+Web+Development",
    description: "Build interactive merchant onboarding widgets and dashboard analytics for millions of Paytm Soundbox retailers across India.",
    eligibility: "Currently enrolled students or recent degree holders",
    applicantsCount: 188,
  },
  {
    id: "job-li-5",
    title: "Product Designer (UI/UX) Trainee",
    company: "CRED",
    location: "Bengaluru",
    type: "Full-time",
    career: "Design",
    skills: ["Figma", "UI Design", "Prototyping", "Design Systems"],
    platform: "LinkedIn",
    postedAgo: "Just now",
    salary: "₹6–9.5 LPA",
    workplaceType: "On-site",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Product+Designer+CRED",
    description: "Craft dark-mode luxury fintech interfaces, design slick micro-animations, and build accessible design system primitives.",
    eligibility: "Portfolio with 2+ completed mobile or web product case studies",
    applicantsCount: 72,
  },
  {
    id: "job-int-1",
    title: "Full Stack Web Developer Intern",
    company: "Zepto",
    location: "Mumbai",
    type: "Internship",
    career: "Software",
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    platform: "Internshala",
    postedAgo: "1 hour ago",
    salary: "₹35,000/mo",
    workplaceType: "Hybrid",
    applyUrl: "https://internshala.com/internships/keywords-web-development-zepto",
    description: "Optimize rapid checkout funnels and warehouse picker web apps. Work with TanStack Query, Next.js server actions, and responsive layout polish.",
    eligibility: "Available for 6 months full-time internship",
    applicantsCount: 140,
    featured: true,
  },
  {
    id: "job-ind-1",
    title: "Junior Business Intelligence Analyst",
    company: "Mu Sigma",
    location: "Bengaluru",
    type: "Full-time",
    career: "Data",
    skills: ["SQL", "Excel", "Power BI", "Tableau"],
    platform: "Indeed",
    postedAgo: "1 day ago",
    salary: "₹5–7.5 LPA",
    workplaceType: "On-site",
    applyUrl: "https://in.indeed.com/jobs?q=Junior+Data+Analyst+Mu+Sigma",
    description: "Deliver analytical solutions for Fortune 500 retail and healthcare clients. Write complex multi-table SQL joins, CTEs, and build KPI reporting.",
    eligibility: "Freshers / Entry-level graduates",
    applicantsCount: 96,
  },
  {
    id: "job-nauk-1",
    title: "Digital Specialist Engineer Trainee",
    company: "Infosys",
    location: "Pune",
    type: "Full-time",
    career: "Software",
    skills: ["JavaScript", "React", "Java", "DSA", "SQL"],
    platform: "Naukri",
    postedAgo: "4 hours ago",
    salary: "₹4.5–7 LPA",
    workplaceType: "Hybrid",
    applyUrl: "https://www.naukri.com/software-engineer-trainee-jobs",
    description: "Specialized engineering track. Intensive enterprise fullstack training on microservices, React web architecture, and cloud deployment pipelines.",
    eligibility: "2024–2026 Batch Graduates with minimum 60% aggregate",
    applicantsCount: 320,
  },
  {
    id: "job-well-1",
    title: "Founding Frontend Engineer",
    company: "SuperOps AI",
    location: "Remote",
    type: "Full-time",
    career: "Software",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    platform: "Wellfound",
    postedAgo: "8 hours ago",
    salary: "₹10–18 LPA + Equity",
    workplaceType: "Remote",
    applyUrl: "https://wellfound.com/jobs",
    description: "Fast-growing venture-backed AI startup. Architect prompt workspaces, interactive agent visualization trees, and stateful dashboard components.",
    eligibility: "Builders with exceptional GitHub portfolio repositories",
    applicantsCount: 42,
    featured: true,
  },
  {
    id: "job-li-6",
    title: "DevOps & Cloud Intern",
    company: "ShipFast Technologies",
    location: "Remote",
    type: "Internship",
    career: "Cloud",
    skills: ["Linux", "DevOps", "Docker", "AWS", "GitHub Actions"],
    platform: "LinkedIn",
    postedAgo: "3 hours ago",
    salary: "₹25,000/mo",
    workplaceType: "Remote",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=DevOps+Intern+ShipFast",
    description: "Automate containerized CI/CD release pipelines with Docker and GitHub Actions. Monitor server health and cloud uptime metrics.",
    eligibility: "Passionate about Linux, automation, and cloud tooling",
    applicantsCount: 78,
  },
];

export type WeekResource = {
  name: string;
  url?: string;
  type: "guide" | "practice" | "video" | "docs";
};

export type WeekItem = {
  id: string;
  weekNumber: number;
  title: string;
  summary: string;
  topics: string[];
  handsOn: string;
  deliverable?: string;
  estimatedHours: number;
  tasks: string[];
  youtubeUrl?: string;
  youtubeTitle?: string;
  resources: WeekResource[];
};

export type RoadmapMilestone = {
  id: string;
  phase: string;
  title: string;
  detail: string;
  weeks: number;
  weekRange: string;
  weeksList: number[];
  weeklyContent: WeekItem[];
};

const BASE_ROADMAPS: Record<string, RoadmapMilestone[]> = {
  "data-analyst": [
    {
      id: "r1",
      phase: "Foundations",
      title: "Excel & spreadsheets",
      detail: "Formulas, pivot tables, charts and executive reporting",
      weeks: 2,
      weekRange: "Weeks 1–2",
      weeksList: [1, 2],
      weeklyContent: [
        {
          id: "da-w1",
          weekNumber: 1,
          title: "Spreadsheet Architecture & Essential Formulas",
          summary: "Master high-speed keyboard navigation, cell referencing ($A$1), data hygiene, and text manipulation functions.",
          topics: [
            "Cell referencing ($A$1 vs relative)",
            "Text functions (LEFT, RIGHT, MID, TRIM, CONCAT)",
            "Logical formulas (IF, IFS, AND, OR)",
            "Date & time parsing functions",
            "Data validation & error traps (IFERROR)",
          ],
          handsOn: "Clean and standardize an inconsistent 5,000-row customer transaction log.",
          deliverable: "Normalized, error-free customer log with automated summary metrics and validation rules.",
          estimatedHours: 8,
          tasks: [
            "Learn and master the top 20 essential spreadsheet keyboard shortcuts",
            "Standardize dirty phone numbers, emails, and address strings using text formulas",
            "Build an automated tax and tiered fee calculator using nested IFS",
            "Complete 5 scenario-based formula troubleshooting exercises",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=Vl0H-qTclOg",
          youtubeTitle: "freeCodeCamp: Excel Tutorial for Beginners - Full Course",
          resources: [
          {
                    name: "Excel Jet: Formula Reference Guide",
                    url: "https://exceljet.net/",
                    type: "guide"
          },
          {
                    name: "Microsoft Excel Practice Workbooks",
                    url: "https://support.microsoft.com/en-us/excel",
                    type: "practice"
          },
          {
                    name: "Chandoo Excel Fundamentals",
                    url: "https://www.youtube.com/watch?v=0nbkaYsR94c",
                    type: "video"
          }
],
        },
        {
          id: "da-w2",
          weekNumber: 2,
          title: "Advanced Lookups, Pivot Tables & Dynamic Reporting",
          summary: "Build multi-dimensional analytical summaries using modern XLOOKUP, Pivot Tables, calculated fields, and interactive slicers.",
          topics: [
            "XLOOKUP & INDEX/MATCH patterns",
            "Multi-condition aggregations (SUMIFS, COUNTIFS, AVERAGEIFS)",
            "Pivot Tables & Pivot Charts",
            "Dynamic Slicers & Timeline filters",
            "Conditional formatting heatmaps & sparklines",
          ],
          handsOn: "Build an interactive Multi-Store Retail Performance Dashboard with regional and quarterly drill-downs.",
          deliverable: "Interactive Excel workbook dashboard equipped with KPI metric cards, sparklines, and slicers.",
          estimatedHours: 10,
          tasks: [
            "Implement XLOOKUP with exact, wildcard, and approximate match parameters",
            "Create Pivot Tables with custom calculated fields and running total percentages",
            "Design an executive dashboard layout with cohesive color coding and visual hierarchy",
            "Export key business findings in a 3-bullet executive summary memo",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=m0wI61ahfLc",
          youtubeTitle: "Kevin Stratvert: Excel Pivot Tables Full Tutorial",
          resources: [
          {
                    name: "Maven Analytics: Excel Pivot Table Deep Dive",
                    url: "https://www.mavenanalytics.io/blog",
                    type: "guide"
          },
          {
                    name: "Kaggle Retail Sales Sample Dataset",
                    url: "https://www.kaggle.com/datasets",
                    type: "practice"
          },
          {
                    name: "Storytelling with Excel Dashboards",
                    url: "https://www.youtube.com/watch?v=K74_FNikNp8",
                    type: "video"
          }
],
        },
      ],
    },
    {
      id: "r2",
      phase: "Foundations",
      title: "Statistics basics",
      detail: "Mean, variance, distributions, hypothesis testing and A/B experiments",
      weeks: 2,
      weekRange: "Weeks 3–4",
      weeksList: [3, 4],
      weeklyContent: [
        {
          id: "da-w3",
          weekNumber: 3,
          title: "Descriptive Statistics, Spread & Distribution Shape",
          summary: "Understand the mathematical intuition behind central tendency, variance, standard deviation, and data skewness in business datasets.",
          topics: [
            "Central tendency (Mean, Median, Mode)",
            "Measures of spread (Variance, Standard Deviation, IQR)",
            "Skewness, Kurtosis & modality",
            "Detecting outliers with Boxplots & Z-Scores",
            "The Normal Distribution & Empirical Rule (68-95-99.7)",
          ],
          handsOn: "Perform an exploratory statistical audit on warehouse delivery fulfillment times.",
          deliverable: "Statistical summary report identifying operational bottleneck outliers and distribution skew.",
          estimatedHours: 8,
          tasks: [
            "Calculate mean, median, IQR, and standard deviation across skewed transaction data",
            "Construct Box & Whisker plots to identify and document 1.5x IQR outliers",
            "Analyze right-skewed revenue distributions to demonstrate when median outperforms mean",
            "Formulate 3 data-backed takeaways on delivery reliability bottlenecks",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=xxpc-HPKN28",
          youtubeTitle: "StatQuest: The Normal Distribution, Clearly Explained!",
          resources: [
          {
                    name: "Khan Academy: Descriptive Statistics & Distributions",
                    url: "https://www.khanacademy.org/math/statistics-probability",
                    type: "guide"
          },
          {
                    name: "StatQuest: Central Tendency & Standard Deviation",
                    url: "https://www.youtube.com/watch?v=xxpc-HPKN28",
                    type: "video"
          },
          {
                    name: "OpenIntro Statistics Exercises",
                    url: "https://www.openintro.org/book/stat/",
                    type: "practice"
          }
],
        },
        {
          id: "da-w4",
          weekNumber: 4,
          title: "Probability, Confidence Intervals & A/B Testing",
          summary: "Formulate rigorous statistical hypotheses, interpret p-values, calculate sample sizes, and evaluate digital product experiments.",
          topics: [
            "Central Limit Theorem & Sampling Error",
            "Confidence Intervals (95% CI) and Margin of Error",
            "Null vs Alternative Hypotheses (H0 vs H1)",
            "p-values, Significance Levels, Type I & Type II Errors",
            "Two-sample t-tests & Chi-Square tests",
            "A/B test design & Minimum Detectable Effect (MDE)",
          ],
          handsOn: "Analyze mobile checkout redesign A/B experiment data to determine statistical significance.",
          deliverable: "Experimentation memo with p-value calculations, confidence interval charts, and a product launch recommendation.",
          estimatedHours: 9,
          tasks: [
            "Formulate formal null and alternative hypotheses for a conversion rate experiment",
            "Compute two-sample t-test and interpret the resulting p-value against alpha 0.05",
            "Calculate minimum sample size required to detect a 5% relative conversion lift",
            "Synthesize findings into an actionable go/no-go product decision memo",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=0oc49DyA3hU",
          youtubeTitle: "StatQuest: Hypothesis Testing and p-Values, Clearly Explained!",
          resources: [
          {
                    name: "Evan Miller A/B Testing Sample Size Calculator",
                    url: "https://www.evanmiller.org/ab-testing/sample-size.html",
                    type: "docs"
          },
          {
                    name: "StatQuest: Hypothesis Testing and p-Values",
                    url: "https://www.youtube.com/watch?v=0oc49DyA3hU",
                    type: "video"
          },
          {
                    name: "Harvard Business Review: A Guide to A/B Testing",
                    url: "https://hbr.org/2017/06/a-refresher-on-ab-testing",
                    type: "guide"
          }
],
        },
      ],
    },
    {
      id: "r3",
      phase: "Core skills",
      title: "SQL for analysis",
      detail: "Joins, aggregations, window functions and query optimization",
      weeks: 3,
      weekRange: "Weeks 5–7",
      weeksList: [5, 6, 7],
      weeklyContent: [
        {
          id: "da-w5",
          weekNumber: 5,
          title: "Relational Foundations, Queries & Aggregations",
          summary: "Write production queries to extract, filter, group, and aggregate structured data from normalized relational database tables.",
          topics: [
            "RDBMS relational architecture & schema diagrams",
            "SELECT, DISTINCT, WHERE, LIKE, IN, BETWEEN",
            "Logical operators (AND, OR, NOT) & precedence",
            "ORDER BY, LIMIT & OFFSET pagination",
            "Aggregates (COUNT, SUM, AVG, MIN, MAX)",
            "GROUP BY & HAVING filter clauses",
          ],
          handsOn: "Query a mock digital streaming platform database to extract monthly user engagement and subscription metrics.",
          deliverable: "SQL script containing 15 analytical queries answering critical business questions on user streaming habits.",
          estimatedHours: 10,
          tasks: [
            "Set up local PostgreSQL / SQLite database with a multi-table sample schema",
            "Write queries utilizing WHERE filters and string pattern matching",
            "Group metrics by subscription tier, country, and registration month using HAVING",
            "Handle NULL values cleanly with COALESCE and NULLIF",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
          youtubeTitle: "freeCodeCamp: SQL Tutorial - Full Database Course for Beginners",
          resources: [
          {
                    name: "SQLBolt: Interactive SQL Lessons",
                    url: "https://sqlbolt.com/",
                    type: "practice"
          },
          {
                    name: "Mode Analytics: SQL Tutorial for Beginners",
                    url: "https://mode.com/sql-tutorial/",
                    type: "guide"
          },
          {
                    name: "PostgreSQL Official Documentation: Queries",
                    url: "https://www.postgresql.org/docs/current/queries.html",
                    type: "docs"
          }
],
        },
        {
          id: "da-w6",
          weekNumber: 6,
          title: "Relational Joins, Subqueries & Conditional Logic",
          summary: "Combine multi-table datasets with precision using JOINs, write nested queries, and create dynamic categories with CASE WHEN.",
          topics: [
            "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN",
            "Self joins & Cross joins",
            "Scalar subqueries vs correlated subqueries",
            "CASE WHEN conditional branching & bucketing",
            "UNION vs UNION ALL",
            "Dealing with Cartesian products and fanout bugs",
          ],
          handsOn: "Construct a Customer 360 view joining user profiles, payments, support tickets, and web sessions.",
          deliverable: "Normalized analytical query uniting 4 tables with customer lifetime value and churn risk classifications.",
          estimatedHours: 11,
          tasks: [
            "Execute complex 3-table and 4-table LEFT JOIN queries without duplicate row fanout",
            "Use CASE WHEN to segment customers into High, Medium, and Low value tiers",
            "Write correlated subqueries to isolate customers whose orders exceed category averages",
            "Verify row counts before and after joins to ensure referential integrity",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
          youtubeTitle: "Alex The Analyst: SQL Joins Tutorial - Full Course",
          resources: [
          {
                    name: "LeetCode Database Problem Set (Easy/Medium)",
                    url: "https://leetcode.com/problemset/database/",
                    type: "practice"
          },
          {
                    name: "StrataScratch Real SQL Interview Questions",
                    url: "https://www.stratascratch.com/",
                    type: "practice"
          },
          {
                    name: "Alex The Analyst: SQL Joins Masterclass",
                    url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
                    type: "video"
          }
],
        },
        {
          id: "da-w7",
          weekNumber: 7,
          title: "Advanced Window Functions, CTEs & Query Tuning",
          summary: "Master enterprise-grade SQL: Common Table Expressions (CTEs), rolling averages, rankings, and query performance optimization.",
          topics: [
            "Common Table Expressions (WITH syntax)",
            "Window framing (OVER, PARTITION BY, ORDER BY)",
            "Ranking functions (ROW_NUMBER, RANK, DENSE_RANK)",
            "Offset navigation (LEAD, LAG)",
            "Running totals and 7-day moving averages",
            "Indexes & EXPLAIN query execution plans",
          ],
          handsOn: "Build a Month-over-Month (MoM) revenue growth and cohort retention matrix entirely in SQL.",
          deliverable: "Modular SQL script utilizing CTEs and Window Functions calculating MoM growth, top-3 products per region, and cumulative LTV.",
          estimatedHours: 12,
          tasks: [
            "Refactor nested subqueries into readable Common Table Expressions (CTEs)",
            "Implement LAG() to calculate percentage growth compared to previous calendar month",
            "Partition rankings to isolate top-earning sales reps per territory",
            "Analyze EXPLAIN query plans to index unindexed foreign key lookups",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=Ww71knvhQ-s",
          youtubeTitle: "Luke Barousse: SQL Window Functions in 15 Minutes",
          resources: [
          {
                    name: "DataLemur SQL Interview Questions",
                    url: "https://datalemur.com/questions",
                    type: "practice"
          },
          {
                    name: "Modern SQL: Window Functions Guide",
                    url: "https://modern-sql.com/feature/window-functions",
                    type: "guide"
          },
          {
                    name: "Use The Index, Luke: Database Performance Guide",
                    url: "https://use-the-index-luke.com/",
                    type: "docs"
          }
],
        },
      ],
    },
    {
      id: "r4",
      phase: "Core skills",
      title: "Python & Pandas",
      detail: "Cleaning, transforming, exploring and visualizing data with Python",
      weeks: 4,
      weekRange: "Weeks 8–11",
      weeksList: [8, 9, 10, 11],
      weeklyContent: [
        {
          id: "da-w8",
          weekNumber: 8,
          title: "Python Core Programming & Automation for Data",
          summary: "Establish solid programming habits: control structures, data structures, custom functions, and automated file parsing.",
          topics: [
            "Python data types (Lists, Dicts, Tuples, Sets)",
            "List & Dictionary comprehensions",
            "Custom functions, parameters, and type hints",
            "Error handling (try/except blocks)",
            "File handling (CSV, JSON, text)",
            "Virtual environments & pip package management",
          ],
          handsOn: "Write a command-line Python script that digests a directory of JSON server access logs and outputs error rate tallies.",
          deliverable: "Executable Python script with docstrings, error handling, and automated summary export.",
          estimatedHours: 9,
          tasks: [
            "Configure Python 3 environment and Jupyter Notebooks in VS Code",
            "Implement nested dictionary lookups and list comprehensions",
            "Write reusable utility functions with typing and docstrings",
            "Parse and summarize semi-structured JSON payloads",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
          youtubeTitle: "Programming with Mosh: Python Tutorial for Beginners",
          resources: [
          {
                    name: "Corey Schafer: Python Beginner Walkthroughs",
                    url: "https://www.youtube.com/watch?v=YYXdXT2l-Gg",
                    type: "video"
          },
          {
                    name: "Real Python: Python Basics & Best Practices",
                    url: "https://realpython.com/",
                    type: "guide"
          },
          {
                    name: "Exercism Python Track",
                    url: "https://exercism.org/tracks/python",
                    type: "practice"
          }
],
        },
        {
          id: "da-w9",
          weekNumber: 9,
          title: "NumPy Vectorization & Pandas DataFrames",
          summary: "Harness vectorized math and the Pandas DataFrame architecture to manipulate tabular data at high speed.",
          topics: [
            "NumPy arrays, broadcasting, and vectorization",
            "Pandas Series & DataFrame internals",
            "Reading CSV, Excel, and SQL tables",
            "Selection & Indexing (.loc, .iloc, query)",
            "Boolean indexing and compound filtering",
            "Summary statistics (.describe(), .info(), .value_counts())",
          ],
          handsOn: "Analyze historical stock market data to calculate daily percentage returns, volatility, and moving averages.",
          deliverable: "Jupyter notebook computing annualized returns and standard deviation across multiple assets.",
          estimatedHours: 10,
          tasks: [
            "Replace slow Python loops with vectorized NumPy array calculations",
            "Load and inspect messy CSV datasets using Pandas parameters",
            "Slice and filter rows using complex multi-condition boolean expressions",
            "Export filtered subsets to compressed Parquet and CSV files",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
          youtubeTitle: "Keith Galli: Pandas Data Science Tutorial - Full Course",
          resources: [
          {
                    name: "10 Minutes to Pandas Official Guide",
                    url: "https://pandas.pydata.org/docs/user_guide/10min.html",
                    type: "docs"
          },
          {
                    name: "Keith Galli: Pandas Data Science Tutorial",
                    url: "https://www.youtube.com/watch?v=vmEHCJofslg",
                    type: "video"
          },
          {
                    name: "Kaggle Python Micro-Course",
                    url: "https://www.kaggle.com/learn/python",
                    type: "practice"
          }
],
        },
        {
          id: "da-w10",
          weekNumber: 10,
          title: "Data Wrangling, Cleaning & Multi-Table Transformations",
          summary: "Master the 80% of data work: imputing missing values, deduplication, string parsing, datetime manipulations, and merging.",
          topics: [
            "Handling nulls (isna, dropna, fillna, forward fill)",
            "Deduplication and outlier clipping",
            "String operations (.str.extract, regex, strip)",
            "Datetime manipulation (pd.to_datetime, dt.month, resample)",
            "Groupby with custom aggregations (.agg)",
            "Pivot tables, melt (wide to long), and merge/concat",
          ],
          handsOn: "Build a robust automated data cleaning pipeline for a messy 100,000-row real estate dataset.",
          deliverable: "A fully documented cleaning pipeline script that turns missing/corrupt records into a pristine dataset.",
          estimatedHours: 12,
          tasks: [
            "Impute missing values using domain-specific median strategies",
            "Extract zip codes, room counts, and square footage from unformatted listing descriptions",
            "Resample daily transaction timeseries into monthly and quarterly trend buckets",
            "Merge property specs with demographic census tables using outer and inner keys",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=bDhvCp3_lYw",
          youtubeTitle: "Alex The Analyst: Data Cleaning in Python Pandas",
          resources: [
          {
                    name: "Wes McKinney: Python for Data Analysis (3rd Edition)",
                    url: "https://wesmckinney.com/book/",
                    type: "guide"
          },
          {
                    name: "Data School: Top 25 Pandas Tricks",
                    url: "https://www.youtube.com/watch?v=RlIiVeAU3vE",
                    type: "video"
          },
          {
                    name: "Kaggle Data Cleaning Challenge",
                    url: "https://www.kaggle.com/learn/data-cleaning",
                    type: "practice"
          }
],
        },
        {
          id: "da-w11",
          weekNumber: 11,
          title: "Exploratory Data Analysis (EDA) & Visual Storytelling",
          summary: "Extract deep business insights through visual discovery with Matplotlib and Seaborn to test hypotheses.",
          topics: [
            "Distribution plots (Histograms, KDE plots)",
            "Categorical relationships (Bar plots, Boxplots, Violin plots)",
            "Numerical correlation heatmaps & pairplots",
            "Customizing themes, figure dimensions, and palettes",
            "Annotating chart callouts and storytelling titles",
            "Structuring EDA findings for stakeholder consumption",
          ],
          handsOn: "Perform an end-to-end Exploratory Data Analysis on a SaaS Customer Churn dataset.",
          deliverable: "Professional Jupyter Notebook featuring 8 polished charts with executive takeaway callouts.",
          estimatedHours: 11,
          tasks: [
            "Compute correlation matrices and visualize multi-collinearity heatmaps",
            "Visualize churn rates across contract types and payment tenures",
            "Add clear chart titles, subtitles, axis labels, and highlight annotations",
            "Write concise analytical commentary for each chart explaining the business implication",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=uo3Z_W_bA0U",
          youtubeTitle: "freeCodeCamp: Exploratory Data Analysis with Matplotlib & Seaborn",
          resources: [
          {
                    name: "The Python Graph Gallery",
                    url: "https://python-graph-gallery.com/",
                    type: "guide"
          },
          {
                    name: "Seaborn Official Gallery & Documentation",
                    url: "https://seaborn.pydata.org/",
                    type: "docs"
          },
          {
                    name: "Kaggle EDA Hall of Fame Notebooks",
                    url: "https://www.kaggle.com/code",
                    type: "practice"
          }
],
        },
      ],
    },
    {
      id: "r5",
      phase: "Visualisation",
      title: "Power BI dashboards",
      detail: "Data models, DAX calculations, storytelling and executive KPI design",
      weeks: 3,
      weekRange: "Weeks 12–14",
      weeksList: [12, 13, 14],
      weeklyContent: [
        {
          id: "da-w12",
          weekNumber: 12,
          title: "Power Query ETL & Star Schema Data Modeling",
          summary: "Transform source data with Power Query and build resilient dimensional models (Fact and Dimension tables).",
          topics: [
            "Power Query transformation interface & M code basics",
            "Unpivoting, splitting, and merging queries",
            "Dimensional modeling: Fact tables vs Dimension tables",
            "Star schema vs Snowflake schema principles",
            "1-to-many relationship cardinalities and cross-filter directions",
            "Dedicated Date/Calendar dimension tables",
          ],
          handsOn: "Model an enterprise global supply chain dataset with inventory, suppliers, and shipment facts.",
          deliverable: "Clean Star Schema Power BI model connecting 1 Fact table and 4 Dimension tables without circular dependencies.",
          estimatedHours: 10,
          tasks: [
            "Ingest multiple CSV and SQL sources into Power Query",
            "Build a dynamic continuous Date Dimension using M code / DAX",
            "Establish 1-to-Many single-directional relationships in the Model view",
            "Hide foreign key ID fields and organize columns into display folders",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=TmhQCQr_81U",
          youtubeTitle: "Kevin Stratvert: Microsoft Power BI Full Course for Beginners",
          resources: [
          {
                    name: "Microsoft Learn: Model Data in Power BI",
                    url: "https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-modeling-view",
                    type: "docs"
          },
          {
                    name: "Guy in a Cube: Star Schema Design Rules",
                    url: "https://www.youtube.com/watch?v=cMwe2mD_d2w",
                    type: "video"
          },
          {
                    name: "Kimball Group: Dimensional Modeling Techniques",
                    url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/",
                    type: "guide"
          }
],
        },
        {
          id: "da-w13",
          weekNumber: 13,
          title: "DAX Measures, Context Transition & Time Intelligence",
          summary: "Master the Data Analysis Expressions (DAX) formula language to compute dynamic KPIs and time-based metrics.",
          topics: [
            "Calculated Columns vs DAX Measures",
            "Filter Context vs Row Context",
            "CALCULATE() modifier functions (FILTER, ALL, REMOVEFILTERS)",
            "Variables in DAX (VAR / RETURN)",
            "Time intelligence (TOTALYTD, SAMEPERIODLASTYEAR, DATEADD)",
            "Handling divide-by-zero safely (DIVIDE)",
          ],
          handsOn: "Write 15 mission-critical business measures for SaaS Monthly Recurring Revenue (MRR), Churn %, and YoY Growth.",
          deliverable: "Measures table with formatted DAX calculations reflecting real-time slicer adjustments.",
          estimatedHours: 12,
          tasks: [
            "Write fundamental KPI measures (Total Revenue, Active Subscribers, ARPU)",
            "Implement CALCULATE with ALL to compute % of Grand Total",
            "Calculate Year-over-Year (YoY) dollar change and percentage growth using SAMEPERIODLASTYEAR",
            "Optimize DAX measure execution using variables",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=842eT_P9Zt8",
          youtubeTitle: "Curbal: DAX Basics & Calculated Measures in Power BI",
          resources: [
          {
                    name: "SQLBI (Marco Russo & Alberto Ferrari): DAX Guide",
                    url: "https://dax.guide/",
                    type: "guide"
          },
          {
                    name: "Curbal: DAX Fridays Video Series",
                    url: "https://www.youtube.com/watch?v=842eT_P9Zt8",
                    type: "video"
          },
          {
                    name: "DAX.guide Reference Manual",
                    url: "https://dax.guide/",
                    type: "docs"
          }
],
        },
        {
          id: "da-w14",
          weekNumber: 14,
          title: "Executive Dashboard UX, Storytelling & Cloud Publishing",
          summary: "Design interactive, aesthetically stunning executive dashboards with bookmarks, drill-throughs, and mobile views.",
          topics: [
            "Visual layout hierarchy, typography & brand color palettes",
            "Interactive bookmarks & selection pane navigation",
            "Drill-through details pages & custom report page tooltips",
            "Field parameters for dynamic metric selection",
            "Mobile layout responsive optimization",
            "Power BI Service publishing, workspaces & scheduled refresh",
          ],
          handsOn: "Create a 3-page C-Suite Executive Command Center dashboard with dark mode and interactive filter overlays.",
          deliverable: "Published Power BI (.pbix) report with bookmarks, custom tooltips, and interactive executive KPI cards.",
          estimatedHours: 10,
          tasks: [
            "Design a clean header bar with logo, date range slicer, and KPI summary tiles",
            "Configure bookmark buttons to toggle between Sales and Operations views",
            "Build a drill-through page allowing stakeholders to inspect individual customer histories",
            "Format mobile layout view for phone screens",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=AGrl-H87pRU",
          youtubeTitle: "Chandoo: Power BI Executive Dashboard Tutorial",
          resources: [
          {
                    name: "Storytelling with Data by Cole Nussbaumer Knaflic",
                    url: "https://www.storytellingwithdata.com/",
                    type: "guide"
          },
          {
                    name: "Power BI Community Dashboard Showcase",
                    url: "https://community.powerbi.com/t5/Data-Stories-Gallery/bd-p/DataStoriesGallery",
                    type: "practice"
          },
          {
                    name: "Microsoft Power BI Desktop Design Best Practices",
                    url: "https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-report-performance",
                    type: "docs"
          }
],
        },
      ],
    },
    {
      id: "r6",
      phase: "Job ready",
      title: "Capstone project",
      detail: "End-to-end analysis published on GitHub with executive insights deck",
      weeks: 3,
      weekRange: "Weeks 15–17",
      weeksList: [15, 16, 17],
      weeklyContent: [
        {
          id: "da-w15",
          weekNumber: 15,
          title: "Capstone Scoping, Problem Framing & Data Architecture",
          summary: "Define an original industry problem, acquire and validate real-world data, and set up your portfolio repository.",
          topics: [
            "Formulating high-value business questions",
            "Dataset acquisition (Kaggle, Open Data portals, APIs, scraping)",
            "Data quality assessment and integrity verification",
            "Project scoping charter (Problem, Audience, Metrics, Limitations)",
            "Git version control workflow & repository architecture",
          ],
          handsOn: "Scope an original Capstone (e.g., E-commerce Customer Retention, Healthcare Wait Times, or Financial Fraud).",
          deliverable: "Project Proposal Document & initialized GitHub repository with structured directory tree (data/, notebooks/, sql/, reports/).",
          estimatedHours: 10,
          tasks: [
            "Select a domain-specific dataset with at least 50k rows and multiple tables",
            "Draft the Project Charter outlining the primary business questions and expected deliverables",
            "Initialize GitHub repository with license, .gitignore, and README skeleton",
            "Perform initial data profiling to check cardinality, null ratios, and data types",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=r-uOLxNrNk8",
          youtubeTitle: "Luke Barousse: How to Build a Data Analyst Portfolio Project",
          resources: [
          {
                    name: "CRISP-DM Analytics Process Guide",
                    url: "https://www.datascience-pm.com/crisp-dm-2/",
                    type: "guide"
          },
          {
                    name: "Cookiecutter Data Science Architecture",
                    url: "https://drivendata.github.io/cookiecutter-data-science/",
                    type: "docs"
          },
          {
                    name: "Awesome Public Datasets Repository",
                    url: "https://github.com/awesomedata/awesome-public-datasets",
                    type: "practice"
          }
],
        },
        {
          id: "da-w16",
          weekNumber: 16,
          title: "Full-Stack Implementation: SQL + Python + Power BI",
          summary: "Execute the end-to-end analysis: database staging in SQL, exploratory modeling in Python, and dashboard synthesis in Power BI.",
          topics: [
            "SQL pipeline creation and database staging",
            "Automated data transformation in Python/Pandas",
            "Statistical testing and predictive or clustering analysis",
            "Power BI dashboard integration",
            "Cross-validating analytical metrics across tools",
          ],
          handsOn: "Build out the entire analytical engine for your capstone project.",
          deliverable: "Complete codebase with clean SQL queries, commented Python notebooks, and an interactive Power BI report.",
          estimatedHours: 14,
          tasks: [
            "Load raw data into PostgreSQL and execute extraction and transformation queries",
            "Write Python scripts for feature engineering and statistical validation",
            "Connect Power BI to transformed outputs and build stakeholder visuals",
            "Ensure all figures and percentages match perfectly between SQL, Python, and Power BI",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=q6gXCEvoMms",
          youtubeTitle: "Alex The Analyst: Full End-to-End Data Analyst Portfolio Project",
          resources: [
          {
                    name: "End-to-End Analytics Project Walkthrough",
                    url: "https://www.youtube.com/watch?v=q6gXCEvoMms",
                    type: "video"
          },
          {
                    name: "Python Clean Code Guidelines (PEP 8)",
                    url: "https://peps.python.org/pep-0008/",
                    type: "docs"
          },
          {
                    name: "Dbt (Data Build Tool) Fundamentals Overview",
                    url: "https://docs.getdbt.com/",
                    type: "guide"
          }
],
        },
        {
          id: "da-w17",
          weekNumber: 17,
          title: "GitHub Documentation, Executive Deck & Video Walkthrough",
          summary: "Showcase your project with a stellar GitHub README, business insights slide deck, and a recorded demo.",
          topics: [
            "Crafting recruiter-ready GitHub READMEs (GIFs, architecture diagrams, summaries)",
            "Translating technical metrics into dollar/business ROI recommendations",
            "Designing an Executive Slide Deck (Problem -> Analysis -> Recommendation)",
            "Recording a crisp 3-minute video presentation walkthrough (Loom)",
            "Publishing interactive web reports (GitHub Pages / NovyPro)",
          ],
          handsOn: "Record and publish your complete Capstone showcase.",
          deliverable: "Polished GitHub repo with comprehensive README, 5-slide PDF executive deck, and a 3-minute video walkthrough link.",
          estimatedHours: 10,
          tasks: [
            "Write an engaging GitHub README with problem statement, methodology, key findings, and screenshots",
            "Create a 5-slide executive presentation focusing on recommendations and business impact",
            "Record a concise 3-minute Loom video demonstrating the dashboard and explaining one key insight",
            "Embed live interactive links and badges in your repository",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=EC4e_VfRz6g",
          youtubeTitle: "Ken Jee: How to Build a Standout Project README & Portfolio",
          resources: [
          {
                    name: "Showwcase: How to Write a Standout Data Project README",
                    url: "https://www.showwcase.com/",
                    type: "guide"
          },
          {
                    name: "NovyPro: Free Power BI Portfolio Hosting",
                    url: "https://www.novypro.com/",
                    type: "practice"
          },
          {
                    name: "Loom Video Recording Platform",
                    url: "https://www.loom.com/",
                    type: "docs"
          }
],
        },
      ],
    },
    {
      id: "r7",
      phase: "Job ready",
      title: "Resume & interviews",
      detail: "ATS-optimized portfolio, mock coding tests, case studies and applications",
      weeks: 2,
      weekRange: "Weeks 18–19",
      weeksList: [18, 19],
      weeklyContent: [
        {
          id: "da-w18",
          weekNumber: 18,
          title: "ATS-Optimized Resume, LinkedIn & Portfolio Showcase",
          summary: "Craft an irresistible resume, optimize your LinkedIn for recruiter searches, and create a centralized portfolio hub.",
          topics: [
            "ATS-friendly resume formatting and parsing algorithms",
            "Google XYZ bullet formula: Accomplished [X] measured by [Y] by doing [Z]",
            "LinkedIn search algorithm optimization (Headline, Skills, About section)",
            "Building a portfolio hub / GitHub profile README",
            "Sourcing high-probability job applications",
          ],
          handsOn: "Create your job application toolkit and publish your personal portfolio.",
          deliverable: "Single-page ATS-formatted Resume PDF, updated LinkedIn profile, and active portfolio link.",
          estimatedHours: 8,
          tasks: [
            "Draft 4-5 bullet points per project following the Google XYZ formula with real numbers",
            "Pass resume through ATS scanner tools to check keyword match scores",
            "Revamp LinkedIn headline: 'Aspiring Data Analyst | SQL, Python, Power BI, Statistics'",
            "Curate top 3 projects on GitHub / personal portfolio website",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=wX-yP5q155s",
          youtubeTitle: "Alex The Analyst: How to Build a Tech Resume That Lands Interviews",
          resources: [
          {
                    name: "Tech Interview Handbook: Resume Guide",
                    url: "https://www.techinterviewhandbook.org/resume/",
                    type: "guide"
          },
          {
                    name: "Jobscan ATS Resume Checker",
                    url: "https://www.jobscan.co/",
                    type: "practice"
          },
          {
                    name: "LinkedIn Profile Optimization for Tech Roles",
                    url: "https://www.youtube.com/watch?v=wX-yP5q155s",
                    type: "video"
          }
],
        },
        {
          id: "da-w19",
          weekNumber: 19,
          title: "Technical Coding Mocks, Case Studies & Behavioral Prep",
          summary: "Practice real-world SQL whiteboard tests, business metric case studies, behavioral STAR stories, and salary negotiations.",
          topics: [
            "Live technical SQL coding test strategies",
            "Python data manipulation interview questions",
            "Metric diagnosis case studies ('DAU dropped 12% last week, what would you check?')",
            "Behavioral interview prep with STAR technique (Situation, Task, Action, Result)",
            "Negotiation strategy and offer evaluation",
          ],
          handsOn: "Complete 3 timed technical test simulations and prepare 5 core behavioral stories.",
          deliverable: "Interview preparation cheat sheet with 5 STAR stories and answers to 20 common technical questions.",
          estimatedHours: 12,
          tasks: [
            "Complete 5 timed SQL interview exercises on StrataScratch / LeetCode under 20 mins each",
            "Prepare 5 STAR stories covering leadership, conflict, technical failure, and tight deadlines",
            "Simulate a live case study interview diagnosing a sudden drop in customer conversion",
            "Apply to 15 targeted entry-level / junior Data Analyst positions with tailored notes",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=Vl03U_B-yYI",
          youtubeTitle: "Exponent: Mock Data Analyst Technical Interview with Feedback",
          resources: [
          {
                    name: "Ace the Data Science Interview (Nick Singh)",
                    url: "https://www.acethedatascienceinterview.com/",
                    type: "guide"
          },
          {
                    name: "Interviewing.io Free Practice Guides",
                    url: "https://interviewing.io/",
                    type: "practice"
          },
          {
                    name: "Exponent: Data Analyst Mock Interview Videos",
                    url: "https://www.youtube.com/watch?v=Vl03U_B-yYI",
                    type: "video"
          }
],
        },
      ],
    },
  ],
  "web-developer": [
    {
      id: "fe-r1",
      phase: "Foundations",
      title: "HTML5, Modern CSS & Responsive Design",
      detail: "Semantic markup, modern layout techniques, responsive systems and accessibility",
      weeks: 3,
      weekRange: "Weeks 1–3",
      weeksList: [1, 2, 3],
      weeklyContent: [
        {
          id: "fe-w1",
          weekNumber: 1,
          title: "Semantic HTML5, CSS Box Model & Flexbox",
          summary: "Construct accessible web foundations using semantic tags, precise box sizing, and dynamic Flexbox layouts.",
          topics: [
            "Semantic HTML tags (main, section, article, nav, aside)",
            "Box model: content, padding, border, margin & box-sizing: border-box",
            "Flexbox parent & child properties (justify-content, align-items, flex-grow)",
            "Modern typography, line-height, and rem/em units",
          ],
          handsOn: "Build a responsive product pricing landing page from Figma specs without frameworks.",
          deliverable: "Clean HTML5/CSS repository deployed to Vercel/GitHub Pages with zero markup validation errors.",
          estimatedHours: 10,
          tasks: [
            "Structure semantic hierarchy with proper heading levels (h1-h6)",
            "Implement a responsive navigation bar and hero section with Flexbox",
            "Build 3 responsive pricing cards with hover micro-interactions",
            "Audit page accessibility using Chrome DevTools Lighthouse",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
          youtubeTitle: "freeCodeCamp: HTML and CSS Crash Course for Beginners",
          resources: [
          {
                    name: "MDN Web Docs: HTML & CSS Basics",
                    url: "https://developer.mozilla.org/en-US/docs/Learn",
                    type: "docs"
          },
          {
                    name: "Flexbox Froggy Interactive Game",
                    url: "https://flexboxfroggy.com/",
                    type: "practice"
          },
          {
                    name: "Kevin Powell: Modern CSS Layouts",
                    url: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
                    type: "video"
          }
],
        },
        {
          id: "fe-w2",
          weekNumber: 2,
          title: "CSS Grid, Custom Properties & Dark Mode",
          summary: "Master 2D CSS Grid layouts, CSS variables, dark mode color token systems, and media queries.",
          topics: [
            "CSS Grid: grid-template-columns, repeat, minmax(), auto-fit vs auto-fill",
            "CSS Custom Properties (Variables) and theme switches",
            "Responsive breakpoints (mobile-first methodology)",
            "CSS transitions and smooth keyframe animations",
          ],
          handsOn: "Build a responsive Bento-Grid Portfolio showcase with light/dark theme switching.",
          deliverable: "Responsive bento-grid layout that rearranges seamlessly from 4 columns on desktop to 1 on mobile.",
          estimatedHours: 10,
          tasks: [
            "Create a CSS Grid bento layout using grid-column and grid-row spanning",
            "Set up CSS custom properties for background, text, accent, and border colors",
            "Implement a theme toggle using data-theme attribute and localStorage",
            "Add subtle micro-animations for card hovers and button clicks",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=rg7Fvvl3taU",
          youtubeTitle: "Kevin Powell: CSS Grid Full Tutorial - Learn CSS Grid",
          resources: [
          {
                    name: "Grid Garden: Learn CSS Grid",
                    url: "https://cssgridgarden.com/",
                    type: "practice"
          },
          {
                    name: "Every Layout: Reusable CSS Layout Patterns",
                    url: "https://every-layout.dev/",
                    type: "guide"
          },
          {
                    name: "Josh Comeau: The CSS Grid Guide",
                    url: "https://www.joshwcomeau.com/css/interactive-guide-to-grid/",
                    type: "guide"
          }
],
        },
        {
          id: "fe-w3",
          weekNumber: 3,
          title: "Git, Terminal & Responsive Project Capstone",
          summary: "Establish professional Git workflows, terminal mastery, and ship a multi-page responsive web project.",
          topics: [
            "Git version control: branching, commits, merges, and pull requests",
            "Command line fluency & npm package manager basics",
            "Forms validation, custom controls, and ARIA attributes",
            "Lighthouse performance optimization (images, fonts, critical CSS)",
          ],
          handsOn: "Develop and deploy a multi-page agency website complete with accessible contact forms.",
          deliverable: "GitHub repository with Git branch history, published live site, and Lighthouse 95+ score.",
          estimatedHours: 10,
          tasks: [
            "Initialize repository and practice feature-branch pull request workflow",
            "Build multi-page navigation and accessible contact form with custom validation styles",
            "Optimize images with modern WebP formats and responsive srcset",
            "Deploy to Vercel or Netlify with automated CI/CD on git push",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
          youtubeTitle: "freeCodeCamp: Git and GitHub for Beginners - Full Crash Course",
          resources: [
          {
                    name: "GitHub Skills: Introduction to GitHub",
                    url: "https://skills.github.com/",
                    type: "practice"
          },
          {
                    name: "Web.dev: Accessible Web Forms",
                    url: "https://web.dev/learn/forms/",
                    type: "guide"
          },
          {
                    name: "Frontend Mentor Practice Challenges",
                    url: "https://www.frontendmentor.io/",
                    type: "practice"
          }
],
        },
      ],
    },
    {
      id: "fe-r2",
      phase: "Core skills",
      title: "JavaScript ES6+ & DOM Mastery",
      detail: "Modern JavaScript syntax, async programming, browser APIs and TypeScript",
      weeks: 4,
      weekRange: "Weeks 4–7",
      weeksList: [4, 5, 6, 7],
      weeklyContent: [
        {
          id: "fe-w4",
          weekNumber: 4,
          title: "JavaScript Core: Scope, Closures & Modern ES6+",
          summary: "Master the foundational mechanics of JavaScript: execution context, closures, higher-order functions, and ES6+ features.",
          topics: [
            "Let, const, arrow functions, and hoisting",
            "Array methods: map, filter, reduce, find, some, every",
            "Destructuring, spread/rest operators, and optional chaining (?.)",
            "Closures, lexical scope, and pure functions",
          ],
          handsOn: "Build an in-memory budget and expense analytics engine with category calculations.",
          deliverable: "Clean JavaScript module with unit-tested math functions for budgeting.",
          estimatedHours: 12,
          tasks: [
            "Implement complex data filtering and aggregation using Array.prototype.reduce",
            "Refactor imperative loops into clean declarative functional chains",
            "Write custom closures for private state encapsulation",
            "Solve 10 algorithm problems on JavaScript fundamental operations",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
          youtubeTitle: "Traversy Media: Modern JavaScript Crash Course for Beginners",
          resources: [
          {
                    name: "JavaScript.info: The Modern JavaScript Tutorial",
                    url: "https://javascript.info/",
                    type: "guide"
          },
          {
                    name: "You Don't Know JS Yet (Book Series)",
                    url: "https://github.com/getify/You-Dont-Know-JS",
                    type: "docs"
          },
          {
                    name: "Codewars: JavaScript Katas",
                    url: "https://www.codewars.com/",
                    type: "practice"
          }
],
        },
        {
          id: "fe-w5",
          weekNumber: 5,
          title: "DOM Manipulation, Events & Browser Storage",
          summary: "Bridge JavaScript with the webpage: DOM traversal, event bubbling, form handling, and persistent LocalStorage.",
          topics: [
            "querySelector, createElement, and fragment rendering",
            "Event listeners, event delegation, and bubbling vs capturing",
            "Debouncing and throttling input events",
            "localStorage, sessionStorage, and JSON serialization",
          ],
          handsOn: "Build an interactive Kanban task board with drag-and-drop and persistent LocalStorage state.",
          deliverable: "Fully functional Kanban app where cards persist across browser refreshes.",
          estimatedHours: 12,
          tasks: [
            "Implement event delegation on parent containers to handle dynamic item creation",
            "Write a debounce utility for live search and filtering",
            "Store and retrieve application state from localStorage with error handling",
            "Add keyboard navigation shortcuts for task management",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=0ik6X4DJKCc",
          youtubeTitle: "freeCodeCamp: JavaScript DOM Manipulation - Full Course",
          resources: [
          {
                    name: "MDN: Introduction to the DOM",
                    url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model",
                    type: "docs"
          },
          {
                    name: "Wes Bos: JavaScript 30 Challenges",
                    url: "https://javascript30.com/",
                    type: "practice"
          },
          {
                    name: "Web.dev: Browser Storage Strategies",
                    url: "https://web.dev/storage-for-the-web/",
                    type: "guide"
          }
],
        },
        {
          id: "fe-w6",
          weekNumber: 6,
          title: "Asynchronous JS, Promises & RESTful APIs",
          summary: "Master the Event Loop, Promises, Async/Await, and consuming third-party RESTful APIs with error resilience.",
          topics: [
            "The JavaScript Event Loop, Call Stack & Microtask Queue",
            "Promises (resolve, reject, Promise.all, Promise.race)",
            "Async / Await syntax & try-catch error boundaries",
            "Fetch API, HTTP status codes, headers, and query parameters",
          ],
          handsOn: "Build a Live Weather & Forecast Explorer app fetching real-time data from OpenWeather API.",
          deliverable: "Weather web app featuring location autocomplete, loading skeletons, and helpful error alerts.",
          estimatedHours: 12,
          tasks: [
            "Fetch weather data using async/await with custom timeout handling",
            "Implement skeleton loaders during asynchronous data fetching states",
            "Handle 404, 500, and offline network errors gracefully with retry buttons",
            "Use Promise.all to fetch current weather and 5-day forecast concurrently",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=PoRJizFvM7s",
          youtubeTitle: "The Net Ninja: Asynchronous JavaScript (Async/Await & Fetch)",
          resources: [
          {
                    name: "Jake Archibald: In the Loop (Event Loop Talk)",
                    url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0",
                    type: "video"
          },
          {
                    name: "Public APIs Directory for Developers",
                    url: "https://github.com/public-apis/public-apis",
                    type: "practice"
          },
          {
                    name: "MDN: Working with APIs & Fetch",
                    url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
                    type: "guide"
          }
],
        },
        {
          id: "fe-w7",
          weekNumber: 7,
          title: "Modern Build Tools & TypeScript Fundamentals",
          summary: "Level up to production tooling: Vite, ES modules, TypeScript types, interfaces, and strict type safety.",
          topics: [
            "Vite build tool, Hot Module Replacement (HMR), and npm scripts",
            "TypeScript types: primitives, unions, intersections, and type aliases",
            "Interfaces, generics (<T>), and readonly utility types",
            "Typing DOM events and API response payloads",
          ],
          handsOn: "Convert an existing JavaScript application into a type-safe TypeScript project built with Vite.",
          deliverable: "Vite + TypeScript repository compiling with zero TypeScript errors under strict mode.",
          estimatedHours: 12,
          tasks: [
            "Set up a new Vite project and configure tsconfig.json with strict type checking",
            "Define explicit TypeScript interfaces for all external API response structures",
            "Type custom event handlers and HTMLInputElement change events",
            "Publish type-safe utility functions with generic type parameters",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
          youtubeTitle: "freeCodeCamp: TypeScript Tutorial for Beginners - Full Course",
          resources: [
          {
                    name: "TypeScript Official Handbook",
                    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
                    type: "docs"
          },
          {
                    name: "Total TypeScript by Matt Pocock",
                    url: "https://www.totaltypescript.com/tutorials",
                    type: "guide"
          },
          {
                    name: "TypeHero: Interactive TypeScript Exercises",
                    url: "https://typehero.dev/",
                    type: "practice"
          }
],
        },
      ],
    },
    {
      id: "fe-r3",
      phase: "Core skills",
      title: "React 19 & Component Architecture",
      detail: "Declarative UI, hooks, state machines, TanStack Router and Tailwind CSS",
      weeks: 4,
      weekRange: "Weeks 8–11",
      weeksList: [8, 9, 10, 11],
      weeklyContent: [
        {
          id: "fe-w8",
          weekNumber: 8,
          title: "React 19 Foundations: JSX, Components & Props",
          summary: "Think in React: breakdown UI into reusable declarative components, master JSX, props, and initial state.",
          topics: [
            "Declarative UI vs Imperative DOM manipulation",
            "JSX syntax, fragments, and conditional rendering",
            "Component hierarchy, props passing, and children props",
            "useState hook fundamentals and state immutability",
          ],
          handsOn: "Build a Modular E-Commerce Product Catalog with cart counter and price filter controls.",
          deliverable: "React component library with reusable Card, Badge, Button, and Rating components.",
          estimatedHours: 12,
          tasks: [
            "Deconstruct a mock UI into a clean tree of atomic components",
            "Pass functions as props to handle user clicks and interactions",
            "Update array and object state immutably using the spread operator",
            "Implement conditional empty states when search returns zero products",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
          youtubeTitle: "freeCodeCamp: React Course for Beginners - Learn React & Hooks",
          resources: [
          {
                    name: "React.dev: Thinking in React Tutorial",
                    url: "https://react.dev/learn/thinking-in-react",
                    type: "docs"
          },
          {
                    name: "Epic React by Kent C. Dodds",
                    url: "https://epicreact.dev/",
                    type: "guide"
          },
          {
                    name: "Scrimba: Learn React Free Interactive Course",
                    url: "https://scrimba.com/learn/learnreact",
                    type: "practice"
          }
],
        },
        {
          id: "fe-w9",
          weekNumber: 9,
          title: "React Hooks, Effects & Custom Hook Design",
          summary: "Master useEffect lifecycle, synchronization, useRef DOM escapes, and encapsulate reusable logic into custom hooks.",
          topics: [
            "useEffect dependencies, lifecycle sync, and cleanup functions",
            "useRef for DOM referencing and mutable instance variables",
            "useMemo and useCallback optimization primitives",
            "Building custom hooks (useLocalStorage, useDebounce, useWindowSize)",
          ],
          handsOn: "Build a GitHub User Search & Analytics Explorer with custom caching hooks.",
          deliverable: "React application powered by 3 custom hooks that debounce queries and cache results.",
          estimatedHours: 12,
          tasks: [
            "Implement proper cleanup in useEffect to abort in-flight fetch requests",
            "Write a reusable useLocalStorage hook with JSON sync",
            "Write a useDebounce hook to prevent excessive search API requests",
            "Benchmark re-renders using the React DevTools Profiler",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=LlvBzyy-558",
          youtubeTitle: "Web Dev Simplified: Learn All React Hooks in One Video",
          resources: [
          {
                    name: "React.dev: Synchronizing with Effects",
                    url: "https://react.dev/learn/synchronizing-with-effects",
                    type: "docs"
          },
          {
                    name: "useHooks: Collection of Modern React Hooks",
                    url: "https://usehooks.com/",
                    type: "guide"
          },
          {
                    name: "Jack Herrington: React Hooks Deep Dive",
                    url: "https://www.youtube.com/watch?v=LlvBzyy-558",
                    type: "video"
          }
],
        },
        {
          id: "fe-w10",
          weekNumber: 10,
          title: "Server State with TanStack Query & Context",
          summary: "Eliminate manual fetch boilerplate: query caching, background refetching, mutations, and global UI Context.",
          topics: [
            "Client state vs Server state management",
            "TanStack Query (React Query): useQuery, useMutation, queryClient",
            "Automatic caching, stale-while-revalidate, and retry policies",
            "React Context API for global user session and theme preferences",
          ],
          handsOn: "Build a Collaborative Bookmark & Notes Manager with optimistic UI updates.",
          deliverable: "Full CRUD React app with automatic background refetching and instant optimistic feedback.",
          estimatedHours: 14,
          tasks: [
            "Configure QueryClient with customized staleTime and cacheTime",
            "Implement optimistic UI updates for instant 'Like' and 'Delete' feedback",
            "Combine React Context with useReducer for complex multi-step modal state",
            "Handle loading, error, and refetch states with polished visual feedback",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=novnyCaa7To",
          youtubeTitle: "Cosden Solutions: TanStack React Query V5 Crash Course",
          resources: [
          {
                    name: "TanStack Query Official Documentation",
                    url: "https://tanstack.com/query/latest",
                    type: "docs"
          },
          {
                    name: "TkDodo's Practical React Query Blog Series",
                    url: "https://tkdodo.eu/blog/practical-react-query",
                    type: "guide"
          },
          {
                    name: "Frontend Masters: React Query in Depth",
                    url: "https://www.youtube.com/watch?v=novnyCaa7To",
                    type: "video"
          }
],
        },
        {
          id: "fe-w11",
          weekNumber: 11,
          title: "Routing, Tailwind CSS & Component Systems (shadcn/ui)",
          summary: "Integrate production routing, client-side URL params, Tailwind CSS utility architecture, and Radix UI primitives.",
          topics: [
            "Modern routing (TanStack Router / React Router): routes, loaders, layout outlets",
            "URL search parameters (?query=) for shareable filter state",
            "Tailwind CSS v4 design tokens, clsx, and tailwind-merge (cn utility)",
            "Radix UI primitives and accessible UI patterns (shadcn/ui)",
          ],
          handsOn: "Build an Airbnb-style Property Booking Explorer with filtering, pagination, and detail routes.",
          deliverable: "Multi-page interactive application with bookmarkable search URLs and accessible dialogs/drawers.",
          estimatedHours: 14,
          tasks: [
            "Set up nested route layouts with persistent navigation headers and sidebars",
            "Synchronize search query, category, and page number with URL search params",
            "Integrate accessible Radix Dialog, DropdownMenu, and Tabs components",
            "Style responsive layouts using Tailwind CSS custom tokens and dark mode",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=ft30zcMlFao",
          youtubeTitle: "freeCodeCamp: Tailwind CSS Tutorial for Beginners - Full Course",
          resources: [
          {
                    name: "TanStack Router Documentation",
                    url: "https://tanstack.com/router/latest",
                    type: "docs"
          },
          {
                    name: "Tailwind CSS Official Documentation",
                    url: "https://tailwindcss.com/docs",
                    type: "docs"
          },
          {
                    name: "shadcn/ui Component Catalog",
                    url: "https://ui.shadcn.com/",
                    type: "practice"
          }
],
        },
      ],
    },
    {
      id: "fe-r4",
      phase: "Job ready",
      title: "Full-Stack Web Capstone & Next.js",
      detail: "Fullstack architecture, authentication, database integration and production polish",
      weeks: 3,
      weekRange: "Weeks 12–14",
      weeksList: [12, 13, 14],
      weeklyContent: [
        {
          id: "fe-w12",
          weekNumber: 12,
          title: "Full-Stack Next.js / Server Functions & Database Integration",
          summary: "Build fullstack web applications: server rendering, server functions/actions, and connecting to PostgreSQL.",
          topics: [
            "Server Components vs Client Components architecture",
            "Server Actions & API Route handlers",
            "Connecting to PostgreSQL with an ORM (Prisma / Drizzle)",
            "Environment variables and secrets security",
          ],
          handsOn: "Develop the backend API and database schemas for a Developer Community Forum platform.",
          deliverable: "Deployed database with seed scripts and type-safe server queries.",
          estimatedHours: 12,
          tasks: [
            "Set up a free cloud PostgreSQL database (Neon or Supabase)",
            "Define relational schemas with foreign key relationships for Users, Posts, and Comments",
            "Implement type-safe Server Actions with Zod input validation",
            "Audit database query response latency under concurrent requests",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=843NEC97214",
          youtubeTitle: "freeCodeCamp: Next.js Full Stack Web Development Course",
          resources: [
          {
                    name: "Next.js Official Learn Course",
                    url: "https://nextjs.org/learn",
                    type: "guide"
          },
          {
                    name: "Prisma ORM Getting Started Guide",
                    url: "https://www.prisma.io/docs",
                    type: "docs"
          },
          {
                    name: "Neon Serverless Postgres Documentation",
                    url: "https://neon.tech/docs",
                    type: "docs"
          }
],
        },
        {
          id: "fe-w13",
          weekNumber: 13,
          title: "Authentication, Payments & Full-Stack Capstone Build",
          summary: "Implement user authentication, protected routes, third-party payment integration (Stripe), and complete the capstone.",
          topics: [
            "User Authentication (JWT, sessions, OAuth Google/GitHub)",
            "Role-based access control and protected routes",
            "Stripe payment checkout flows & webhook listeners",
            "Form validation with React Hook Form and Zod",
          ],
          handsOn: "Complete the full-stack capstone SaaS project with user login, dashboard, and paid subscription checkout.",
          deliverable: "End-to-end working web application with authenticated dashboards and live Stripe test checkout.",
          estimatedHours: 15,
          tasks: [
            "Implement OAuth login and secure session storage",
            "Protect dashboard and settings routes from unauthenticated access",
            "Integrate Stripe Checkout and verify webhook signatures",
            "Perform end-to-end user checkout flows in staging environment",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=wN4cQ_JzRsc",
          youtubeTitle: "Web Dev Simplified: How to Accept Payments with Stripe - Full Tutorial",
          resources: [
          {
                    name: "Auth.js (NextAuth) Documentation",
                    url: "https://authjs.dev/",
                    type: "docs"
          },
          {
                    name: "Stripe Developer Documentation: Checkout",
                    url: "https://stripe.com/docs/payments/checkout",
                    type: "docs"
          },
          {
                    name: "Zod Schema Validation Library",
                    url: "https://zod.dev/",
                    type: "guide"
          }
],
        },
        {
          id: "fe-w14",
          weekNumber: 14,
          title: "Performance Optimization, Testing & CI/CD",
          summary: "Optimize Core Web Vitals, write automated component tests with Vitest, and configure automated GitHub Actions.",
          topics: [
            "Core Web Vitals: LCP, CLS, INP optimization",
            "Unit & Component Testing with Vitest and React Testing Library",
            "Automated CI/CD pipelines with GitHub Actions",
            "Production monitoring and error logging (Sentry)",
          ],
          handsOn: "Test, benchmark, and deploy your production capstone application with CI/CD checks.",
          deliverable: "Production deployment with passing automated test suite, 98+ Lighthouse scores, and CI badge.",
          estimatedHours: 12,
          tasks: [
            "Write 10 component tests checking user interactions and error states",
            "Set up a GitHub Actions workflow that runs linter and tests on every pull request",
            "Optimize bundle size with dynamic imports and image compression",
            "Achieve green scores across all Core Web Vitals in Chrome DevTools",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=7f-71kYhK00",
          youtubeTitle: "Jack Herrington: React Unit Testing with Vitest and Testing Library",
          resources: [
          {
                    name: "Vitest Official Guide",
                    url: "https://vitest.dev/guide/",
                    type: "docs"
          },
          {
                    name: "Testing Library Best Practices",
                    url: "https://testing-library.com/docs/react-testing-library/intro/",
                    type: "guide"
          },
          {
                    name: "Web.dev: Optimizing Core Web Vitals",
                    url: "https://web.dev/explore/vitals",
                    type: "guide"
          }
],
        },
      ],
    },
    {
      id: "fe-r5",
      phase: "Job ready",
      title: "Portfolio, Interviews & Career Launch",
      detail: "Developer portfolio website, technical interviews, LeetCode algorithms and job search",
      weeks: 2,
      weekRange: "Weeks 15–16",
      weeksList: [15, 16],
      weeklyContent: [
        {
          id: "fe-w15",
          weekNumber: 15,
          title: "Developer Portfolio, Resume & Personal Brand",
          summary: "Build an unforgettable developer portfolio showcase, craft a targeted tech resume, and optimize your online presence.",
          topics: [
            "Designing a minimalist, high-converting developer portfolio",
            "Writing high-impact project case studies (Architecture, Challenges, Solutions)",
            "ATS resume engineering tailored for Frontend/Fullstack roles",
            "GitHub profile customization and README documentation polish",
          ],
          handsOn: "Design, code, and deploy your personal portfolio site showcasing your 3 best live projects.",
          deliverable: "Live portfolio domain, ATS-ready PDF resume, and public GitHub profile showcasing active commits.",
          estimatedHours: 10,
          tasks: [
            "Code your personal portfolio website with project case studies and live demo links",
            "Write README files for each project with architectural diagrams and demo GIFs",
            "Format resume with Google XYZ bullets highlighting performance gains and metrics",
            "Share your portfolio on LinkedIn and developer communities for peer review",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=27JtRAI3QO8",
          youtubeTitle: "Kevin Powell: How to Build a Modern Developer Portfolio Website",
          resources: [
          {
                    name: "Brittany Chiang: Inspiring Developer Portfolios",
                    url: "https://brittanychiang.com/",
                    type: "guide"
          },
          {
                    name: "Tech Interview Handbook: Resume Templates",
                    url: "https://www.techinterviewhandbook.org/resume/",
                    type: "guide"
          },
          {
                    name: "GitHub Profile README Generator",
                    url: "https://rahuldkjain.github.io/gh-profile-readme-generator/",
                    type: "practice"
          }
],
        },
        {
          id: "fe-w16",
          weekNumber: 16,
          title: "Frontend Technical Interviews & Live Coding Practice",
          summary: "Ace frontend technical interviews: JS coding challenges, React architecture questions, and behavioral rounds.",
          topics: [
            "JavaScript coding challenges (Polyfills, debounce, memoize, flatten)",
            "React system design & architecture questions (e.g. 'Design an infinite scroll feed')",
            "Web performance, security (CORS, XSS, CSRF), and browser internals",
            "Behavioral interview STAR stories and salary negotiation strategies",
          ],
          handsOn: "Complete 3 simulated live frontend coding interviews and submit 15 job applications.",
          deliverable: "Interview preparation cheat sheet with code snippets and tracked job application submissions.",
          estimatedHours: 14,
          tasks: [
            "Implement Array.prototype.flat and Array.prototype.reduce from scratch",
            "Practice designing a component library architecture in a 30-minute mock session",
            "Prepare 5 STAR stories focusing on technical disagreements and overcoming complex bugs",
            "Submit 15 customized applications for Junior/Associate Frontend Developer openings",
          ],
          youtubeUrl: "https://www.youtube.com/watch?v=17XpDauv524",
          youtubeTitle: "Clément Mihailescu: Frontend Mock Interview (React & JavaScript)",
          resources: [
          {
                    name: "GreatFrontEnd: Frontend Interview Practice",
                    url: "https://www.greatfrontend.com/",
                    type: "practice"
          },
          {
                    name: "Frontend Interview Handbook",
                    url: "https://www.frontendinterviewhandbook.com/",
                    type: "guide"
          },
          {
                    name: "BFE.dev (BigFrontend.dev Coding Challenges)",
                    url: "https://bigfrontend.dev/",
                    type: "practice"
          }
],
        },
      ],
    },
  ],
};

export const CAREER_ROADMAPS: Record<string, RoadmapMilestone[]> = {
  ...BASE_ROADMAPS,
  ...ADDITIONAL_ROLE_ROADMAPS,
  ...EXTENDED_ROLE_ROADMAPS,
  // Role mappings for related specialties
  "backend-engineer": ADDITIONAL_ROLE_ROADMAPS["software-developer"] || BASE_ROADMAPS["web-developer"],
  "data-scientist": ADDITIONAL_ROLE_ROADMAPS["ai-ml-engineer"] || BASE_ROADMAPS["data-analyst"],
  "java-enterprise-dev": ADDITIONAL_ROLE_ROADMAPS["software-developer"] || ADDITIONAL_ROLE_ROADMAPS["fullstack-developer"],
  "db-admin": BASE_ROADMAPS["data-analyst"],
  "qa-automation-engineer": ADDITIONAL_ROLE_ROADMAPS["software-developer"] || ADDITIONAL_ROLE_ROADMAPS["fullstack-developer"],
  "it-project-manager": ADDITIONAL_ROLE_ROADMAPS["product-manager"] || ADDITIONAL_ROLE_ROADMAPS["business-analyst"],
  "growth-marketing-manager": ADDITIONAL_ROLE_ROADMAPS["product-manager"] || ADDITIONAL_ROLE_ROADMAPS["business-analyst"],
};

export function getRoadmapForCareer(careerId: string): RoadmapMilestone[] {
  if (CAREER_ROADMAPS[careerId] && CAREER_ROADMAPS[careerId].length > 0) {
    return CAREER_ROADMAPS[careerId];
  }
  return CAREER_ROADMAPS["data-analyst"] || [];
}

export const ROADMAP: RoadmapMilestone[] = CAREER_ROADMAPS["data-analyst"] || [];

