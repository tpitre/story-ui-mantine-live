/**
 * Story UI Storybook Manager Addon
 *
 * This addon integrates with Storybook's sidebar to show generated stories.
 * In Edge mode, it fetches stories from the Edge Worker and adds them to the sidebar.
 *
 * NOTE: Uses Storybook's manager globals for compatibility with Storybook 9 build system.
 */

import { addons, types } from 'storybook/manager-api';
import React, { useEffect, useState, useCallback } from 'react';

// Addon identifier
const ADDON_ID = 'story-ui';
const PANEL_ID = `${ADDON_ID}/generated-stories`;

// Event channels for communication between panel and manager
export const EVENTS = {
  STORY_GENERATED: `${ADDON_ID}/story-generated`,
  REFRESH_STORIES: `${ADDON_ID}/refresh-stories`,
  SELECT_GENERATED_STORY: `${ADDON_ID}/select-generated-story`,
};

// Types
interface GeneratedStory {
  id: string;
  title: string;
  createdAt: number;
  framework?: string;
}

/**
 * Get the Edge URL from environment variable.
 * This must be configured via VITE_STORY_UI_EDGE_URL environment variable.
 * No hardcoded URLs - each deployment must configure their own backend.
 *
 * NOTE: Storybook's manager is built with esbuild IIFE format separately from
 * the preview iframe. We need to access the URL through window globals that
 * can be set at runtime via manager-head.html or environment configuration.
 */

// Extend Window interface to include our global
declare global {
  interface Window {
    STORY_UI_EDGE_URL?: string;
  }
}

function getEdgeUrl(): string {
  // Try window global first (can be set via manager-head.html or runtime config)
  if (typeof window !== 'undefined' && window.STORY_UI_EDGE_URL) {
    return window.STORY_UI_EDGE_URL;
  }

  // No fallback - environment variable must be configured
  return '';
}

/**
 * Check if we're in Edge mode
 */
function isEdgeMode(): boolean {
  const edgeUrl = getEdgeUrl();
  if (edgeUrl) return true;

  // Check if we're on a production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname !== 'localhost' && hostname !== '127.0.0.1';
  }

  return false;
}

/**
 * Simple inline styles (avoiding @storybook/theming)
 */
const styles = {
  container: {
    padding: '10px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.35em',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  storyItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  storyItemHover: {
    background: '#f5f5f5',
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '12px',
  },
  refreshButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: '#666',
    fontSize: '14px',
  },
};

/**
 * Generated Stories Panel Component
 */
const GeneratedStoriesPanel: React.FC<{ active?: boolean }> = ({ active }) => {
  const [stories, setStories] = useState<GeneratedStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    if (!isEdgeMode()) return;

    setLoading(true);
    try {
      const edgeUrl = getEdgeUrl();
      const response = await fetch(`${edgeUrl}/story-ui/stories`);
      if (response.ok) {
        const data = await response.json();
        setStories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch generated stories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (active) {
      fetchStories();
    }
  }, [active, fetchStories]);

  // Listen for story generation events
  useEffect(() => {
    const channel = addons.getChannel();

    const handleStoryGenerated = (data: GeneratedStory) => {
      setStories(prev => [data, ...prev.filter(s => s.id !== data.id)]);
    };

    const handleRefresh = () => {
      fetchStories();
    };

    channel.on(EVENTS.STORY_GENERATED, handleStoryGenerated);
    channel.on(EVENTS.REFRESH_STORIES, handleRefresh);

    return () => {
      channel.off(EVENTS.STORY_GENERATED, handleStoryGenerated);
      channel.off(EVENTS.REFRESH_STORIES, handleRefresh);
    };
  }, [fetchStories]);

  const handleStoryClick = useCallback((story: GeneratedStory) => {
    setActiveStoryId(story.id);

    // Emit event for the preview to pick up
    const channel = addons.getChannel();
    channel.emit(EVENTS.SELECT_GENERATED_STORY, story);

    // Navigate to the Generated Story Renderer
    // The selectStory API is accessible via addons
    const api = (addons as any).getConfig?.()?.api;
    if (api?.selectStory) {
      api.selectStory('storyui-generated--story-renderer');
    }
  }, []);

  if (!active) return null;

  if (!isEdgeMode()) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          Generated stories appear here in Edge mode.
          <br />
          <br />
          Deploy to Cloudflare Pages to enable this feature.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.sectionTitle}>
        <span>Generated Stories</span>
        <button
          style={styles.refreshButton}
          onClick={fetchStories}
          title="Refresh stories"
        >
          {loading ? '...' : '\u21bb'}
        </button>
      </div>

      {stories.length === 0 ? (
        <div style={styles.emptyState}>
          {loading ? 'Loading...' : 'No generated stories yet'}
        </div>
      ) : (
        <ul style={styles.storyList}>
          {stories.map((story) => (
            <li
              key={story.id}
              style={{
                ...styles.storyItem,
                ...(hoveredId === story.id || activeStoryId === story.id ? styles.storyItemHover : {}),
                color: activeStoryId === story.id ? '#1976d2' : '#333',
              }}
              onClick={() => handleStoryClick(story)}
              onMouseEnter={() => setHoveredId(story.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span>&#128214;</span>
              {story.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the sidebar panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Generated',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: ({ active }) => <GeneratedStoriesPanel active={active} />,
  });
});
