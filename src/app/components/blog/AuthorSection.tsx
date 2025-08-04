import React from 'react';
import Image from 'next/image';
import { Box, Typography, Link } from '@mui/material';
import { Twitter, Facebook, LinkedIn, Email, Web } from '@mui/icons-material';
import Kimage from '@components/ClientSideImage';

interface AuthorProps {
  name: string;
  bio: string;
  photoUrl: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    email?: string;
    link?: string;
  };
}

const AuthorSection: React.FC<AuthorProps> = ({ name, bio, photoUrl, socialLinks }) => {
  const platformIcons: { [key: string]: React.ReactNode } = {
    twitter: <Twitter fontSize="small" />,
    facebook: <Facebook fontSize="small" />,
    linkedin: <LinkedIn fontSize="small" />,
    email: <Email fontSize="small" />,
    link: <Web fontSize="small" />,
  };

  return (
    <Box component="section" sx={{ marginY: 6 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 4 }} gutterBottom>
        About the Author
      </Typography>
      <Box
        component="figure"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on larger screens
          alignItems: { xs: 'center', sm: 'flex-start' },
          margin: 0,
          padding: 0,
          gap: 2, // Space between elements
        }}
      >
        {/* Author Photo */}
        <Kimage
          src={photoUrl}
          alt={`${name}'s photo`}
          width={100}
          height={100}
          sx={{ borderRadius: '50%' }}
        />
        {/* Author Details */}
        <Box
          component="figcaption"
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="h6" component="h3">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {bio}
          </Typography>
        </Box>
      </Box>

      {/* Social Links */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: { xs: 'center', sm: 'flex-end' },
          marginTop: 3,
        }}
      >
        {Object.entries(socialLinks).map(
          ([platform, url]) =>
            url &&
            platformIcons[platform] && (
              <Link
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${platform}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'color 0.3s ease',
                  '&:hover': { color: '#1976d2' },
                }}
              >
                {platformIcons[platform]}
              </Link>
            )
        )}
      </Box>
    </Box>
  );
};

export default AuthorSection;
