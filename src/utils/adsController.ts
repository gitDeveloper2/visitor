'use client';

import { usePathname } from 'next/navigation';

export const adsController = () => {
    const pathname = usePathname();
    return pathname.includes('/content') || pathname.includes('/admin');
}