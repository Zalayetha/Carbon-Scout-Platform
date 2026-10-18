import type { Document } from "@anvia/core";
import { supportPolicy } from "./support-policy.js";

export const staticContext: readonly Document[] = [
  {
    id: supportPolicy.id,
    text: supportPolicy.text,
    additionalProps: supportPolicy.additionalProps,
  },
];
