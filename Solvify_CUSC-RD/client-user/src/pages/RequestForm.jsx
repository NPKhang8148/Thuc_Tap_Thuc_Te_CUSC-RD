import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import { createRequestByUser } from "../api/userRequestApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Squares from "@/components/Squares";

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    customer: "",
    content: "",
    deadline: "",
    status: "pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createRequestByUser(formData);
      toast.success("🎉 Yêu cầu đã được gửi thành công!");
      navigate("/my-request");
    } catch (error) {
      console.error(error);
      toast.error("❌ Không thể gửi yêu cầu. Vui lòng thử lại!");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/*  Nền Squares */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Squares
          speed={0.3}
          squareSize={40}
          direction="diagonal"
          borderColor="#1976d2"
          backgroundColor="#f9fafc"
        />
      </div>

      {/*  Nội dung form (đè lên nền) */}
      <Container
        maxWidth="sm"
        sx={{
          mt: 10,
          mb: 6,
          position: "relative",
          zIndex: 1, // Giúp form nổi lên trên background
        }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
          >
            Gửi yêu cầu
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Tên yêu cầu"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              placeholder="VD: Cài đặt phần mềm"
            />

            <TextField
              label="Tên khách hàng"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              fullWidth
              required
              placeholder="VD: Nguyễn Văn A"
            />

            <TextField
              label="Nội dung yêu cầu"
              name="content"
              value={formData.content}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              placeholder="Mô tả chi tiết yêu cầu..."
            />

            <TextField
              label="Hạn hoàn thành"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              label="Trạng thái"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="canceled">Canceled</MenuItem>
            </TextField>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2, justifyContent: "center" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                }}
              >
                Gửi yêu cầu
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/my-request")}
                sx={{
                  textTransform: "none",
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                }}
              >
                Xem yêu cầu đã gửi
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default RequestForm;
