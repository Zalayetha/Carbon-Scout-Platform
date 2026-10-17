import { hc } from "hono/client";
import type { AppType } from "../index.js";

export const apiClient = hc<AppType>("http://localhost:8000")