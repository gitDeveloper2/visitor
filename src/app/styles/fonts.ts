import { Roboto, Poppins } from 'next/font/google';

// font subsetting
export const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
});