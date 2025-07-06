import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "ArtEsfera - Ecossistema de Suporte e Fomento à Arte";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #292423 0%, #000167 50%, #292423 100%)",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 70%, #FCC931 0%, transparent 50%), radial-gradient(circle at 70% 30%, #F05913 0%, transparent 50%)",
            opacity: 0.1,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: 120,
              fontWeight: "bold",
              background:
                "linear-gradient(135deg, #FCC931 0%, #F05913 50%, #A4144E 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: 40,
            }}
          >
            ArtEsfera
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: "#FDF6EC",
              maxWidth: 800,
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            Ecossistema de Suporte e Fomento à Arte
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: "#FDF6EC",
              opacity: 0.8,
              maxWidth: 900,
              lineHeight: 1.4,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Descubra, contrate e exponha talentos únicos
          </div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 50,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(45deg, #FCC931, #F05913)",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 50,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(45deg, #21DAED, #A4144E)",
            opacity: 0.3,
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
