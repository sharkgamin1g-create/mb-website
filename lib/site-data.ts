export type NavChild = { label: string; href: string; blurb?: string }
export type NavItem = { label: string; href: string; children?: NavChild[] }

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Construction', href: '/services#construction', blurb: 'Ground-up build and structural delivery' },
      { label: 'Fit-Out & Finishing', href: '/services#fit-out', blurb: 'Concept to final detail' },
      { label: 'Interior Design', href: '/services#interior', blurb: 'Spaces designed for how you live and work' },
      { label: 'Project Management', href: '/services#pm', blurb: 'Precision planning and control' },
      { label: 'Electro-Mechanical', href: '/services#mep', blurb: 'Integrated MEP engineering' },
      { label: 'Technical Support', href: '/services#support', blurb: 'Ongoing maintenance and care' },
    ],
  },
  {
    label: 'Projects',
    href: '/projects',
    children: [
      { label: 'Residential', href: '/projects?category=residential' },
      { label: 'Corporate', href: '/projects?category=corporate' },
      { label: 'Commercial', href: '/projects?category=commercial' },
      { label: 'Hospitality', href: '/projects?category=hospitality' },
      { label: 'Industrial', href: '/projects?category=industrial' },
    ],
  },
  { label: 'AI Design Studio', href: '/ai-studio' },
  { label: 'Instant Quote', href: '/quote' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

export const HERO_SCENES = [
  {
    id: 1,
    lines: ['We build', 'what you', 'imagine.'],
    image: '/images/hero-architecture.png',
  },
  {
    id: 2,
    lines: ['From vision', 'to turnkey.'],
    image: '/images/project-corporate.png',
  },
  {
    id: 3,
    lines: ['Designed for', 'how you live.'],
    image: '/images/project-residential.png',
  },
  {
    id: 4,
    lines: ['Engineered for', 'how you work.'],
    image: '/images/project-hospitality.png',
  },
] as const

export const STATS = [
  { value: 9, suffix: '+', label: 'Years of Experience' },
  { value: 500, suffix: '+', label: 'Clients Served' },
  { value: 320, suffix: '+', label: 'Projects Delivered' },
  { value: 480, suffix: 'K+', label: 'Square Meters Delivered' },
] as const

// Client names referenced from the existing Master Build presence.
export const CLIENTS = [
  'Aramex',
  'Fawry Plus',
  'WE Telecom',
  'Mall of Arabia',
  'Al Mokhtabar Labs',
  'Tecno Group',
  'Islamic Design House',
  'Sparkys',
  'ACC',
  'Opera City',
]

export type Service = {
  id: string
  index: string
  title: string
  description: string
  image: string
}

export const SERVICES: Service[] = [
  {
    id: 'construction',
    index: '01',
    title: 'Construction',
    description:
      'Ground-up structural delivery executed with engineering discipline, rigorous safety and uncompromising quality control.',
    image: '/images/hero-architecture.png',
  },
  {
    id: 'fit-out',
    index: '02',
    title: 'Fit-Out & Finishing',
    description:
      'From concept to final detail, we transform spaces through precise craftsmanship and integrated execution.',
    image: '/images/project-corporate.png',
  },
  {
    id: 'interior',
    index: '03',
    title: 'Interior Design',
    description:
      'Editorial, functional interiors designed around how people actually live and work within a space.',
    image: '/images/project-residential.png',
  },
  {
    id: 'pm',
    index: '04',
    title: 'Project Management',
    description:
      'End-to-end planning, coordination and control that keeps scope, cost and timeline aligned.',
    image: '/images/project-hospitality.png',
  },
  {
    id: 'mep',
    index: '05',
    title: 'Electro-Mechanical Works',
    description:
      'Integrated MEP engineering — power, HVAC, plumbing and systems built to perform for the life of the building.',
    image: '/images/project-commercial.png',
  },
  {
    id: 'support',
    index: '06',
    title: 'Technical Support',
    description:
      'Ongoing maintenance and technical care that protects the value of every space we deliver.',
    image: '/images/about-craft.png',
  },
]

export type ProjectCategory =
  | 'residential'
  | 'corporate'
  | 'commercial'
  | 'hospitality'
  | 'industrial'

export type Project = {
  slug: string
  name: string
  category: ProjectCategory
  location: string
  year: string
  area: string
  scope: string
  summary: string
  description: string
  image: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'fayrouz-resort',
    name: 'Fayrouz Resort',
    category: 'hospitality',
    location: 'Egypt',
    year: '2023',
    area: '18,000 m²',
    scope: 'Construction · Fit-Out · MEP',
    summary: 'A coastal hospitality destination delivered turnkey, from structure to the last finish.',
    description:
      'A full-service resort environment where architecture, interiors and engineering were coordinated as one delivery. Our team managed the build, guest-facing fit-out and integrated electro-mechanical systems to a demanding hospitality standard.',
    image: '/images/project-hospitality.png',
  },
  {
    slug: 'the-jewelry-house',
    name: 'The Jewelry House',
    category: 'commercial',
    location: 'Egypt',
    year: '2022',
    area: '640 m²',
    scope: 'Fit-Out · Interior Design',
    summary: 'A refined retail environment engineered around light, security and material precision.',
    description:
      'A boutique retail concept demanding exceptional finish quality and bespoke detailing. We delivered the interior design and fit-out with millimeter tolerances across custom joinery, lighting and display systems.',
    image: '/images/project-commercial.png',
  },
  {
    slug: 'aramex',
    name: 'Aramex',
    category: 'corporate',
    location: 'Egypt',
    year: '2023',
    area: '2,400 m²',
    scope: 'Fit-Out · MEP · Project Management',
    summary: 'A corporate workplace built for operational flow and brand expression.',
    description:
      'A headquarters fit-out balancing open collaboration zones with focused work areas. We managed scope, budget and timeline end to end, integrating MEP systems for a high-performance workplace.',
    image: '/images/project-corporate.png',
  },
  {
    slug: 'opera-city',
    name: 'Opera City',
    category: 'residential',
    location: 'Egypt',
    year: '2021',
    area: '12,500 m²',
    scope: 'Construction · Fit-Out',
    summary: 'A residential development delivered with consistency at scale.',
    description:
      'A multi-unit residential project where repeatable quality and disciplined scheduling were essential. Our team delivered construction and finishing across units to a uniform, elevated standard.',
    image: '/images/project-residential.png',
  },
  {
    slug: 'mall-of-arabia',
    name: 'Mall of Arabia',
    category: 'commercial',
    location: 'Egypt',
    year: '2022',
    area: '5,800 m²',
    scope: 'Fit-Out · MEP',
    summary: 'Retail environments delivered inside a major commercial destination.',
    description:
      'A commercial fit-out program executed within a live retail context, requiring precise phasing and coordination. We delivered finishing and electro-mechanical works with minimal disruption.',
    image: '/images/project-commercial.png',
  },
  {
    slug: 'al-mokhtabar-labs',
    name: 'Al Mokhtabar Labs',
    category: 'corporate',
    location: 'Egypt',
    year: '2021',
    area: '1,900 m²',
    scope: 'Construction · MEP · Fit-Out',
    summary: 'A clinical environment engineered for hygiene, flow and compliance.',
    description:
      'A medical laboratory build demanding specialized MEP systems and strict finish specifications. We delivered a controlled, compliant environment optimized for staff and patient flow.',
    image: '/images/project-corporate.png',
  },
  {
    slug: 'promenade-october',
    name: 'Promenade October',
    category: 'residential',
    location: '6th of October',
    year: '2023',
    area: '9,200 m²',
    scope: 'Construction · Fit-Out · Interior Design',
    summary: 'A residential community delivered from ground-up to move-in ready.',
    description:
      'A residential development where design intent carried consistently from architecture into interiors. We handled construction, interior design and fit-out as a single accountable delivery.',
    image: '/images/project-residential.png',
  },
  {
    slug: 'tube-factory',
    name: 'Tube Factory',
    category: 'industrial',
    location: 'Egypt',
    year: '2020',
    area: '22,000 m²',
    scope: 'Construction · MEP',
    summary: 'An industrial facility engineered for heavy operations and uptime.',
    description:
      'A large-scale industrial build requiring robust structural delivery and integrated electro-mechanical infrastructure. We delivered a facility built for demanding, continuous production.',
    image: '/images/hero-architecture.png',
  },
  {
    slug: 'we-telecom',
    name: 'WE Telecom',
    category: 'corporate',
    location: 'Egypt',
    year: '2022',
    area: '3,100 m²',
    scope: 'Fit-Out · MEP · Project Management',
    summary: 'A flagship corporate space blending brand, technology and comfort.',
    description:
      'A telecom headquarters fit-out integrating advanced systems with a strong brand environment. We managed the full delivery, from finishes to electro-mechanical integration.',
    image: '/images/project-corporate.png',
  },
]

