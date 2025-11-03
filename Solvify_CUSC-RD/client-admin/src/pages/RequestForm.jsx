import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { createRequest, updateRequest } from "../api/adminRequestApi";

const RequestForm = ({ open, onClose, fetchData, editingRequest }) => {
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
    if (editingRequest) setFormData(editingRequest);
  }, [editingRequest]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingRequest) {
        await updateRequest(editingRequest._id, formData);
      } else {
        await createRequest(formData);
      }
      fetchData();
      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingRequest ? "Sửa yêu cầu" : "Thêm yêu cầu"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Tên yêu cầu *"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Nội dung *"
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Khách hàng/Công ty *"
          name="customer"
          value={formData.customer}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Nhân viên phụ trách *"
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
          label="Deadline *"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestForm;
