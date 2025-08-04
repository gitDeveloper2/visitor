import React, { ReactElement } from "react";
import PrismaSelfRelations from "./Prisma-self-relations";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "Prisma Self Relations",
    description: "Learn how to manage self-relations in Prisma with clear examples and practical code snippets. Explore 1:1, 1:M, and M:M self-relations, including schema definitions and queries for user-manager, category-subcategory, and person-friend models. Ideal for understanding Prisma's approach to self-referencing relationships in your database schema.",
    keywords: "Prisma Self Relations, Prisma One-to-One Self Relation, Prisma One-to-Many Self Relation, Prisma Many-to-Many Self Relation, Prisma Self Relation Example, Prisma Self Relation Schema, Prisma 1:1 Self Relation, Prisma 1:M Self Relation, Prisma M:M Self Relation, Prisma Recursive Query, Prisma Self Relation Query, Prisma Self Relation Management, Prisma Self Referencing Relationship, Prisma Model Example Self Relation, Prisma Self Relation Update, Prisma Self Relation Tutorial, Prisma Self Relation Practical Example, Prisma Self Relation Implementation, Prisma User Manager Self Relation, Prisma Category Subcategories Self Relation, Prisma Person Friends Self Relation, Prisma Self Relation Explained, Prisma Self Relation Use Cases, Prisma Self Relation in Database Design, Prisma One-to-One Relationship Example, Prisma One-to-Many Relationship Example, Prisma Many-to-Many Relationship Example, Self-Referencing in Prisma Models, Prisma Self Relation Types, Prisma Relationship Management",
    canonicalUrl:"/blog/prisma-self-relations"
  });
}

export default function Test() {
  

  return (
   <PrismaSelfRelations/>
  );
}
