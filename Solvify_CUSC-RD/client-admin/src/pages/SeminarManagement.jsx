import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Pagination,
  Stack,
} from "@mui/material";
import { Edit, Delete, Close } from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const API_URL = "http://localhost:5000/api/seminars";

const SeminarManagement = () => {
  const [allSeminars, setAllSeminars] = useState([]); // toàn bộ dữ liệu
  const [seminars, setSeminars] = useState([]); // dữ liệu hiển thị (sau khi lọc + phân trang)
  const [openCreate, setOpenCreate] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState(null);

  // Bộ lọc
  const [searchTitle, setSearchTitle] = useState("");
  const [searchSpeaker, setSearchSpeaker] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Form
  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    speakers: [{ code: "", name: "", email: "" }],
    content: [{ type: "text", value: "" }],
  });

  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    speakers: [{ code: "", name: "", email: "" }],
    content: [{ type: "text", value: "" }],
  });

  // Toolbar ReactQuill
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };
  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "link",
    "image",
    "video",
  ];

  // === Lấy toàn bộ seminar từ API ===
  const fetchSeminars = async () => {
    try {
      const res = await axios.get(API_URL);
      let data = res.data.data || res.data.seminars || res.data;

      // Sắp xếp seminar mới nhất lên đầu
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllSeminars(data);
    } catch (err) {
      console.error("❌ Lỗi khi tải seminar:", err);
    }
  };

  // === Lọc + tìm kiếm + phân trang ===
  const applyFilters = () => {
    let filtered = [...allSeminars];

    // Tìm theo tiêu đề
    if (searchTitle.trim()) {
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Tìm theo tên diễn giả
    if (searchSpeaker.trim()) {
      filtered = filtered.filter((s) =>
        s.speakers?.some((sp) =>
          sp.name.toLowerCase().includes(searchSpeaker.toLowerCase())
        )
      );
    }

    // Lọc theo ngày cụ thể
    if (selectedDate) {
      filtered = filtered.filter(
        (s) => new Date(s.date).toISOString().split("T")[0] === selectedDate
      );
    }

    // Lọc theo tháng - năm
    if (month || year) {
      filtered = filtered.filter((s) => {
        const d = new Date(s.date);
        const seminarMonth = d.getMonth() + 1;
        const seminarYear = d.getFullYear();
        return (
          (!month || seminarMonth === parseInt(month)) &&
          (!year || seminarYear === parseInt(year))
        );
      });
    }

    // Sắp xếp lại (mới nhất trước)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Tính tổng số trang
    const pages = Math.ceil(filtered.length / limit);
    setTotalPages(pages);

    // Lấy dữ liệu theo trang hiện tại
    const startIdx = (page - 1) * limit;
    const paginated = filtered.slice(startIdx, startIdx + limit);

    setSeminars(paginated);
  };

  useEffect(() => {
    fetchSeminars();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    allSeminars,
    searchTitle,
    searchSpeaker,
    selectedDate,
    month,
    year,
    page,
  ]);

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSearchTitle("");
    setSearchSpeaker("");
    setSelectedDate("");
    setMonth("");
    setYear("");
    setPage(1);
  };

  // === CRUD ===
  const handleCreate = async () => {
    try {
      await axios.post(API_URL, form);
      alert("✅ Đã tạo seminar mới");
      setOpenCreate(false);
      fetchSeminars();
      setForm({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        speakers: [{ code: "", name: "", email: "" }],
        content: [{ type: "text", value: "" }],
      });
    } catch (err) {
      console.error("❌ Lỗi khi tạo seminar:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chuyên đề này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("🗑️ Đã xóa seminar");
        fetchSeminars();
      } catch (err) {
        console.error("❌ Lỗi khi xóa seminar:", err);
      }
    }
  };

  const handleOpenEdit = (seminar) => {
    let normalizedContent = [];

    if (Array.isArray(seminar.content)) {
      normalizedContent = seminar.content.map((c) => ({
        type: c.type || "text",
        value: c.value || "",
      }));
    } else if (typeof seminar.content === "string") {
      // Nếu API cũ trả về chuỗi JSON
      try {
        const parsed = JSON.parse(seminar.content);
        normalizedContent = Array.isArray(parsed)
          ? parsed
          : [{ type: "text", value: parsed }];
      } catch {
        normalizedContent = [{ type: "text", value: seminar.content }];
      }
    } else {
      normalizedContent = [{ type: "text", value: "" }];
    }

    setEditingSeminar(seminar);
    setEditForm({
      ...seminar,
      date: seminar.date ? seminar.date.split("T")[0] : "",
      speakers: Array.isArray(seminar.speakers)
        ? seminar.speakers
        : [{ code: "", name: "", email: "" }],
      content: normalizedContent,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${editingSeminar._id}`, editForm);
      alert("✅ Đã cập nhật seminar");
      setEditingSeminar(null);
      fetchSeminars();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật seminar:", err);
    }
  };

  // === Quản lý form động ===
  const addSpeaker = (isEdit = false) => {
    const target = isEdit ? editForm : form;
    const setter = isEdit ? setEditForm : setForm;
    setter({
      ...target,
      speakers: [...target.speakers, { code: "", name: "", email: "" }],
    });
  };

  const removeSpeaker = (i, isEdit = false) => {
    const target = isEdit ? editForm : form;
    const setter = isEdit ? setEditForm : setForm;
    setter({
      ...target,
      speakers: target.speakers.filter((_, idx) => idx !== i),
    });
  };

  const addContent = (isEdit = false) => {
    const target = isEdit ? editForm : form;
    const setter = isEdit ? setEditForm : setForm;
    setter({
      ...target,
      content: [...target.content, { type: "text", value: "" }],
    });
  };

  const removeContent = (i, isEdit = false) => {
    const target = isEdit ? editForm : form;
    const setter = isEdit ? setEditForm : setForm;
    setter({
      ...target,
      content: target.content.filter((_, idx) => idx !== i),
    });
  };

  // === JSX ===
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quản lý chuyên đề / sự kiện
      </Typography>

      {/* Bộ lọc */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Tìm theo tiêu đề"
          value={searchTitle}
          onChange={(e) => {
            setSearchTitle(e.target.value);
            setPage(1);
          }}
          size="small"
        />
        <TextField
          label="Tìm theo tên diễn giả"
          value={searchSpeaker}
          onChange={(e) => {
            setSearchSpeaker(e.target.value);
            setPage(1);
          }}
          size="small"
        />
        <TextField
          label="Ngày cụ thể"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setPage(1);
          }}
          size="small"
        />
        <TextField
          label="Tháng"
          type="number"
          inputProps={{ min: 1, max: 12 }}
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ width: 100 }}
        />
        <TextField
          label="Năm"
          type="number"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ width: 120 }}
        />
        <Button variant="outlined" onClick={handleResetFilters}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreate(true)}
        >
          + Tạo mới
        </Button>
      </Box>

      {/* Bảng dữ liệu */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Diễn giả</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell>Địa điểm</TableCell>
            <TableCell>Nội dung</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seminars.map((s, idx) => (
            <TableRow key={s._id}>
              <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
              <TableCell>
                {s.speakers
                  ?.map((sp) => `${sp.code} - ${sp.name} (${sp.email})`)
                  .join(", ")}
              </TableCell>
              <TableCell>{s.title}</TableCell>
              <TableCell>
                {new Date(s.date).toLocaleDateString()} <br />
                {s.startTime} - {s.endTime}
              </TableCell>
              <TableCell>{s.location}</TableCell>
              <TableCell
                sx={{
                  maxWidth: 300,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {(() => {
                  let contentArray = [];

                  // Trường hợp 1: content là mảng object
                  if (Array.isArray(s.content)) {
                    contentArray = s.content;
                  }
                  // Trường hợp 2: content là chuỗi JSON
                  else if (typeof s.content === "string") {
                    try {
                      const parsed = JSON.parse(s.content);
                      if (Array.isArray(parsed)) {
                        contentArray = parsed;
                      } else if (
                        parsed &&
                        typeof parsed === "object" &&
                        parsed.value
                      ) {
                        contentArray = [parsed];
                      } else {
                        // có thể là HTML thuần
                        contentArray = [{ type: "text", value: s.content }];
                      }
                    } catch {
                      // chuỗi HTML thuần
                      contentArray = [{ type: "text", value: s.content }];
                    }
                  }
                  // Trường hợp 3: content là object (Mongoose Mixed)
                  else if (s.content && typeof s.content === "object") {
                    if (Array.isArray(Object.values(s.content))) {
                      contentArray = Object.values(s.content);
                    } else if (s.content.value) {
                      contentArray = [s.content];
                    }
                  }

                  // Nếu không có nội dung
                  if (!contentArray || !contentArray.length) {
                    return (
                      <Typography color="text.secondary">
                        {/* Chưa có nội dung */}
                      </Typography>
                    );
                  }

                  // Hiển thị nội dung (rút gọn 200 ký tự)
                  return contentArray.map((c, i) => (
                    <Box key={i} sx={{ mb: 1 }}>
                      {c.type === "text" && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              typeof c.value === "string"
                                ? c.value.length > 200
                                  ? c.value.substring(0, 200) + "..."
                                  : c.value
                                : "",
                          }}
                          style={{
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxHeight: "120px",
                          }}
                        />
                      )}

                      {c.type === "image" && c.value && (
                        <img
                          src={c.value}
                          alt="seminar-content"
                          width="100%"
                          style={{
                            maxWidth: "180px",
                            borderRadius: "8px",
                            display: "block",
                            marginTop: "4px",
                          }}
                        />
                      )}

                      {c.type === "video" && c.value && (
                        <video
                          width="180"
                          controls
                          style={{ marginTop: "4px" }}
                        >
                          <source src={c.value} type="video/mp4" />
                        </video>
                      )}
                    </Box>
                  ));
                })()}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleOpenEdit(s)}
                  size="small"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(s._id)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
        />
      </Stack>

      {/* Dialog tạo mới */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Tạo mới Seminar</DialogTitle>
        <DialogContent>
          {/* --- Thông tin cơ bản --- */}
          <TextField
            fullWidth
            margin="dense"
            label="Tiêu đề *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            type="date"
            fullWidth
            margin="dense"
            label="Ngày tổ chức *"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Giờ bắt đầu"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <TextField
              label="Giờ kết thúc"
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </Box>
          <TextField
            fullWidth
            margin="dense"
            label="Địa điểm"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          {/* --- Diễn giả --- */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Danh sách diễn giả *
          </Typography>
          {form.speakers.map((sp, i) => (
            <Box
              key={i}
              sx={{ display: "flex", gap: 2, mt: 1, alignItems: "center" }}
            >
              <TextField
                label="Mã số"
                value={sp.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    speakers: form.speakers.map((s, idx) =>
                      idx === i ? { ...s, code: e.target.value } : s
                    ),
                  })
                }
              />
              <TextField
                label="Tên *"
                value={sp.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    speakers: form.speakers.map((s, idx) =>
                      idx === i ? { ...s, name: e.target.value } : s
                    ),
                  })
                }
              />
              <TextField
                label="Email *"
                value={sp.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    speakers: form.speakers.map((s, idx) =>
                      idx === i ? { ...s, email: e.target.value } : s
                    ),
                  })
                }
              />
              <IconButton color="error" onClick={() => removeSpeaker(i)}>
                <Close />
              </IconButton>
            </Box>
          ))}
          <Button onClick={() => addSpeaker()}>+ Thêm diễn giả</Button>

          {/* --- Nội dung --- */}
          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Nội dung chuyên đề *
          </Typography>
          {form.content.map((c, i) => (
            <Box key={i} sx={{ mt: 1 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Loại nội dung"
                value={c.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: form.content.map((ct, idx) =>
                      idx === i ? { ...ct, type: e.target.value } : ct
                    ),
                  })
                }
                sx={{ mb: 1 }}
              >
                <option value="text">Văn bản</option>
                <option value="image">Hình ảnh</option>
                <option value="video">Video</option>
              </TextField>

              {c.type === "text" ? (
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={c.value}
                  onChange={(val) =>
                    setForm({
                      ...form,
                      content: form.content.map((ct, idx) =>
                        idx === i ? { ...ct, value: val } : ct
                      ),
                    })
                  }
                />
              ) : (
                <TextField
                  fullWidth
                  placeholder="Nhập link ảnh hoặc video"
                  value={c.value}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: form.content.map((ct, idx) =>
                        idx === i ? { ...ct, value: e.target.value } : ct
                      ),
                    })
                  }
                />
              )}
              <IconButton color="error" onClick={() => removeContent(i)}>
                <Close />
              </IconButton>
            </Box>
          ))}
          <Button onClick={() => addContent()}>+ Thêm nội dung</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa */}
      <Dialog
        open={!!editingSeminar}
        onClose={() => setEditingSeminar(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Chỉnh sửa Seminar</DialogTitle>
        <DialogContent>
          {/* --- Thông tin cơ bản --- */}
          <TextField
            fullWidth
            margin="dense"
            label="Tiêu đề"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
          />
          <TextField
            type="date"
            fullWidth
            margin="dense"
            label="Ngày tổ chức"
            InputLabelProps={{ shrink: true }}
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Giờ bắt đầu"
              type="time"
              value={editForm.startTime}
              onChange={(e) =>
                setEditForm({ ...editForm, startTime: e.target.value })
              }
            />
            <TextField
              label="Giờ kết thúc"
              type="time"
              value={editForm.endTime}
              onChange={(e) =>
                setEditForm({ ...editForm, endTime: e.target.value })
              }
            />
          </Box>
          <TextField
            fullWidth
            margin="dense"
            label="Địa điểm"
            value={editForm.location}
            onChange={(e) =>
              setEditForm({ ...editForm, location: e.target.value })
            }
          />

          {/* --- Diễn giả --- */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Danh sách diễn giả
          </Typography>
          {editForm.speakers.map((sp, i) => (
            <Box
              key={i}
              sx={{ display: "flex", gap: 2, mt: 1, alignItems: "center" }}
            >
              <TextField
                label="Mã số"
                value={sp.code}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    speakers: editForm.speakers.map((s, idx) =>
                      idx === i ? { ...s, code: e.target.value } : s
                    ),
                  })
                }
              />
              <TextField
                label="Tên"
                value={sp.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    speakers: editForm.speakers.map((s, idx) =>
                      idx === i ? { ...s, name: e.target.value } : s
                    ),
                  })
                }
              />
              <TextField
                label="Email"
                value={sp.email}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    speakers: editForm.speakers.map((s, idx) =>
                      idx === i ? { ...s, email: e.target.value } : s
                    ),
                  })
                }
              />
              <IconButton color="error" onClick={() => removeSpeaker(i, true)}>
                <Close />
              </IconButton>
            </Box>
          ))}
          <Button onClick={() => addSpeaker(true)}>+ Thêm diễn giả</Button>

          {/* --- Nội dung --- */}
          <Typography variant="subtitle1" sx={{ mt: 3 }}>
            Nội dung chuyên đề
          </Typography>
          {editForm.content.map((c, i) => (
            <Box key={i} sx={{ mt: 1 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Loại nội dung"
                value={c.type}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    content: editForm.content.map((ct, idx) =>
                      idx === i ? { ...ct, type: e.target.value } : ct
                    ),
                  })
                }
                sx={{ mb: 1 }}
              >
                <option value="text">Văn bản</option>
                <option value="image">Hình ảnh</option>
                <option value="video">Video</option>
              </TextField>

              {c.type === "text" ? (
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={c.value}
                  onChange={(val) =>
                    setEditForm({
                      ...editForm,
                      content: editForm.content.map((ct, idx) =>
                        idx === i ? { ...ct, value: val } : ct
                      ),
                    })
                  }
                />
              ) : (
                <TextField
                  fullWidth
                  placeholder="Nhập link ảnh hoặc video"
                  value={c.value}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      content: editForm.content.map((ct, idx) =>
                        idx === i ? { ...ct, value: e.target.value } : ct
                      ),
                    })
                  }
                />
              )}
              <IconButton color="error" onClick={() => removeContent(i, true)}>
                <Close />
              </IconButton>
            </Box>
          ))}
          <Button onClick={() => addContent(true)}>+ Thêm nội dung</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingSeminar(null)}>Hủy</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeminarManagement;
