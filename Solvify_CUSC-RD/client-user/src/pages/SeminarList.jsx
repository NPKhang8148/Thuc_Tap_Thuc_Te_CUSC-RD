import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Box,
  CircularProgress,
  TextField,
  Pagination,
  MenuItem,
  Paper,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SortIcon from "@mui/icons-material/Sort";

import DotGrid from "../components/DotGrid";

const SeminarList = () => {
  const navigate = useNavigate();
  const [seminars, setSeminars] = useState([]);
  const [filteredSeminars, setFilteredSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonthYear, setFilterMonthYear] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);

  const seminarsPerPage = 6;

  // === Lấy danh sách seminar ===
  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/seminars");
        const sorted = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setSeminars(sorted);
        setFilteredSeminars(sorted);
      } catch (error) {
        console.error("Lỗi khi tải danh sách seminar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeminars();
  }, []);

  // === Lọc & sắp xếp ===
  useEffect(() => {
    let filtered = [...seminars];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.speakers?.some((sp) =>
            sp.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (s) => new Date(s.date).toLocaleDateString("en-CA") === filterDate
      );
    }

    if (filterMonthYear) {
      filtered = filtered.filter((s) => {
        const seminarDate = new Date(s.date);
        const seminarMonthYear = `${seminarDate.getFullYear()}-${String(
          seminarDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return seminarMonthYear === filterMonthYear;
      });
    }

    switch (sortOption) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "az":
        filtered.sort((a, b) => a.title.localeCompare(b.title, "vi"));
        break;
      case "za":
        filtered.sort((a, b) => b.title.localeCompare(a.title, "vi"));
        break;
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredSeminars(filtered);
    setPage(1);
  }, [searchTerm, filterDate, filterMonthYear, sortOption, seminars]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterMonthYear("");
    setSortOption("newest");
  };

  const indexOfLast = page * seminarsPerPage;
  const indexOfFirst = indexOfLast - seminarsPerPage;
  const currentSeminars = filteredSeminars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSeminars.length / seminarsPerPage);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box position="relative" minHeight="100vh">
      {/* Nền DotGrid */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 1,
          pointerEvents: "none",
        }}
      >
        <DotGrid className="seminar-list-bg"/>
      </Box>

      {/* Bố cục chính */}
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Sidebar (Bộ lọc) */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "280px" },
            backgroundColor: "rgba(255,255,255,0.95)",
            height: "fit-content",
            position: "sticky",
            top: 100,
            alignSelf: "flex-start",
            borderRadius: 3,
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            m: { xs: 0, md: 3 },
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <SortIcon /> Bộ lọc
          </Typography>

          <TextField
            label="Tìm kiếm (tiêu đề/diễn giả)"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <TextField
            label="Lọc theo ngày"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <TextField
            label="Lọc theo tháng-năm"
            type="month"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={filterMonthYear}
            onChange={(e) => setFilterMonthYear(e.target.value)}
          />

          <TextField
            select
            label="Sắp xếp theo"
            fullWidth
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="oldest">Cũ nhất</MenuItem>
            <MenuItem value="az">Tên (A → Z)</MenuItem>
            <MenuItem value="za">Tên (Z → A)</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RestartAltIcon />}
            onClick={handleResetFilters}
            fullWidth
          >
            Đặt lại bộ lọc
          </Button>
        </Box>

        {/* Nội dung chính */}
        <Box
          flexGrow={1}
          p={{ xs: 2, sm: 3, md: 5 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#faa7a7", textAlign: "center", mb: 4 }}
          >
            Danh sách chuyên đề
          </Typography>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: "1200px" }}
          >
            {currentSeminars.length === 0 ? (
              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  mx: "auto",
                  textAlign: "center",
                  width: "100%",
                  color: "white",
                }}
              >
                Không có chuyên đề nào phù hợp.
              </Typography>
            ) : (
              currentSeminars.map((seminar) => (
                <Grid item xs={12} sm={6} md={4} key={seminar._id}>
                  <Card
                    sx={{
                      height: "100%",
                      maxWidth: 400,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderRadius: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight={600}
                        gutterBottom
                        sx={{
                          minHeight: 60,
                          maxHeight: 60,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {seminar.title}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <EventIcon sx={{ mr: 1 }} color="action" />
                        <Typography variant="body2">
                          {new Date(seminar.date).toLocaleDateString("vi-VN")}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <AccessTimeIcon sx={{ mr: 1 }} color="action" />
                        <Typography variant="body2">
                          {seminar.startTime} - {seminar.endTime}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1 }} color="action" />
                        <Typography variant="body2">
                          {seminar.location}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Diễn giả:
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {seminar.speakers?.length ? (
                          seminar.speakers.map((sp) => (
                            <Chip
                              key={sp._id}
                              label={sp.name}
                              color="secondary"
                              variant="outlined"
                              size="small"
                              icon={<GroupIcon />}
                            />
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            Chưa có diễn giả
                          </Typography>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate(`/seminars/${seminar._id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                variant="outlined"
                shape="rounded"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SeminarList;
