axios.defaults.baseURL = "http://localhost:5000";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Stack,
  Button,
} from "@mui/material";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    requests: 0,
    seminars: 0,
    softwares: 0,
  });
  const [latestSoftwares, setLatestSoftwares] = useState([]);
  const [latestSeminars, setLatestSeminars] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);

  // Bộ lọc
  const [filterType, setFilterType] = useState("none");
  const [filterValue, setFilterValue] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        let url = "/api/stats";
        if (filterType !== "none" && filterValue)
          url += `?type=${filterType}&value=${filterValue}`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        const data = res.data || {};
        setStats({
          users: data.total?.users || 0,
          requests: data.total?.requests || 0,
          seminars: data.total?.seminars || 0,
          softwares: data.total?.softwares || 0,
        });

        setLatestSoftwares(data.latestSoftwares || []);
        setLatestSeminars(data.latestSeminars || []);

        // lấy yêu cầu cấp bách
        const urgentRes = await axios.get("/api/requests/urgent?limit=5", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setUrgentRequests(urgentRes.data || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải thống kê hoặc yêu cầu cấp bách:", error);
      }
    };

    fetchDashboardStats();
  }, [filterType, filterValue]);

  // Khi người dùng chọn năm/quý/tháng -> gộp thành filterValue gửi lên API
  // === CẬP NHẬT PHẦN USEEFFECT XỬ LÝ GIÁ TRỊ BỘ LỌC ===
  useEffect(() => {
    if (filterType === "quarter" && selectedYear && selectedQuarter)
      setFilterValue(`Q${selectedQuarter}-${selectedYear}`);

    if (filterType === "month" && selectedYear && selectedMonth)
      setFilterValue(
        `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`
      );

    if (filterType === "day" && filterValue) setFilterValue(filterValue); // đã là YYYY-MM-DD

    if (filterType === "year" && selectedYear)
      setFilterValue(`${selectedYear}`);
  }, [filterType, selectedYear, selectedQuarter, selectedMonth]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quản lý thống kê
      </Typography>

      {/* === Thống kê tổng quan === */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Tổng số người dùng" value={stats.users} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Tổng số yêu cầu" value={stats.requests} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Tổng số chuyên đề" value={stats.seminars} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Tổng số phần mềm" value={stats.softwares} />
        </Grid>
      </Grid>

      {/* === Bộ lọc === */}
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Bộ lọc thống kê
        </Typography>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Chọn kiểu lọc</InputLabel>
          <Select
            value={filterType}
            label="Chọn kiểu lọc"
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue("");
              setSelectedYear("");
              setSelectedQuarter("");
              setSelectedMonth("");
            }}
          >
            <MenuItem value="none">Không lọc</MenuItem>
            <MenuItem value="day">Theo ngày cụ thể</MenuItem>
            <MenuItem value="month">Theo tháng-năm</MenuItem>
            <MenuItem value="quarter">Theo quý-năm</MenuItem>
            <MenuItem value="year">Theo năm</MenuItem>
          </Select>
        </FormControl>

        {/* === Bộ lọc theo ngày === */}
        {filterType === "day" && (
          <TextField
            type="date"
            label="Chọn ngày cụ thể"
            InputLabelProps={{ shrink: true }}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        )}

        {/* === Bộ lọc theo tháng-năm === */}
        {filterType === "month" && (
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Năm</InputLabel>
              <Select
                value={selectedYear}
                label="Năm"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {[2022, 2023, 2024, 2025].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedYear && (
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Tháng</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Tháng"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <MenuItem key={month} value={month}>
                      Tháng {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        )}

        {/* === Bộ lọc theo quý-năm === */}
        {filterType === "quarter" && (
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Năm</InputLabel>
              <Select
                value={selectedYear}
                label="Năm"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {[2022, 2023, 2024, 2025].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedYear && (
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Quý</InputLabel>
                <Select
                  value={selectedQuarter}
                  label="Quý"
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                >
                  <MenuItem value="1">Quý 1 (Tháng 1–3)</MenuItem>
                  <MenuItem value="2">Quý 2 (Tháng 4–6)</MenuItem>
                  <MenuItem value="3">Quý 3 (Tháng 7–9)</MenuItem>
                  <MenuItem value="4">Quý 4 (Tháng 10–12)</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        )}

        {/* === Bộ lọc theo năm === */}
        {filterType === "year" && (
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Chọn năm</InputLabel>
            <Select
              value={selectedYear}
              label="Chọn năm"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {[2022, 2023, 2024, 2025].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* === Nút reset bộ lọc === */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setFilterType("none");
            setFilterValue("");
            setSelectedYear("");
            setSelectedQuarter("");
            setSelectedMonth("");
          }}
        >
          Đặt lại bộ lọc
        </Button>
      </Paper>

      {/* === Danh sách 3 cột === */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={4}>
          <ListCard
            title="Phần mềm mới nhất"
            subtitle="(5 phần mềm gần đây)"
            items={latestSoftwares.map(
              (s) => s.title || s.name || "Phần mềm không tên"
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ListCard
            title="Chuyên đề gần đây"
            subtitle="(5 chuyên đề gần nhất)"
            items={latestSeminars.map(
              (s) => s.title || s.name || "Chuyên đề không tên"
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ListCard
            title="Yêu cầu cấp bách"
            subtitle="(gần deadline nhất)"
            items={urgentRequests.map(
              (r) =>
                `${r.title || "Yêu cầu không tên"}${
                  r.deadline
                    ? ` (Hạn: ${new Date(r.deadline).toLocaleDateString()})`
                    : ""
                }`
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// === COMPONENT CON ===
const StatCard = ({ label, value }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      textAlign: "center",
      borderRadius: 3,
      border: "1px solid #e0e0e0",
      backgroundColor: "#f9fafb",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h4" color="primary" fontWeight={600}>
      {value}
    </Typography>
  </Paper>
);

const ListCard = ({ title, subtitle, items }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      border: "1px solid #e0e0e0",
      minHeight: 250,
      backgroundColor: "#fff",
    }}
  >
    <Typography variant="h6" fontWeight={600} gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {subtitle}
    </Typography>
    <Divider sx={{ mb: 2 }} />

    <List dense>
      {items.length === 0 ? (
        <ListItem>
          <ListItemText
            primary="Không có dữ liệu"
            primaryTypographyProps={{
              color: "text.secondary",
              fontStyle: "italic",
            }}
          />
        </ListItem>
      ) : (
        items.map((item, idx) => (
          <ListItem
            key={idx}
            sx={{
              border: "1px solid #eee",
              borderRadius: 2,
              mb: 1,
              backgroundColor: "#fafafa",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <ListItemText primary={item} />
          </ListItem>
        ))
      )}
    </List>
  </Paper>
);

export default DashboardStats;
