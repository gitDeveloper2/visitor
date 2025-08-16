import { Inter, Roboto, Poppins, Outfit, Plus_Jakarta_Sans, Albert_Sans } from 'next/font/google';

// Primary font - Inter for excellent readability
export const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Secondary font - Poppins for headings and UI elements
export const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

// Modern display font - Outfit for hero sections and large text
export const outfit = Outfit({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

// Professional font - Plus Jakarta Sans for body text
export const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Clean font - Albert Sans for technical content
export const albertSans = Albert_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-albert',
});

// Legacy fonts for backward compatibility
export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

// Font class combinations
export const fontClasses = {
  primary: `${inter.variable} ${poppins.variable}`,
  modern: `${outfit.variable} ${plusJakartaSans.variable}`,
  technical: `${albertSans.variable} ${inter.variable}`,
  all: `${inter.variable} ${poppins.variable} ${outfit.variable} ${plusJakartaSans.variable} ${albertSans.variable}`,
};