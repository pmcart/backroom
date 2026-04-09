import type { ReactNode } from 'react';
import ShelDemoBanner from './ShelDemoBanner';
import ShelDemoSidebar from './ShelDemoSidebar';

interface ShelDemoLayoutProps {
  children: ReactNode;
  role: 'admin' | 'coach' | 'player';
  userName: string;
}

const ShelDemoLayout = ({ children, role, userName }: ShelDemoLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ShelDemoBanner />
      <div className="flex flex-1">
        <ShelDemoSidebar role={role} userName={userName} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShelDemoLayout;
