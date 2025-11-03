import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Import hiệu ứng LiquidEther
import LiquidEther from "../components/LiquidEther";

const SeminarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seminar, setSeminar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/seminars/${id}`);
        setSeminar(res.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết seminar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeminar();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (!seminar)
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Không tìm thấy chuyên đề.
      </Typography>
    );

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/*  Nền đen */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#1c1c1c",
          zIndex: 0,
        }}
      />
      {/* Hiệu ứng nền động */}
      <LiquidEther
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
        speed={0.4}
        viscosity={0.25}
        color="#61dafb"
      />

      {/* Nội dung chính */}
      <Container
        sx={{
          mt: 5,
          mb: 5,
          position: "relative",
          zIndex: 1, // đảm bảo nằm trên nền
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Quay lại
        </Button>

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 4,
            p: 2,
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(255,255,255,0.85)",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              color="primary"
              gutterBottom
              fontWeight="bold"
            >
              {seminar.title}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EventIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Ngày: {new Date(seminar.date).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Thời gian: {seminar.startTime} - {seminar.endTime}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Địa điểm: {seminar.location}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Diễn giả:
                </Typography>
                {seminar.speakers && seminar.speakers.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {seminar.speakers.map((sp) => (
                      <Chip
                        key={sp._id}
                        icon={<GroupIcon />}
                        label={`${sp.name} (${sp.email})`}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có diễn giả
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Nội dung chuyên đề
            </Typography>
            {seminar.content && seminar.content.length > 0 ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "rgba(250, 250, 250, 0.9)",
                  borderRadius: 2,
                  maxHeight: 400,
                  overflowY: "auto",
                }}
              >
                {seminar.content.map((c, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    {c.type === "text" ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: c.value }}
                        style={{ whiteSpace: "pre-wrap" }}
                      />
                    ) : (
                      <Typography>{c.value}</Typography>
                    )}
                  </Box>
                ))}
              </Paper>
            ) : (
              <Typography color="text.secondary">
                Chưa có nội dung chi tiết.
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" color="text.secondary">
              Ngày tạo: {new Date(seminar.createdAt).toLocaleString("vi-VN")}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SeminarDetail;
