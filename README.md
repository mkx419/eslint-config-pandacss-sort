# eslint-config-pandacss-sort

Before

```js
import { css } from "styled-system/css/index.js";

const style = css({
  fontSize: 1,
  _hover: {
    color: "red",
  },
  background: {
    _hover: "blue",
    base: "green",
    _focus: "yellow",
  },
});
```

After

```js
import { css } from "styled-system/css/index.js";

const style = css({
  fontSize: 1,
  background: {
    _hover: "blue",
    _focus: "yellow",
    base: "green",
  },
  _hover: {
    color: "red",
  },
});
```

## Installation

```bash
pnpm add -D @mkx419/eslint-config-pandacss-sort
```

## Usage

```js
import perfectionist from "eslint-plugin-perfectionist";
import getConfig from "@mkx419/eslint-config-pandacss-sort";

/** @type {import("eslint").Linter.Config[]} */
export default [
  perfectionist.configs["recommended-natural"],
  await getConfig({
    // Options
    type: "natural",
  }),
];
```

See [here](https://perfectionist.dev/rules/sort-objects#options) for options.
