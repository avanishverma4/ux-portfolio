export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  category: 'UI/UX & Product Design' | 'Design Systems & Tokens' | 'Interactive Prototypes' | 'Mobile & Web Apps';
  featured: boolean;
  coverImage: string;
  galleryImages: string[];
  impactMetric: string;
  description: string;
  overview: string;
  architecture: string;
  keyFeatures: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface SkillCategory {
  category: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0-100
    experienceYears: number;
    highlight?: string;
  }[];
}

export interface Education {
  id: string;
  qualification: string;
  institution: string;
  location: string;
  period: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  /** Optional headshot. Without one the section renders a typographic monogram
      rather than attaching an unrelated stock photo to a named person. */
  avatar?: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Awanish Verma",
    title: "Senior Lead UI/UX Designer & Design Systems Architect",
    shortBio: "Crafting intuitive product experiences, pixel-perfect design systems, user-centric interfaces, and high-fidelity interactive prototypes.",
    longBio: "I am a Lead UI/UX Designer & Design Systems Architect passionate about transforming complex problem spaces into elegant, intuitive, and human-centered digital products. With over 7 years of experience spanning user research, interaction design, design token architectures, visual design systems, and frontend implementation, I craft end-to-end solutions that delight users and drive measurable business metrics.",
    location: "Bengaluru, India / Remote Worldwide",
    availability: "Available for Product Design Contracts & UI/UX Design System Advisory",
    email: "avanishverma4@gmail.com",
    github: "https://github.com/avanishverma4",
    linkedin: "https://linkedin.com/in/awanish-verma",
    behance: "https://behance.net/avanishverma4",
    instagram: "https://www.instagram.com/avanishverma4",
    stats: [
      { label: "Years Experience", value: "7+" },
      { label: "UI/UX & Systems Built", value: "24+" },
      { label: "User Testing Studies", value: "150+" },
      { label: "Design Token Systems", value: "14+" },
    ]
  },

  projects: [
    {
      id: "project-1",
      title: "XpertOnline Chatbot",
      slug: "xpertonline-chatbot",
      tagline: "AI-powered conversational assistant UI/UX design with intuitive chat flow and smart intent architecture.",
      category: "UI/UX & Product Design",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1762330465857-07e4c81c0dfa?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1762330465857-07e4c81c0dfa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1762328862557-e0a36587cd3c?auto=format&fit=crop&w=1200&q=80"
      ],
      impactMetric: "🤖 +60% increase in user engagement & conversational task completion",
      description: "End-to-end UI/UX design case study for an intelligent conversational AI chatbot interface, optimizing response legibility, prompt quick-actions, and multi-turn dialogue UX.",
      overview: "Designed and prototyped XpertOnline Chatbot to streamline automated support and AI assistance. Focused on reducing friction in complex workflows, designing visual state indicators for streaming responses, and creating intuitive follow-up prompts.",
      architecture: "User Flow Mapping, Figma Interactive Components, Conversation UI Patterns, Design Tokens, Accessibility Contrast Validation.",
      keyFeatures: [
        "Conversational UI with dynamic typing states and structured response cards",
        "Contextual quick-action prompts and intent-based suggestion pills",
        "Accessible dark & light themes optimized for prolonged screen reading",
        "Handoff architecture with comprehensive Figma component states"
      ],
      techStack: ["UI/UX Design", "Figma", "Conversational UX", "User Research", "Interaction Design"],
      liveUrl: "https://www.behance.net/gallery/231083459/XpertOnline-Chatbot"
    },
    {
      id: "project-2",
      title: "Water Drink Reminder App",
      slug: "water-drink-reminder-app",
      tagline: "Intuitive hydration tracking mobile UI/UX with habit-forming visual micro-interactions and smart goals.",
      category: "Mobile & Web Apps",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1548780607-46c78f38182d?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1548780607-46c78f38182d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1529079337819-f6d0024bd364?auto=format&fit=crop&w=1200&q=80"
      ],
      impactMetric: "💧 4.8★ user satisfaction with +40% daily hydration consistency",
      description: "A user-centric mobile app design focused on daily hydration tracking, subtle gamification, liquid progress animations, and timely notification ergonomics.",
      overview: "Crafted to help users maintain healthy hydration habits through minimal interaction effort. Features fluid wave animations, customizable daily goals based on personal metrics, and seamless logging with one-tap shortcuts.",
      architecture: "Mobile First UX, Figma Smart Animate, Habit Loop Psychology, Custom Iconography & Liquid Wave UI Animations.",
      keyFeatures: [
        "One-tap quick intake logging with custom vessel volume presets",
        "Fluid visual hydration gauge with real-time wave animation feedback",
        "Smart adaptive reminder notifications based on daily user activity routines",
        "Weekly and monthly habit analytics charts with goal progress milestones"
      ],
      techStack: ["Mobile UI/UX", "Figma", "Habit Design", "Prototyping", "Micro-interactions"],
      liveUrl: "https://www.behance.net/gallery/207598711/Water-Drink-Reminder-App"
    },
    {
      id: "project-3",
      title: "Plant App UX Design Process",
      slug: "plant-app-ux-design-process",
      tagline: "Comprehensive end-to-end UX research, wireframing, and UI design process for plant care & identification.",
      category: "UI/UX & Product Design",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1637311252429-634d760e08b2?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1637311252429-634d760e08b2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=80"
      ],
      impactMetric: "🌱 Complete UX case study with 100% positive user usability feedback",
      description: "A deep-dive product design case study detailing user interviews, competitive analysis, persona creation, wireframing, and visual UI design for plant enthusiasts.",
      overview: "Documented the complete UX design lifecycle for a plant care assistant app. From discovering user pain points around over-watering to building plant diagnosis visual flows and tailored sunlight schedules.",
      architecture: "User Research, Empathy Maps, Persona Mapping, Low-Fi & High-Fi Wireframes, Figma Interactive Prototypes, Design System.",
      keyFeatures: [
        "AI photo-scan camera interface for instant botanical identification",
        "Custom watering & sunlight schedule reminders tailored to plant species",
        "Step-by-step diagnostic flows for troubleshooting plant health & yellowing leaves",
        "Community botanical marketplace & care tip sharing feed"
      ],
      techStack: ["UX Research", "User Testing", "Figma", "Wireframing", "Information Architecture"],
      liveUrl: "https://www.behance.net/gallery/178415273/Plant-App-UX-Design-Process"
    },
    {
      id: "project-4",
      title: "Doctor-Patient Management App",
      slug: "doctor-patient-management-app",
      tagline: "Healthcare platform UI/UX connecting doctors and patients with streamlined appointment booking & EHR.",
      category: "UI/UX & Product Design",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1758691463620-188ca7c1a04f?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1758691463620-188ca7c1a04f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
      ],
      impactMetric: "🩺 Reduced appointment booking time by 65% across clinical tests",
      description: "A comprehensive healthcare UI/UX case study featuring dual-role interfaces for medical professionals and patients, electronic health record (EHR) management, and telehealth consultations.",
      overview: "Designed to bridge communication between healthcare providers and patients. Focused on high legibility, HIPAA-compliant design patterns, empathetic color palettes, and clear appointment scheduling workflows.",
      architecture: "Healthcare UX Patterns, Figma Wireframing, Dual Persona Architecture, Accessible Medical Dashboards.",
      keyFeatures: [
        "Patient portal for friction-free specialist search and instant slot booking",
        "Doctor clinical dashboard with patient vitals, medical history & prescription generator",
        "Secure video consultation call interface with real-time note-taking",
        "Lab report viewer with intuitive chart visualizations of health parameters"
      ],
      techStack: ["Healthcare UI/UX", "Figma", "Product Design", "Design Systems", "User Research"],
      liveUrl: "https://www.behance.net/gallery/221640093/Doctor-Patient-Management-App"
    },
    {
      id: "project-5",
      title: "Academy of Dental Excellence",
      slug: "academy-of-dental-excellence",
      tagline: "Premier dental education web platform featuring course enrollment, clinical masterclasses, and student portal.",
      category: "Mobile & Web Apps",
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=80"
      ],
      impactMetric: "🎓 Live production platform powering advanced dental masterclasses worldwide",
      description: "A production web platform designed for dental practitioners offering advanced hands-on workshops, online certification courses, and clinical resource downloads.",
      overview: "Designed and developed the digital presence for Academy of Dental Excellence. Created an elegant, high-trust visual aesthetic, responsive course catalogs, and seamless event registration.",
      architecture: "Web Architecture, UI/UX Design, Responsive Layouts, SEO Optimization, Conversion Design.",
      keyFeatures: [
        "Interactive course catalog with filtering by specialty (Endodontics, Implantology, Aesthetics)",
        "Seamless workshop registration and secure payment checkout integration",
        "Video masterclass streaming interface with downloadable lecture notes",
        "Faculty & speaker showcase with clinical credentials and past workshop galleries"
      ],
      techStack: ["UI/UX Design", "Web Development", "Product Design", "Tailwind CSS", "Responsive Design"],
      liveUrl: "https://dentalexcellence.academy/"
    },
    {
      id: "project-6",
      title: "Password Generator",
      slug: "password-generator",
      tagline: "Sleek, customizable strong password generator tool with real-time entropy calculation and instant copy.",
      category: "Interactive Prototypes",
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1614064548237-096f735f344f?auto=format&fit=crop&w=1200&q=80"
      ],
      impactMetric: "🔐 Instant sub-millisecond cryptographic password generation",
      description: "A modern web application utility designed for maximum privacy, live password strength analytics, custom character parameters, and copy-to-clipboard interactions.",
      overview: "Built to demonstrate micro-interaction polish, accessible control elements, dark mode visual aesthetic, and client-side cryptographic security.",
      architecture: "React, TypeScript, Web Crypto API, Tailwind CSS, Motion animations.",
      keyFeatures: [
        "Configurable length sliders with real-time visual strength meter",
        "Toggle options for uppercase, lowercase, numbers, and special symbols",
        "Client-side cryptographic randomness using window.crypto.getRandomValues",
        "One-click copy feedback with smooth entry/exit toast notifications"
      ],
      techStack: ["React", "TypeScript", "Tailwind CSS", "Web Crypto API", "UI Design"],
      liveUrl: "https://random-password-generator-eight-xi.vercel.app/"
    },
    {
      id: "project-7",
      title: "Jumblefix",
      slug: "jumblefix",
      tagline: "Fast, interactive web tool for solving and unjumbling word puzzles with clean, responsive UI.",
      category: "Interactive Prototypes",
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1642406415849-a410b5d01a94?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1642406415849-a410b5d01a94?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1583334648584-6c2ba1fb41cd?auto=format&fit=crop&w=1200&q=80"
      ],
      impactMetric: "⚡ Sub-10ms instant anagram solving algorithm",
      description: "A lightweight, highly performant web application for solving anagrams, jumbled words, and word puzzles with an ultra-clean user interface.",
      overview: "Designed and built Jumblefix as a minimal, lightning-fast utility app. Features immediate keyboard focus, real-time query filtering, and smooth UI layout transitions.",
      architecture: "Next.js, TypeScript, Trie / Anagram Algorithm, Tailwind CSS, Vercel.",
      keyFeatures: [
        "Instant anagram solver with length-based result grouping",
        "Clean dark/light theme options with focused input ergonomics",
        "Filter solutions by word length, starting letter, or containing patterns",
        "Sub-second load time and fully mobile-responsive touch layout"
      ],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Algorithms", "UI/UX"],
      liveUrl: "https://jumblefix.vercel.app/"
    }
  ] as Project[],

  experiences: [
    {
      id: "exp-1",
      role: "Senior UI/UX Designer",
      company: "Acadlog",
      location: "Patna, India",
      period: "Oct 2023 – Present",
      current: true,
      description: "Lead product design across a portfolio of EdTech learning platforms, owning UX research, information architecture, design systems, and design-to-code handoff for web and mobile.",
      achievements: [
        "Architected a multi-brand design token system in Figma powering 3 education platforms, cutting new-screen design time by 45% and eliminating handoff inconsistencies between design and engineering.",
        "Led end-to-end UX for the student learning journey — from discovery research through high-fidelity interactive prototypes — increasing course completion rates by 28%.",
        "Conducted 60+ moderated usability sessions and translated findings into interface changes that reduced onboarding drop-off by 35%.",
        "Shipped a WCAG 2.1 AA accessible component library with engineering in React and Tailwind CSS, resolving 100% of critical accessibility audit issues before launch."
      ],
      skills: ["UI/UX Design", "Design Strategy", "Design Systems", "Figma", "User Research", "Accessibility (WCAG 2.1 AA)", "Prototyping"]
    },
    {
      id: "exp-2",
      role: "Graphic Designer",
      company: "i2i TeleSolutions & Telemedicine",
      location: "India",
      period: "Apr 2018 – Oct 2023",
      current: false,
      description: "Owned visual design and UI production for telemedicine and healthtech products, spanning brand identity, patient-facing interfaces, clinical dashboards, and marketing systems.",
      achievements: [
        "Designed 500+ digital and print assets across patient apps, clinical dashboards, and campaigns while sustaining brand consistency at scale.",
        "Rebuilt the product visual identity and UI kit, lifting engagement on core patient-facing screens by 30%.",
        "Standardized reusable UI components and layout templates that cut design turnaround on recurring requests by 50%.",
        "Partnered with clinicians and product managers to translate care workflows into high-legibility, accessible healthcare interfaces."
      ],
      skills: ["Visual Design", "Healthcare UI", "Brand Identity", "UI Production", "Figma", "Adobe Creative Suite"]
    },
    {
      id: "exp-3",
      role: "Freelance Designer",
      company: "Self-employed",
      location: "Bangalore, India",
      period: "Dec 2017 – Apr 2018",
      current: false,
      description: "Delivered end-to-end UI/UX and brand design engagements for startup and SMB clients across web and mobile products.",
      achievements: [
        "Delivered 15+ end-to-end design engagements spanning web, mobile, and brand identity for startup and SMB clients.",
        "Produced high-fidelity interactive prototypes that let clients validate concepts before development, shortening build cycles.",
        "Maintained a 100% on-time delivery record and a majority repeat-client rate through rapid iteration and structured design reviews."
      ],
      skills: ["UI/UX Design", "Interactive Prototyping", "Wireframing", "Brand Design", "Client Collaboration"]
    },
    {
      id: "exp-4",
      role: "Visual Designer",
      company: "Skanda Graphics",
      location: "India",
      period: "Sep 2015 – Dec 2017",
      current: false,
      description: "Executed branding and communication design for enterprise clients, from concept development through print-ready and digital production.",
      achievements: [
        "Executed end-to-end branding and communication campaigns for enterprise clients across 50+ projects.",
        "Streamlined creative workflows with reusable templates and shared asset libraries, reducing project turnaround time by 40%.",
        "Produced print and digital collateral to pixel-accurate brand specifications, earning repeat enterprise engagements."
      ],
      skills: ["Visual Design", "Branding", "Communication Design", "Print & Digital Production", "Adobe Creative Suite"]
    }
  ] as Experience[],

  education: [
    {
      id: "edu-1",
      qualification: "Diploma in Graphics, Web & Animation",
      institution: "MAAC India",
      location: "Bengaluru, India",
      period: "Aug 2014 – Aug 2015"
    }
  ] as Education[],

  certifications: [
    {
      id: "cert-1",
      name: "Google UX Design Professional Certificate",
      issuer: "Google",
      year: "2025"
    },
    {
      id: "cert-2",
      name: "Introduction to Web Development with HTML5, CSS3, and JavaScript",
      issuer: "edX",
      year: "2025"
    },
    {
      id: "cert-3",
      name: "Certified User Experience Specialist",
      issuer: "Mobignosis",
      year: "2020"
    }
  ] as Certification[],

  skillCategories: [
    {
      category: "UI/UX & Product Design",
      iconName: "Palette",
      skills: [
        { name: "Figma & Design Systems", level: 98, experienceYears: 7, highlight: "Auto-Layout, Variables, Component Libraries, Tokens" },
        { name: "User Research & Testing", level: 94, experienceYears: 6, highlight: "User Journeys, Personas, Usability Audits, A/B Testing" },
        { name: "Interaction Design & Wireframes", level: 96, experienceYears: 7, highlight: "Information Architecture, User Flow, Low/High-Fi Prototypes" },
        { name: "Visual Design & Typography", level: 98, experienceYears: 7, highlight: "Fluid Scales, Grid Systems, Color Theory, Editorial Layouts" },
        { name: "Micro-Interactions & Motion", level: 92, experienceYears: 5, highlight: "Framer, Motion Specs, Interactive States, Micro-animations" }
      ]
    },
    {
      category: "Design Systems & Token Architecture",
      iconName: "Layout",
      skills: [
        { name: "Design Token Specification", level: 96, experienceYears: 6, highlight: "W3C Token Standard, Figma Tokens, Multi-Brand Scaling" },
        { name: "Component Library Specs", level: 95, experienceYears: 6, highlight: "Headless UI, Accessible Primitives, Storybook Specs" },
        { name: "Accessibility (WCAG 2.1 AA/AAA)", level: 95, experienceYears: 6, highlight: "Color Contrast, Focus Management, Screen Reader Testing" },
        { name: "Design-to-Code Pipeline", level: 94, experienceYears: 5, highlight: "Figma API, Automated Sync, Token Export, Style Dictionary" }
      ]
    },
    {
      category: "Frontend Implementation (Design-Led)",
      iconName: "Code2",
      skills: [
        { name: "React 19 / Next.js 15", level: 92, experienceYears: 6, highlight: "App Router, Interactive UI Components, Responsive Layouts" },
        { name: "Tailwind CSS v4 & Modern CSS", level: 98, experienceYears: 5, highlight: "CSS Variables, Container Queries, 8pt Grid Systems" },
        { name: "TypeScript & UI State", level: 90, experienceYears: 5, highlight: "Typed Component Props, Clean State Architecture" }
      ]
    }
  ] as SkillCategory[],

  testimonials: [
    {
      id: "test-1",
      quote: "Awanish is an exceptional UI/UX Designer who deeply understands user psychology and design systems. He transformed our complex enterprise platform into an intuitive, elegant product that our users love.",
      author: "Sham Banerji",
      role: "CEO",
      company: "i2i TeleSolutions"
    },
    {
      id: "test-2",
      quote: "Working with Awanish elevated our entire product design standard. His Figma token system and pixel-perfect design specs made our design-to-development handoffs effortless.",
      author: "Rick Singh",
      role: "Cofounder",
      company: "Vendorbay"
    }
  ] as Testimonial[]
};

