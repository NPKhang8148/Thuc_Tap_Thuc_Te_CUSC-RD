import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Add, Edit, Visibility } from "@mui/icons-material";
import axios from "axios";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' hoặc 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Mở dialog tạo / chỉnh sửa
  const handleOpenForm = (mode, category = null) => {
    setFormMode(mode);
    setSelectedCategory(category);
    setFormData(category || { name: "" });
    setOpenForm(true);
  };

  // Mở dialog xem chi tiết
  const handleOpenDetail = (category) => {
    setSelectedCategory(category);
    setOpenDetail(true);
  };

  // Gửi form
  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        await axios.post("http://localhost:5000/api/categories", formData);
      } else {
        await axios.put(
          `http://localhost:5000/api/categories/${selectedCategory._id}`,
          formData
        );
      }
      setOpenForm(false);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Quản lý Danh mục
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenForm("create")}
        sx={{ mb: 2 }}
      >
        Tạo danh mục
      </Button>

      {/* Bảng danh mục */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>STT</strong></TableCell>
            <TableCell><strong>Tên danh mục</strong></TableCell>
            <TableCell><strong>Hành động</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((cat, index) => (
            <TableRow key={cat._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDetail(cat)}>
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => handleOpenForm("edit", cat)}>
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Không có danh mục nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog tạo / chỉnh sửa */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>
          {formMode === "create" ? "Tạo danh mục" : "Chỉnh sửa danh mục"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên danh mục"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {formMode === "create" ? "Tạo" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chi tiết */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth>
        <DialogTitle>Chi tiết danh mục</DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <>
              <Typography><strong>ID:</strong> {selectedCategory._id}</Typography>
              <Typography><strong>Tên:</strong> {selectedCategory.name}</Typography>
              <Typography>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(selectedCategory.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Ngày cập nhật:</strong>{" "}
                {new Date(selectedCategory.updatedAt).toLocaleString()}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CategoryManagement;
