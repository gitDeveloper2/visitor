"use client";
import "react-image-crop/dist/ReactCrop.css";
import {
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { StyledSectionGrid } from "@components/layout/Spacing";
import BlogComponent, { LinkListItem } from "@components/blog/BlogContent";
import { CodeBox } from "@styles/globalStyles"; // Ensure this is correctly imported
import getRelatedPages from "../../../data/RelatedPages";
// import { ResponsiveNativeBannerAd } from "@components/adds/ResponsiveNativeBannerAd";
const parentPath = "js";
const thisPagePath = "/blog/zod_enum_validation";

export default function WorkflowDispatch() {
  const theme = useTheme();

  return (
    <StyledSectionGrid theme={theme} container gap={1} y16>
      <Grid item xs={12}>
        <BlogComponent
               relatedPages={getRelatedPages(parentPath,thisPagePath)}
          blogComponent={
            <>
              <Typography variant="h1" gutterBottom>
                Mastering Zod Enum Validation: A Comprehensive Guide
              </Typography>
              <Typography variant="body1" paragraph>
                When building robust and reliable applications, data validation
                is a critical aspect. Zod, a TypeScript-first schema declaration
                and validation library, offers a powerful way to handle various
                validation needs, including enums. In this guide, we will
                explore Zod enum validation in depth, comparing it to native
                enums, discussing its usage with arrays, and more. We'll also
                address common scenarios like handling enum error messages and
                using enums with optional fields.
              </Typography>
              <Typography variant="h2" gutterBottom>
                Understanding Zod Enums
              </Typography>
              <Typography variant="body1" paragraph>
                Zod enum validation allows you to define a set of named values,
                ensuring that data conforms to one of these predefined options.
                This is particularly useful when you want to restrict a value to
                a specific set of possibilities.
              </Typography>
              <Typography variant="h3" gutterBottom>
                Defining a Zod Enum
              </Typography>
              <Typography variant="body1" paragraph>
                To start with Zod enum validation, you define an enum using the{" "}
                </Typography>
                <CodeBox>z.enum()</CodeBox> <Typography>method. This method allows you to
                specify a list of valid values.
              </Typography>
              <CodeBox>
                {`
import { z } from 'zod';

// Define a Zod enum
const ColorEnum = z.enum(['Red', 'Green', 'Blue']);
                `}
              </CodeBox>
              <Typography variant="body1" paragraph>
                With</Typography> <CodeBox>ColorEnum</CodeBox> <Typography>, you can now validate that a
                value is one of the specified colors.
              </Typography>
              <Typography variant="h3" gutterBottom>
                Zod Enum vs Native Enum
              </Typography>
              {/* <ResponsiveNativeBannerAd/> */}
              <Typography variant="body1" paragraph>
                When comparing Zod enum vs native enum, it's essential to
                understand that native enums are part of TypeScript's language
                features, while Zod enums are specifically designed for
                validation within schemas.
              </Typography>
              <Typography variant="h4" gutterBottom>
                Native Enum Example:
              </Typography>
              <CodeBox>
                {`
enum Color {
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue'
}

// Usage
const selectedColor: Color = Color.Red;
                `}
              </CodeBox>
              <Typography variant="h4" gutterBottom>
                Zod Enum Example:
              </Typography>
              <CodeBox>
                {`
const ColorEnum = z.enum(['Red', 'Green', 'Blue']);
const result = ColorEnum.safeParse('Red'); // Valid
                `}
              </CodeBox>
              <Typography variant="body1" paragraph>
                Zod enums are more focused on validation and schema enforcement,
                while native enums provide a way to define and use constant
                values directly in TypeScript.
              </Typography>
              <Typography variant="h2" gutterBottom>
                Validating with Zod Enum
              </Typography>
              <Typography variant="h3" gutterBottom>
                Basic Validation
              </Typography>
              <Typography variant="body1" paragraph>
                To validate a value against a Zod enum, use the{" "} </Typography>
                <CodeBox>safeParse</CodeBox><Typography> method. This method returns an
                object indicating whether the validation was successful.
              </Typography>
              <CodeBox>
                {`
const result = ColorEnum.safeParse('Green');
console.log(result); // { success: true, data: 'Green' }
                `}
              </CodeBox>
              <Typography variant="h3" gutterBottom>
                Handling Enum Error Messages
              </Typography>
              <Typography variant="body1" paragraph>
                When a value does not match any of the enum options, Zod enum
                validation will produce an error. You can customize the error
                message to provide more meaningful feedback.
              </Typography>
              <CodeBox>
                {`
const CustomErrorEnum = z.enum(['Success', 'Failure']).refine(val => val === 'Success', {
  message: 'Only "Success" is allowed.',
});

const invalidResult = CustomErrorEnum.safeParse('Failure');
console.log(invalidResult.error.format()); // Custom error message
                `}
              </CodeBox>
              <Typography variant="h2" gutterBottom>
                Zod Enum with Arrays
              </Typography>
              <Typography variant="body1" paragraph>
                Enums can also be used within arrays for more complex validation
                scenarios. For example, you might have an array of colors where
                each color must be one of the predefined enum values.
              </Typography>
              <CodeBox>
                {`
const ColorArrayEnum = z.array(ColorEnum);

const colorsResult = ColorArrayEnum.safeParse(['Red', 'Green']);
console.log(colorsResult); // { success: true, data: ['Red', 'Green'] }

const invalidColorsResult = ColorArrayEnum.safeParse(['Red', 'Yellow']);
console.log(invalidColorsResult.error.format()); // Error due to 'Yellow' not being in the enum
                `}
              </CodeBox>
              <Typography variant="h2" gutterBottom>
                Zod Enum from Object Keys
              </Typography>
              <Typography variant="body1" paragraph>
                In some cases, you might want to create a Zod enum based on the
                keys of an object. This can be done dynamically by extracting
                the keys and using them to define the enum.
              </Typography>
              <CodeBox>
                {`
const statusObject = {
  Pending: 'Pending',
  InProgress: 'InProgress',
  Completed: 'Completed',
};

const StatusEnumFromObject = z.enum(Object.keys(statusObject) as ['Pending', 'InProgress', 'Completed']);

const statusResult = StatusEnumFromObject.safeParse('Pending');
console.log(statusResult); // { success: true, data: 'Pending' }
                `}
              </CodeBox>
              <Typography variant="h2" gutterBottom>
                Zod Enum with Numbers
              </Typography>
              <Typography variant="body1" paragraph>
                Zod enums can also be defined with numeric values. This is
                useful if your application requires enum values to be numbers
                rather than strings.
              </Typography>
              <CodeBox>
                {`
const NumericEnum = z.enum([1, 2, 3] as const);

// Validate numeric enum values
const validNumericResult = NumericEnum.safeParse(2);
console.log(validNumericResult); // { success: true, data: 2 }

const invalidNumericResult = NumericEnum.safeParse(4);
console.log(invalidNumericResult.error.format()); // Error due to '4' not being in the enum
                `}
              </CodeBox>
              <Typography variant="h2" gutterBottom>
                Zod Enum Optional
              </Typography>
              <Typography variant="body1" paragraph>
                Zod enums can be used with optional fields to allow for
                scenarios where the value may or may not be present.
              </Typography>
              <CodeBox>
                {`
const OptionalEnum = z.enum(['Active', 'Inactive']).optional();

// Validate optional enum values
const resultWithValue = OptionalEnum.safeParse('Active');
console.log(resultWithValue); // { success: true, data: 'Active' }

const resultWithoutValue = OptionalEnum.safeParse(undefined);
console.log(resultWithoutValue); // { success: true, data: undefined }
                `}
              </CodeBox>
              <Typography variant="h2" gutterBottom>
                Zod Enum vs Union
              </Typography>
              <Typography variant="body1" paragraph>
                When comparing Zod enum vs union, it’s important to note that
                while enums are great for defining a fixed set of named values,
                unions offer flexibility by allowing you to define multiple
                possible types.
              </Typography>
              <Typography variant="h4" gutterBottom>
                Zod Enum Example:
              </Typography>
              <CodeBox>
                {`
const RoleEnum = z.enum(['Admin', 'User', 'Guest']);
                `}
              </CodeBox>
              <Typography variant="h4" gutterBottom>
                Zod Union Example:
              </Typography>
              <CodeBox>
                {`
const RoleUnion = z.union([z.literal('Admin'), z.literal('User'), z.literal('Guest')]);
                `}
              </CodeBox>
              <Typography variant="body1" paragraph>
                Enums provide a more structured way to handle a specific set of
                values, while unions can be more flexible but less strict.
              </Typography>
              <Typography variant="h2" gutterBottom>
                Zod Enum Examples
              </Typography>
              <Typography variant="body1" paragraph>
                To cement your understanding, let’s look at a few more Zod enum
                examples:
              </Typography>
              <Typography variant="h4" gutterBottom>
                Enum for User Status
              </Typography>
              <CodeBox>
                {`
const UserStatusEnum = z.enum(['Active', 'Inactive', 'Suspended']);

const userStatusResult = UserStatusEnum.safeParse('Active');
console.log(userStatusResult); // { success: true, data: 'Active' }
                `}
              </CodeBox>
              <Typography variant="h4" gutterBottom>
                Enum for Order Status
              </Typography>
              <CodeBox>
                {`
const OrderStatusEnum = z.enum(['Pending', 'Shipped', 'Delivered']);

const orderStatusResult = OrderStatusEnum.safeParse('Shipped');
console.log(orderStatusResult); // { success: true, data: 'Shipped' }

const invalidOrderStatusResult = OrderStatusEnum.safeParse('Cancelled');
console.log(invalidOrderStatusResult.error.format()); // Error due to 'Cancelled' not being in the enum
                `}
              </CodeBox>
              <Typography variant="h4" gutterBottom>
                Enum with Mixed Types
              </Typography>
              <CodeBox>
                {`
const MixedEnum = z.union([z.literal('One'), z.literal(2)]);

const mixedEnumResult = MixedEnum.safeParse(2);
console.log(mixedEnumResult); // { success: true, data: 2 }

const invalidMixedEnumResult = MixedEnum.safeParse('Three');
console.log(invalidMixedEnumResult.error.format()); // Error due to 'Three' not being in the enum
                `}
              </CodeBox>
              <Typography variant="h2" gutterBottom>
                Conclusion
              </Typography>
              <Typography variant="body1" paragraph>
                Zod enum validation provides a robust and flexible way to handle
                predefined sets of values in your TypeScript applications. By
                using Zod enums, you can enforce constraints on data, ensure
                that values are among a set of valid options, and handle various
                scenarios such as enums with arrays, object keys, numbers, and
                optional fields.
              </Typography>
              <Typography variant="body1" paragraph>
                Through Zod enum validation, you gain strong type safety and
                clear validation logic, making your applications more reliable
                and easier to maintain. Whether you’re comparing Zod enums to
                native enums, exploring Zod enum vs union, or handling complex
                validation scenarios, Zod equips you with the tools to handle
                your data validation needs effectively.
              </Typography>
              <Typography variant="body1" paragraph>
                Feel free to experiment with the examples provided and adapt
                them to fit your specific use cases. By incorporating Zod enums
                into your projects, you can improve data integrity and enhance
                the overall quality of your applications. Happy coding!
              </Typography>
              <Typography variant="h2" gutterBottom>
                Sources
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Zod Documentation"
                    secondary="The official Zod documentation provides comprehensive information on all features, including enums and validation methods."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="TypeScript Handbook: Enums"
                    secondary="A detailed guide on TypeScript enums, useful for comparing with Zod enums."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Zod GitHub Repository"
                    secondary="The official GitHub repository for Zod, where you can find additional examples and community discussions."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="TypeScript Official Documentation"
                    secondary="The primary resource for understanding TypeScript features and best practices."
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
