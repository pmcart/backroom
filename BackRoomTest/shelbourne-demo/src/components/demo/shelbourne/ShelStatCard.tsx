import type { LucideIcon } from 'lucide-react';
import { cn } from '@lib/utils';

interface ShelStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
}

const ShelStatCard = ({ title, value, subtitle, icon: Icon, trend, className }: ShelStatCardProps) => {
  return (
    <div className={cn('glass-card p-5', className)}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-red-500" />
          </div>
          {trend && (
            <span className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShelStatCard;
