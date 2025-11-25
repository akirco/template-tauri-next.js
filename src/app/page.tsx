"use client";
import useTheme from "@/hooks/useTheme";

export default function Home() {
  useTheme();

  return (
    <div className="flex justify-center items-center bg-zinc-50 dark:bg-black min-h-screen font-sans">
      hello world
    </div>
  );
}
