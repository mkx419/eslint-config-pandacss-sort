import type { Config, Preset } from "@pandacss/types";

import presetBase from "@pandacss/preset-base";
import presetPanda from "@pandacss/preset-panda";
import createJITI from "jiti";
import path from "path";

const jiti = createJITI(import.meta.url);

async function getPreset(preset: Preset | Promise<Preset> | string): Promise<Preset> {
  return typeof preset === "string" ? (await import(preset)).default : preset;
}

export default async function getConfig({
  destructureOnly = false,
  ignoreCase = true,
  ignorePattern = [],
  order = "asc",
  partitionByComment = false,
  partitionByNewLine = false,
  pluginName = "perfectionist",
  styledComponents = true,
  type = "alphabetical",
}: {
  destructureOnly?: boolean;
  ignoreCase?: boolean;
  ignorePattern?: string[];
  order?: "asc" | "desc";
  partitionByComment?: boolean | string | string[];
  partitionByNewLine?: boolean;
  pluginName?: string;
  styledComponents?: boolean;
  type?: "alphabetical" | "line-length" | "natural";
}) {
  const config: Config = (await jiti(path.resolve("panda.config.ts"))).default;
  const utilities: string[] = [];
  const conditions: string[] = [];
  const presets: Preset[] = [];

  if (!config.eject) {
    utilities.push("textStyle", "layerStyle");
    presets.push(presetBase);

    if (config.presets) {
      for (const preset of config.presets) {
        presets.push(await getPreset(preset));
      }
    } else {
      presets.push(presetPanda);
    }
  } else {
    if (config.presets) {
      for (const preset of config.presets) {
        presets.push(await getPreset(preset));
      }
    }
  }

  for (const preset of presets) {
    if (preset.utilities) {
      const { extend = {}, ...rest } = preset.utilities;
      utilities.push(...Object.keys(rest), ...Object.keys(extend));
    }

    if (preset.conditions) {
      const { extend = {}, ...rest } = preset.conditions;
      conditions.push(...Object.keys(rest), ...Object.keys(extend));
    }
  }

  return {
    rules: {
      [`${pluginName}/sort-objects`]: [
        "error",
        {
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
          destructureOnly,
          groups: [
            ...utilities.map((value) => `pandacss/${value}`),
            ...conditions.map((value) => `pandacss/_${value}`),
          ],
          ignoreCase,
          ignorePattern,
          order,
          partitionByComment,
          partitionByNewLine,
          styledComponents,
          type,
        },
      ],
    },
  } as const;
}
