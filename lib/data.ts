export const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const

export const EMAIL = 'avanishverma4@gmail.com'
export const BEHANCE_URL = 'https://www.behance.net/avanishverma4'

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/awanish-verma/' },
  { label: 'Behance', href: 'https://www.behance.net/avanishverma4' },
  { label: 'GitHub', href: 'https://github.com/avanishverma4/' },
  { label: 'Instagram', href: 'https://www.instagram.com/avanishverma4/' },
] as const

export type ProjectSize = 'featured' | 'small'

export interface Project {
  id: number
  title: string
  tags: readonly string[]
  description: string
  size: ProjectSize
  /** Unsplash image URL for the card background */
  image: string
  /** Direct link to the project (Behance gallery or live URL) */
  link: string
}

// All images: images.unsplash.com — cropped 800×600, q80
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'XpertOnline Chatbot',
    tags: ['UI/UX', 'AI'],
    description:
      'A sophisticated AI-driven chatbot interface for seamless customer interaction and support.',
    size: 'featured',
    image: u('1531746790731-6c087fecd65a'),
    link: 'https://www.behance.net/gallery/231083459/XpertOnline-Chatbot',
  },
  {
    id: 2,
    title: 'Water Drink Reminder',
    tags: ['Mobile App', 'Health Tech'],
    description:
      'A health-focused mobile application designed to help users maintain optimal hydration levels.',
    size: 'small',
    image: u('1548839140-29a749e1cf4d'),
    link: 'https://www.behance.net/gallery/207598711/Water-Drink-Reminder-App',
  },
  {
    id: 3,
    title: 'Gmail App Redesign',
    tags: ['Redesign', 'Productivity'],
    description:
      'A conceptual redesign of the Gmail mobile experience focusing on productivity and clarity.',
    size: 'small',
    image: u('1596526131083-e8c633c948d2'),
    link: 'https://www.behance.net/gallery/198481573/Gmail-App-Redesign',
  },
  {
    id: 4,
    title: 'Amazon App Redesign',
    tags: ['E-commerce', 'UX Design'],
    description:
      'Enhancing the shopping experience through a more intuitive and visually cohesive interface.',
    size: 'small',
    image: u('1607082348824-0a96f2a4b9da'),
    link: 'https://www.behance.net/gallery/178536371/Amazon-App-Redesign',
  },
  {
    id: 5,
    title: 'Plant App UX Process',
    tags: ['UX Process', 'Case Study'],
    description:
      'A comprehensive look at the UX design process for a plant care and identification app.',
    size: 'small',
    image: u('1416879595882-3373a0480b5b'),
    link: 'https://www.behance.net/gallery/178415273/Plant-App-UX-Design-Process',
  },
  {
    id: 6,
    title: 'Apple Dynamic Island',
    tags: ['Interaction Design', 'iOS'],
    description:
      'Exploring the possibilities of the Dynamic Island for enhanced user interaction.',
    size: 'small',
    image: u('1512941937669-90a1b58e7e9c'),
    link: 'https://www.behance.net/gallery/152365249/Apple-Dynamic-Island',
  },
  {
    id: 7,
    title: 'Patient Management System',
    tags: ['Healthtech', 'Enterprise'],
    description:
      'A data-driven platform designed to optimize clinical workflows and enhance patient-provider communication.',
    size: 'featured',
    image: u('1576091160399-112ba8d25d1d'),
    link: 'https://www.behance.net/gallery/221640093/Doctor-Patient-Management-App',
  },
  {
    id: 8,
    title: 'Moment Insurance Platform',
    tags: ['Product Design', 'Fintech'],
    description:
      'Modernizing legacy insurance structures with a streamlined, modular interface that empowers users.',
    size: 'small',
    image: u('1554224155-6726b3ff858f'),
    link: 'https://www.momentum.co.za/',
  },
  {
    id: 9,
    title: 'Academy of Dental Excellence',
    tags: ['E-Learning', 'Platform Design'],
    description:
      'A premium educational portal for medical professionals, featuring integrated LMS and webinar capabilities.',
    size: 'small',
    image: u('1606811841689-23dfddce3e95'),
    link: 'https://dentalexcellence.academy/prelogin/',
  },
  {
    id: 10,
    title: 'Secure Password Utility',
    tags: ['Tooling', 'Security'],
    description:
      'A minimalist utility focused on cryptographic security and zero-clutter interface design.',
    size: 'small',
    image: u('1526374965328-7f61d4dc18c5'),
    link: 'https://random-password-generator-eight-xi.vercel.app/',
  },
]

export interface Experience {
  role: string
  company: string
  location: string
  period: string
  description: string
}

export const EXPERIENCES: Experience[] = [
  {
    role: 'Senior UI/UX Designer',
    company: 'Acadlog',
    location: 'Patna, India',
    period: 'Present',
    description:
      'Leading the design strategy for educational products, focusing on user-centric interfaces and scalable design systems.',
  },
  {
    role: 'Graphic Designer',
    company: 'i2i TeleSolutions & Telemedicine',
    location: 'India',
    period: 'Apr 2018 – Oct 2023',
    description:
      'Crafted visual identities and digital assets for telemedicine platforms, improving brand consistency and user engagement.',
  },
  {
    role: 'Freelance Designer',
    company: 'Self-employed',
    location: 'Bangalore, India',
    period: 'Dec 2017 – Apr 2018',
    description:
      'Collaborating with diverse clients to deliver high-fidelity prototypes and graphic design solutions.',
  },
  {
    role: 'Visual Designer',
    company: 'Skanda Graphics',
    location: 'India',
    period: 'Sep 2015 – Dec 2017',
    description:
      'Executed end-to-end branding and communication projects for enterprise clients. Optimized creative workflows, reducing project turnaround time by ~40%.',
  },
]

export const SKILLS = [
  'UI/UX Design',
  'Product Strategy',
  'Design Systems',
  'Prototyping',
  'User Research',
  'Graphic Design',
  'Frontend Development',
  'Video Editing',
] as const
