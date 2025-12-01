export default {
  "importPath": "@mantine/core",
  "componentPrefix": "",
  "layoutRules": {
    "multiColumnWrapper": "SimpleGrid",
    "columnComponent": "div",
    "containerComponent": "Container",
    "layoutExamples": {
      "twoColumn": "<SimpleGrid cols={2} spacing=\"md\">\n  <div>\n    <Card shadow=\"sm\" padding=\"lg\" radius=\"md\" withBorder>\n      <Text fw={500} size=\"lg\" mb=\"xs\">Left Card</Text>\n      <Text size=\"sm\" c=\"dimmed\">\n        Left content goes here\n      </Text>\n    </Card>\n  </div>\n  <div>\n    <Card shadow=\"sm\" padding=\"lg\" radius=\"md\" withBorder>\n      <Text fw={500} size=\"lg\" mb=\"xs\">Right Card</Text>\n      <Text size=\"sm\" c=\"dimmed\">\n        Right content goes here\n      </Text>\n    </Card>\n  </div>\n</SimpleGrid>"
    }
  },
  "generatedStoriesPath": "./src/stories/generated",
  "storyPrefix": "Generated/",
  "defaultAuthor": "Story UI AI",

  // Production app dependencies (design system packages)
  "dependencies": ["@mantine/core", "@mantine/hooks"],

  // Provider configuration for production app
  "provider": {
    "cssImports": ["@mantine/core/styles.css"],
    "imports": ["import { MantineProvider } from '@mantine/core';"],
    "wrapper": "<MantineProvider>{children}</MantineProvider>"
  }
};
