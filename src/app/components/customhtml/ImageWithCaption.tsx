import Image from 'next/image';
import { styled, useTheme } from '@mui/material/styles';
import { CSSProperties, FC } from 'react';
import { useMediaQuery } from '@mui/material';
import Kimage from '@components/ClientSideImage';

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption: string;
  attribution?: {
    url: string;
    text: string;
  };
  isAboveFold?: boolean;
}

const imageQuality = Number(process.env.IMAGE_QUALITY) || 75;

const Figure = styled('figure')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: "32px 0",
  padding: 0,
  textAlign: 'center',
  width: '100%',
}));

const StyledImageWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  maxWidth: '700px',
  height: '400px',
  overflow: 'hidden',
});

const Figcaption = styled('figcaption')(({ theme }) => ({
  ...theme.typography.caption,
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

const ImageWithCaption: FC<ImageWithCaptionProps> = ({ src, alt, caption, attribution, isAboveFold = false }) => {

  const theme = useTheme();
  const isNonMobile = useMediaQuery(theme.breakpoints.up('sm')); // Define breakpoint for non-mobile devices
 // Conditional props
 const imageProps = isNonMobile
 ? {
     sizes: '(max-width: 700px) 100vw, 700px',
     style: { objectFit: 'contain' as CSSProperties['objectFit'] }, // Ensure type matches
   }
 : {};
  return(
    <Figure>
      <StyledImageWrapper>
      <Kimage
          src={src}
          alt={alt}
          // fill
          // quality={imageQuality}
          // priority={false}
          {...imageProps} 

        />
      
        {/* <Image 
          src={src}
          alt={alt}
          fill
          quality={imageQuality}
          priority={false}
          {...imageProps} 

        /> */}
      </StyledImageWrapper>
      <Figcaption>
        <span>{alt}</span>
        {attribution && (
          <>
            <br />
            <a 
              href={attribution.url} 
              target="_blank" 
              rel="noopener noreferrer nofollow" 
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              {attribution.text}
            </a>
          </>
        )}
      </Figcaption>
    </Figure>
  )
};

export default ImageWithCaption;
