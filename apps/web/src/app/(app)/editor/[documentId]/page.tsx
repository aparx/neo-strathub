"use client";
import dynamic from "next/dynamic";

export default dynamic(async () => (await import("./content")).EditorContent, {
  ssr: false,
});
