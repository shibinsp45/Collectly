import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

// ==========================================
// 1. SwiftUI-Inspired Button (Apple Style)
// ==========================================
interface SwiftButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'prominent' | 'bordered' | 'glass' | 'plain' | 'danger';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const SwiftButton: React.FC<SwiftButtonProps> = ({
  children,
  variant = 'bordered',
  size = 'default',
  icon: Icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] focus:outline-none select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const sizeClasses = {
    sm: "h-8 px-3 text-[13px] rounded-[8px] gap-1.5",
    default: "h-[36px] px-3.5 text-[14px] rounded-[10px] gap-2",
    lg: "h-[42px] px-5 text-[15px] rounded-[12px] gap-2",
    icon: "h-[34px] w-[34px] rounded-[8px] p-0 flex items-center justify-center",
  };

  const variantClasses = {
    prominent: "bg-[#007AFF] text-white hover:bg-[#0069D9] shadow-xs active:bg-[#0058b8]",
    bordered: "bg-black/[0.04] dark:bg-white/[0.08] text-[var(--text-primary)] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] border border-black/[0.08] dark:border-white/[0.12]",
    glass: "glass-panel text-[var(--text-primary)] hover:bg-white/80 dark:hover:bg-white/10 active:opacity-90",
    plain: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-[8px]",
    danger: "bg-[#D92D20]/10 text-[#D92D20] hover:bg-[#D92D20]/20 border border-[#D92D20]/20",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
    </button>
  );
};

// ==========================================
// 2. SwiftUI Segmented Control (Picker)
// ==========================================
interface Option<T> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

interface SwiftSegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  size?: 'sm' | 'default';
}

export function SwiftSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'default'
}: SwiftSegmentedControlProps<T>) {
  return (
    <div 
      className={clsx(
        "inline-flex p-[3px] bg-black/[0.06] dark:bg-white/[0.08] rounded-[10px] border border-black/[0.04] dark:border-white/[0.06]",
        className
      )}
      role="tablist"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={clsx(
              "flex items-center justify-center font-medium transition-all duration-160 select-none cursor-pointer gap-1.5",
              size === 'sm' ? "h-6 px-2.5 text-[12px] rounded-[7px]" : "h-7 px-3 text-[13px] rounded-[8px]",
              isSelected
                ? "bg-white dark:bg-[#2C2C2E] text-[var(--text-primary)] shadow-[0_1px_3px_rgba(0,0,0,0.12)] font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {Icon && <Icon size={14} strokeWidth={2} className={isSelected ? "text-[#007AFF] dark:text-[#0A84FF]" : "opacity-70"} />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ==========================================
// 3. SwiftUI Toggle Switch
// ==========================================
interface SwiftToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const SwiftToggle: React.FC<SwiftToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled
}) => {
  return (
    <label className={clsx(
      "flex items-center justify-between gap-4 py-2 cursor-pointer select-none",
      disabled && "opacity-50 pointer-events-none"
    )}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-[14px] font-medium text-[var(--text-primary)]">{label}</span>}
          {description && <span className="text-[12px] text-[var(--text-secondary)]">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? "bg-[#34C759]" : "bg-black/[0.16] dark:bg-white/[0.2]"
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-[20px]" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
};

// ==========================================
// 4. Apple Tag / Badge
// ==========================================
interface SwiftBadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'subtle' | 'outline' | 'solid';
  className?: string;
  onClick?: () => void;
}

export const SwiftBadge: React.FC<SwiftBadgeProps> = ({
  children,
  color,
  variant = 'subtle',
  className,
  onClick
}) => {
  return (
    <span
      onClick={onClick}
      style={color ? { color } : undefined}
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-medium tracking-tight select-none",
        variant === 'subtle' && "bg-black/[0.04] dark:bg-white/[0.08] text-[var(--text-secondary)]",
        variant === 'outline' && "border border-black/[0.1] dark:border-white/[0.12] text-[var(--text-secondary)]",
        variant === 'solid' && "bg-[#007AFF] text-white",
        onClick && "cursor-pointer hover:opacity-80 active:scale-95 transition-all",
        className
      )}
    >
      {children}
    </span>
  );
};

// ==========================================
// 5. Apple SwiftUI Sheet / Dialog Modal
// ==========================================
interface SwiftSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const SwiftSheet: React.FC<SwiftSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Dimmed backdrop with Apple blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div 
        className={clsx(
          "relative w-full rounded-t-[20px] sm:rounded-[18px] bg-[var(--surface-primary)] shadow-2xl border border-black/[0.08] dark:border-white/[0.12] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] z-10",
          maxWidth
        )}
      >
        {/* iOS Drag Handle */}
        <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-black/20 dark:bg-white/20" />
        </div>

        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              {title && <h3 className="text-[17px] font-semibold text-[var(--text-primary)] tracking-tight">{title}</h3>}
              {subtitle && <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-full bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.08] dark:hover:bg-white/[0.16] flex items-center justify-center text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
