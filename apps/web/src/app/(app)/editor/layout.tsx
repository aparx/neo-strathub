"use client";
import { useDenyZoom } from "@/hooks/useDenyZoom";
import { FiberProvider } from "its-fine";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useDenyZoom();

  return <FiberProvider>{children}</FiberProvider>;
}