export type OpenRole = {
  title: string
  department: string
  location: string
  type: string
}

export const OPEN_ROLES: OpenRole[] = [
  { title: 'Senior Site Engineer', department: 'Construction', location: 'Cairo, Egypt', type: 'Full-time' },
  { title: 'Interior Designer', department: 'Design', location: 'Cairo, Egypt', type: 'Full-time' },
  { title: 'MEP Engineer', department: 'Electro-Mechanical', location: 'Cairo, Egypt', type: 'Full-time' },
  { title: 'Project Manager', department: 'Project Management', location: 'Cairo, Egypt', type: 'Full-time' },
  { title: 'Quantity Surveyor', department: 'Commercial', location: 'Cairo, Egypt', type: 'Full-time' },
]

export const PROCESS_STEPS = [
  { index: '01', title: 'Kickoff Meeting', description: 'We align on vision, constraints and success criteria before a single line is drawn.' },
  { index: '02', title: 'Scope Analysis', description: 'Detailed assessment of requirements, site conditions and technical feasibility.' },
  { index: '03', title: 'Planning', description: 'Design, scheduling, budgeting and resource planning built for precise execution.' },
  { index: '04', title: 'Execution', description: 'Coordinated delivery with rigorous quality and craftsmanship at every stage.' },
  { index: '05', title: 'Controlling & Monitoring', description: 'Continuous oversight of scope, cost and timeline through to turnkey handover.' },
]

export const TESTIMONIALS = [
  {
    quote:
      'Master Build delivered our space with a level of precision and finish we had not seen from any contractor before.',
    name: 'Client Name',
    company: 'Company',
    project: 'Corporate Fit-Out',
  },
  {
    quote:
      'They managed scope, budget and timeline as one integrated process. It felt like a true partnership.',
    name: 'Client Name',
    company: 'Company',
    project: 'Hospitality Project',
  },
  {
    quote:
      'From design to handover, the craftsmanship and communication were exceptional throughout.',
    name: 'Client Name',
    company: 'Company',
    project: 'Residential Villa',
  },
]

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  residential: 'Residential',
  corporate: 'Corporate',
  commercial: 'Commercial',
  hospitality: 'Hospitality',
  industrial: 'Industrial',
}
