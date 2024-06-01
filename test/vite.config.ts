import { UserConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
    let plugins = [react()];

    const options: UserConfig = {
        plugins,
    };
    if (mode == "development") {
        options.optimizeDeps = {
            include: ["cache-wise"],
        };
    }

    return options;
});
