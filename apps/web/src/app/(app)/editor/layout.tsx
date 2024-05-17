"use client";
import { usePreventZoom } from "@/hooks";
import { FiberProvider } from "its-fine";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePreventZoom(); // Always deny zooming in the editor
  return <FiberProvider>{children}</FiberProvider>;
}
