# Projects Page - Visual Component Guide

## Page Structure

```
┌─────────────────────────────────────────────────────────┐
│                      HEADER                             │
│         Projetos Culturais (Title)                      │
│         Description Text                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   SEARCH & FILTERS                      │
│  🔍 [Search Input..........]  [Filtros] [Buscar]       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────┬─────────────────────┐
│  PROJECT CARD 1     │  PROJECT CARD 2     │
│  [Featured Badge]   │                     │
│  ❤️ 🔗              │  ❤️ 🔗              │
│  ┌─────────────────┐│  ┌─────────────────┐│
│  │                 ││  │                 ││
│  │  Cover Image    ││  │  Cover Image    ││
│  │                 ││  │                 ││
│  └─────────────────┘│  └─────────────────┘│
│  🏢 Company         │  🏢 Company         │
│  Title              │  Title              │
│  Description...     │  Description...     │
│  [Tag] [Tag] [Tag]  │  [Tag] [Tag] [Tag]  │
│  ┌─────────────────┐│  ┌─────────────────┐│
│  │ 📅 Deadline     ││  │ 📅 Deadline     ││
│  │ 📍 Location     ││  │ 📍 Location     ││
│  │ 💰 Salary       ││  │ 💰 Salary       ││
│  │ ⏰ Duration     ││  │ ⏰ Duration     ││
│  └─────────────────┘│  └─────────────────┘│
│  👥 X vagas         │  👥 X vagas         │
│  [Ver Detalhes]     │  [Ver Detalhes]     │
│  [Candidatar-se]    │  [Candidatar-se]    │
└─────────────────────┴─────────────────────┘

[Load More Button]
```

## Project Card Components Breakdown

### 1. Header Section (Above Image)

```
┌──────────────────────────────────┐
│ [🏆 Destaque]          ❤️ 🔗    │ ← Featured Badge + Actions
└──────────────────────────────────┘
```

### 2. Cover Image Section

```
┌──────────────────────────────────┐
│                                  │
│      [Project Cover Image]       │
│      (with gradient overlay)     │
│                                  │
│ [⏰ Há X dias]                   │ ← Posted date badge
└──────────────────────────────────┘
```

### 3. Content Section

```
┌──────────────────────────────────┐
│ 🏢 Company Name    [Category]    │ ← Company + Category badge
│                                  │
│ Project Title (Bold, Large)      │
│                                  │
│ Project description text that    │
│ explains what the opportunity    │
│ is about and requirements...     │
│                                  │
│ [Tag 1] [Tag 2] [Tag 3] [+2]    │ ← Skills/Tags
│                                  │
│ ┌─────────────┬────────────────┐│
│ │ 📅 Prazo    │ 📍 Local       ││
│ │ Date        │ Location       ││
│ ├─────────────┼────────────────┤│ ← Details Grid
│ │ 💰 Remuneração │ ⏰ Duração  ││
│ │ R$ X - Y    │ X meses        ││
│ └─────────────┴────────────────┘│
│                                  │
│ 👥 X vagas  👥 Y candidatos  [Type] │ ← Stats
│                                  │
│ [Ver Detalhes] [Candidatar-se]  │ ← Action Buttons
└──────────────────────────────────┘
```

## Interactive States

### Save/Favorite Button

- **Default**: ❤️ Outline (gray/white)
- **Saved**: ❤️ Filled (red)
- **Hover**: Scale 1.1, background brightens

### Card Hover State

- Card lifts up slightly (translateY: -4px)
- Shadow becomes more prominent
- Cover image scales up 105%
- Title changes to brand color

### Button States

- **Ver Detalhes** (Outline):
  - Hover: Background fills slightly, reflexive animation
- **Candidatar-se** (Primary):
  - Brand navy-blue (light) / yellow (dark)
  - Hover: Slightly darker, reflexive animation

## Color Coding

### Light Theme

- **Primary Action**: Navy Blue (#010166)
- **Featured Badge**: Orange (#f05913)
- **Salary**: Green (#1f9c74)
- **Saved Heart**: Red (#da0f17)
- **Category Badges**: Navy Blue 10% opacity

### Dark Theme

- **Primary Action**: Yellow (#fcc931)
- **Featured Badge**: Orange (#f05913)
- **Salary**: Green (#1f9c74)
- **Saved Heart**: Red (#da0f17)
- **Category Badges**: Yellow 10% opacity

## Responsive Breakpoints

### Desktop (1024px+)

- 2-column grid
- Full card height with all details
- All tags visible

### Tablet (768px - 1023px)

- 2-column grid (narrower)
- Slightly smaller images
- All features maintained

### Mobile (< 768px)

- 1-column layout
- Full-width cards
- Condensed spacing
- Same features, stacked

## Glassmorphism Effects

All cards use:

- `backdrop-blur-[15px]`
- Semi-transparent backgrounds (white 20% / black 20%)
- Border with white 30% / white 20%
- Multiple inset shadows for depth
- Enhanced shadows on hover

## Animation Timings

- Card fade-in: 0.5s with stagger delay (index \* 0.1s)
- Hover transform: 0.3s ease
- Image scale: 0.5s ease
- Button interactions: 0.3s cubic-bezier
- Save/share buttons: Framer Motion scale animation

## Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy (h1 → h3)
- Interactive elements have proper focus states
- Icons paired with descriptive text
- Sufficient color contrast ratios
- Keyboard navigation support (ready for implementation)
- ARIA labels for icon-only buttons (ready for implementation)

## Content Guidelines

### Project Title

- Max 2 lines (line-clamp-2)
- Bold, serif font
- 20px font size

### Description

- Max 3 lines (line-clamp-3)
- 14px font size
- 70% opacity
- Line height: relaxed

### Company Name

- 14px font size
- Medium weight
- Truncates with ellipsis if too long

### Tags

- Show first 3 tags
- "+X" indicator for additional tags
- 12px font size
- Rounded corners

### Images

- Aspect ratio: 16:9
- Height: 192px (h-48)
- Object-fit: cover
- Source: Unsplash (high-quality, free)

---

**Legend:**

- 🏆 Featured/Highlight
- ❤️ Save/Favorite
- 🔗 Share
- 🏢 Company/Organization
- 📅 Calendar/Deadline
- 📍 Location/Place
- 💰 Money/Salary
- ⏰ Clock/Duration/Time
- 👥 Users/People/Positions
