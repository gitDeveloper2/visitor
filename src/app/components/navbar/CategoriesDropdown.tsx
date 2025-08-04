import React, { useState } from "react";
import { Box, Button, List, ListItem, Collapse, ClickAwayListener } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

interface Category {
  name: string;
  path: string;
  subcategories?: Category[];
}

interface CategoriesDropdownProps {
  categories: Category[];
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ categories }) => {
  const theme = useTheme();
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setOpenCategories({});
  };

  return (
    <ClickAwayListener onClickAway={handleMenuClose}>
      <Box
        sx={{
          display: "none",
          [theme.breakpoints.up("sm")]: {
            display: "block",
          },
          position: "relative",
        }}
      >
        <Button
          color="inherit"
          sx={{ textTransform: "none", padding: "8px 16px" }}
          onClick={handleMenuToggle}
        >
          CATEGORIES
          {menuOpen ? <ExpandLess /> : <ExpandMore />}
        </Button>
        <Collapse
          in={menuOpen}
          timeout="auto"
          unmountOnExit={false}
          sx={{
            position: "absolute",
            backgroundColor: "white",
            boxShadow: theme.shadows[3],
            zIndex: theme.zIndex.modal,
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <List
            component="div"
            disablePadding
            sx={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              maxHeight: "300px", // Limit height for scroll
              overflowY: "auto",  // Enable vertical scrolling
            }}
          >
            {categories.map((category) =>
              category.subcategories ? (
                <Box key={`box-${category.path}`}>
                  <ListItem
                    button
                    onClick={() => toggleCategory(category.name)}
                    sx={{
                      justifyContent: "space-between",
                      padding: "8px 16px",
                      borderBottom: "1px solid #ddd",
                      color: "black",
                      "&:hover": {
                        backgroundColor: theme.palette.grey[200],
                      },
                    }}
                  >
                    {category.name}
                    {openCategories[category.name] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={openCategories[category.name]}
                    timeout="auto"
                    unmountOnExit={false}
                  >
                    <List
                      component="div"
                      disablePadding
                      sx={{
                        paddingLeft: 2,
                        backgroundColor: "#f9f9f9",
                        borderLeft: "2px solid #ddd",
                      }}
                    >
                      {category.subcategories.map((subcat) => (
                        <ListItem
                          key={`list-${subcat.path}`}
                          sx={{
                            padding: "8px 16px",
                            color: "black",
                            "&:hover": {
                              backgroundColor: theme.palette.grey[200],
                            },
                          }}
                          onClick={handleMenuClose}
                        >
                          <Link
                            href={subcat.path}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              display: "block",
                              width: "100%",
                            }}
                          >
                            {subcat.name}
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              ) : (
                <ListItem
                  key={`list-item-${category.path}`}
                  sx={{
                    padding: "8px 16px",
                    borderBottom: "1px solid #ddd",
                    color: "black",
                    "&:hover": {
                      backgroundColor: theme.palette.grey[200],
                    },
                  }}
                  onClick={handleMenuClose}
                >
                  <Link
                    href={category.path}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                      width: "100%",
                    }}
                  >
                    {category.name}
                  </Link>
                </ListItem>
              )
            )}
          </List>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default CategoriesDropdown;