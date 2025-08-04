// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/blog/Understanding_GitHub_Actions_Workflow_Dispatch',
        destination: '/blog/understanding_github_actions_workflow_dispatch2', // Redirect to a 404 page or another relevant page
        permanent: true, // or false if it's a temporary redirect
      },
      {
        source: '/blog/lucid_react_icons',
        destination: '/blog/lucide_react_icons', // Redirect to a 404 page or another relevant page
        permanent: true, // or false if it's a temporary redirect
      },
    ];
  },
 images: {
  unoptimized:true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc*', // Allow images that match this pattern
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnail*', // Allow old thumbnail URLs
      },
    ],
  },
};

export default nextConfig;
