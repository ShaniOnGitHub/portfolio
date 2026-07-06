export type JourneyEntry = {
  year: string;
  narrative: string;
  mockups: { title: string; caption: string }[];
  achievements: string[];
};

export const journeyEntries: JourneyEntry[] = [
  {
    year: "2026",
    narrative:
      "This has been the busiest stretch yet. I'm finishing my final year of Software Engineering at SZABIST while co-running two companies. I completed the Final Defense for SmartExam, an AI-assisted exam proctoring platform, where I owned the Student Portal and Notifications modules. Alongside that, I've been building out DentraFlow: an AI receptionist product for UK dental clinics, handling GTM and cold outreach. I also picked up the IBM RAG and Agentic AI Certified Professional Course to sharpen the technical side of what I'm building.",
    mockups: [
      { title: "SmartExam", caption: "Student portal · proctoring live" },
      { title: "DentraFlow", caption: "AI receptionist · UK dental clinics" },
    ],
    achievements: [
      "Completed FYP-I Final Defense: SmartExam",
      "Co-founded DentraFlow (AI receptionist for UK dental clinics)",
      "IBM RAG and Agentic AI Certified Professional Course",
    ],
  },
  {
    year: "2025",
    narrative:
      "This is where I started pointing my content and community skills toward something more technical. I worked as a Prompt Engineer at Retrax, engineering prompt systems to automate content creation workflows. I also co-founded Frequenzy, an events company here in Islamabad. Behind the scenes, I started teaching myself the AI automation stack: FastAPI, PostgreSQL, vector databases, because I wanted to be able to build the systems I kept pitching to clients, not just sell them.",
    mockups: [
      { title: "Script analytics", caption: "Retention curves · viral hooks" },
      { title: "Early automations", caption: "FastAPI · pgvector" },
    ],
    achievements: [
      "Wrote viral short-form scripts for creators",
      "Worked as a Prompt Engineer at Retrax, automating content creation workflows",
      "Co-founded Frequenzy (events company)",
      "Started building AI automation systems (FastAPI, PostgreSQL/pgvector)",
    ],
  },

  {
    year: "2024",
    narrative:
      "This is the year I stepped into community leadership. I became Social Media Lead at GDG on Campus SZABIST, running content strategy and growth for the chapter: turning technical events into content people actually wanted to see, not just another poster in a group chat. It was my first real bridge between content skills and the developer world, and it planted the seed for everything I'd build technically a year later.",
    mockups: [
      { title: "GDG content", caption: "Event poster / social content sample" },
      { title: "Community event", caption: "Event & community photo" },
    ],
    achievements: [
      "Became Social Media Lead: GDG on Campus SZABIST",
      "Ran content strategy for chapter events and community growth",
      "First direct exposure to the developer/tech community ecosystem",
    ],
  },
  {
    year: "2023",
    narrative:
      "Before the AI pivot, this was all content and events. I was deep into scriptwriting, social strategy, and production: helping run event coverage and learning what actually makes people stop scrolling. This foundation is still the reason I can talk to both engineers and clients without sounding like I'm reading from two different scripts.",
    mockups: [
      { title: "Live events", caption: "Coverage & production" },
      { title: "Social strategy", caption: "Hooks that stop scrolls" },
    ],
    achievements: [
      "Built foundation in scriptwriting and social media strategy",
      "Produced and promoted live events",
      "Developed early content-to-community growth playbook",
    ],
  },
  {
    year: "2021–2022",
    narrative:
      "This is where it actually started. Long before AI or startups, I was just obsessed with content: figuring out why some posts took off and others didn't. I started building an online community from zero, learning social strategy by trial and error, and slowly grew it past 1,000 members organically, with no ad spend, just consistent posting and understanding what people actually wanted to engage with. It was messy and slow, but it's the reason I understand audiences before I understand algorithms.",
    mockups: [{ title: "Community growth", caption: "0 → 1,000+ organically" }],
    achievements: [
      "Grew online community from 0 to 1,000+ members organically",
      "Learned content strategy and audience psychology through direct trial and error",
      "Laid the foundation for everything that came after: content, sales, and eventually AI",
    ],
  },
];
