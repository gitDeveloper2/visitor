"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import Link from "next/link";
import { fetchCategoriesForNavigation } from "../../../utils/categories";

interface Category {
  name: string;
  path: string;
  subcategories?: Array<{ name: string; path: string }>;
}

export default function NavLinks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategoriesForNavigation();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories for navigation:', error);
        // Fallback to minimal categories
        setCategories([
          { name: "Technology", path: "/categories/technology", subcategories: [] },
          { name: "Development", path: "/categories/development", subcategories: [] },
          { name: "Design", path: "/categories/design", subcategories: [] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Button
        component={Link}
        href="/"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Home
      </Button>
      
      <Button
        component={Link}
        href="/launch"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Apps
      </Button>
      
      <Button
        component={Link}
        href="/blogs"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Blogs
      </Button>
      
      <Button
        component={Link}
        href="/aboutus"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        About
      </Button>
      
      <Button
        component={Link}
        href="/contactus"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Contact
      </Button>
      
      <Button
        component={Link}
        href="/pricing"
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Pricing
      </Button>
      
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        Categories
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "categories-button",
        }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category.path}
            onClick={handleClose}
            component={Link}
            href={category.path}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            {category.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}