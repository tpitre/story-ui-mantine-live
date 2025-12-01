# Story UI AI Considerations - Clean Test

This file contains specific instructions and considerations for the AI when generating stories for your component library.

## Component Library Details

**Library Name**: @mantine/core
**Import Path**: `@mantine/core`

## CRITICAL DESIGN SYSTEM RULES - MUST FOLLOW

These rules are MANDATORY and must be followed for ALL generated components:

### Color Contrast Rules (MOST IMPORTANT)

1. **ALWAYS ENSURE TEXT IS READABLE**
   - Dark text on light backgrounds OR light text on dark backgrounds
   - Never use white text on white/light backgrounds
   - Never use dark text on dark backgrounds
   - Use Mantine's color prop with appropriate contrast

### Typography Rules

2. **ALL HEADINGS MUST BE IN UPPERCASE**
   - Every Title, h1, h2, h3, and heading component must have its text content in ALL CAPITAL LETTERS
   - Example: Instead of "Welcome to Dashboard", use "WELCOME TO DASHBOARD"

### Button Styling Rules

3. **ALL BUTTONS MUST USE BLUE COLOR**
   - Every Button component must use `color="blue"` (Mantine's default blue)
   - Example: `<Button color="blue">CLICK ME</Button>`
   - This ensures good contrast and visibility

### Card Background Rules

4. **USE WHITE OR LIGHT BACKGROUNDS FOR CARDS**
   - Cards and Paper components should use light backgrounds
   - Text inside cards should be dark (default) for readability
   - Example: `<Paper bg="white" p="xl">` with default dark text

## Layout & Responsive Design (Mantine-Specific)

### Responsive Layouts
- Use Grid with responsive breakpoints: `cols={{ base: 1, sm: 2, md: 3, lg: 4 }}`
- Use SimpleGrid for equal-width responsive columns
- Use Stack for vertical layouts, Group for horizontal layouts
- Use Container with `size="xl"` or `fluid` for full-width layouts
- Use responsive props: `{{ base: 'value', sm: 'value', md: 'value', lg: 'value' }}`

### Spacing & Padding
- Add generous spacing: `p="xl"`, `gap="lg"`, `my="xl"` for breathing room
- Cards and sections should have proper padding (`p="lg"` or `p="xl"`)
- NEVER use fixed pixel widths - use Mantine's responsive props

### Visual Polish
- Add subtle shadows to cards: `shadow="sm"` or `shadow="md"`
- Use border radius for softer look: `radius="md"` or `radius="lg"`
- Use proper visual hierarchy with Title (varied `order` prop) and Text (with `size` prop)
- Use Badge, Indicator, and other decorative elements for visual interest

## Core Principles

- Use only Mantine components from @mantine/core
- Never use Material-UI, Chakra UI, or other design systems
- Use Mantine's built-in props for styling (size, radius, color, variant)
- Use Mantine's Grid, Group, Stack, and Container for layout
- ALWAYS prioritize readability and color contrast

## Do's and Don'ts

### DO
- Make ALL headings UPPERCASE
- Use `color="blue"` on ALL buttons
- Ensure text has good contrast with background
- Use light backgrounds (white, gray.0, gray.1) for cards
- Use dark text on light backgrounds
- Use Mantine's Paper component for card-like containers
- Use Title for headings (with UPPERCASE text) and Text for body copy

### DON'T
- Never use white text on white/light backgrounds
- Never use lowercase in headings
- Never use colors that create poor contrast
- Never use MuiButton, MuiTextField, or any Material-UI components
- Never use raw HTML elements like div, span when Mantine equivalents exist

## Test Marker

If these considerations are being read correctly, ALL generated components should:
- Have all headings in UPPERCASE
- Use blue color for ALL buttons
- Have readable text with good contrast
- Use light backgrounds for cards

**TEST_MARKER: BLUE_BUTTONS_UPPERCASE_HEADINGS_GOOD_CONTRAST**

## Common Mistakes to Avoid

1. **Wrong**: `<Button>Click Me</Button>`
   **Right**: `<Button color="blue">CLICK ME</Button>`
   **Why**: ALL buttons must be blue

2. **Wrong**: `<Title>Welcome</Title>`
   **Right**: `<Title>WELCOME</Title>`
   **Why**: ALL headings must be UPPERCASE

3. **Wrong**: `<Text c="white">content on light bg</Text>`
   **Right**: `<Text c="dark">content on light bg</Text>`
   **Why**: Text must have good contrast with background
