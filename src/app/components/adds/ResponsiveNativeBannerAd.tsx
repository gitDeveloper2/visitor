"use client"
import { useMediaQuery, useTheme } from '@mui/material';
import { SidebarSquareAd } from './SidebarSquarAd';
import { NativeBannerAd } from './NativeBannerAd';
import { adsController } from '../../../utils/adsController';
export const ResponsiveNativeBannerAd = () => {
    const theme = useTheme();
    if (adsController()) return null;


    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // Large screens (lg and above)



return isLargeScreen ? <NativeBannerAd /> :
<SidebarSquareAd/>


}