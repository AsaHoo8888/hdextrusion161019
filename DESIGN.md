---
name: HD Extrusion
description: Precise industrial typography, technical white surfaces, and a restrained rose accent.
colors:
  brand: "#cb3a56"
  brand-dark: "#ad2943"
  ink: "#182b3a"
  muted: "#53616b"
  paper: "#fff"
  surface: "#f3f5f5"
  line: "#d6dddf"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(40px, 4.35vw, 68px)"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(30px, 3.1vw, 46px)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-.035em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 650
    letterSpacing: ".005em"
rounded:
  control: "4px"
spacing:
  section: "104px"
  section-tablet: "80px"
  section-mobile: "65px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand-dark}"
  button-small:
    padding: "12px 19px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "13px 14px"
  material-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "24px"
  inquiry-container:
    backgroundColor: "{colors.paper}"
    padding: "30px"
---

# Design System: HD Extrusion

## Overview

**Creative North Star: "Engineering Hall"**

A spacious industrial showroom with technical white and cool grey surfaces, navy typography, fine rules, and the confirmed rose brand accent. Engineering Hall is the visual decision reference adapted to the business identity; its homepage composition is recorded separately in `.impeccable/homepage.md`.

The system uses clear typographic hierarchy and open, ruled layouts to make technical information approachable. The current textual wordmark is provisional until final logo artwork is supplied.

**Key Characteristics:**

- Quiet surfaces and generous section spacing.
- Manrope throughout, with compact technical labels.
- Rose actions, visible keyboard focus, and precise separators.

## Colors

### Primary

- **Brand Rose:** Primary actions, wordmark slash, focus outlines, and small status marks.
- **Deep Rose:** Action hover, text links, selected material text, and emphasized headings.

### Neutral

- **Engineering Ink:** Headings, body text, and navigation.
- **Technical Slate:** Supporting copy, labels, units, and notes.
- **White Paper:** Main background, controls, navigation, and inquiry container.
- **Cool Grey Surface:** Engineering section and quiet background layering.
- **Fine Rule:** Structural separators and container boundaries.

**The Accent Rule.** Use rose to identify action and emphasis; retain white and grey as the dominant surfaces. Contextual pale rose selection and inquiry surfaces remain subordinate.

## Typography

**Display and Body Font:** Locally hosted Manrope, falling back to Arial and sans-serif. The variable font supplies the observed intermediate weights.

Display and headline roles use tightly tracked, balanced lines. Body text is calm and open; technical descriptions generally use smaller (12–14px) text with generous line height (1.7–1.9). Selected-line titles use (26px), weight (750), and line height (1.3). Labels remain compact and sentence case. Specification values use tabular numerals where implemented.

## Layout

The shared navigation collapses to the mobile menu at (980px) to accommodate the video-library link. Content layout breakpoints remain unchanged.

The desktop container caps at (1280px) with (56px) side gutters. At the (1100px) breakpoint gutters become (32px); at (760px) they become (20px). Section spacing follows the frontmatter scale.

Desktop uses open columns: material navigation beside a specification panel, four process stages, three support columns, and a two-column inquiry. On mobile, the material selector becomes three horizontal choices, process stages form two columns, and support, inquiry, and FAQ stack. The quick specification strip retains two fields beside one another and places its action below them. Keep controls comfortably readable; mobile field text is (16px).

## Elevation & Depth

Depth comes primarily from tonal surfaces and fine borders. The quick specification strip has a restrained ambient shadow (`0 8px 28px #182b3a0b`); the expanded mobile navigation uses `0 12px 20px #182b3a0a`. The pipe symbols use an inset white ring. Avoid introducing elevated card stacks into these open layouts.

## Shapes

Controls use the small corner radius in frontmatter. Larger content areas remain square and flat. Thin separators organize specification rows and adjacent columns. Circular pipe cross-sections and small round status marks provide the few curved motifs.

## Components

Product specification tables use full-width semantic rows, fine horizontal rules, left-aligned row headers, and muted clarification text. Reference equipment imagery retains the entire machine; crop only surrounding whitespace when needed. Product section links wrap on mobile.

Video regions use a 16:9 navy frame with `object-fit: contain` to preserve source thumbnails. Playback uses an explicit rose action; category buttons use the established control radius and pressed state. The library uses three columns on desktop and one at the existing mobile content breakpoint.

### Buttons

Solid rose, white text, weight (700), with a small radius and a trailing arrow or download icon. Standard minimum height is (57px); the compact navigation variant is (46px). Hover darkens the surface and lifts it (1px); active returns it to rest. Keyboard focus uses a rose outline (3px), offset (5px).

### Inputs / Fields

White controls with a grey stroke (`#c7d0d5`), small radius, and visible labels. Hover strengthens the border (`#899ba5`); focus changes it to brand rose while retaining the global focus outline. Required markers and unit labels are visible. The inquiry container is white on a pale rose section; online delivery is explicitly pending, and the implemented action downloads a brief.

### Navigation

Horizontal links with compact text (13px), weight (650), and rose hover. Below (980px), a labeled menu control reveals a vertical white panel. Extrusion lines opens a native disclosure with PVC, PE and PPR four-layer product links; the current product is highlighted. Preserve its expanded state, Escape-to-close behavior, outside-click dismissal and keyboard focus return.

### Material Selector

Ruled choices with pipe cross-section symbols on desktop, pale rose hover (`#faf2f4`) and selected (`#fbf0f3`) backgrounds. Selection updates the adjacent specification and inquiry fields; its state uses `aria-pressed`. A brief highlight (550ms) identifies the changed panel. Symbols are hidden in the mobile layout.

### Specification and FAQ Containers

Use fine horizontal rules rather than detached cards. FAQ uses native details/summary controls with plus/minus indicators. Generated production imagery is visibly labeled as AI-generated. Source photographs carry provenance and are identified as reference equipment rather than final project configurations.

## Do's and Don'ts

### Do:

- **Do** preserve the confirmed brand rose and locally hosted typeface.
- **Do** use ruled, open layouts with a clear hierarchy of action and information.
- **Do** retain keyboard focus, mobile menu semantics, and reduced-motion support.
- **Do** keep illustration disclosure and inquiry delivery status readable.

### Don't:

- **Don't** substitute the reference composition's blue accent for the confirmed brand color.
- **Don't** turn technical information into nested elevated cards.
- **Don't** present the provisional wordmark or generated imagery as supplied brand or production evidence.
