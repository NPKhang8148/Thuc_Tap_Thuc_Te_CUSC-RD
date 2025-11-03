import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { getRequestById, updateRequest } from "../api/adminRequestApi";

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    customer: "",
    assignedTo: "",
    startDate: "",
    endDate: "",
    deadline: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRequestById(id);
        setRequest(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Lỗi khi tải yêu cầu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateRequest(id, formData);
      alert("Cập nhật thành công!");
      navigate("/dashboard/requests");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!request) return <Typography>Không tìm thấy yêu cầu.</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Chi tiết yêu cầu
        </Typography>

        <TextField
          fullWidth
          margin="dense"
          label="Tên yêu cầu"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Nội dung"
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Khách hàng/Công ty"
          name="customer"
          value={formData.customer}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Nhân viên phụ trách"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="dense"
          type="date"
          label="Ngày bắt đầu"
          name="startDate"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate ? formData.startDate.substring(0, 10) : ""}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="dense"
          type="date"
          label="Ngày hoàn thành"
          name="endDate"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate ? formData.endDate.substring(0, 10) : ""}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="dense"
          type="date"
          label="Deadline"
          name="deadline"
          InputLabelProps={{ shrink: true }}
          value={formData.deadline ? formData.deadline.substring(0, 10) : ""}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="dense"
          select
          label="Trạng thái"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </TextField>

        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Lưu cập nhật
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard/requests")}
          >
            ⬅ Quay lại
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RequestDetail;
