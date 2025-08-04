    import { DonateButton } from '@/features/shared/components/PaypallDonation';
    import { Box, Button } from '@mui/material';
    import React from 'react';
    import { BuyMeCoffee } from '../../../features/shared/components/BuyMeCofee';

    type AuthProps={
        isMobile:boolean
    }
    const Auth:React.FC<AuthProps> = ({isMobile}) => {
        return (
            <Box
  sx={{
    display: 'flex',
    gap: 2,
    justifyContent: isMobile ? 'flex-start' : 'center',
    alignItems: 'center',
  }}
>

                {/* <DonateButton/> */}
                {/* {!isMobile && <BuyMeCoffee />} */}
                <Button variant='outlined'>Sign Up</Button>
                <Button variant='contained'>Login</Button>

            </Box>
        );
    }

    export default Auth;
