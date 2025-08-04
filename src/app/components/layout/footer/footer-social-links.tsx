import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import FooterData, { SocialMedia } from '../../../data/FooterData'



interface SocialLinkItemProps {
  data: SocialMedia
}

const SocialLinkItem: FC<SocialLinkItemProps> = ({ data }) => (
  <Box
    component="li"
    sx={{
      display: 'inline-block',
      color: 'primary.contrastText',
      mr: 0.5,
    }}
  >
    <Link
      target="_blank"
      sx={{
        lineHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '50%',
        color: 'inherit',
        '&:hover': {
          backgroundColor: 'secondary.main',
        },
        '& img': {
          fill: 'currentColor',
          width: 22,
          height: 'auto',
        },
      }}
      href={data.path}
    >
      {/* eslint-disable-next-line */}
     {data.icon}
    </Link>
  </Box>
)

// default
const SocialLinks: FC = () => {
  return (
    <Box sx={{ ml: -1 }}>
      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          lineHeight: 0,
          borderRadius: 3,
          listStyle: 'none',
        }}
      >
         {FooterData.sections.filter(item=>{return item.name==="Social Media"}).map((item) => (
            item.socialMedia.map(i=>{
                return  <SocialLinkItem key={i.text} data={i} />
            })
          ))}
       
      </Box>
    </Box>
  )
}

export default SocialLinks
