import type { rules } from "eslint-plugin-perfectionist";

import { loadConfig } from "@pandacss/config";
import path from "path";

type Options = { pluginName?: string } & Omit<
  (typeof rules)["sort-objects"]["defaultOptions"][0],
  "customGroups" | "groups"
>;

export default async function getConfig(options?: Options) {
  const { pluginName = "perfectionist", ...restOptions } = options;
  const config = (await loadConfig({ cwd: path.resolve() })).config;
  const utilities = [...Object.keys(config.utilities), "textStyle", "layerStyle"];
  const conditions = Object.keys(config.conditions);

  return {
    rules: {
      [`${pluginName}/sort-objects`]: [
        "error",
        {
          ...restOptions,
          customGroups: {
            ...utilities.reduce(
              (previous, current) => Object.assign(previous, { [`pandacss/${current}`]: current }),
              {},
            ),
            ...conditions.reduce(
              (previous, current) =>
                Object.assign(previous, { [`pandacss/_${current}`]: `_${current}` }),
              {},
            ),
          },
          groups: [
            ...utilities.map((value) => `pandacss/${value}`),
            ...conditions.map((value) => `pandacss/_${value}`),
          ],
        },
      ],
    },
  } as const;
}
