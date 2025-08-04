import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the home page with the new design
  redirect('/home');
}
