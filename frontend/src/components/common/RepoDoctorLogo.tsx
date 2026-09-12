import React from 'react';

interface RepoDoctorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPulse?: boolean;
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export const RepoDoctorLogo: React.FC<RepoDoctorLogoProps> = ({
  size = 'md',
  showPulse = true,
  showText = false,
  subtitle,
  className = ''
}) => {
  const sizeStyles = {
    sm: {
      container: 'h-8 w-8 rounded-lg',
      iconSize: 16,
      badge: 'h-1.5 w-1.5 -bottom-0.5 -right-0.5',
      title: 'text-sm font-semibold',
      sub: 'text-[11px]'
    },
    md: {
      container: 'h-9 w-9 rounded-xl',
      iconSize: 18,
      badge: 'h-2 w-2 -bottom-0.5 -right-0.5',
      title: 'text-base font-semibold',
      sub: 'text-xs'
    },
    lg: {
      container: 'h-12 w-12 rounded-xl',
      iconSize: 24,
      badge: 'h-2.5 w-2.5 -bottom-0.5 -right-0.5',
      title: 'text-xl font-bold',
      sub: 'text-xs'
    },
    xl: {
      container: 'h-16 w-16 rounded-2xl',
      iconSize: 32,
      badge: 'h-3 w-3 -bottom-1 -right-1',
      title: 'text-2xl font-bold',
      sub: 'text-sm'
    }
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`relative flex ${sizeStyles.container} items-center justify-center bg-[#0B0E1A] border border-[#5E3A5C] text-[#F3E9EC] shadow-sm transition-all duration-300`}
      >
        {/* Technical repository node & branch topology emblem in mauve/pink */}
        <svg
          width={sizeStyles.iconSize}
          height={sizeStyles.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer diamond / frame */}
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            stroke="#B47A9A"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          {/* Main trunk node */}
          <circle cx="8" cy="8" r="2" fill="#F3E9EC" />
          {/* Branch split node */}
          <circle cx="16" cy="16" r="2" fill="#B47A9A" />
          {/* Cross node */}
          <circle cx="16" cy="8" r="1.5" stroke="#F3E9EC" strokeOpacity="0.8" strokeWidth="1.2" />
          {/* Connecting path */}
          <path
            d="M8 10V16H14"
            stroke="#B47A9A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 8H14.5"
            stroke="#5E3A5C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1.5 1.5"
          />
        </svg>

        {showPulse && (
          <span className={`absolute ${sizeStyles.badge} flex`}>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B47A9A] opacity-60" />
            <span className="relative inline-flex h-full w-full rounded-full bg-[#B47A9A] border border-[#00030E]" />
          </span>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left font-urbanist">
          <div className="flex items-center gap-2">
            <span className={`${sizeStyles.title} tracking-tight text-[#F3E9EC] font-urbanist font-bold`}>
              Repo Doctor
            </span>
            <span className="rounded-full bg-[#2C1B2F] px-2 py-0.5 text-[10px] font-urbanist font-bold text-[#B47A9A] border border-[#5E3A5C]">
              v2.4
            </span>
          </div>
          {subtitle && (
            <p className={`${sizeStyles.sub} text-[#B47A9A]/80 tracking-normal font-urbanist font-medium`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
