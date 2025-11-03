// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";

const Sidebar = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress size={24} />
      </Box>
    );

  return (
    <Box
      sx={{
        height: "100%",
        py: 3,
        px: 2,
        background:
          "linear-gradient(180deg, rgba(245,247,250,1) 0%, rgba(255,255,255,1) 100%)",
        border: "1px solid #e0e0e0", // bo đều viền xung quanh
        borderRadius: "12px", //  viền bo tròn
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // bóng mềm hơn
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="bold">
          Danh mục
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List dense>
        <ListItemButton
          selected={!selectedCategory}
          onClick={() => onCategorySelect(null)}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "#fff",
              "&:hover": { backgroundColor: "primary.dark" },
            },
          }}
        >
          <ListItemText primary="Tất cả" />
        </ListItemButton>

        {categories.map((cat) => (
          <ListItemButton
            key={cat._id}
            selected={selectedCategory === cat._id}
            onClick={() => onCategorySelect(cat._id)}
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
              },
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "#fff",
                "&:hover": { backgroundColor: "primary.dark" },
              },
            }}
          >
            <ListItemText primary={cat.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
