import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Generated 1200×630 social/search card — replaces the cropped square logo so
// link previews and SERP cards render at the correct aspect ratio.
export const runtime = "nodejs";
export const alt = "Kumaran Natural Products — farm-fresh quail eggs and quail meat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public", "Kumaran natural product logo.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px",
          backgroundColor: "#f3f7f3",
          backgroundImage:
            "radial-gradient(1000px 500px at 15% -10%, #e6f4ea 0%, transparent 60%), radial-gradient(900px 600px at 110% 10%, #dcefe0 0%, transparent 55%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={logoSrc} width={210} height={210} />
        <div
          style={{
            marginTop: 24,
            fontSize: 68,
            fontWeight: 700,
            color: "#16241c",
            letterSpacing: "-1px",
          }}
        >
          Kumaran Natural Products
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "#2e7d46",
            fontWeight: 600,
          }}
        >
          Farm-fresh quail eggs &amp; quail meat · Sri Lanka
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 24,
            color: "#56655b",
          }}
        >
          Available at Cargills Food City, Keells &amp; private supermarkets
        </div>
      </div>
    ),
    { ...size }
  );
}
