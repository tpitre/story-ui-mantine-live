/**
 * Story UI Storybook Manager Addon
 *
 * This addon adds a "Source Code" panel to Storybook that displays
 * the source code of the currently viewed story with syntax highlighting.
 *
 * Works in both local development and production deployments.
 */

import { addons, types, useStorybookApi, useStorybookState } from 'storybook/manager-api';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

// Addon identifier
const ADDON_ID = 'story-ui';
const PANEL_ID = `${ADDON_ID}/source-code`;

// Event channel for receiving generated code from StoryUIPanel
const EVENTS = {
  CODE_GENERATED: `${ADDON_ID}/code-generated`,
  STORY_SELECTED: `${ADDON_ID}/story-selected`,
};

// Extend Window to include generated stories cache
declare global {
  interface Window {
    __STORY_UI_GENERATED_CODE__?: Record<string, string>;
  }
}

/**
 * Simple Prism-like syntax highlighting for JSX/TSX
 * Uses inline styles for portability (no external CSS needed)
 */
const tokenize = (code: string): Array<{ type: string; value: string }> => {
  const tokens: Array<{ type: string; value: string }> = [];
  let remaining = code;

  const patterns: Array<{ type: string; regex: RegExp }> = [
    // Comments
    { type: 'comment', regex: /^(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/ },
    // Strings (double, single, template)
    { type: 'string', regex: /^("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/ },
    // JSX tags
    { type: 'tag', regex: /^(<\/?[A-Z][a-zA-Z0-9.]*|<\/?[a-z][a-z0-9-]*)/ },
    // Closing tag bracket
    { type: 'punctuation', regex: /^(\/>|>)/ },
    // Keywords
    { type: 'keyword', regex: /^(const|let|var|function|return|export|default|import|from|if|else|for|while|class|extends|new|this|typeof|instanceof|async|await|try|catch|throw|finally)\b/ },
    // Booleans and null
    { type: 'boolean', regex: /^(true|false|null|undefined)\b/ },
    // Numbers
    { type: 'number', regex: /^-?\d+\.?\d*(e[+-]?\d+)?/ },
    // Props/attributes (word followed by =)
    { type: 'attr-name', regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?==)/ },
    // Function names
    { type: 'function', regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/ },
    // Identifiers
    { type: 'plain', regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
    // Operators
    { type: 'operator', regex: /^(=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:])/ },
    // Punctuation
    { type: 'punctuation', regex: /^[{}[\]();,.]/ },
    // Whitespace
    { type: 'whitespace', regex: /^\s+/ },
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const { type, regex } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        tokens.push({ type, value: match[0] });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Unknown character, add as plain
      tokens.push({ type: 'plain', value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
};

/**
 * Color scheme for syntax highlighting (VS Code-like dark theme)
 */
const tokenColors: Record<string, React.CSSProperties> = {
  comment: { color: '#6A9955', fontStyle: 'italic' },
  string: { color: '#CE9178' },
  tag: { color: '#569CD6' },
  keyword: { color: '#C586C0' },
  boolean: { color: '#569CD6' },
  number: { color: '#B5CEA8' },
  'attr-name': { color: '#9CDCFE' },
  function: { color: '#DCDCAA' },
  operator: { color: '#D4D4D4' },
  punctuation: { color: '#D4D4D4' },
  plain: { color: '#D4D4D4' },
  whitespace: {},
};

/**
 * Syntax Highlighter Component
 */
const SyntaxHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const tokens = useMemo(() => tokenize(code), [code]);

  return (
    <pre
      style={{
        margin: 0,
        padding: '16px',
        background: '#1E1E1E',
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '13px',
        lineHeight: '1.5',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      }}
    >
      <code>
        {tokens.map((token, index) => (
          <span key={index} style={tokenColors[token.type] || {}}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
};

/**
 * Inline styles for the panel
 */
const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    background: '#1E1E1E',
    color: '#D4D4D4',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderBottom: '1px solid #3C3C3C',
    background: '#252526',
  },
  title: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#CCCCCC',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  copyButton: {
    background: '#0E639C',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  codeContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '0',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#888',
    fontSize: '13px',
    textAlign: 'center' as const,
    padding: '20px',
  },
  storyInfo: {
    fontSize: '11px',
    color: '#888',
    marginTop: '4px',
  },
};

/**
 * Source Code Panel Component
 */
const SourceCodePanel: React.FC<{ active?: boolean }> = ({ active }) => {
  const api = useStorybookApi();
  const state = useStorybookState();
  const [sourceCode, setSourceCode] = useState<string>('');
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Get the current story ID
  const currentStoryId = state?.storyId;

  // Try to get source code from the story
  useEffect(() => {
    if (!currentStoryId || !active) return;

    // Get story data from the API
    const story = api.getData(currentStoryId);

    if (story) {
      setStoryTitle(story.title || '');

      // Check if this is a generated story (from Story UI)
      // Generated stories are saved in the Generated folder
      const isGeneratedStory =
        story.title?.startsWith('Generated/') ||
        story.id?.startsWith('generated-') ||
        currentStoryId.includes('generated');

      // Try to get source from story parameters
      const storySource = (story as any)?.parameters?.docs?.source?.code ||
                          (story as any)?.parameters?.storySource?.source ||
                          (story as any)?.parameters?.source?.code;

      if (storySource) {
        setSourceCode(storySource);
      } else if (isGeneratedStory) {
        // For generated stories, try to get from window cache
        // Check both window and window.top since StoryUIPanel stores code in top window
        const topWindow = window.top || window;
        const cachedCode = topWindow.__STORY_UI_GENERATED_CODE__?.[currentStoryId] ||
                          window.__STORY_UI_GENERATED_CODE__?.[currentStoryId];
        if (cachedCode) {
          setSourceCode(cachedCode);
        } else {
          setSourceCode('');
        }
      } else {
        setSourceCode('');
      }
    }
  }, [currentStoryId, active, api]);

  // Listen for code generated events from StoryUIPanel
  useEffect(() => {
    const channel = addons.getChannel();
    const topWindow = window.top || window;

    const handleCodeGenerated = (data: { storyId: string; code: string }) => {
      // Store in window cache (both local and top window)
      if (!window.__STORY_UI_GENERATED_CODE__) {
        window.__STORY_UI_GENERATED_CODE__ = {};
      }
      window.__STORY_UI_GENERATED_CODE__[data.storyId] = data.code;

      if (topWindow !== window) {
        if (!topWindow.__STORY_UI_GENERATED_CODE__) {
          topWindow.__STORY_UI_GENERATED_CODE__ = {};
        }
        topWindow.__STORY_UI_GENERATED_CODE__[data.storyId] = data.code;
      }

      // If this is the current story, update the display
      if (data.storyId === currentStoryId) {
        setSourceCode(data.code);
      }
    };

    channel.on(EVENTS.CODE_GENERATED, handleCodeGenerated);

    return () => {
      channel.off(EVENTS.CODE_GENERATED, handleCodeGenerated);
    };
  }, [currentStoryId]);

  const handleCopy = useCallback(() => {
    if (sourceCode) {
      navigator.clipboard.writeText(sourceCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [sourceCode]);

  if (!active) return null;

  // No story selected
  if (!currentStoryId) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <span>Select a story to view its source code</span>
        </div>
      </div>
    );
  }

  // No source code available
  if (!sourceCode) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.title}>Source Code</span>
        </div>
        <div style={styles.emptyState}>
          <span>No source code available for this story</span>
          <span style={styles.storyInfo}>
            {storyTitle || currentStoryId}
          </span>
          <span style={{ ...styles.storyInfo, marginTop: '12px', maxWidth: '280px' }}>
            Generate a story using the Story UI panel to see the code here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Source Code</span>
        <button
          style={{
            ...styles.copyButton,
            background: copied ? '#16825D' : '#0E639C',
          }}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div style={styles.codeContainer}>
        <SyntaxHighlighter code={sourceCode} />
      </div>
    </div>
  );
};

// Register the addon - always register, not just in Edge mode
addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Source Code',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: ({ active }) => <SourceCodePanel active={active} />,
  });
});
