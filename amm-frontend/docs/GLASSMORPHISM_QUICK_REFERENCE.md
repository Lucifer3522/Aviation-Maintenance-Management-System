# Glassmorphism Quick Reference Guide

## Fast Implementation (Copy-Paste Ready)

### Basic Glassmorphism Card
```jsx
<GlassmorphismCard title="My Card" subtitle="Subtitle">
  <p className="text-white">Your content here</p>
</GlassmorphismCard>
```

### Dashboard with Cards
```jsx
<GlassmorphismDashboard>
  <GlassmorphismGrid cols={3}>
    <GlassmorphismCard title="Card 1">Content</GlassmorphismCard>
    <GlassmorphismCard title="Card 2">Content</GlassmorphismCard>
    <GlassmorphismCard title="Card 3">Content</GlassmorphismCard>
  </GlassmorphismGrid>
</GlassmorphismDashboard>
```

---

## Tailwind Classes

### Backdrop Blur (Glass Effect)
| Class | Effect | When to Use |
|-------|--------|------------|
| `backdrop-blur-xs` | Very subtle (2px) | Text overlays |
| `backdrop-blur-sm` | Subtle (4px) | Secondary cards |
| `backdrop-blur-md` | Medium (12px) | Normal cards |
| `backdrop-blur-lg` | Strong (16px) | Important cards |
| `backdrop-blur-xl` | Very strong (24px) | Main cards (default) |
| `backdrop-blur-2xl` | Extreme (40px) | Highlight/hero |

### Opacity (Transparency)
| Class | Value | Use Case |
|-------|-------|----------|
| `bg-white/5` | 5% white | Very subtle background |
| `bg-white/10` | 10% white | Subtle background |
| `bg-white/15` | 15% white | Medium background |
| `bg-white/20` | 20% white | Opaque background |
| `border-white/10` | 10% white border | Subtle border |
| `border-white/20` | 20% white border | Normal border |
| `border-white/30` | 30% white border | Strong border |
| `text-white/60` | 60% white text | Secondary text |
| `text-white/70` | 70% white text | Tertiary text |
| `text-white/90` | 90% white text | Primary text |

### Colors (Aviation Palette)
```css
/* Primary Text */
text-white          /* Main text (#ffffff) */
text-white/70       /* Secondary text */
text-white/60       /* Tertiary text */

/* Accent Colors */
text-sky-300        /* Light sky blue (#7dd3fc) */
text-sky-400        /* Sky blue (#38bdf8) */
text-blue-500       /* Blue (#3b82f6) */
text-emerald-400    /* Emerald green (#34d399) */
text-emerald-500    /* Green (#10b981) */
text-orange-300     /* Orange (#fed7aa) */
text-orange-500     /* Orange warning (#f97316) */
text-yellow-300     /* Yellow (#fcd34d) */
text-purple-400     /* Purple (#c084fc) */

/* Backgrounds */
bg-white/5          /* Very subtle glass */
bg-white/10         /* Subtle glass */
bg-white/15         /* Medium glass */
bg-gradient-to-br   /* Gradient direction */
```

### Rounded Corners
| Class | Border Radius | Use Case |
|-------|---|---|
| `rounded-lg` | 0.5rem | Nested elements |
| `rounded-xl` | 0.75rem | Cards, buttons |
| `rounded-2xl` | 1rem | Large cards (default) |
| `rounded-3xl` | 1.5rem | Hero sections |

### Shadows
| Class | Effect | Use Case |
|-------|--------|----------|
| `shadow-lg` | Subtle shadow | Cards |
| `shadow-xl` | Medium shadow | Hover cards |
| `shadow-2xl` | Strong shadow | Cards (default) |
| `shadow-3xl` | Very strong | Hover effects |

### Hover Effects
| Class | Effect | Combines With |
|-------|--------|---|
| `hover:bg-white/15` | Brighter background | All cards |
| `hover:border-white/30` | Stronger border | All glass elements |
| `hover:shadow-3xl` | Enhanced shadow | Cards |
| `hover:scale-105` | Slight scale up | Cards |
| `hover:scale-110` | 10% scale up | Buttons |

### Responsive Sizes
| Breakpoint | Width | When | Example |
|-----------|-------|------|---------|
| Mobile | < 640px | `text-3xl` | Default size |
| Medium | 640px+ | `md:text-4xl` | Tablets |
| Large | 1024px+ | `lg:text-5xl` | Desktops |
| XL | 1280px+ | `xl:text-6xl` | Large screens |

### Responsive Grids
```jsx
/* Single Column */
<GlassmorphismGrid cols={1}>

/* Two Columns (1 → 2 at lg) */
<GlassmorphismGrid cols={2}>

/* Three Columns (1 → 2 at md → 3 at lg) */
<GlassmorphismGrid cols={3}>

/* Four Columns (1 → 2 at md → 4 at lg) */
<GlassmorphismGrid cols={4}>
```

### Span Multiple Columns
```jsx
<GlassmorphismCard className="md:col-span-2">
  {/* Spans 2 columns on medium+ screens */}
</GlassmorphismCard>
```

---

## Custom CSS Classes

### From `glassmorphism.css`

