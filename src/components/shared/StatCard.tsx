import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  size?: 'default' | 'compact';
  className?: string;
}

const variants = {
  default: {
    bg: 'bg-card',
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  primary: {
    bg: 'bg-card',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  accent: {
    bg: 'bg-card',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  success: {
    bg: 'bg-card',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
  warning: {
    bg: 'bg-card',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default',
  size = 'default',
  className 
}: StatCardProps) {
  const styles = variants[variant];
  const isCompact = size === 'compact';

  return (
    <div className={cn(
      "rounded-xl border border-border shadow-card transition-smooth hover:shadow-elevated",
      isCompact ? "p-4" : "p-6",
      styles.bg,
      className
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className={cn("flex items-center justify-center rounded-lg", 
          isCompact ? "h-9 w-9" : "h-12 w-12",
          styles.iconBg
        )}>
          <Icon className={cn(isCompact ? "h-4 w-4" : "h-6 w-6", styles.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className={cn("font-medium text-muted-foreground", isCompact ? "text-xs" : "text-sm")}>{title}</p>
            <p className={cn("font-bold text-foreground", isCompact ? "text-lg" : "text-2xl")}>{value}</p>
          </div>
          {subtitle && !isCompact && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && !isCompact && (
            <div className="flex items-center gap-1 pt-1">
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
