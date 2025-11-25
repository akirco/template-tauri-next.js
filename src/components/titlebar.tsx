"use client";
import { Close, Maximize, Minimize, Restore } from "@/components/icon";
import { mainWindow } from "@/lib/ipc";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState<boolean | undefined>();

  useEffect(() => {
    const checkIsMaximized = async () => {
      const isMaximized = await mainWindow?.isMaximized();
      setIsMaximized(isMaximized);
    };
    const unlisten = mainWindow?.listen("tauri://resize", () => {
      checkIsMaximized();
    });
    return () => {
      unlisten?.then((fn) => fn());
    };
  }, []);

  const buttonClass =
    "font-thin hover:bg-gray-600/20 inline-flex flex justify-center items-center bg-transparent border-none w-12 h-full appearance-none";
  return (
    <div className="top-0 right-0 left-0 fixed items-center grid grid-cols-[auto_max-content] bg-titlebar-background h-9 text-slate-400 select-none">
      <div data-tauri-drag-region className="h-full"></div>
      <div className="flex h-full">
        <button className={buttonClass} onClick={() => mainWindow?.minimize()}>
          <Minimize />
        </button>
        <button
          className={buttonClass}
          onClick={() => {
            mainWindow?.toggleMaximize();
            setIsMaximized(!isMaximized);
          }}
        >
          {isMaximized ? <Restore /> : <Maximize />}
        </button>
        <button
          className={cn(buttonClass, "hover:bg-red-600/70")}
          onClick={() => mainWindow?.close()}
        >
          <Close />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
