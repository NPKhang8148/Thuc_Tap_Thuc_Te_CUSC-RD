// frontend/src/pages/ToolsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Pagination,
  Stack,
} from "@mui/material";

import SpotlightCard from "@/components/SpotlightCard";
import Particles from "@/components/Particles";

const API_URL = "http://localhost:5000/api/tools";

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [page, setPage] = useState(1);
  const toolsPerPage = 8;

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await axios.get(API_URL);
        setTools(res.data);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };
    fetchTools();
  }, []);

  const indexOfLastTool = page * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = tools.slice(indexOfFirstTool, indexOfLastTool);
  const totalPages = Math.ceil(tools.length / toolsPerPage);

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background Particles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Particles particleCount={300} particleSpread={8} />
      </div>

      {/* Nội dung chính */}
      <Container
        sx={{
          pt: 6,
          pb: 8, // chừa khoảng trống để pagination không đè
          position: "relative",
          zIndex: 1,
          flex: 1, // chiếm toàn bộ chiều cao trừ pagination
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Danh sách Tools
        </Typography>

        <Grid container spacing={3}>
          {currentTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool._id}>
              <SpotlightCard className="h-full">
                <Card
                  sx={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    height: 150,
                    width: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "center",
                    mx: "auto",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#fff" }}>
                      {tool.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      {tool.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "#4fc3f7" }}
                    >
                      Mở tool
                    </Button>
                  </CardActions>
                </Card>
              </SpotlightCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pagination dưới cùng */}
      {totalPages > 1 && (
        <Stack
          alignItems="center"
          sx={{
            position: "relative",
            zIndex: 1,
            py: 2,
            backgroundColor: "transparent",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#1976d2",
                color: "#fff",
              },
              "& .MuiPaginationItem-previousNext": {
                color: "#fff",
              },
            }}
          />
        </Stack>
      )}
    </div>
  );
}
