// SoftwareManagement.jsx 
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
import {
  Add,
  Edit,
  Delete,
  Close,
  Search,
  Refresh,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import * as mammoth from "mammoth";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

const API_URL = "http://localhost:5000/api/softwares";
const CATEGORY_API = "http://localhost:5000/api/categories";

const SoftwareManagement = () => {
  const [softwares, setSoftwares] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [searchTitle, setSearchTitle] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [softPerPage] = useState(5);

  // Dialog
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

  // Quill config
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
      displayStyles: { backgroundColor: "black", color: "white" },
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

  // ============================ FETCH DATA ===============================
  useEffect(() => {
    fetchSoftwares();
    fetchCategories();
  }, []);

  const fetchSoftwares = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { includeHidden: true },
      });

      // Chuẩn hoá dữ liệu cũ (không có hidden)
      const normalized = res.data.map((s) => ({
        ...s,
        hidden: typeof s.hidden === "boolean" ? s.hidden : false,
      }));

      setSoftwares(normalized.reverse());
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

  // ============================ HIDE / SHOW =============================
  const toggleHidden = async (id) => {
    try {
      const target = softwares.find((s) => s._id === id);
      const newHidden = !(target?.hidden ?? false);

      const res = await axios.put(
        `${API_URL}/${id}`,
        { hidden: newHidden }, // gửi JSON, không dùng FormData
        { headers: { "Content-Type": "application/json" } }
      );

      setSoftwares((prev) =>
        prev.map((s) => (s._id === id ? { ...s, hidden: res.data.hidden } : s))
      );
    } catch (err) {
      console.error("Error toggling hidden:", err);
    }
  };

  // ============================ FILTERING ===============================
  const filteredSoftwares = softwares.filter((s) => {
    const matchTitle = s.title
      ?.toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchContent = s.content
      ?.toLowerCase()
      .includes(searchContent.toLowerCase());
    const matchCategory =
      !selectedCategory || s.category?._id === selectedCategory;

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "visible" && !s.hidden) ||
      (statusFilter === "hidden" && s.hidden);

    return matchTitle && matchContent && matchCategory && matchStatus;
  });

  // ============================ PAGINATION ==============================
  const indexOfLast = currentPage * softPerPage;
  const indexOfFirst = indexOfLast - softPerPage;
  const currentSoftwares = filteredSoftwares.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSoftwares.length / softPerPage);

  const handlePageChange = (_, value) => setCurrentPage(value);

  const handleResetFilters = () => {
    setSearchTitle("");
    setSearchContent("");
    setSelectedCategory("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // ============================ CRUD ===================================
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
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveUrl = () => setFormData((prev) => ({ ...prev, url: "" }));

  const handleWordUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          convertImage: mammoth.images.inline((image) =>
            image.read("base64").then((img) => ({
              src: `data:${image.contentType};base64,${img}`,
            }))
          ),
        }
      );

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
      const hasImages =
        formData.images && formData.images.some((i) => typeof i !== "string");
      const hasFile = !!formData.wordFile;
      const isMultipart = hasImages || hasFile;

      let payload;
      let headers;

      if (!isMultipart) {
        // Không có file → gửi JSON
        payload = {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          url: formData.url.trim(),
        };

        headers = { "Content-Type": "application/json" };
      } else {
        // Có file → FormData + multipart
        payload = new FormData();
        payload.append("title", formData.title);
        payload.append("content", formData.content);
        payload.append("category", String(formData.category || ""));
        payload.append("url", formData.url.trim());

        if (hasImages) {
          formData.images.forEach((file) => {
            if (typeof file !== "string") payload.append("images", file);
          });
        }

        if (hasFile) payload.append("file", formData.wordFile);

        headers = { "Content-Type": "multipart/form-data" };
      }

      // UPDATE
      if (editingSoftware) {
        await axios.put(`${API_URL}/${editingSoftware._id}`, payload, {
          headers,
        });
      } else {
        // ADD
        await axios.post(`${API_URL}/add`, payload, { headers });
      }

      fetchSoftwares();
      handleClose();
    } catch (err) {
      console.error("Error saving software:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phần mềm này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchSoftwares();
    } catch (err) {
      console.error("Error deleting software:", err);
    }
  };

  // ============================ UI ====================================
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý phần mềm
      </Typography>

      {/* ================== FILTERS ================== */}
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

        {/* FILTER hidden/visible */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="visible">Đang hiển thị</MenuItem>
            <MenuItem value="hidden">Đang ẩn</MenuItem>
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

      {/* ADD */}
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => handleOpen()}
      >
        Thêm phần mềm
      </Button>

      {/* TABLE */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Danh mục</TableCell>
            <TableCell>Nội dung</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Ảnh</TableCell>
            <TableCell>Ẩn/Hiện</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {currentSoftwares.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                Không có dữ liệu phù hợp
              </TableCell>
            </TableRow>
          ) : (
            currentSoftwares.map((software, index) => (
              <TableRow key={software._id}>
                <TableCell>{indexOfFirst + index + 1}</TableCell>

                <TableCell sx={{ opacity: software.hidden ? 0.4 : 1 }}>
                  {software.title}
                </TableCell>

                <TableCell>
                  {software.category && typeof software.category === "object"
                    ? software.category.name
                    : "-"}
                </TableCell>

                <TableCell sx={{ maxWidth: 300 }}>
                  <div
                    style={{
                      maxHeight: "120px",
                      overflow: "hidden",
                      opacity: software.hidden ? 0.4 : 1,
                    }}
                    dangerouslySetInnerHTML={{ __html: software.content }}
                  />
                </TableCell>

                <TableCell>
                  {software.url ? (
                    <a
                      href={software.url}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        borderRadius: 4,
                        opacity: software.hidden ? 0.4 : 1,
                      }}
                    />
                  ))}
                </TableCell>

                {/* Ẩn / Hiện */}
                <TableCell>
                  <IconButton onClick={() => toggleHidden(software._id)}>
                    {software.hidden ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </TableCell>

                <TableCell>
                  <IconButton
                    onClick={() => handleOpen(software)}
                    color="primary"
                  >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Stack>
      )}

      {/* DIALOG */}
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
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleWordUpload}
            />
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
              endAdornment: formData.url && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleRemoveUrl}>
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
                      color: "white",
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
