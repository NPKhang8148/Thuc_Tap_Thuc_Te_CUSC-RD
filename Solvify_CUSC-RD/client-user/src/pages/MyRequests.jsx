import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Pagination,
  Stack,
} from "@mui/material";
import { getMyRequests } from "../api/userRequestApi";
import dayjs from "dayjs";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [timeFilter, setTimeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await getMyRequests();

        // ẨN yêu cầu có hidden = true
        const visibleRequests = (res.data || []).filter(
          (r) => r.hidden !== true
        );

        setRequests(visibleRequests);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách yêu cầu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Reset bộ lọc
  const handleResetFilters = () => {
    setFilteredStatus("all");
    setTimeFilter("all");
    setSortOption("newest");
    setSearchTerm("");
    setPage(1);
  };

  // Lọc trạng thái
  let filtered = [...requests];
  if (filteredStatus !== "all") {
    filtered = filtered.filter(
      (r) => r.status?.toLowerCase() === filteredStatus
    );
  }

  // Lọc theo thời gian
  if (timeFilter !== "all") {
    const now = dayjs();
    filtered = filtered.filter((r) => {
      const createdAt = dayjs(r.createdAt);
      if (timeFilter === "month")
        return createdAt.isAfter(now.subtract(1, "month"));
      if (timeFilter === "quarter")
        return createdAt.isAfter(now.subtract(3, "month"));
      if (timeFilter === "year")
        return createdAt.isAfter(now.subtract(1, "year"));
      return true;
    });
  }

  // Tìm kiếm theo tiêu đề hoặc mô tả
  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title?.toLowerCase().includes(term) ||
        r.content?.toLowerCase().includes(term)
    );
  }

  // Sắp xếp
  filtered.sort((a, b) => {
    if (sortOption === "newest") return dayjs(b.createdAt) - dayjs(a.createdAt);
    if (sortOption === "oldest") return dayjs(a.createdAt) - dayjs(b.createdAt);
    if (sortOption === "a-z") return a.title.localeCompare(b.title);
    if (sortOption === "z-a") return b.title.localeCompare(a.title);
    return 0;
  });

  // Phân trang
  const totalPages = Math.ceil(filtered.length / limit);
  const paginatedRequests = filtered.slice((page - 1) * limit, page * limit);

  // Hàm hiển thị trạng thái tiếng Việt
  const renderStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Typography color="warning.main">Đang chờ</Typography>;
      case "in progress":
        return <Typography color="info.main">Đang xử lý</Typography>;
      case "completed":
        return <Typography color="success.main">Hoàn thành</Typography>;
      case "canceled":
        return <Typography color="error.main">Đã hủy</Typography>;
      default:
        return <Typography color="text.secondary">Không rõ</Typography>;
    }
  };

  // Định dạng ngày (nếu có)
  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "—";

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Danh sách yêu cầu
      </Typography>

      {/* Bộ lọc */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          size="small"
          label="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          size="small"
          value={filteredStatus}
          onChange={(e) => setFilteredStatus(e.target.value)}
        >
          <MenuItem value="all">Tất cả trạng thái</MenuItem>
          <MenuItem value="pending">Đang chờ</MenuItem>
          <MenuItem value="in progress">Đang xử lý</MenuItem>
          <MenuItem value="completed">Hoàn thành</MenuItem>
          <MenuItem value="canceled">Đã hủy</MenuItem>
        </Select>

        <Select
          size="small"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <MenuItem value="all">Tất cả thời gian</MenuItem>
          <MenuItem value="month">Trong tháng</MenuItem>
          <MenuItem value="quarter">Trong quý</MenuItem>
          <MenuItem value="year">Trong năm</MenuItem>
        </Select>

        <Select
          size="small"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="oldest">Cũ nhất</MenuItem>
          <MenuItem value="a-z">A - Z</MenuItem>
          <MenuItem value="z-a">Z - A</MenuItem>
        </Select>

        {/* Nút Reset bộ lọc */}
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleResetFilters}
        >
          Reset bộ lọc
        </Button>
      </Box>

      {/* Bảng dữ liệu */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 2 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày gửi</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Ngày hoàn thành</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req, index) => (
                  <TableRow key={req._id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{req.title}</TableCell>
                    <TableCell>
                      {req.content?.slice(0, 40) || "Không có mô tả"}...
                    </TableCell>
                    <TableCell>{renderStatus(req.status)}</TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
                    <TableCell>{formatDate(req.deadline)}</TableCell>
                    <TableCell>{formatDate(req.endDate)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedRequest(req)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có yêu cầu nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}

      {/* Hộp thoại chi tiết */}
      <Dialog
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết yêu cầu</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                Tiêu đề:
              </Typography>
              <Typography>{selectedRequest.title}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Mô tả:
              </Typography>
              <Typography>{selectedRequest.content}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Khách hàng:
              </Typography>
              <Typography>{selectedRequest.customer || "—"}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Người tạo:
              </Typography>
              <Typography>{selectedRequest.createdBy || "—"}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Giao cho:
              </Typography>
              <Typography>{selectedRequest.assignedTo || "—"}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Ngày bắt đầu:
              </Typography>
              <Typography>{formatDate(selectedRequest.startDate)}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Deadline:
              </Typography>
              <Typography>{formatDate(selectedRequest.deadline)}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Ngày hoàn thành:
              </Typography>
              <Typography>{formatDate(selectedRequest.endDate)}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Trạng thái:
              </Typography>
              {renderStatus(selectedRequest.status)}

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Ngày tạo:
              </Typography>
              <Typography>{formatDate(selectedRequest.createdAt)}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Cập nhật lần cuối:
              </Typography>
              <Typography>{formatDate(selectedRequest.updatedAt)}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRequest(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyRequests;
