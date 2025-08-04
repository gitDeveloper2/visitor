'use client';

import { Button } from '@mui/material';
import PayPalIcon from '@mui/icons-material/AttachMoney';

const showDonate = process.env.NEXT_PUBLIC_SHOW_DONATE_BUTTON === 'true';
const donateLink = process.env.NEXT_PUBLIC_PAYPAL_DONATE_LINK;

export const DonateButton = () => {
  if (!showDonate || !donateLink) return null;

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<PayPalIcon />}
      href={donateLink}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ textTransform: 'none', fontWeight: 600 }}
    >
      Donate via PayPal
    </Button>
  );
};
