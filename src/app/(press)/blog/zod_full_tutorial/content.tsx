"use client";
import "react-image-crop/dist/ReactCrop.css";
import { Grid, Typography, List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { StyledSectionGrid } from "@components/layout/Spacing";
import BlogComponent, { LinkListItem } from "@components/blog/BlogContent";
import { CodeBox } from "@styles/globalStyles"; // Ensure this is correctly imported
import getRelatedPages from "../../../data/RelatedPages";
// import { ResponsiveNativeBannerAd } from "@components/adds/ResponsiveNativeBannerAd";
const parentPath = "js";
const thisPagePath = "/blog/zod_full_tutorial";


export default function WorkflowDispatch() {
  const theme = useTheme();
  getRelatedPages;
  return (
    <StyledSectionGrid theme={theme} container gap={1} y16>
      <Grid item xs={12}>
        <BlogComponent
          relatedPages={getRelatedPages(parentPath,thisPagePath)}
          blogComponent={
            <>
              <Typography variant="h1" gutterBottom>
                How to Learn Zod: Complete Guide to Zod Schema, Validation,
                Transformations, and More
              </Typography>
              <Typography variant="body1" paragraph>
                In the world of TypeScript and JavaScript development, data
                validation and schema management are crucial aspects of creating
                robust applications. One library that has been gaining attention
                for its powerful yet intuitive approach to schema validation is{" "}
                <strong>Zod</strong>. This tutorial will walk you through
                everything you need to know about Zod, from its basics to
                advanced features, with practical examples and comparisons.
              </Typography>

              <Typography variant="h2" gutterBottom>
                What is Zod?
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Zod</strong> is a TypeScript-first schema declaration
                and validation library. It allows you to define schemas for your
                data and validate that your data conforms to these schemas. Zod
                provides a fluent API to build and validate schemas easily and
                integrates well with TypeScript’s static type checking.
              </Typography>

              <Typography variant="h3" gutterBottom>
                How Does Zod Work?
              </Typography>
              <Typography variant="body1" paragraph>
                Zod works by allowing you to define a schema for your data and
                then use that schema to validate data at runtime. Here’s a basic
                example to illustrate how Zod works:
              </Typography>
              <CodeBox>
                {`
import { z } from 'zod';

// Define a Zod schema
const userSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
});

// Validate data against the schema
const result = userSchema.safeParse({ name: 'Alice', age: 30 });
console.log(result); // { success: true, data: { name: 'Alice', age: 30 } }

const invalidResult = userSchema.safeParse({ name: 'Alice', age: -5 });
console.log(invalidResult.error.format()); // Error due to age being negative
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Why Use Zod Instead of TypeScript?
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>TypeScript</strong> provides static type checking, which
                is great for development-time type safety. However, it doesn’t
                handle runtime validation. This is where Zod comes in. While
                TypeScript ensures that your types are correct at compile time,
                Zod ensures that your data is valid at runtime.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Zod vs TypeScript</strong>
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="TypeScript"
                    secondary="Ensures type safety at compile time. Types are erased at runtime, so there's no built-in mechanism to enforce data validity during execution."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Zod"
                    secondary="Provides runtime validation to ensure that data adheres to the specified schema. This validation happens during execution and complements TypeScript’s compile-time checks."
                  />
                </ListItem>
              </List>
              <Typography variant="body1" paragraph>
                Using Zod alongside TypeScript allows you to validate data
                thoroughly, combining the best of both worlds.
              </Typography>

              <Typography variant="h2" gutterBottom>
                Zod Schema
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Zod schemas</strong> define the shape and constraints of
                your data. They are highly customizable and can be composed to
                handle complex data structures.
              </Typography>

              <Typography variant="h3" gutterBottom>
                Basic Schema Example
              </Typography>
              {/* <ResponsiveNativeBannerAd/> */}
              <CodeBox>
                {`
import { z } from 'zod';

// Define a basic schema
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

// Validate data
const validationResult = schema.safeParse({ name: 'Bob', age: 25 });
console.log(validationResult); // { success: true, data: { name: 'Bob', age: 25 } }
                `}
              </CodeBox>

              <Typography variant="h3" gutterBottom>
                Schema with Nested Objects
              </Typography>
              <CodeBox>
                {`
const nestedSchema = z.object({
  user: z.object({
    name: z.string(),
    age: z.number(),
  }),
  address: z.object({
    city: z.string(),
    postalCode: z.string(),
  }),
});

const nestedResult = nestedSchema.safeParse({
  user: { name: 'Alice', age: 30 },
  address: { city: 'Wonderland', postalCode: '12345' },
});
console.log(nestedResult); // { success: true, data: ... }
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Zod Validation
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Zod validation</strong> involves checking if the data
                conforms to the defined schema. Zod provides various methods to
                handle different validation scenarios.
              </Typography>

              <Typography variant="h3" gutterBottom>
                Required Fields
              </Typography>
              <CodeBox>
                {`
const optionalSchema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
});

const resultWithOptionalFields = optionalSchema.safeParse({ name: 'John' });
console.log(resultWithOptionalFields); // { success: true, data: { name: 'John', age: undefined } }
                `}
              </CodeBox>

              <Typography variant="h3" gutterBottom>
                Regex Validation
              </Typography>
              <CodeBox>
                {`
import { z } from 'zod';

const schema = z.string().regex(/^[a-zA-Z0-9]+$/, 'Invalid input');

// Example usage
try {
  schema.parse('valid123'); // Passes validation
  schema.parse('invalid!@#'); // Throws error: Invalid input
} catch (e) {
  console.error(e.errors); // Logs validation error
}
        `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Zod Transform
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Transformations</strong> in Zod allow you to modify data
                as it is being validated. This is useful for data normalization
                or preprocessing.
              </Typography>

              <Typography variant="h3" gutterBottom>
                Basic Transform Example
              </Typography>
              <CodeBox>
                {`
const transformSchema = z.string().transform((val) => val.toUpperCase());

const transformedResult = transformSchema.safeParse('hello');
console.log(transformedResult); // { success: true, data: 'HELLO' }
                `}
              </CodeBox>

              <Typography variant="h3" gutterBottom>
                Transform with Object Schema
              </Typography>
              <CodeBox>
                {`
const userSchemaWithTransform = z.object({
  name: z.string().transform((val) => val.trim()),
  age: z.number(),
});

const transformedUserResult = userSchemaWithTransform.safeParse({ name: ' Alice ', age: 25 });
console.log(transformedUserResult); // { success: true, data: { name: 'Alice', age: 25 } }
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Zod Refine
              </Typography>
              <Typography variant="body1" paragraph>
                The <strong>refine</strong> method in Zod is used for custom
                validation logic that goes beyond the built-in constraints.
              </Typography>

              <Typography variant="h3" gutterBottom>
                Refine Example
              </Typography>
              <CodeBox>
                {`
const ageSchema = z.number().refine((val) => val >= 18, {
  message: 'Age must be at least 18',
});

const validAge = ageSchema.safeParse(25);
console.log(validAge); // { success: true, data: 25 }

const invalidAge = ageSchema.safeParse(16);
console.log(invalidAge.error.format()); // Error due to age being less than 18
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Zod Preprocess
              </Typography>
              <Typography variant="body1" paragraph>
                The <strong>preprocess</strong> method allows you to modify the
                input data before it is validated.
              </Typography>

              <Typography variant="h3" gutterBottom>
                Preprocess Example
              </Typography>
              <CodeBox>
                {`
const preprocessSchema = z.preprocess(
  (input) => (typeof input === 'string' ? parseInt(input, 10) : input),
  z.number()
);

const processedResult = preprocessSchema.safeParse('42');
console.log(processedResult); // { success: true, data: 42 }

const invalidResult = preprocessSchema.safeParse('not a number');
console.log(invalidResult.error.format()); // Error due to invalid number
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Zod Examples
              </Typography>
              <Typography variant="body1" paragraph>
                Here are more practical examples of using Zod in various
                scenarios:
              </Typography>

              <Typography variant="h3" gutterBottom>
                Zod Enum Example
              </Typography>
              <CodeBox>
                {`
const ColorEnum = z.enum(['Red', 'Green', 'Blue']);

const colorResult = ColorEnum.safeParse('Red');
console.log(colorResult); // { success: true, data: 'Red' }

const invalidColorResult = ColorEnum.safeParse('Yellow');
console.log(invalidColorResult.error.format()); // Error due to 'Yellow' not being in the enum
                `}
              </CodeBox>

              <Typography variant="h3" gutterBottom>
                Zod Form Example
              </Typography>
              <CodeBox>
                {`
const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const formData = { username: 'user', password: 'pass123' };
const formResult = formSchema.safeParse(formData);
console.log(formResult); // { success: true, data: { ... } }
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Comparison: What is Faster Than Zod?
              </Typography>
              <Typography variant="body1" paragraph>
                When it comes to performance, different libraries and methods
                have varying speeds. Zod is known for its efficiency and ease of
                use, but there are other libraries and techniques that might be
                faster depending on your needs.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Joi</strong>: Another popular validation library that is
                mature and feature-rich but can be slower in some cases compared
                to Zod.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Yup</strong>: Provides a similar feature set but might
                have different performance characteristics.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Custom Validators</strong>: Writing your own validation
                logic can sometimes be more performant if you have very specific
                requirements.
              </Typography>

              <Typography variant="h2" gutterBottom>
                Conclusion
              </Typography>
              <Typography variant="body1" paragraph>
                Zod is a powerful tool for handling schema validation in
                TypeScript applications. It offers a clear, concise API for
                defining schemas, validating data, and performing
                transformations. Whether you’re using Zod for basic data
                validation or complex scenarios involving enums and custom
                logic, it provides a robust solution that complements
                TypeScript’s type system.
              </Typography>
              <Typography variant="body1" paragraph>
                By understanding and utilizing Zod’s features—such as schema
                definitions, validation methods, transformations, refinements,
                and preprocessors—you can enhance your application’s data
                integrity and maintainability.
              </Typography>
              <Typography variant="body1" paragraph>
                Feel free to experiment with the examples provided and integrate
                Zod into your projects to improve data validation and overall
                application quality. Happy coding!
              </Typography>

              <Typography variant="h2" gutterBottom>
                Sources
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Zod Documentation"
                    secondary="https://zod.dev/docs"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="TypeScript Handbook"
                    secondary="https://www.typescriptlang.org/docs/handbook/enum.html"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Zod GitHub Repository"
                    secondary="https://github.com/colinhacks/zod"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="TypeScript Official Documentation"
                    secondary="https://www.typescriptlang.org/docs/"
                  />
                </ListItem>
              </List>
            </>
          }
        />
      </Grid>
    </StyledSectionGrid>
  );
}
