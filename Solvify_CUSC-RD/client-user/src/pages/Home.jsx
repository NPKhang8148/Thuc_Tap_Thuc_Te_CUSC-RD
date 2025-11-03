import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import LetterGlitch from "@/components/LetterGlitch";
import DotGrid from "@/components/DotGrid";
import LiquidEther from "@/components/LiquidEther";
import Particles from "@/components/Particles";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [seminars, setSeminars] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/categories");
        if (Array.isArray(res.data)) setCategories(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Lấy phần mềm mới
  useEffect(() => {
    const fetchSoftwares = async () => {
      try {
        const res = await axios.get("/api/softwares?sort=-createdAt&limit=6");
        setSoftwares(res.data.data || res.data);
      } catch (err) {
        console.error("Lỗi khi lấy phần mềm:", err);
      }
    };
    fetchSoftwares();
  }, []);

  // Lấy chuyên đề mới
  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const res = await axios.get("/api/seminars?sort=-createdAt&limit=6");
        setSeminars(res.data.data || res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chuyên đề:", err);
      }
    };
    fetchSeminars();
  }, []);

  // Lấy tool mới
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await axios.get("/api/tools?sort=-createdAt&limit=6");
        setTools(res.data.data || res.data);
      } catch (err) {
        console.error("Lỗi khi lấy tools:", err);
      }
    };
    fetchTools();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate("/softwares", { state: { categoryId } });
  };

  const handleSoftwareClick = (id) => navigate(`/softwares/${id}`);
  const handleSeminarClick = (id) => navigate(`/seminars/${id}`);
  const handleToolClick = (url) => window.open(url, "_blank");

  return (
    <div style={{ fontFamily: "sans-serif", color: "#fff" }}>
      {/* === DANH MỤC === */}
      <FadeInSection background={<LetterGlitch />} title="">
        <Hero />
        {loading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : (
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            {categories.map((cat) => (
              <Grid item key={cat._id} xs={12} sm={6} md={4} lg={3}>
                <CategoryCard
                  title={cat.name || cat.title}
                  description={cat.description || "Danh mục sản phẩm phần mềm"}
                  onClick={() => handleCategoryClick(cat._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </FadeInSection>

      {/* === PHẦN MỀM & GIẢI PHÁP MỚI === */}
      <FadeInSection
        background={<DotGrid className="software-list-bg" />}
        title="Phần mềm & Giải pháp mới"
      >
        <ItemGrid
          items={softwares}
          onClick={handleSoftwareClick}
          type="software"
        />
      </FadeInSection>

      {/* === CHUYÊN ĐỀ === */}
      <FadeInSection
        background={<LiquidEther className="software-list-bg" />}
        title="Chuyên đề mới nhất"
      >
        <ItemGrid
          items={seminars}
          onClick={handleSeminarClick}
          type="seminar"
          showDescription={false}
        />
      </FadeInSection>

      {/* === TOOLS === */}
      <FadeInSection
        background={<Particles className="software-list-bg" />}
        title="Tools mới nhất"
      >
        <ItemGrid
          items={tools}
          onClick={(tool) => handleToolClick(tool.url)}
          type="tool"
        />
      </FadeInSection>
    </div>
  );
};

/* -------------------------------
    Section nền động + FadeIn
-------------------------------- */
const FadeInSection = ({ background, title, children }) => (
  <Box
    sx={{
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      py: 8,
    }}
  >
    {/* Nền động */}
    <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.8 }}>
      {background}
    </div>

    {/* Overlay */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.9))",
      }}
    />

    {/* Nội dung với hiệu ứng fade-in */}
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ position: "relative", zIndex: 2 }}
    >
      {title && (
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          {title}
        </Typography>
      )}
      {children}
    </motion.div>
  </Box>
);

/* -------------------------------
   Hero Section (giữ nguyên)
-------------------------------- */
const Hero = () => (
  <section style={{ marginBottom: "60px" }}>
    <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
      💡 Chào mừng đến với CUSC RD
    </h1>
    <p style={{ fontSize: "18px", marginTop: "10px" }}>
      Trung tâm công nghệ - Giải pháp phần mềm toàn diện
    </p>
    <Link to="/softwares" style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 3, paddingX: 3, paddingY: 1.5, borderRadius: 2 }}
      >
        Khám phá giải pháp
      </Button>
    </Link>
  </section>
);

/* -------------------------------
   Grid hiển thị item (6 item)
-------------------------------- */
const ItemGrid = ({ items, onClick, type, showDescription = true }) => {
  if (!items || items.length === 0)
    return <Typography>Chưa có dữ liệu.</Typography>;

  return (
    <Grid container spacing={2} justifyContent="center">
      {items.slice(0, 6).map((item) => (
        <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
          <Card
            onClick={() =>
              type === "tool" ? onClick(item) : onClick(item._id)
            }
            sx={{
              height: 200,
              width: 400,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#fff",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.3)", boxShadow: 6 },
            }}
          >
            <CardContent sx={{ overflow: "hidden", textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title || item.name || "Không có tiêu đề"}
              </Typography>
              {showDescription && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "rgba(255,255,255,0.8)",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.description ||
                    item.summary ||
                    item.content ||
                    "Không có mô tả"}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

/* -------------------------------
   Thẻ danh mục (giữ nguyên)
-------------------------------- */
const CategoryCard = ({ title, description, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      height: 200,
      borderRadius: 2,
      border: "1px solid rgba(255,255,255,0.2)",
      backgroundColor: "rgba(240,240,240,0.3)",
      color: "#fff",
      cursor: "pointer",
      transition: "0.3s",
      "&:hover": { boxShadow: 6, backgroundColor: "rgba(0,0,0,0.3)" },
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,0.8)",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default Home;
