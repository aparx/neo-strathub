"use client";
import { FiberProvider } from "its-fine";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // the canvas requires a `FiberProvider`
  return <FiberProvider>{children}</FiberProvider>;
}
