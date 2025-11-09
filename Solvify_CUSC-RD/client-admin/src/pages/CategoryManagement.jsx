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
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import { Add, Edit, Visibility, Delete } from "@mui/icons-material";
import axios from "axios";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Pagination
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      const sorted = [...res.data].reverse();
      setCategories(sorted);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Form
  const handleOpenForm = (mode, category = null) => {
    setFormMode(mode);
    setSelectedCategory(category);
    setFormData(category || { name: "" });
    setOpenForm(true);
  };

  // Open Detail
  const handleOpenDetail = (category) => {
    setSelectedCategory(category);
    setOpenDetail(true);
  };

  // Submit
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

  // Xóa danh mục (dựa trên logic backend)
  const handleDeleteCategory = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/categories/${id}`
      );

      setAlert({
        open: true,
        message: res.data.message || "Xóa danh mục thành công",
        severity: "success",
      });

      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi xóa danh mục:", err);
      setAlert({
        open: true,
        message:
          err.response?.data?.message ||
          "Không thể xóa danh mục (có thể còn phần mềm trực thuộc).",
        severity: "error",
      });
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>STT</strong>
            </TableCell>
            <TableCell>
              <strong>Tên danh mục</strong>
            </TableCell>
            <TableCell>
              <strong>Hành động</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedCategories.map((cat, index) => (
            <TableRow key={cat._id}>
              <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{cat.name}</TableCell>

              <TableCell>
                <IconButton onClick={() => handleOpenDetail(cat)}>
                  <Visibility />
                </IconButton>

                <IconButton
                  color="primary"
                  onClick={() => handleOpenForm("edit", cat)}
                >
                  <Edit />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => handleDeleteCategory(cat._id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Không có danh mục nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Form */}
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

      {/* Detail */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth>
        <DialogTitle>Chi tiết danh mục</DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <>
              <Typography>
                <strong>ID:</strong> {selectedCategory._id}
              </Typography>
              <Typography>
                <strong>Tên:</strong> {selectedCategory.name}
              </Typography>
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

      {/* Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CategoryManagement;
