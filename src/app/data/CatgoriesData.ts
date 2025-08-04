
export interface subcategory{
  name:string;
  path:string;
}
export interface Category{
  name:string;
  path:string;
  subcategories?:subcategory[]
}

export const categories:Category[] = [
  {
    name: "Programming",
    path: "/categories/programming",
    subcategories: [
      { name: "JavaScript", path: "/categories/programming/javascript" },
      { name: "Python", path: "/categories/programming/python" },
    ],
  },
  {
    name: "Design",
    path: "/categories/design",
    subcategories: [
      { name: "UI/UX", path: "/categories/design/ui-ux" },
      { name: "Graphic Design", path: "/categories/design/graphic" },
    ],
  },
  {
    name: "DevOps",
    path: "/categories/devops",
  },
];
