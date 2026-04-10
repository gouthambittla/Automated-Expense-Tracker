# UI And Chart Standards

## Screenshot-To-UI Workflow

1. Break the image into sections: header, summary, navigation, cards, inputs, chart area, footer, modal, and floating actions.
2. Identify reusable primitives before writing the screen.
3. Map visual values to theme tokens where possible instead of hardcoding new colors.
4. Build layout first, then typography, then states, then motion.
5. Add loading, empty, and error states before considering the screen complete.

## React Native Documentation Grounding

- Prefer core components from the official docs for basic layout and interaction.
- Use `FlatList` or `SectionList` for long data sets instead of oversized `ScrollView` trees.
- Use `Pressable` for interactive surfaces that need pressed or hovered states.
- Use `Image` and `ImageBackground` according to React Native image guidance.
- Remote images must have explicit dimensions or aspect ratio handling.

## Graph And Analytics Standards

- For simple visuals, prefer custom KPI cards, segmented bars, stacked rows, dot legends, progress rails, and mini bar charts made from plain `View` blocks.
- Use consistent axes, legends, and units. Expense numbers should clearly state currency and timeframe.
- Avoid decorative charts without labels or comparison context.
- If no graphing package exists, build the simplest correct visual with existing components first.
- Only introduce an SVG-based graph library when there is a real need for curved paths, pie or donut geometry, zooming, tooltips, or gesture-driven selection.

## Coding Standards

- Keep components small enough to read in one pass.
- Extract display-only helpers when a screen starts mixing formatting, transformations, and rendering.
- Avoid overusing memoization. Optimize after identifying a real render problem.
- Keep screen data mapping close to the fetch layer or store layer, not buried in multiple visual components.
- Use meaningful names for layout blocks such as `summaryRow`, `legendItem`, `emptyStateCard`, and `chartColumn`.
