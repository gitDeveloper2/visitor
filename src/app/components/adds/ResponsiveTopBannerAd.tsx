"use client"
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { TopBannerAd } from './TopBannerAd';
import { SidebarSquareAd } from './SidebarSquarAd';
import { adsController } from '../../../utils/adsController';


export const ResponsiveTopBannerAd = () => {
    const theme = useTheme();
    if (adsController()) return null;

 const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // Large screens (lg and above)




return isLargeScreen ? <TopBannerAd /> :
<Box
sx={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}
>
<SidebarSquareAd />
</Box>


}