import React from "react";
import { Box, Typography } from "@mui/material";

const NavLogo: React.FC = () => {
  // console.log("nav logo")
  return (
    <Typography variant='h5' component={'h1'} sx={{
       color:'primary.main',
       '& span':{
           color:'secondary.dark'
       }
   }}>Basic<span>Utils</span></Typography>

);
};

export default NavLogo;
