export const blogCategories = [
  "Technology",
  "Business", 
  "Design",
  "Development",
  "Marketing",
  "Productivity",
  "Startup",
  "Tutorial",
  "AI",
  "Web3"
] as const;

export const appCategories = [
  "Productivity",
  "Development", 
  "Design",
  "Marketing",
  "Analytics",
  "Communication",
  "Finance",
  "Education",
  "Entertainment",
  "AI"
] as const;

export const blogTags = [
  "React", "Vue", "Angular", "Node.js", "Python", "JavaScript", "TypeScript",
  "Web Development", "Mobile Development", "UI/UX", "Design Systems",
  "Startup", "Business", "Marketing", "SEO", "Analytics", "Productivity",
  "AI", "Machine Learning", "Web3", "Blockchain", "Tutorial", "Guide",
  "Case Study", "Interview", "Tools", "Resources"
] as const;

export const appTags = [
  "React", "Vue", "Angular", "Node.js", "Python", "JavaScript", "TypeScript",
  "Mobile", "Desktop", "Web App", "API", "Database", "Cloud", "AWS", "Azure",
  "Free", "Freemium", "Paid", "Open Source", "SaaS", "B2B", "B2C", "AI",
  "Analytics", "Automation", "Collaboration", "Communication", "Design",
  "Development", "Education", "Entertainment", "Finance", "Health",
  "Marketing", "Productivity", "Security", "Social Media"
] as const;

export type BlogCategory = typeof blogCategories[number];
export type AppCategory = typeof appCategories[number];
export type BlogTag = typeof blogTags[number];
export type AppTag = typeof appTags[number]; 