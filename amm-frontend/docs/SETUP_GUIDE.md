# Glassmorphism Setup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Import CSS
Add this import to your main `main.jsx` or App component:
```jsx
import './styles/glassmorphism.css';
```

### Step 2: Wrap Your Dashboard
Replace your existing dashboard with `GlassmorphismDashboard`:
```jsx
import { GlassmorphismDashboard, GlassmorphismGrid, GlassmorphismCard } from './components/GlassmorphismCard';

export function Dashboard() {
  return (
    <GlassmorphismDashboard>
      <h1 className="text-white text-4xl">My Dashboard</h1>
      {/* Your content here */}
    </GlassmorphismDashboard>
  );
}
```

### Step 3: Create Cards
Add your content inside glassmorphism cards:
```jsx
<GlassmorphismCard title="Card Title" subtitle="Description">
  Your content here
</GlassmorphismCard>
```

### Step 4: Organize with Grid
Use `GlassmorphismGrid` for responsive layouts:
```jsx
<GlassmorphismGrid cols={3}>
  <GlassmorphismCard>Card 1</GlassmorphismCard>
  <GlassmorphismCard>Card 2</GlassmorphismCard>
  <GlassmorphismCard>Card 3</GlassmorphismCard>
</GlassmorphismGrid>
```

Done! ✨

---

## 📁 Files Overview

### Components
- **`GlassmorphismCard.jsx`** - Main components (Card, Dashboard, Grid)
- **`DashboardGlassmorphism.jsx`** - Complete example dashboard
- **`GlassmorphismIntegrationExamples.jsx`** - Integration patterns & examples

### Styles
- **`glassmorphism.css`** - Core CSS with animations and utilities
- **`glassmorphism-theme.js`** - Color palette & constants

### Documentation
- **`GLASSMORPHISM_GUIDE.md`** - Comprehensive guide
- **`GLASSMORPHISM_QUICK_REFERENCE.md`** - Quick lookup reference
- **`SETUP_GUIDE.md`** - This file

### Configuration
- **`tailwind.config.js`** - Updated with animations and colors

---

## 🎨 Component Usage Patterns

### Pattern 1: Statistics Card
```jsx
<GlassmorphismCard title="Active Aircraft" subtitle="Fleet">
  <p className="text-3xl font-bold text-sky-300">24</p>
  <p className="text-sm text-white/60 mt-2">All operational</p>
</GlassmorphismCard>
```

### Pattern 2: List Card
```jsx
<GlassmorphismCard title="Recent Aircraft" subtitle="Last 5">
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10">
        <p className="font-medium text-white">{item.name}</p>
        <p className="text-sm text-white/60">{item.code}</p>
      </div>
    ))}
  </div>
</GlassmorphismCard>
```

### Pattern 3: Status Badge
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

### Pattern 4: Multi-Column Layout
```jsx
<GlassmorphismGrid cols={2}>
  <GlassmorphismCard className="md:col-span-1">
    Left content
  </GlassmorphismCard>
  <GlassmorphismCard className="md:col-span-1">
    Right content
  </GlassmorphismCard>
</GlassmorphismGrid>
```

---

## 🔧 Configuration

### Tailwind Config (Already Updated)
The `tailwind.config.js` has been updated with:
- ✅ Custom animations (pulse, glow, float)
- ✅ Animation delays
- ✅ Enhanced backdrop blur
- ✅ Aviation color palette
- ✅ Animation delay utilities

**No additional setup needed!**

---

## 📱 Responsive Design

The system automatically handles responsive layouts:

```jsx
<!-- Four stats on desktop, two on tablet, one on mobile -->
<GlassmorphismGrid cols={4}>
  <GlassmorphismCard>Stat 1</GlassmorphismCard>
  <GlassmorphismCard>Stat 2</GlassmorphismCard>
  <GlassmorphismCard>Stat 3</GlassmorphismCard>
  <GlassmorphismCard>Stat 4</GlassmorphismCard>
</GlassmorphismGrid>

<!-- Make a card span multiple columns -->
<GlassmorphismCard className="md:col-span-2 lg:col-span-3">
  Wide content
</GlassmorphismCard>
```

---

## 🎯 Common Tasks

### Change Card Border
```jsx
<!-- Stronger border -->
<GlassmorphismCard className="border-white/30 hover:border-white/40">
  Content
</GlassmorphismCard>

<!-- Subtle border -->
<GlassmorphismCard className="border-white/10">
  Content
</GlassmorphismCard>
```

### Add Icon to Card
```jsx
import { Users } from 'lucide-react';

<GlassmorphismCard 
  title="Team Members" 
  icon={Users}
  subtitle="12 members"
>
  Content
</GlassmorphismCard>
```

### Disable Hover Effect
```jsx
<GlassmorphismCard hoverable={false}>
  Static content
</GlassmorphismCard>
```

### Custom Styling
```jsx
<GlassmorphismCard className="md:col-span-2 lg:col-span-3 bg-white/20">
  Content with custom classes
</GlassmorphismCard>
```

---

## 🎨 Color Usage

