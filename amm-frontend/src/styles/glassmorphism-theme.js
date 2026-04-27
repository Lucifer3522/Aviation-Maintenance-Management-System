/**
 * Aviation Color Palette & Theme Constants
 * Glassmorphism Design System
 */

// ============================================
// PRIMARY COLORS
// ============================================

export const COLORS = {
  // Aviation Blue Theme
  primary: {
    aviation: '#1e3a8a',      // Deep Aviation Blue
    darkNavy: '#0f172a',      // Navy Dark (Background)
    lightNavy: '#1e293b',     // Navy Light
    sky: '#87ceeb',           // Sky Light
    slate: '#94a3b8',         // Slate Gray
  },

  // Semantic Colors
  semantic: {
    success: '#10b981',       // Emerald (Operational)
    warning: '#f97316',       // Orange (Maintenance)
    caution: '#eab308',       // Yellow (Inspection)
    error: '#ef4444',         // Red (Error)
    info: '#0ea5e9',          // Sky (Information)
  },

  // Accent Colors (Tailwind)
  accents: {
    emerald: '#10b981',
    emerald300: '#6ee7b7',
    emerald400: '#34d399',
    sky300: '#7dd3fc',
    sky400: '#38bdf8',
    orange300: '#fed7aa',
    orange500: '#f97316',
    purple400: '#c084fc',
    yellow300: '#fcd34d',
  },

  // Neutral White Series (for glass effects)
  white: {
    full: '#ffffff',
    p90: 'rgba(255, 255, 255, 0.9)',
    p80: 'rgba(255, 255, 255, 0.8)',
    p70: 'rgba(255, 255, 255, 0.7)',
    p60: 'rgba(255, 255, 255, 0.6)',
    p50: 'rgba(255, 255, 255, 0.5)',
    p30: 'rgba(255, 255, 255, 0.3)',
    p20: 'rgba(255, 255, 255, 0.2)',
    p15: 'rgba(255, 255, 255, 0.15)',
    p10: 'rgba(255, 255, 255, 0.1)',
    p5: 'rgba(255, 255, 255, 0.05)',
  },
};

// ============================================
// TAILWIND CLASS MAPPINGS
// ============================================

export const TAILWIND_CLASSES = {
  // Text Colors
  text: {
    primary: 'text-white',
    secondary: 'text-white/70',
    tertiary: 'text-white/60',
    muted: 'text-white/50',
    accent: {
      sky: 'text-sky-300',
      emerald: 'text-emerald-400',
      orange: 'text-orange-300',
      yellow: 'text-yellow-300',
      purple: 'text-purple-400',
    },
  },

  // Background Colors
  background: {
    verySubtle: 'bg-white/5',
    subtle: 'bg-white/10',
    medium: 'bg-white/15',
    opaque: 'bg-white/20',
    strong: 'bg-white/30',
  },

  // Border Colors
  border: {
    subtle: 'border border-white/10',
    medium: 'border border-white/20',
    strong: 'border border-white/30',
    glass: 'border border-white/15',
  },

  // Backdrop Blur
  blur: {
    xs: 'backdrop-blur-xs',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl',
  },

  // Rounded Corners
  rounded: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  },

  // Shadows
  shadow: {
    sm: 'shadow-lg',
    md: 'shadow-xl',
    lg: 'shadow-2xl',
    xl: 'shadow-3xl',
  },

  // Spacing
  padding: {
    compact: 'p-4',
    comfortable: 'p-6',
    spacious: 'p-8',
    extraSpacious: 'p-12',
  },

  gap: {
    tight: 'gap-4',
    normal: 'gap-6',
    loose: 'gap-8',
  },
};

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  mobile: 'base',           // Default (< 640px)
  tablet: 'md:',            // 640px+
  desktop: 'lg:',           // 1024px+
  wide: 'xl:',              // 1280px+
  ultraWide: '2xl:',        // 1536px+
};

// ============================================
// STATUS BADGE STYLES
// ============================================

export const STATUS_STYLES = {
  operational: {
    bg: 'bg-emerald-500/30',
    text: 'text-emerald-300',
    label: 'Operational',
  },
  maintenance: {
    bg: 'bg-orange-500/30',
    text: 'text-orange-300',
    label: 'Maintenance',
  },
  inspection: {
    bg: 'bg-yellow-500/30',
    text: 'text-yellow-300',
    label: 'Inspection',
  },
  alert: {
    bg: 'bg-red-500/30',
    text: 'text-red-300',
    label: 'Alert',
  },
  warning: {
    bg: 'bg-orange-500/30',
    text: 'text-orange-300',
    label: 'Warning',
  },
  completed: {
    bg: 'bg-emerald-500/30',
    text: 'text-emerald-300',
    label: 'Completed',
  },
  pending: {
    bg: 'bg-yellow-500/30',
    text: 'text-yellow-300',
    label: 'Pending',
  },
};

