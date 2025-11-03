// src/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
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
  Button,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Lỗi khi fetch user:', err);
      alert('Không thể lấy danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, isLocked) => {
    const confirmMessage = isLocked
      ? 'Mở khóa tài khoản này?'
      : 'Khóa tài khoản người dùng này?';
    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:5000/api/users/${userId}/status`,
        { isLocked: !isLocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', err);
      alert('Không thể cập nhật trạng thái người dùng.');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa người dùng này?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Xóa người dùng thành công!');
      fetchUsers();
    } catch (err) {
      console.error('❌ Lỗi khi xóa user:', err);
      alert('Không thể xóa người dùng.');
    }
  };

  const handleCloseDialog = () => setSelectedUser(null);

  const getAvatarSrc = (avatar) => {
    if (!avatar || !avatar.data || !avatar.contentType) return '';
    const base64String = btoa(
      avatar.data.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:${avatar.contentType};base64,${base64String}`;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !user.isLocked) ||
      (statusFilter === 'locked' && user.isLocked);
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Đang tải danh sách người dùng...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Quản lý người dùng
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField
          label="Tìm kiếm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
        />
        <TextField
          select
          label="Lọc vai trò"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>
        <TextField
          select
          label="Lọc trạng thái"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="active">Đang hoạt động</MenuItem>
          <MenuItem value="locked">Đã bị khóa</MenuItem>
        </TextField>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Avatar src={getAvatarSrc(user.avatar)} alt={user.fullName} />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.isLocked ? 'Đã bị khóa' : 'Đang hoạt động'}
                </TableCell>
                <TableCell>
                  {user.isLocked ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => toggleUserStatus(user._id, true)}
                      sx={{ mr: 1 }}
                    >
                      Mở khóa
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => toggleUserStatus(user._id, false)}
                      sx={{ mr: 1 }}
                    >
                      Khóa
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedUser(user)}
                    sx={{ mr: 1 }}
                  >
                    Xem
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteUser(user._id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có người dùng nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(selectedUser)} onClose={handleCloseDialog}>
        <DialogTitle>Thông tin người dùng</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Avatar
                src={getAvatarSrc(selectedUser.avatar)}
                alt={selectedUser.fullName}
                sx={{ width: 64, height: 64, mb: 2 }}
              />
              <Typography><strong>ID:</strong> {selectedUser._id}</Typography>
              <Typography><strong>Họ tên:</strong> {selectedUser.fullName}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Vai trò:</strong> {selectedUser.role}</Typography>
              <Typography><strong>Trạng thái:</strong> {selectedUser.isLocked ? 'Đã bị khóa' : 'Đang hoạt động'}</Typography>
              <Typography><strong>Ngày tạo:</strong> {moment(selectedUser.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
              <Typography><strong>Ngày cập nhật:</strong> {moment(selectedUser.updatedAt).format('DD/MM/YYYY HH:mm')}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;