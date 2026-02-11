export interface Course {
  name: string;
  fee: string;
  duration: string;
  targetAudience: string[];
  prerequisites: string[];
  overview: string;
  modules: string[];
  outcomes: string[];
  notes: string[];
}

export const courses: Course[] = [
  {
    name: "Data Science with AI",
    fee: "₹70,000",
    duration: "6 Months",
    targetAudience: [
      "Fresh graduates",
      "Engineering and science students",
      "Working professionals transitioning into data roles",
    ],
    prerequisites: [
      "Basic programming knowledge (Python preferred)",
      "Understanding of basic mathematics and statistics",
    ],
    overview:
      "This course combines core Data Science concepts with Artificial Intelligence techniques. Learners gain hands-on experience in data analysis, machine learning, and AI-driven decision-making using real-world datasets.",
    modules: [
      "Python for Data Science",
      "Statistics and Probability for Data Analysis",
      "Data Preprocessing and Feature Engineering",
      "Exploratory Data Analysis (EDA)",
      "Machine Learning Algorithms",
      "Introduction to Deep Learning",
      "AI applications in Data Science",
    ],
    outcomes: [
      "Ability to analyze and interpret complex datasets",
      "Build predictive and AI-driven models",
      "Apply Data Science techniques to real-world problems",
      "Readiness for advanced AI and Data Science roles",
    ],
    notes: [
      "Focus on concepts and practical implementation",
      "No job placement guarantees",
      "Advanced AI topics are covered in specialized programs",
    ],
  },
  {
    name: "Data Analyst",
    fee: "₹60,000",
    duration: "5 Months",
    targetAudience: [
      "Freshers and non-technical graduates",
      "Business and commerce graduates",
      "Professionals seeking data analysis skills",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "No prior programming experience required",
    ],
    overview:
      "This course focuses on analyzing, visualizing, and presenting data to support business decision-making. It emphasizes practical tools and analytical thinking rather than advanced programming.",
    modules: [
      "Data Analysis Fundamentals",
      "Excel for Data Analysis",
      "SQL for Data Retrieval",
      "Python Basics for Analysts",
      "Data Visualization Tools",
      "Business Intelligence Concepts",
      "Dashboard and Report Building",
    ],
    outcomes: [
      "Ability to clean and analyze datasets",
      "Create meaningful visualizations and reports",
      "Derive insights to support business decisions",
      "Understand real-world data analyst workflows",
    ],
    notes: [
      "Emphasis on hands-on practice",
      "Suitable for beginners",
      "Career guidance may be provided separately",
    ],
  },
  {
    name: "Python Full Stack Development",
    fee: "₹60,000",
    duration: "6 Months",
    targetAudience: [
      "Fresh graduates",
      "Aspiring software developers",
      "Professionals switching to development roles",
    ],
    prerequisites: [
      "Basic computer and internet knowledge",
      "No prior coding experience required",
    ],
    overview:
      "This course covers full stack web development using Python. Learners are introduced to front-end, back-end, databases, and deployment concepts to build complete web applications.",
    modules: [
      "Python Programming Fundamentals",
      "HTML, CSS, and JavaScript",
      "Front-End Framework Basics",
      "Backend Development with Python",
      "Database Management (SQL & NoSQL basics)",
      "REST APIs",
      "Web Application Deployment",
    ],
    outcomes: [
      "Build full stack web applications",
      "Understand client-server architecture",
      "Develop and deploy Python-based applications",
      "Gain foundation for advanced software development",
    ],
    notes: [
      "Project-based learning approach",
      "Focus on application development fundamentals",
      "Advanced frameworks covered in higher-level courses",
    ],
  },
  {
    name: "DevOps Engineer",
    fee: "₹60,000",
    duration: "6 Months",
    targetAudience: [
      "Software developers",
      "System administrators",
      "IT professionals interested in DevOps practices",
    ],
    prerequisites: [
      "Basic Linux knowledge",
      "Understanding of software development lifecycle",
    ],
    overview:
      "This course introduces DevOps principles, tools, and practices used to automate and optimize software development and deployment processes.",
    modules: [
      "DevOps Fundamentals",
      "Linux and Shell Scripting",
      "Version Control Systems",
      "CI/CD Pipelines",
      "Containerization Concepts",
      "Cloud Computing Basics",
      "Infrastructure Automation",
    ],
    outcomes: [
      "Understand DevOps culture and workflows",
      "Automate build and deployment pipelines",
      "Manage applications in cloud environments",
      "Improve collaboration between development and operations",
    ],
    notes: [
      "Focus on practical tools and real-world workflows",
      "No guaranteed placement support",
      "Advanced cloud and security topics handled separately",
    ],
  },
];

export const SENSITIVE_TOPICS = ["fee", "fees", "cost", "price", "placement", "salary", "job guarantee", "package", "hiring", "job"];

export const CLOSING_MESSAGE = "For more details and clarity, please talk to my counselor.";