// ============================================
// GLASS EFFECT PRESETS
// ============================================

export const GLASS_PRESETS = {
  standard: {
    background: 'bg-white/10',
    border: 'border border-white/20',
    blur: 'backdrop-blur-xl',
    className: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6',
  },
  strong: {
    background: 'bg-white/15',
    border: 'border border-white/25',
    blur: 'backdrop-blur-2xl',
    className: 'bg-white/15 backdrop-blur-2xl border border-white/25 rounded-2xl p-8',
  },
  subtle: {
    background: 'bg-white/5',
    border: 'border border-white/10',
    blur: 'backdrop-blur-md',
    className: 'bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4',
  },
};

// ============================================
// ANIMATION CONFIGURATIONS
// ============================================

export const ANIMATIONS = {
  hover: {
    scale: 'hover:scale-105',
    brightness: 'hover:brightness-110',
    shadow: 'hover:shadow-2xl hover:shadow-3xl',
    border: 'hover:border-white/30',
    combined: 'hover:scale-105 hover:shadow-2xl hover:bg-white/15',
  },
  enter: {
    fade: 'opacity-0 animate-fade-in',
    slideUp: 'translate-y-4 opacity-0 animate-slide-up',
    slideDown: 'translate-y-0 opacity-100',
  },
  continuous: {
    pulse: 'animate-pulse',
    glow: 'animate-glow-pulse',
    float: 'animate-float',
    shimmer: 'animate-shimmer',
  },
};

// ============================================
// TYPOGRAPHY STYLES
// ============================================

export const TYPOGRAPHY = {
  // Headers
  pageTitle: 'text-5xl md:text-6xl font-bold text-white',
  sectionTitle: 'text-3xl md:text-4xl font-bold text-white',
  cardTitle: 'text-lg md:text-xl font-semibold text-white',
  cardSubtitle: 'text-sm text-white/70',

  // Body
  body: 'text-base text-white/90',
  bodySecondary: 'text-sm text-white/70',
  bodyMuted: 'text-sm text-white/60',

  // Special
  heroText: 'text-4xl md:text-5xl lg:text-6xl font-bold text-gradient',
  label: 'text-xs font-semibold uppercase tracking-wider text-white/70',
};

// ============================================
// COMPONENT TEMPLATES
// ============================================

export const TEMPLATES = {
  card: {
    container: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl hover:bg-white/15 hover:border-white/30 hover:shadow-3xl transition-all duration-300',
    header: 'mb-4 flex items-center gap-3',
    title: 'text-lg font-semibold text-white',
    subtitle: 'text-sm text-white/70',
    content: 'text-white/90',
  },

  badge: {
    base: 'px-3 py-1 rounded-full text-xs font-semibold',
    success: 'bg-emerald-500/30 text-emerald-300',
    warning: 'bg-orange-500/30 text-orange-300',
    alert: 'bg-red-500/30 text-red-300',
  },

  listItem: {
    container: 'p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5',
    primary: 'font-medium text-white',
    secondary: 'text-sm text-white/60 mt-1',
  },

  metric: {
    container: 'text-center p-4 rounded-xl bg-white/5',
    value: 'text-2xl font-bold text-sky-300',
    label: 'text-sm text-white/60 mt-2',
  },
};

// ============================================
// UTILITY HELPERS
// ============================================

/**
 * Combine glass effect classes
 */
export const getGlassClass = (variant = 'standard') => {
  return GLASS_PRESETS[variant]?.className || GLASS_PRESETS.standard.className;
};

/**
 * Get status badge classes
 */
export const getStatusClasses = (status) => {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.operational;
  return `${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full text-xs font-semibold`;
};

/**
 * Combine hover effect classes
 */
export const getHoverClass = (type = 'combined') => {
  return ANIMATIONS.hover[type] || ANIMATIONS.hover.combined;
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  COLORS,
  TAILWIND_CLASSES,
  BREAKPOINTS,
  STATUS_STYLES,
  GLASS_PRESETS,
  ANIMATIONS,
  TYPOGRAPHY,
  TEMPLATES,
  getGlassClass,
  getStatusClasses,
  getHoverClass,
};
