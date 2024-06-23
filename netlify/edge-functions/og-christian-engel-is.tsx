import type { Config, Context } from "@netlify/edge-functions";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";
import React from "https://esm.sh/react@18.2.0";

const FONTS = [
  {
    name: "UbuntuSansMono",
    weight: 700,
    style: "normal",
    filePath: "UbuntuSansMono-Bold.ttf",
  },
  {
    name: "UbuntuSansMono",
    weight: 300,
    style: "normal",
    filePath: "UbuntuSansMono-Regular.ttf",
  },
];

const STYLES = {
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffc55a",
    fontSize: "50px",
    fontFamily: "UbuntuSansMono",
    paddingTop: "120px",
    paddingLeft: "60px",
    paddingRight: "60px",
  },
  h1: {
    color: "#2c4e80",
    marginBottom: "30px",
    fontWeight: 300,
  },
  span: {
    color: "#00215e",
    fontWeight: 700,
  },
};

async function loadFonts(origin: string) {
  return await Promise.all(
    FONTS.map(async (font) => {
      const { name, weight, style, filePath } = font;
      const url = [origin, "fonts", filePath].join("/");
      const fontFileResponse = await fetch(url);
      const data = await fontFileResponse.arrayBuffer();
      return { name, weight, style, data };
    })
  );
}

export default async (request: Request, context: Context) => {
  const { origin, searchParams } = new URL(request.url);
  const fonts = await loadFonts(origin);
  const content = searchParams.get("content");
  const emoji = searchParams.get("emoji");
  const page = {
    title: `${content} ${emoji}`,
  };

  return new ImageResponse(
    (
      <div style={STYLES.wrapper}>
        <div style={STYLES.h1}>Christian Engel is</div>
        <div style={STYLES.span}>{page.title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
};

export const config: Config = { path: "/og-christian-engel-is" };
