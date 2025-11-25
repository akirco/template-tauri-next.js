import { Window } from "@tauri-apps/api/window";

let mainWindow: Window | undefined = undefined;

mainWindow = mainWindow ?? new Window("main");

export { mainWindow };