#### Glass Effects
```css
.glass              /* Basic frosted glass */
.glass-strong       /* Enhanced frosted glass */
.glass-subtle       /* Light frosted glass */

.card-glass         /* Complete card with all effects */
.panel-glass        /* Panel with subtle effects */

.border-glass       /* Standard border */
.border-glass-strong /* Enhanced border */
```

#### Animations
```css
.animate-shimmer    /* Shimmer effect (2s loop) */
.animate-glow-pulse /* Pulsing glow (3s loop) */
.animate-float      /* Floating effect (6s loop) */

._animation-delay-2000  /* 2 second delay */
.animation-delay-4000   /* 4 second delay */
.animation-delay-6000   /* 6 second delay */
```

#### Text Effects
```css
.text-gradient      /* Blue gradient text */
```

#### Backgrounds
```css
.gradient-aviation  /* Deep blue aviation gradient */
```

---

## Common Component Patterns

### Statistics Card
```jsx
<GlassmorphismCard title="Active Aircraft" subtitle="Total Fleet">
  <div className="space-y-2">
    <p className="text-3xl font-bold text-sky-300">24</p>
    <p className="text-sm text-white/60">All operational</p>
  </div>
</GlassmorphismCard>
```

### List Card
```jsx
<GlassmorphismCard title="Aircraft List" subtitle="Recent">
  <div className="space-y-2">
    {items.map((item) => (
      <div
        key={item.id}
        className="p-3 rounded-lg bg-white/5 hover:bg-white/10"
      >
        <p className="text-white font-medium">{item.name}</p>
        <p className="text-sm text-white/60">{item.subtitle}</p>
      </div>
    ))}
  </div>
</GlassmorphismCard>
```

### Status Badge
```jsx
<span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    status === 'operational'
      ? 'bg-emerald-500/30 text-emerald-300'
      : 'bg-orange-500/30 text-orange-300'
  }`}
>
  {status}
</span>
```

### Metric Grid
```jsx
<div className="grid grid-cols-3 gap-4">
  {metrics.map((m) => (
    <div key={m.id} className="text-center p-4 rounded-xl bg-white/5">
      <p className="text-2xl font-bold text-sky-300">{m.value}</p>
      <p className="text-sm text-white/60 mt-2">{m.label}</p>
    </div>
  ))}
</div>
```

---

## Quick Styling Checklist

- [ ] Import `glassmorphism.css` in main file
- [ ] Wrap dashboard in `<GlassmorphismDashboard>`
- [ ] Use `GlassmorphismGrid` for layouts
- [ ] Wrap content in `GlassmorphismCard`
- [ ] Use `text-white` for main text
- [ ] Use `text-white/70` for secondary text
- [ ] Use `bg-white/5` to `bg-white/20` for nested elements
- [ ] Add `hover:` effects for interactive cards
- [ ] Test responsive at `md:` and `lg:` breakpoints
- [ ] Check accessibility (contrast, focus states)

---

## Typography Hierarchy

```css
/* Page Title */
text-5xl md:text-6xl font-bold text-white

/* Section Title */
text-3xl md:text-4xl font-bold text-white

/* Card Title */
text-lg md:text-xl font-semibold text-white

/* Card Subtitle */
text-sm text-white/70

/* Body Text */
text-base text-white/90

/* Small Text */
text-sm text-white/60

/* Very Small */
text-xs text-white/50
```

---

## Animation Delay Helpers

```jsx
/* Stagger animations with delays */
<div className="animate-pulse animation-delay-0">First</div>
<div className="animate-pulse animation-delay-2000">2s delay</div>
<div className="animate-pulse animation-delay-4000">4s delay</div>
```

---

## Spacing Scale

| Class | Value | Pixels |
|-------|-------|--------|
| `p-4` | 1rem | 16px |
| `p-6` | 1.5rem | 24px |
| `p-8` | 2rem | 32px |
| `gap-4` | 1rem | 16px |
| `gap-6` | 1.5rem | 24px |
| `gap-8` | 2rem | 32px |
| `mb-4` | margin-bottom 1rem | 16px |
| `mb-8` | margin-bottom 2rem | 32px |
| `mt-2` | margin-top 0.5rem | 8px |

---

## Browser Support

✅ **Full Support:**
- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 76+
- Mobile browsers (iOS 15+, Android 12+)

⚠️ **Graceful Degradation:**
- Older browsers: Shows solid background instead of glass effect
- No JavaScript required
- Progressive enhancement: Works without JavaScript

---

## Performance Tips

1. **Limit blur intensity on cards below viewport fold**
2. **Use `will-change` for animated elements** (computed at build time)
3. **Test on low-end mobile devices** for performance
4. **Combine hover effects** (scale + shadow together)
5. **Use CSS variables** for theme switching

---

## Dark Mode (Already Built-in)

All components are dark-mode ready:
- Background: Deep navy (#0f172a)
- Text: White with opacity
- Borders: White with opacity
- No switcher needed - it's the default theme

---

## ProTips ⚡

1. **Hover Scale**: Always use `hover:scale-105` not `hover:scale-110`
2. **Focus Ring**: Use `focus:ring-2 focus:ring-sky-400` for buttons
3. **Disabled State**: Use `opacity-50 cursor-not-allowed`
4. **Loading**: Apply `animate-pulse` to skeleton elements
5. **Empty State**: Use `text-white/70` for empty content messages

---

**Last Updated:** April 27, 2026
**Glassmorphism Design System v1.0.0**
