"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Link from "next/link";
import { fetchCategoriesForNavigation } from "../../../utils/categories";

interface Category {
  name: string;
  path: string;
  subcategories?: Array<{ name: string; path: string }>;
}

const CategoryItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CategoryHeader = styled(ListItemText)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  padding: theme.spacing(1, 2),
}));

const SubcategoryList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  backgroundColor: "#f0f0f0",
}));

const DrawerItem: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategoriesForNavigation();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories for drawer:', error);
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

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  if (loading) {
    return (
      <div>
        <CategoryItem onClick={handleDrawerOpen}>
          <ListItemText primary="Loading categories..." />
        </CategoryItem>
      </div>
    );
  }

  return (
    <>
      <CategoryItem onClick={handleDrawerOpen}>
        <ListItemText primary="Categories" />
      </CategoryItem>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <List>
          <CategoryHeader primary="Categories" />
          <Divider />
          <List
            sx={{
              maxHeight: '400px',  // Make the categories scrollable if they exceed this height
              overflowY: 'auto',
            }}
          >
            {/* Categories Section */}
            <List>
              <CategoryHeader>Categories</CategoryHeader>
              {categories.map((category) => (
                <div key={category.path}>
                  {/* Main Category Item */}
                  <CategoryItem onClick={() => toggleCategory(category.name)}>
                    <ListItemIcon>
                      {/* Optional Icon here */}
                    </ListItemIcon>
                    <span>{category.name}</span>
                    {openCategories[category.name] ? <ExpandLess /> : <ExpandMore />}
                  </CategoryItem>

                  {/* Subcategories List */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <Collapse in={openCategories[category.name]} timeout="auto" unmountOnExit={false}>
                      <SubcategoryList>
                        {category.subcategories.map((subcat) => (
                          <CategoryItem key={subcat.path} onClick={handleDrawerClose}>
                            <Link
                              href={subcat.path}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                                width: "100%",
                              }}
                            >
                              {subcat.name}
                            </Link>
                          </CategoryItem>
                        ))}
                      </SubcategoryList>
                    </Collapse>
                  )}
                </div>
              ))}
            </List>
          </List>
        </List>
      </Drawer>
    </>
  );
};

export default DrawerItem;
