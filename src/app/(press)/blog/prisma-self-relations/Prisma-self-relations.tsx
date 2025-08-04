"use client";
import "react-image-crop/dist/ReactCrop.css";
import { Container, Grid } from "@mui/material";
import React, { ReactElement } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Code } from "@mui/icons-material";
import { StyledSectionGrid } from "@components/layout/Spacing";
import BlogComponent, { LinkListItem } from "@components/blog/BlogContent";
import Citation from "@components/customhtml/Citation";
import { CodeBox, ListContainer, StyledList, StyledListItem } from "@styles/globalStyles";
import ImageWithCaption from "@components/customhtml/ImageWithCaption";
import ReactEmbedGist from 'react-embed-gist';
import { WrappingTypography } from "../../../../lib/TextLib";
import getRelatedPages from "../../../data/RelatedPages";
// import { ResponsiveNativeBannerAd } from "@components/adds/ResponsiveNativeBannerAd";
const parentPath = "js";
const thisPagePath = "/blog/prisma-self-relations";

export default function PrismaSelfRelations() {
  const theme = useTheme();

  return (
    <StyledSectionGrid theme={theme} container gap={1} y16>
      <Grid item xs={12}>
        <BlogComponent
   relatedPages={getRelatedPages(parentPath,thisPagePath)}
          blogComponent={
            <>
           
              <Typography variant="h1" component={"h1"} gutterBottom>
                Prisma Self Relations
              </Typography>

              <Typography variant="h2" gutterBottom>
                Introduction
              </Typography>
              <Typography variant="body1" paragraph>
                When working with databases, relationships are sometimes
                required, whereby a record in the database points to another of
                the same type. We refer to this as a self-relation. Think of it
                as a way for an entity to be linked with another instance of
                itself. Take Twitter as an example. A person is able to follow
                another person. Each user in this scenario can be linked to many
                other users. This shows that the user model must make
                self-references. Managing such self-relations is made easy using
                Prisma. Prisma can asists you to define and manage these
                relationships in your database architecture without being
                limited by complicated queries. Self relations can be of any
                cardinality. These can fall under either; prisma one-to-one self
                relation (1:1), prisma one-to-many self relation(1:m),prisma
                many-to-many self relation(m;m). In this blog, we'll go through
                each of these prisma self relations.
              </Typography>

              <Typography variant="h3" component={"h3"} gutterBottom>
                Prisma one-to-one self-relations
              </Typography>
              <Typography variant="body1" paragraph>
                In a prisma 1:1 self-relation, a record in a table is connected
                to exactly one other record in the same table . Let's go over a
                concise example with Prisma.
              </Typography>
              <Typography variant="h4" component={"h4"} gutterBottom>
                Example Scenario
              </Typography>
              <Typography variant="body1" paragraph>
                Assume we have a user model in which there can only be one
                manager for each user and only one manager for each user. This
                establishes a prisma self-relation of 1:1.
              </Typography>
              <Typography variant="h5" component={"h5"} gutterBottom>
                Prisma Schema
              </Typography>
              <CodeBox language="javascript" theme="light">
                {`model User {
  id        Int    @id @default(autoincrement())
  name      String
  manager   User?  @relation( "ManagerUserRelation" , fields: [managerId], references: [id])
  managerId Int?   // Foreign key User's manager
  managedUser User? @relation("ManagerUserRelation")
}
`}
              </CodeBox>

              <Typography variant="h5" component={"h5"} gutterBottom>
                Explanation
              </Typography>
              {/* <ResponsiveNativeBannerAd/> */}
            <Container>
                <WrappingTypography variant="body1" paragraph>
                  <strong>@relation("ManagerUserRelation"): </strong> This is
                  prisma self-relations name. Its how Prisma determines that the
                  field labeled "manager" corresponds to a different user within
                  the same table.
                </WrappingTypography>
                <WrappingTypography  variant="body1" paragraph>
                  <strong>fields: [managerId]: </strong> This suggests that the
                  manager reference is stored in the managerId column.
               </WrappingTypography >
               <WrappingTypography  variant="body1" paragraph>
                  <strong>references: [id]: </strong> This tells Prisma that
                  managerId is a reference to the User model's id field.
                </WrappingTypography >
                </Container>
              <Typography variant="h5" component={"h5"} gutterBottom>
                Practical example of a prisma one-to-one self relation
              </Typography>
              <CodeBox>
                {`import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createUser() {
  // Create two users
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
    },
  });

  // Set Alice as Bob's manager
  await prisma.user.update({
    where: { id: bob.id },
    data: { managerId: alice.id },
  });

  console.log('Alice and Bob created with a 1:1 self-relation');
}

createUser();

                `}
              </CodeBox>
              <Typography variant="h3" component={"h3"} gutterBottom>
                Prisma one-to-many self-relations
              </Typography>
              <Typography variant="body1" paragraph>
                A record in a table can be linked to numerous other entries in
                the same table by a prisma one to many self-relation. This
                implies that one record can have multiple related records, but
                each related record links back to only one main record.
              </Typography>
              <Typography variant="h4" component={"h4"} gutterBottom>
                Example Scenario
              </Typography>
              <Typography variant="body1" paragraph>
                Consider a category model in which there can be several
                subcategories inside each category, but each subcategory is only
                a part of one category. Thus, one to prisma many self-relation
                (1:m)
              </Typography>
              <Typography variant="h5" component={"h5"} gutterBottom>
                Prisma Schema
              </Typography>
              <CodeBox>
                {`model Category {
  id            Int          @id @default(autoincrement())
  name          String
  subcategories Category[]   @relation("CategorySubcategories")
}
`}
              </CodeBox>
              <Typography variant="h5" component={"h5"} gutterBottom>
                Explanation
              </Typography>
         
                <WrappingTypography variant="body1" paragraph>
                  <strong>@relation("CategorySubcategories"): </strong> This
                  specifies the name of the self relation. Prisma uses this to
                  understand that the subcategories field refers to other
                  Category records.
                </WrappingTypography >
                <WrappingTypography variant="body1" paragraph>
                  <strong>Category[]: </strong>Indicates that a category can
                  have multiple subcategories.
                </WrappingTypography >
             
              <Typography variant="h5" component={"h5"} gutterBottom>
                Practical Example of prisma one to many self relation
              </Typography>
              <CodeBox>
                {`import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createCategories() {
  // Create a main category
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
    },
  });

  // Create subcategories under the main category
  await prisma.category.createMany({
    data: [
      { name: 'Laptops', parentId: electronics.id },
      { name: 'Smartphones', parentId: electronics.id },
      { name: 'Headphones', parentId: electronics.id },
    ],
  });

  console.log('Electronics category with subcategories created');
}

createCategories();
`}
              </CodeBox>

              <Typography variant="h3" component={"h3"} gutterBottom>
                Prisma many-to-many self-relations
              </Typography>
              <Typography variant="body1" paragraph>
                In a (m:m) prisma many-to-many self-relation, entries in one
                table may be associated to numerous other entries in the same
                table, and vice versa. This implies that a record may have more
                than one connected record, and that record may have more than
                one related record per record.
              </Typography>
              <Typography variant="h4" component={"h4"} gutterBottom>
                Example scenario of many-to-many self-relation
              </Typography>
              <Typography variant="body1" paragraph>
                Consider a Person model where each person can have multiple
                friends, and each friend can also be friends with multiple
                people. This is what m:m self relation means
              </Typography>
              <Typography variant="h5" component={"h5"} gutterBottom>
                Prisma schema of many-to-many self-relation
              </Typography>
              <CodeBox>
                {`model Person {
  id         Int       @id @default(autoincrement())
  name       String
  friends    Person[]  @relation("Friendships", references: [id])
  friendsOf  Person[]  @relation("Friendships")
}
`}
              </CodeBox>
              <Typography variant="h5" component={"h5"} gutterBottom>
                Explanation
              </Typography>
             
                <WrappingTypography variant="body1" paragraph>
                  <strong>@relation("ManagerRelation"): </strong>
                  This indicates the self relation name. This is how Prisma
                  determines that the field labeled "manager" corresponds to a
                  different user within the same table.
                </WrappingTypography >
                <WrappingTypography variant="body1" paragraph>
                  <strong>fields: [managerId]: </strong>
                  This tells that the manager reference is stored in the
                  managerId column.
                </WrappingTypography >
                <WrappingTypography variant="body1" paragraph>
                  <strong>references: [id]:</strong>
                  This instructs Prisma that managerId is a reference to the
                  User model's id field.
                </WrappingTypography >
                       <Typography variant="h5" component={"h5"} gutterBottom>
                Practical example of prisma many-to-many self-relation
              </Typography>
              <CodeBox>
                {`import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createPeopleAndFriendships() {
  // Create people
  const alice = await prisma.person.create({
    data: { name: 'Alice' },
  });

  const bob = await prisma.person.create({
    data: { name: 'Bob' },
  });

  const charlie = await prisma.person.create({
    data: { name: 'Charlie' },
  });

  // Set friendships
  await prisma.person.update({
    where: { id: alice.id },
    data: {
      friends: {
        connect: [
          { id: bob.id },
          { id: charlie.id },
        ],
      },
    },
  });

  await prisma.person.update({
    where: { id: bob.id },
    data: {
      friends: {
        connect: [
          { id: alice.id },
          { id: charlie.id },
        ],
      },
    },
  });

  await prisma.person.update({
    where: { id: charlie.id },
    data: {
      friends: {
        connect: [
          { id: alice.id },
          { id: bob.id },
        ],
      },
    },
  });

  console.log('People created and friendships set up');
}

createPeopleAndFriendships();
`}
              </CodeBox>

              <Typography variant="h4" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body1" paragraph>
                We have looked at how to manage prisma self-relations, a
                well-liked database toolkit, in this blog. Three categories of
                self-relations were discussed:
              </Typography>
              
                <WrappingTypography variant="body1" paragraph >
                  <strong>1:1 prisma one to one self-selations:</strong>In the
                  same table, every record is connected to exactly one other
                  record. We gave the example of a user model in which there is
                  one manager for every user and one manager for every user.
                </WrappingTypography >
                <WrappingTypography variant="body1" paragraph>
                  <strong>1:m prisma one to many self-Relations</strong> A
                  single record in a table is linked to several other records,
                  but all of those records are pointing to the same primary
                  record. We used a category model to demonstrate this, in which
                  there can be several subcategories inside each category.
                </WrappingTypography >
                <WrappingTypography variant="body1" paragraph>
                  <strong>M:M prisma many to many self relations</strong>Each
                  record can be linked to many other records, and each of those
                  records can also be linked to many records. . We used a Person
                  model to illustrate this, in which a person can have many
                  friends, and a friend can have many friends.
                </WrappingTypography >
              
              <Typography variant="h4" gutterBottom>
                Sources
              </Typography>
              <Citation
                index={1}
                text={
                  "Prisma schema reference - Official Prisma documentation detailing schema definitions and relations."
                }
                url={
                  "https://www.prisma.io/docs/orm/reference/prisma-schema-reference"
                }
              />
              <Citation
                index={2}
                text={
                  "Self-relations - Specific guide on self-relations in Prisma."
                }
                url={
                  "https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/self-relations"
                }
              />

              <Citation
                index={2}
                text={
                  "Prisma Client Reference - Overview of how to interact with your database using Prisma Client."
                }
                url={
                  "https://www.prisma.io/docs/orm/reference/prisma-client-reference"
                }
              />
              <Citation
                index={3}
                text={
                  "Prisma Blog - Various articles and tutorials that provide additional examples and use cases."
                }
                url={"https://www.prisma.io/blog/education"}
              />
              <Citation
                index={4}
                text={
                  "Prisma GitHub - The source code and issues can offer further insights and examples."
                }
                url={"https://github.com/prisma/prisma"}
              />
            </>
          }
        />
      </Grid>
    </StyledSectionGrid>
  );
}
