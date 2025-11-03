import React, { useRef } from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import VariableProximity from "@components/VariableProximity";

const About = () => {
  const containerRef = useRef(null);

  return (
    <Container sx={{ mt: 5 }} ref={containerRef}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        {/* Tiêu đề có hiệu ứng VariableProximity */}
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          <VariableProximity
            label="Giới thiệu về CUSC-RD"
            fromFontVariationSettings="'wght' 300, 'wdth' 100"
            toFontVariationSettings="'wght' 900, 'wdth' 120"
            containerRef={containerRef}
            radius={80}
            falloff="exponential"
            className="variable-title"
          />
        </Typography>

        {/* Nội dung giới thiệu */}
        <Typography variant="body1" paragraph>
          <strong>CUSC-RD</strong> là website quảng bá các phần mềm của Trung tâm,
          là nơi để nhân viên gửi các yêu cầu của khách hàng về cho trung tâm xử lý,
          theo dõi các chuyên đề, và sử dụng các công cụ miễn phí có sẵn.
        </Typography>

        <Typography variant="body1" paragraph>
          Website được xây dựng nhằm giúp nhân viên và khách hàng dễ dàng tương tác,
          chia sẻ thông tin, và tiếp cận các phần mềm – sản phẩm nghiên cứu do trung tâm phát triển.
        </Typography>

        <Box component="ul" sx={{ pl: 4 }}>
          <li>Quảng bá và giới thiệu các phần mềm nghiên cứu của trung tâm.</li>
          <li>Gửi và theo dõi các yêu cầu từ khách hàng nhanh chóng, thuận tiện.</li>
          <li>Tra cứu, đăng ký và theo dõi các chuyên đề công nghệ.</li>
          <li>Truy cập, sử dụng các tool miễn phí hỗ trợ công việc.</li>
        </Box>

        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 3, color: "primary.main" }}
        >
          <VariableProximity
            label="Khám phá công nghệ cùng CUSC-RD!"
            fromFontVariationSettings="'wght' 400, 'wdth' 100"
            toFontVariationSettings="'wght' 900, 'wdth' 120"
            containerRef={containerRef}
            radius={60}
            falloff="linear"
          />
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
