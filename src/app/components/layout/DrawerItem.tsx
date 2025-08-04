import React, { useState } from "react";
import { ClickAwayListener, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, Collapse, Typography } from "@mui/material";
import { ChevronLeft, Menu as MenuIcon } from "@mui/icons-material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import styled from '@emotion/styled';
import Link from "next/link";
import { links } from "../../data/HeaderData"; // Assuming your data is in this file
import { Category } from "../../data/CatgoriesData";

const DrawerHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '8px 8px',
});

const CategoryHeader = styled(Typography)({
  fontSize: '18px',
  fontWeight: 'bold',
  padding: '12px 16px',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #ddd',
});

const SubcategoryList = styled(List)({
  paddingLeft: '20px',
  paddingTop: '8px',
});

const CategoryItem = styled(ListItem)({
  padding: '10px 16px',
  fontSize: '16px',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

const DrawerItem: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
    
            <Divider />
            <List
              sx={{
                maxHeight: '400px',  // Make the categories scrollable if they exceed this height
                overflowY: 'auto',
              }}
            >
              {/* Apps Section */}
              <List>
                {links.apps.map((item, index) => (
                  <CategoryItem  key={index} onClick={handleDrawerClose}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      {item.name}
                    </Link>
                  </CategoryItem>
                ))}
              </List>

              {/* Learning Section */}
              {/* <List>
                {links.tutorials.map((item, index) => (
                  <CategoryItem  key={index} onClick={handleDrawerClose}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                      {item.name}
                    </Link>
                  </CategoryItem>
                ))}
              </List> */}

              {/* Categories Section */}
              <List>
                <CategoryHeader>Categories</CategoryHeader>
                {categories.map((category) => (
                  <div key={category.path}>
                    {/* Main Category Item */}
                    <CategoryItem  onClick={() => toggleCategory(category.name)}>
                      <ListItemIcon>
                        {/* Optional Icon here */}
                      </ListItemIcon>
                      <span>{category.name}</span>
                      {openCategories[category.name] ? <ExpandLess /> : <ExpandMore />}
                    </CategoryItem>

                    {/* Subcategories List */}
                    {category.subcategories && (
                      <Collapse in={openCategories[category.name]} timeout="auto" unmountOnExit={false}>
                        <SubcategoryList >
                          {category.subcategories.map((subcat) => (
                            <CategoryItem key={subcat.path} onClick={handleDrawerClose}>
                              <Link
                                href={subcat.path}
                                style={{
                                  textDecoration: 'none',
                                  color: 'inherit',
                                  width: '100%',
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
          
    </>
  );
};

export default DrawerItem;
