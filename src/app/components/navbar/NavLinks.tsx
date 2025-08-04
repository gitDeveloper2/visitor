import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { links } from "../../data/HeaderData";
import { categories, Category } from "../../data/CatgoriesData";
import DrawerItem from "@components/layout/DrawerItem";
import { DropdownMenu } from "./DropDown";
import CategoriesDropdown from "./CategoriesDropdown";

interface NavLinkProps{
  categories:Category[]
}

const NavLinks: React.FC<NavLinkProps> = ({categories}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<{
    apps: HTMLElement | null;
    tutorials: HTMLElement | null;
    categories: HTMLElement | null;
  }>({
    apps: null,
    tutorials: null,
    categories: null,
  });

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    menu: "apps" | "tutorials" | "categories"
  ) => {
    setAnchorEl((prev) => ({ ...prev, [menu]: event.currentTarget }));
  };

  const handleMenuClose = (menu: "apps" | "tutorials" | "categories") => {
    setAnchorEl((prev) => ({ ...prev, [menu]: null }));
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2,  flexDirection: { xs: "column", md: "row" },
  }}>
      <Link
        href={links.home.path}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {links.home.name}
      </Link>

      <Box sx={{ display: { xs: "block", sm: "none" } }}>
       
        <DrawerItem categories={categories} />
      </Box>

      <DropdownMenu
        title="Apps"
        menuItems={links.apps}
        onMenuClose={() => handleMenuClose("apps")}
        anchorEl={anchorEl.apps}
        onMenuOpen={(e) => handleMenuClick(e, "apps")}
      />

      {/* <DropdownMenu
        title="Learning"
        menuItems={links.tutorials.filter((item) => item.name !== "Home")}
        onMenuClose={() => handleMenuClose("tutorials")}
        anchorEl={anchorEl.tutorials}
        onMenuOpen={(e) => handleMenuClick(e, "tutorials")}
      /> */}

      {/* CategoriesDropdown */}
      {/* <CategoriesDropdown categories={categories} /> */}
      
    </Box>
  );
};

export default NavLinks;