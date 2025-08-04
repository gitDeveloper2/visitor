"use client"
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { TopBannerAd } from './TopBannerAd';
import { SidebarSquareAd } from './SidebarSquarAd';
import { SidebarLongAd } from './SidebarLongAd';
import { adsController } from '../../../utils/adsController';
export const ResponsiveSidebarAd = () => {
    const theme = useTheme();
    if (adsController()) return null;

 const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // Large screens (lg and above)



return isLargeScreen ? <SidebarLongAd /> :
null


}