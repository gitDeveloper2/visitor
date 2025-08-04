"use client";

import { styled } from '@mui/material/styles'


export const StyledDiv = styled("div")(({theme}) => ({
  backgroundColor:theme.palette.primary.main,
  padding:"0 10px",
  borderRadius:"3px",
  width:"40%",
  border:"2px solid green ",
  [theme.breakpoints.up("sm")]:{
    display: "flex"
  }
}));
