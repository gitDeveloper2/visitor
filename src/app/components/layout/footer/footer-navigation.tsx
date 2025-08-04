import React, { FC } from 'react'
import Link from 'next/link'
import Grid from '@mui/material/Grid'
import MuiLink from '@mui/material/Link'
import FooterSectionTitle from './footer-section-title'


export interface Navigation {
  label: string
  path: string
}

const aboutusMenu: Array<Navigation> = [
  {
    label: 'About Us',
    path: '/aboutus',
  },
  {
    label: 'Contact Us',
    path: '/contactus',
  },
  {
    label: 'FAQs',
    path: '/faqs',
  },
]

const legalMenu: Array<Navigation> = [
  {
    label: 'Privacy Policy',
    path: '/policy',
  },
  {
    label: 'Terms of Use',
    path: '/terms',
  },
  {
    label: 'Disclaimer',
    path: '/disclaimer',
  },
  {
    label: 'DMCA Policy',
    path: '/dcma-policy',
  },
]

const companyMenu: Array<Navigation> = [
  { label: 'Contact Us', path: '#' },
  { label: 'Privacy & Policy', path: '#' },
  { label: 'Term & Condition', path: '#' },
  { label: 'FAQ', path: '#' },
]

interface NavigationItemProps {
  label: string
  path: string
}

const NavigationItem: FC<NavigationItemProps> = ({ label, path }) => {
  return (
    <Link href={path} passHref>
      <MuiLink
        underline="hover"
        sx={{
          display: 'block',
          mb: 1,
          color: 'primary.contrastText',
        }}
      >
        {label}
      </MuiLink>
    </Link>
  )
}

const FooterNavigation: FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="About Company" />
        {aboutusMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path={path} />
        ))}
      </Grid>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="Legal" />
        {legalMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path={path} />
        ))}
      </Grid>
      {/* <Grid item xs={12} md={4}>
        <FooterSectionTitle title="About" />
        {companyMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path={path} />
        ))}
      </Grid> */}
    </Grid>
  )
}

export default FooterNavigation
