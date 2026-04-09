import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Calendar,
  Target,
  LineChart,
  Video,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Building2,
  UserCircle,
  Shield,
  BookOpen,
} from 'lucide-react';
import { cn } from '@lib/utils';
import { Button } from '@components/ui/button';

interface ShelDemoSidebarProps {
  role: 'admin' | 'coach' | 'player';
  userName: string;
  orgName?: string;
}

const ShelDemoSidebar = ({ role, userName, orgName = 'Shelbourne FC Academy' }: ShelDemoSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const prefix = `/demo/shelbourne/${role}/`;

  const roleConfig = {
    admin: { icon: Building2, label: 'Academy Admin', color: 'text-red-500' },
    coach: { icon: Shield, label: 'Coach', color: 'text-red-600' },
    player: { icon: UserCircle, label: 'Player', color: 'text-red-500' },
  };

  const getNavItems = () => {
    const base = [{ icon: LayoutDashboard, label: 'Dashboard', path: `/demo/shelbourne/${role}` }];
    if (role === 'admin') {
      return [...base,
        { icon: BookOpen, label: 'Club Methodology', path: `${prefix}methodology` },
        { icon: Users, label: 'Squad Management', path: `${prefix}squads` },
        { icon: GraduationCap, label: 'Education Hub', path: `${prefix}education` },
        { icon: Calendar, label: 'Planning Overview', path: `${prefix}planning` },
        { icon: Target, label: 'IDP Management', path: `${prefix}idp` },
        { icon: LineChart, label: 'Monitoring', path: `${prefix}monitoring` },
        { icon: Video, label: 'Video Library', path: `${prefix}video` },
        { icon: Shield, label: 'Upskilling & Aftercare', path: `${prefix}upskilling` },
        { icon: Settings, label: 'Settings', path: `${prefix}settings` },
      ];
    }
    if (role === 'coach') {
      return [...base,
        { icon: BookOpen, label: 'Club Methodology', path: `${prefix}methodology` },
        { icon: Users, label: 'My Squad', path: `${prefix}squad` },
        { icon: Calendar, label: 'Session Planning', path: `${prefix}planning` },
        { icon: Target, label: 'Player IDPs', path: `${prefix}idp` },
        { icon: LineChart, label: 'Wellness Data', path: `${prefix}monitoring` },
        { icon: Video, label: 'Video Analysis', path: `${prefix}video` },
        { icon: GraduationCap, label: 'Education', path: `${prefix}education` },
        { icon: Shield, label: 'Upskilling & Aftercare', path: `${prefix}upskilling` },
      ];
    }
    return [...base,
      { icon: BookOpen, label: 'Club Methodology', path: `${prefix}methodology` },
      { icon: Target, label: 'My Development', path: `${prefix}development` },
      { icon: LineChart, label: 'Daily Check-in', path: `${prefix}checkin` },
      { icon: Users, label: 'Recovery & Stretching', path: `${prefix}recovery` },
      { icon: Video, label: 'My Videos', path: `${prefix}videos` },
      { icon: GraduationCap, label: 'Learning', path: `${prefix}learning` },
      { icon: Calendar, label: 'Schedule', path: `${prefix}schedule` },
      { icon: Shield, label: 'Upskilling & Aftercare', path: `${prefix}upskilling` },
    ];
  };

  const navItems = getNavItems();
  const RoleIcon = roleConfig[role].icon;

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-sidebar-background border-r border-sidebar-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <span className="text-sm font-bold text-white">SFC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">Shelbourne FC</span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">{orgName}</span>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground">
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Role Badge */}
      <div className={cn('p-4 border-b border-sidebar-border', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-3 p-2 rounded-lg bg-red-500/10', collapsed && 'justify-center')}>
          <RoleIcon className={cn('h-5 w-5', roleConfig[role].color)} />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{roleConfig[role].label}</span>
              <span className="text-sm font-medium text-sidebar-foreground">{userName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-red-500/15 text-red-500'
                  : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <Link
          to="/demo/shelbourne"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Switch Role</span>}
        </Link>
      </div>
    </aside>
  );
};

export default ShelDemoSidebar;
