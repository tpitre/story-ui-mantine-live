import type { Preview } from '@storybook/react-vite'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import React from 'react'

// Auto-detect production environment and configure Story UI to use same-origin API
// This enables the StoryUIPanel to communicate with the MCP server behind Caddy
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  // Set window.STORY_UI_EDGE_URL to use same origin (Caddy routes /story-ui/* to MCP server)
  (window as any).STORY_UI_EDGE_URL = window.location.origin;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
};

export default preview;
