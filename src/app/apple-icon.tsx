import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background:
            "linear-gradient(135deg, #FCC931 0%, #F05913 50%, #A4144E 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#292423",
          fontWeight: "bold",
          borderRadius: "40px",
          boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.2)",
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
