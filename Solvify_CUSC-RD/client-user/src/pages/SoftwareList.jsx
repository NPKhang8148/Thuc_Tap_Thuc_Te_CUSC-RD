// src/pages/SoftwareList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  CardActionArea,
  CardActions,
  Button,
  Pagination,
  IconButton,
  Stack,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import DotGrid from "../components/DotGrid";
import Sidebar from "../components/Sidebar";

const SoftwareList = () => {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.categoryId || null
  );

  // Lấy từ khóa tìm kiếm từ URL (?search=)
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchSoftware();
    if (selectedCategory) {
      fetchCategoryName(selectedCategory);
    } else {
      setCategoryName("");
    }
  }, [selectedCategory, searchQuery]);

  const fetchSoftware = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/softwares";
      if (selectedCategory) {
        url += `?categoryId=${selectedCategory}`;
      }

      const res = await axios.get(url);
      let data = res.data;

      // Nếu có từ khóa tìm kiếm -> lọc theo title (không phân biệt hoa thường)
      if (searchQuery) {
        data = data.filter((item) =>
          item.title?.toLowerCase().includes(searchQuery)
        );
      }

      setSoftware(data);
    } catch (err) {
      console.error("Error fetching software:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryName = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/categories/${id}`);
      setCategoryName(res.data.name || "");
    } catch (err) {
      console.error("Error fetching category name:", err);
    }
  };

  const totalPages = Math.ceil(software.length / itemsPerPage);
  const displayedSoftware = software.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hàm đặt lại bộ lọc
  const handleResetFilters = () => {
    setSelectedCategory(null);
    navigate("/softwares");
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
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
        <DotGrid className="software-list-bg" />
      </Box>

      {/* Bố cục có Sidebar */}
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Sidebar */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "250px" },
            backgroundColor: "rgba(255,255,255,0.9)",
            height: "fit-content",
            position: "sticky",
            top: 100,
            alignSelf: "flex-start",
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            m: { xs: 0, md: 2 },
            p: 1,
          }}
        >
          {/* Tiêu đề + nút Reset */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1, px: 1 }}
          >
            <Typography variant="h6" color="text.primary">
              ==================
            </Typography>
            <IconButton
              size="small"
              color="primary"
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              sx={{
                backgroundColor: "rgba(0,0,0,0.05)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
              }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Component Sidebar */}
          <Sidebar
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </Box>

        {/* Nội dung chính */}
        <Box
          flexGrow={1}
          p={{ xs: 2, sm: 3, md: 5 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: "center" }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#ffffff", textAlign: "center", mb: 4 }}
          >
            {searchQuery
              ? `Kết quả tìm kiếm cho: "${searchQuery}"`
              : selectedCategory
              ? categoryName || "Phần mềm theo danh mục"
              : "Tất cả phần mềm"}
          </Typography>

          {software.length === 0 ? (
            <Typography color="white" align="center">
              {searchQuery
                ? "Không tìm thấy phần mềm nào phù hợp."
                : "Chưa có phần mềm nào."}
            </Typography>
          ) : (
            <>
              <Grid
                container
                spacing={{ xs: 2, sm: 3, md: 4 }}
                justifyContent="center"
                alignItems="center"
                sx={{ maxWidth: "1200px" }}
              >
                {displayedSoftware.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card
                      sx={{
                        maxWidth: 360,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        height: 360,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: 3,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                        },
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        to={`/softwares/${item._id}`}
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {item.images && item.images.length > 0 ? (
                          <CardMedia
                            component="img"
                            image={item.images[0]}
                            alt={item.title}
                            sx={{
                              height: 160,
                              width: "100%",
                              objectFit: "cover",
                              borderTopLeftRadius: 12,
                              borderTopRightRadius: 12,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 180,
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#e0e0e0",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Không có ảnh
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ px: 2, py: 1, flexShrink: 0 }}>
                          <Typography
                            variant="h6"
                            component="div"
                            fontWeight="bold"
                            sx={{
                              textAlign: "center",
                              color: "#222",
                              fontSize: { xs: "1rem", sm: "1.1rem" },
                              lineHeight: 1.4,
                            }}
                          >
                            {item.title}
                          </Typography>
                        </Box>

                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textAlign: "justify",
                              fontSize: { xs: "0.85rem", sm: "0.9rem" },
                            }}
                          >
                            {item.content
                              ?.replace(/<[^>]+>/g, "")
                              .slice(0, 150) + "..."}
                          </Typography>
                        </CardContent>
                      </CardActionArea>

                      <CardActions
                        sx={{
                          justifyContent: "center",
                          pb: 2,
                          pt: 0,
                          flexShrink: 0,
                        }}
                      >
                        <Button
                          size="small"
                          color="primary"
                          component={Link}
                          to={`/softwares/${item._id}`}
                          sx={{ fontWeight: 500 }}
                        >
                          XEM THÊM
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box mt={4} display="flex" justifyContent="center">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
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
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SoftwareList;
