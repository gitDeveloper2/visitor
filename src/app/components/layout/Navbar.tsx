"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import withMetrics from "../../../lib/Metrics";
import NavLogo from "@components/navbar/NavLogo";
import NavLinks from "@components/navbar/NavLinks";
import { Category } from "../../data/CatgoriesData";
import { usePathname } from "next/navigation";
import Auth from "./Auth";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { DonateButton } from "@/features/shared/components/PaypallDonation";
import { BuyMeCoffee } from "@/features/shared/components/BuyMeCofee";
import ThemeToggle from "@/app/components/ThemeToggle";

interface NavBarProps {
  categories: Category[];
}

const NavBar: React.FC<NavBarProps> = ({ categories }) => {
  const pathname = usePathname();
  const shouldHideNavbar = pathname.startsWith("/content/");

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  if (shouldHideNavbar) return null;

  return (
    <>
      <AppBar position="sticky" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <NavLogo />
            {mounted &&
              (isMobile ? (<> 
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  {/* <BuyMeCoffee /> */}
  <IconButton onClick={toggleDrawer} edge="end" size="large">
    <MenuIcon />
  </IconButton>
</Box>

                </>
              ) : (
                <>
                  <NavLinks categories={categories} />
                  <ThemeToggle />
                  <Auth isMobile={isMobile}/>
                </>
              ))}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            p: 2,
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 4 }}>
            <NavLinks categories={categories} />
            <Box sx={{ mt: 2 }}>
  {/* <BuyMeCoffee /> */}
</Box>

            {/* <Box sx={{ mt: 2 }}>
              <Auth isMobile={isMobile}  />
            </Box> */}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default withMetrics(NavBar);
