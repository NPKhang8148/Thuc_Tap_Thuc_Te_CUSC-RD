import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Pagination,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete, Close, Search, Refresh } from "@mui/icons-material";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import * as mammoth from "mammoth";
import ImageResize from "quill-image-resize-module-react";

// Đăng ký module resize ảnh và video
Quill.register("modules/imageResize", ImageResize);

const API_URL = "http://localhost:5000/api/softwares";
const CATEGORY_API = "http://localhost:5000/api/categories";

const SoftwareManagement = () => {
  const [softwares, setSoftwares] = useState([]);
  const [categories, setCategories] = useState([]);

  // Bộ lọc
  const [searchTitle, setSearchTitle] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [softPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    images: [],
    wordFile: null,
    url: "",
  });

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
    imageResize: {
      displayStyles: {
        backgroundColor: "black",
        border: "none",
        color: "white",
      },
      modules: ["Resize", "DisplaySize", "Toolbar"],
    },
  };

  const formats = [
    "font",
    "size",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  useEffect(() => {
    fetchSoftwares();
    fetchCategories();
  }, []);

  const fetchSoftwares = async () => {
    try {
      const res = await axios.get(API_URL);
      setSoftwares(res.data);
    } catch (err) {
      console.error("Error fetching softwares:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ====== Lọc dữ liệu ======
  const filteredSoftwares = softwares.filter((s) => {
    const matchTitle = s.title?.toLowerCase().includes(searchTitle.toLowerCase());
    const matchContent = s.content?.toLowerCase().includes(searchContent.toLowerCase());
    const matchCategory =
      !selectedCategory || s.category?._id === selectedCategory;
    return matchTitle && matchContent && matchCategory;
  });

  // ====== Phân trang ======
  const indexOfLast = currentPage * softPerPage;
  const indexOfFirst = indexOfLast - softPerPage;
  const currentSoftwares = filteredSoftwares.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSoftwares.length / softPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleResetFilters = () => {
    setSearchTitle("");
    setSearchContent("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  // ====== CRUD ======
  const handleOpen = (software = null) => {
    if (software) {
      setEditingSoftware(software);
      setFormData({
        title: software.title || "",
        content: software.content || "",
        category: software.category?._id || "",
        images: software.images || [],
        wordFile: null,
        url: software.url || "",
      });
    } else {
      setEditingSoftware(null);
      setFormData({
        title: "",
        content: "",
        category: "",
        images: [],
        wordFile: null,
        url: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveUrl = () => {
    setFormData((prev) => ({ ...prev, url: "" }));
  };

  const handleWordUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer }, {
        convertImage: mammoth.images.inline((image) =>
          image.read("base64").then((imageBuffer) => ({
            src: `data:${image.contentType};base64,${imageBuffer}`,
          }))
        ),
      });

      let html = result.value
        .replace(/<p>/g, "<p style='margin-bottom:10px; line-height:1.6;'>")
        .replace(
          /<img/g,
          "<img style='max-width:100%; height:auto; display:block; margin:10px auto;'"
        );

      setFormData((prev) => ({
        ...prev,
        wordFile: file,
        content: prev.content + "<br/>" + html,
      }));
    } catch (err) {
      console.error("Error reading Word file:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title || "");
      formDataToSend.append("content", formData.content || "");
      formDataToSend.append("category", String(formData.category || ""));
      formDataToSend.append("url", formData.url ? String(formData.url).trim() : "");

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file) => {
          formDataToSend.append("images", file);
        });
      }

      if (formData.wordFile) {
        formDataToSend.append("file", formData.wordFile);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingSoftware) {
        await axios.put(`${API_URL}/${editingSoftware._id}`, formDataToSend, config);
      } else {
        await axios.post(`${API_URL}/add`, formDataToSend, config);
      }

      fetchSoftwares();
      handleClose();
    } catch (err) {
      console.error("Error saving software:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phần mềm này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchSoftwares();
      } catch (err) {
        console.error("Error deleting software:", err);
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý phần mềm
      </Typography>

      {/* Bộ lọc tìm kiếm */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="center"
        mb={3}
        p={2}
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <TextField
          label="Tìm theo tiêu đề"
          variant="outlined"
          size="small"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Tìm theo nội dung"
          variant="outlined"
          size="small"
          value={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Danh mục"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Refresh />}
          onClick={handleResetFilters}
        >
          Reset bộ lọc
        </Button>
      </Box>

      {/* Nút thêm */}
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => handleOpen()}
      >
        Thêm phần mềm
      </Button>

      {/* Bảng hiển thị */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Danh mục</TableCell>
            <TableCell>Nội dung</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Ảnh</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentSoftwares.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Không có dữ liệu phù hợp
              </TableCell>
            </TableRow>
          ) : (
            currentSoftwares.map((software, index) => (
              <TableRow key={software._id}>
                <TableCell>{indexOfFirst + index + 1}</TableCell>
                <TableCell>{software.title}</TableCell>
                <TableCell>
                  {software.category && typeof software.category === "object"
                    ? software.category.name
                    : "-"}
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <div
                    style={{ maxHeight: "120px", overflow: "hidden" }}
                    dangerouslySetInnerHTML={{ __html: software.content }}
                  />
                </TableCell>
                <TableCell>
                  {software.url ? (
                    <a
                      href={software.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue" }}
                    >
                      {software.url}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {software.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt="software"
                      style={{
                        width: "50px",
                        marginRight: "5px",
                        borderRadius: "4px",
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(software)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(software._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}

      {/* Dialog thêm/sửa phần mềm */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editingSoftware ? "Chỉnh sửa phần mềm" : "Thêm phần mềm"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tiêu đề phần mềm *"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <Typography variant="subtitle2">Upload file Word</Typography>
            <input type="file" accept=".doc,.docx" onChange={handleWordUpload} />
          </Box>

          <Box mt={2}>
            <Typography variant="subtitle2">Nội dung *</Typography>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value }))
              }
              modules={modules}
              formats={formats}
              style={{ height: "350px", marginBottom: "50px" }}
            />
          </Box>

          <TextField
            margin="dense"
            label="Đường dẫn URL"
            name="url"
            fullWidth
            value={formData.url}
            onChange={handleChange}
            InputProps={{
              endAdornment:
                formData.url && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleRemoveUrl} size="small">
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
            }}
          />

          <Box mt={2}>
            <Typography variant="subtitle2">Ảnh minh họa</Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />

            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {formData.images.map((img, idx) => (
                <Box key={idx} sx={{ position: "relative" }}>
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt="preview"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 6,
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      "&:hover": { backgroundColor: "red" },
                    }}
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingSoftware ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SoftwareManagement;
