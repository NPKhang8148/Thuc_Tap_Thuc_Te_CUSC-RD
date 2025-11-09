import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Pagination,
  Stack,
} from "@mui/material";

import {
  Delete,
  Visibility,
  RestartAlt,
  HideSource,
  VisibilityOff,
} from "@mui/icons-material";

import {
  getRequests,
  deleteRequest,
  toggleHidden,
} from "../api/adminRequestApi";

import RequestForm from "./RequestForm";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenFilter, setHiddenFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  const navigate = useNavigate();

  // Load TẤT CẢ yêu cầu, bỏ lọc user thường
  const fetchData = async () => {
    try {
      const res = await getRequests();
      setRequests(res.data); // luôn load tất cả
    } catch (err) {
      console.error("Lỗi khi tải yêu cầu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle Hidden
  const handleToggleHidden = async (id) => {
    try {
      await toggleHidden(id);

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, hidden: !req.hidden } : req
        )
      );
    } catch (err) {
      console.error("Lỗi khi toggle hidden:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa yêu cầu?")) return;
    try {
      await deleteRequest(id);
      fetchData();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  // Filtering logic
  useEffect(() => {
    let data = [...requests];

    const now = new Date();
    const next10Days = new Date();
    next10Days.setDate(now.getDate() + 10);

    data = data.filter((req) => {
      let match = true;

      if (statusFilter && req.status !== statusFilter) match = false;

      if (hiddenFilter === "hidden" && req.hidden !== true) match = false;
      if (hiddenFilter === "visible" && req.hidden === true) match = false;

      if (deadlineFilter) {
        const deadline = req.deadline ? new Date(req.deadline) : null;
        if (!deadline || deadline < now || deadline > next10Days) match = false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          req.title?.toLowerCase().includes(q) ||
          req.customer?.toLowerCase().includes(q) ||
          (req.createdBy === "admin"
            ? "admin".includes(q)
            : req.userId?.name?.toLowerCase().includes(q) ||
              req.userId?.fullName?.toLowerCase().includes(q));
        if (!matchesSearch) match = false;
      }

      return match;
    });

    setFilteredRequests(data);
    setCurrentPage(1);
  }, [statusFilter, hiddenFilter, deadlineFilter, searchQuery, requests]);

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter("");
    setHiddenFilter("");
    setDeadlineFilter(false);
    setSearchQuery("");
  };

  // Pagination
  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý yêu cầu
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => {
          setEditingRequest(null);
          setOpenForm(true);
        }}
      >
        Gửi yêu cầu mới
      </Button>

      {/* Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2, alignItems: "center" }}
      >
        <TextField
          label="Tìm kiếm..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
        />

        <TextField
          select
          label="Trạng thái"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </TextField>

        <TextField
          select
          label="Ẩn / Hiện"
          size="small"
          value={hiddenFilter}
          onChange={(e) => setHiddenFilter(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="visible">Đang hiển thị</MenuItem>
          <MenuItem value="hidden">Đang ẩn</MenuItem>
        </TextField>

        <Button
          variant={deadlineFilter ? "contained" : "outlined"}
          color="secondary"
          onClick={() => setDeadlineFilter(!deadlineFilter)}
        >
          Sắp đến Deadline
        </Button>

        <Button
          variant="outlined"
          color="warning"
          startIcon={<RestartAlt />}
          onClick={handleResetFilters}
        >
          Đặt lại
        </Button>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên yêu cầu</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Người gửi</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ẩn?</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRequests.length > 0 ? (
              currentRequests.map((req, index) => (
                <TableRow
                  key={req._id}
                  sx={{
                    opacity: req.hidden ? 0.4 : 1,
                    backgroundColor: req.hidden ? "#f0f0f0" : "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  <TableCell>{indexOfFirst + index + 1}</TableCell>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{req.customer || "—"}</TableCell>

                  <TableCell>
                    {req.createdBy === "admin"
                      ? "Admin"
                      : req.userId?.fullName ||
                        req.userId?.name ||
                        "User"}
                  </TableCell>

                  <TableCell>
                    {req.deadline
                      ? new Date(req.deadline).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell>{req.status}</TableCell>

                  <TableCell>
                    <strong style={{ color: req.hidden ? "red" : "green" }}>
                      {req.hidden ? "Ẩn" : "Hiện"}
                    </strong>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        navigate(`/dashboard/requests/${req._id}`)
                      }
                    >
                      <Visibility />
                    </IconButton>

                    <IconButton onClick={() => handleToggleHidden(req._id)}>
                      {req.hidden ? (
                        <VisibilityOff color="warning" />
                      ) : (
                        <HideSource color="primary" />
                      )}
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(req._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có yêu cầu nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredRequests.length > requestsPerPage && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredRequests.length / requestsPerPage)}
            page={currentPage}
            onChange={(e, v) => setCurrentPage(v)}
          />
        </Stack>
      )}

      {openForm && (
        <RequestForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          fetchData={fetchData}
          editingRequest={editingRequest}
        />
      )}
    </Container>
  );
};

export default RequestsPage;