### Text Colors
```jsx
<p className="text-white">Primary text</p>
<p className="text-white/70">Secondary text</p>
<p className="text-white/60">Tertiary text</p>
<p className="text-sky-300">Accent text</p>
<p className="text-emerald-400">Success text</p>
<p className="text-orange-300">Warning text</p>
```

### Background Colors
```jsx
{/* Nested elements */}
<div className="bg-white/5">Very subtle</div>
<div className="bg-white/10">Subtle</div>
<div className="bg-white/15">Medium</div>
<div className="bg-white/20">Opaque</div>
```

### Status Colors
```jsx
// Success
className="bg-emerald-500/30 text-emerald-300"

// Warning
className="bg-orange-500/30 text-orange-300"

// Alert
className="bg-red-500/30 text-red-300"

// Info
className="bg-blue-500/30 text-blue-300"
```

---

## 🚀 Performance Optimization

### Lazy Load Cards
For dashboards with many cards:
```jsx
import { Suspense } from 'react';
const DashboardCard = React.lazy(() => import('./DashboardCard'));

<Suspense fallback={<Loading />}>
  <DashboardCard />
</Suspense>
```

### Reduce Animation Count
On mobile or slower devices:
```jsx
<GlassmorphismDashboard className="md:animate-glow-pulse">
  {/* Animations only on medium+ screens */}
</GlassmorphismDashboard>
```

### Use CSS Classes Over Inline Styles
```jsx
// ✅ Good - Tailwind classes
<div className="p-6 rounded-xl bg-white/10">

// ❌ Avoid - Inline styles
<div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>
```

---

## ✅ Checklist: Convert Existing Dashboard

- [ ] Import `glassmorphism.css`
- [ ] Import components from `GlassmorphismCard.jsx`
- [ ] Wrap dashboard in `<GlassmorphismDashboard>`
- [ ] Wrap content sections in `<GlassmorphismGrid>`
- [ ] Convert cards to `<GlassmorphismCard>` components
- [ ] Update text colors to use `text-white` and `text-white/70`
- [ ] Replace backgrounds with `bg-white/X` classes
- [ ] Add hover effects where appropriate
- [ ] Test responsive design
- [ ] Test on mobile device
- [ ] Check accessibility (contrast, focus states)
- [ ] Deploy and celebrate! 🎉

---

## 🐛 Troubleshooting

### Issue: Glass effect not showing
**Solution:** Ensure `backdrop-blur-xl` class is present and CSS is imported
```jsx
// Check that CSS is imported
import './styles/glassmorphism.css';
```

### Issue: Text hard to read
**Solution:** Use sufficient opacity for text
```jsx
// ✅ Good
<p className="text-white">Readable</p>

// ❌ Poor contrast
<p className="text-white/30">Hard to read</p>
```

### Issue: Cards look weird on mobile
**Solution:** Check responsive classes
```jsx
// Include responsive variants
<div className="p-4 md:p-6 lg:p-8">
  Mobile: 16px, Tablet: 24px, Desktop: 32px
</div>
```

### Issue: Animations causing performance issues
**Solution:** Reduce animation complexity
```jsx
// Reduce blur amount
backdrop-blur-lg // Instead of blur-2xl

// Remove some gradient overlays
// Keep only 1-2 animated overlays instead of 3
```

### Issue: Component not updating
**Solution:** Check React key prop
```jsx
<GlassmorphismGrid cols={3}>
  {items.map((item, idx) => (
    <GlassmorphismCard key={item.id}> {/* Use unique ID, not index */}
      {item.name}
    </GlassmorphismCard>
  ))}
</GlassmorphismGrid>
```

---

## 📚 Related Documentation

- **Full Guide:** See `GLASSMORPHISM_GUIDE.md`
- **Quick Reference:** See `GLASSMORPHISM_QUICK_REFERENCE.md`
- **Examples:** See `GlassmorphismIntegrationExamples.jsx`
- **Demo:** See `DashboardGlassmorphism.jsx`

---

## 🔗 External Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CSS Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [React Component Patterns](https://react.dev/learn/describing-the-ui)
- [Glassmorphism Design](https://uxdesign.cc/glassmorphism-in-user-interfaces-3f39d3f72059)

---

## 💡 Tips & Tricks

1. **Use CSS variables for theme colors** - Makes switching themes easy
2. **Test on real devices** - Blur effects vary by device
3. **Combine animations wisely** - Too many can reduce performance
4. **Keep hierarchy clear** - Use sizes to show importance
5. **Accessible by default** - White text on blue is readable

---

## 🎓 Learning Path

1. **Beginner**: Read this guide and GLOSSMORPHISM_GUIDE.md
2. **Intermediate**: Study GlassmorphismIntegrationExamples.jsx
3. **Advanced**: Customize colors and animations in glassmorphism-theme.js
4. **Expert**: Extend tailwind.config.js with new animations

---

## 📞 Support

For issues or questions:
1. Check `GLASSMORPHISM_QUICK_REFERENCE.md`
2. Review `GlassmorphismIntegrationExamples.jsx`
3. Check browser console for errors
4. Verify all imports are correct
5. Test in different browsers

---

**Status:** ✅ Ready to use
**Last Updated:** April 27, 2026
**Version:** 1.0.0
