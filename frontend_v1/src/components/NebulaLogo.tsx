interface NebulaLogoProps {
  size?: number;
  className?: string;
}

export function NebulaLogo({ size = 120, className = '' }: NebulaLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="gradient3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Hexagon Shape */}
        <path
          d="M100 10 L170 50 L170 130 L100 170 L30 130 L30 50 Z"
          fill="none"
          stroke="url(#gradient3)"
          strokeWidth="2"
          opacity="0.3"
        />
        
        {/* Ribbon 1 - Cyan to Blue */}
        <path
          d="M 40 60 Q 100 40, 160 60 L 155 80 Q 100 55, 45 80 Z"
          fill="url(#gradient1)"
          opacity="0.9"
          filter="url(#glow)"
        />
        
        {/* Ribbon 2 - Blue to Purple */}
        <path
          d="M 160 70 Q 140 100, 100 140 L 95 125 Q 130 95, 150 70 Z"
          fill="url(#gradient1)"
          opacity="0.85"
        />
        
        {/* Ribbon 3 - Purple */}
        <path
          d="M 100 145 Q 70 125, 50 90 L 55 80 Q 75 110, 105 130 Z"
          fill="url(#gradient2)"
          opacity="0.9"
        />
        
        {/* Ribbon 4 - Pink */}
        <path
          d="M 45 85 Q 60 70, 85 65 L 88 75 Q 68 78, 52 90 Z"
          fill="url(#gradient2)"
          opacity="0.85"
          filter="url(#glow)"
        />
        
        {/* Ribbon 5 - Gradient blend */}
        <path
          d="M 90 70 Q 100 80, 110 70 L 115 85 Q 100 100, 85 85 Z"
          fill="url(#gradient3)"
          opacity="0.7"
        />
        
        {/* Additional depth ribbons */}
        <path
          d="M 155 75 Q 130 60, 100 65 L 98 75 Q 125 72, 148 85 Z"
          fill="#3B82F6"
          opacity="0.6"
        />
        
        <path
          d="M 100 135 Q 80 120, 70 100 L 75 95 Q 83 110, 102 125 Z"
          fill="#A855F7"
          opacity="0.6"
        />
        
        {/* Center highlight */}
        <circle cx="100" cy="90" r="8" fill="white" opacity="0.9" filter="url(#glow)" />
        <circle cx="100" cy="90" r="4" fill="#7C3AED" opacity="0.8" />
      </svg>
    </div>
  );
}

interface NebulaLogoWithTextProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NebulaLogoWithText({ size = 'md', className = '' }: NebulaLogoWithTextProps) {
  const sizes = {
    sm: { logo: 40, text: 'text-xl' },
    md: { logo: 50, text: 'text-2xl' },
    lg: { logo: 60, text: 'text-3xl' },
  };

  const { logo, text } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <NebulaLogo size={logo} />
      <span className={`${text} font-bold bg-gradient-to-r from-nebula-cyan via-nebula-purple to-nebula-pink bg-clip-text text-transparent`}>
        Nebula
      </span>
    </div>
  );
}
