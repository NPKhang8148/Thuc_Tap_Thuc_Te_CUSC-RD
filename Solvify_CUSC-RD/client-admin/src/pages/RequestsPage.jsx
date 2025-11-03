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
import { Delete, Visibility, RestartAlt } from "@mui/icons-material";
import { getRequests, deleteRequest } from "../api/adminRequestApi";
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  const navigate = useNavigate();
  const { user } = useAuthStore();

  // --- Fetch Data ---
  const fetchData = async () => {
    try {
      const res = await getRequests();
      let data = res.data;

      // Xác định có phải admin không
      const isAdmin =
        user?.email === "admin@solvify.com" ||
        user?.email?.toLowerCase().includes("admin");

      if (!isAdmin) {
        data = data.filter((req) => req.userId === user?._id);
      }

      setRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      console.error("Lỗi khi tải yêu cầu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handle Delete ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      await deleteRequest(id);
      fetchData();
    }
  };

  // --- Handle Filter + Search (lọc chéo, nhiều điều kiện) ---
  useEffect(() => {
    let data = [...requests];
    const now = new Date();
    const next10Days = new Date();
    next10Days.setDate(now.getDate() + 10);

    data = data.filter((req) => {
      let match = true;

      // Lọc theo trạng thái
      if (statusFilter && req.status !== statusFilter) {
        match = false;
      }

      // Lọc theo deadline sắp tới (trong 10 ngày)
      if (deadlineFilter) {
        const deadline = req.deadline ? new Date(req.deadline) : null;
        if (!deadline || deadline < now || deadline > next10Days) {
          match = false;
        }
      }

      // Tìm kiếm theo tiêu đề, khách hàng, hoặc người gửi
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
  }, [statusFilter, deadlineFilter, searchQuery, requests, user]);

  // --- Reset Filters ---
  const handleResetFilters = () => {
    setStatusFilter("");
    setDeadlineFilter(false);
    setSearchQuery("");
    setFilteredRequests(requests);
  };

  // --- Pagination logic ---
  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý yêu cầu
      </Typography>

      {/* Nút thêm mới */}
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

      {/* Bộ lọc và tìm kiếm */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2, alignItems: "center" }}
      >
        <TextField
          label="Tìm kiếm..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
        />

        <TextField
          select
          label="Trạng thái"
          variant="outlined"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </TextField>

        <Button
          variant={deadlineFilter ? "contained" : "outlined"}
          color="secondary"
          onClick={() => setDeadlineFilter(!deadlineFilter)}
        >
          {deadlineFilter ? "Bỏ lọc Deadline gần" : "Sắp đến Deadline"}
        </Button>

        <Button
          variant="outlined"
          color="warning"
          startIcon={<RestartAlt />}
          onClick={handleResetFilters}
        >
          Đặt lại bộ lọc
        </Button>
      </Stack>

      {/* Bảng hiển thị */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên yêu cầu</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày hoàn thành</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Người gửi yêu cầu</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRequests.length > 0 ? (
              currentRequests.map((req, index) => (
                <TableRow key={req._id}>
                  <TableCell>{indexOfFirst + index + 1}</TableCell>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{req.customer || "Chưa có"}</TableCell>
                  <TableCell>
                    {req.startDate
                      ? new Date(req.startDate).toLocaleDateString()
                      : "Chưa có"}
                  </TableCell>
                  <TableCell>
                    {req.endDate
                      ? new Date(req.endDate).toLocaleDateString()
                      : "Chưa có"}
                  </TableCell>
                  <TableCell>
                    {req.deadline
                      ? new Date(req.deadline).toLocaleDateString()
                      : "Chưa có"}
                  </TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>
                    {req.createdBy === "admin"
                      ? "Admin"
                      : req.userId?.name || req.userId?.fullName || "User"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => navigate(`/dashboard/requests/${req._id}`)}
                    >
                      <Visibility />
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
                <TableCell colSpan={9} align="center">
                  Không có yêu cầu nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      {filteredRequests.length > requestsPerPage && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredRequests.length / requestsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}

      {/* Form yêu cầu */}
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
