import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";

const SoftwareDetail = () => {
  const { id } = useParams();
  const [software, setSoftware] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/softwares/${id}`);
        setSoftware(res.data);
      } catch (err) {
        console.error("Error fetching software detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSoftware();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!software) return <Typography>Không tìm thấy phần mềm.</Typography>;

  // Hàm kiểm tra nội dung có chứa HTML tag không
  const isHTML = (str) => /<\/?[a-z][\s\S]*>/i.test(str);

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      <Card sx={{ boxShadow: 4 }}>
        {/* Hiển thị ảnh đầu tiên (thumbnail) */}
        {software.images && software.images.length > 0 && (
          <CardMedia
            component="img"
            height="300"
            image={
              typeof software.images[0] === "string"
                ? software.images[0]
                : URL.createObjectURL(software.images[0])
            }
            alt={software.title}
          />
        )}

        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {software.title}
          </Typography>

          {/* Hiển thị nội dung: tự nhận dạng HTML hoặc text thường */}
          {software.content && (
            <>
              {isHTML(software.content) ? (
                <Box
                  sx={{
                    mt: 2,
                    lineHeight: 1.8,
                    "& img": {
                      maxWidth: "100%",
                      borderRadius: "8px",
                      marginY: "10px",
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: software.content }}
                />
              ) : (
                <Box
                  sx={{
                    mt: 2,
                    whiteSpace: "pre-line", // Giữ xuống dòng trong text thuần
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    color: "#333",
                  }}
                >
                  {software.content}
                </Box>
              )}
            </>
          )}

          {/* Nút xem tài liệu (nếu có URL) */}
          {software.url && (
            <Button
              variant="contained"
              color="primary"
              href={software.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 3 }}
            >
              Xem tài liệu
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SoftwareDetail;
