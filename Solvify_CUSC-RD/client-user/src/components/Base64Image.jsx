import React, { useMemo } from "react";

const Base64Image = ({ image, alt = "", width, height, className = "" }) => {
  const getImageSrc = (imageData) => {
    if (!imageData) return "https://via.placeholder.com/150";

    // Nếu là base64 string
    if (typeof imageData === "string") {
      return `data:image/jpeg;base64,${imageData}`;
    }

    // Nếu là object MongoDB buffer
    if (imageData.data && imageData.contentType) {
      try {
        const binary = imageData.data?.data || imageData.data;

        // Chuyển Uint8Array thành chuỗi nhị phân an toàn (không spread trực tiếp)
        const byteArray = new Uint8Array(binary);
        let binaryStr = "";
        const chunkSize = 8192;

        for (let i = 0; i < byteArray.length; i += chunkSize) {
          const chunk = byteArray.subarray(i, i + chunkSize);
          binaryStr += String.fromCharCode.apply(null, chunk);
        }

        const base64 = btoa(binaryStr);
        return `data:${imageData.contentType};base64,${base64}`;
      } catch (error) {
        console.error("Lỗi khi chuyển ảnh:", error);
        return "https://via.placeholder.com/150";
      }
    }

    return "https://via.placeholder.com/150";
  };

  const src = useMemo(() => getImageSrc(image), [image]);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "cover", borderRadius: "8px" }}
    />
  );
};

export default Base64Image;
