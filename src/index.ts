import { loadConfig } from "@pandacss/config";
import path from "path";

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
  const config = (await loadConfig({ cwd: path.resolve() })).config;
  const utilities = [...Object.keys(config.utilities), "textStyle", "layerStyle"];
  const conditions = Object.keys(config.conditions);

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
