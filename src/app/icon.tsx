import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "linear-gradient(135deg, #FCC931 0%, #F05913 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#292423",
          fontWeight: "bold",
          borderRadius: "6px",
        }}
      >
        A
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
