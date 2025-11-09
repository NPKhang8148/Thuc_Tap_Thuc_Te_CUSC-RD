// src/pages/ToolManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/tools";

export default function ToolManagement() {
  const [tools, setTools] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", url: "" });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  // phân trang + tìm kiếm + filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // fetch tools từ backend (đã có field hidden)
  const fetchTools = async () => {
    try {
      const res = await axios.get(API_URL);
      const sorted = [...res.data].reverse();
      setTools(sorted);
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // mở dialog
  const handleOpen = (tool = null) => {
    if (tool) {
      setForm({
        name: tool.name,
        description: tool.description,
        url: tool.url,
      });
      setEditingId(tool._id);
    } else {
      setForm({ name: "", description: "", url: "" });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // thêm / sửa tool
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      setForm({ name: "", description: "", url: "" });
      setEditingId(null);
      fetchTools();
      handleClose();
    } catch (error) {
      console.error("Error saving tool:", error);
    }
  };

  // xóa tool
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tool này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTools();
      } catch (error) {
        console.error("Error deleting tool:", error);
      }
    }
  };

  // toggle ẩn / hiện tool — gọi API backend
  const toggleToolVisibility = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/toggle`);
      fetchTools();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  // lọc + tìm kiếm
  const filteredTools = tools
    .filter((tool) => tool.name.toLowerCase().includes(search.toLowerCase()))
    .filter((tool) => {
      if (filter === "visible") return !tool.hidden;
      if (filter === "hidden") return tool.hidden;
      return true;
    });

  const totalPages = Math.ceil(filteredTools.length / rowsPerPage);
  const paginatedTools = filteredTools.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Tools
      </Typography>

      {/* Thanh hành động */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Thêm Tool
        </Button>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Tìm kiếm tool..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <FormControl size="small">
            <InputLabel>Bộ lọc</InputLabel>
            <Select
              value={filter}
              label="Bộ lọc"
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="visible">Đang hiển thị</MenuItem>
              <MenuItem value="hidden">Đang ẩn</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên Tool</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedTools.map((tool, index) => (
              <TableRow key={tool._id} sx={{ opacity: tool.hidden ? 0.5 : 1 }}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.description}</TableCell>
                <TableCell>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    {tool.url}
                  </a>
                </TableCell>

                <TableCell>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => handleOpen(tool)}
                    size="small"
                  />

                  <Button
                    startIcon={<Delete />}
                    onClick={() => handleDelete(tool._id)}
                    size="small"
                    color="error"
                  />

                  {/* toggle ẩn / hiện */}
                  <Button
                    startIcon={tool.hidden ? <Visibility /> : <VisibilityOff />}
                    onClick={() => toggleToolVisibility(tool._id)}
                    size="small"
                    color={tool.hidden ? "primary" : "warning"}
                  />
                </TableCell>
              </TableRow>
            ))}

            {paginatedTools.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy tool nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, v) => setPage(v)}
          />
        </Stack>
      )}

      {/* Dialog thêm/sửa */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Chỉnh sửa Tool" : "Thêm Tool"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên Tool"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL"
            fullWidth
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
