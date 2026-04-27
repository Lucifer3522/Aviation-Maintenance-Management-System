/**
 * GlassmorphismCard Component
 * A modern glassmorphism design component with semi-transparent frosted glass effect
 * Designed for aviation maintenance management system dashboard
 */

import React from 'react';

export const GlassmorphismCard = ({
  children,
  className = '',
  hoverable = true,
  icon: Icon = null,
  title = '',
  subtitle = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white/10 backdrop-blur-xl rounded-2xl
        border border-white/20
        p-6 md:p-8
        shadow-2xl
        transition-all duration-300 ease-out
        ${hoverable ? 'hover:bg-white/15 hover:border-white/30 hover:shadow-3xl hover:scale-105' : ''}
        ${className}
      `}
      {...props}
    >
      {(Icon || title) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-3 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-xl border border-sky-400/30">
              <Icon className="w-6 h-6 text-sky-300" />
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-white/70">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="text-white/90">{children}</div>
    </div>
  );
};

export const GlassmorphismDashboard = ({ children, className = '' }) => {
  return (
    <div
      className={`
        min-h-screen relative overflow-hidden
        ${className}
      `}
    >
      <div className="relative z-10 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
};

export const GlassmorphismGrid = ({ children, cols = 3 }) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colsClass[cols] || colsClass[3]} gap-6 md:gap-8`}>
      {children}
    </div>
  );
};

export default GlassmorphismCard;
