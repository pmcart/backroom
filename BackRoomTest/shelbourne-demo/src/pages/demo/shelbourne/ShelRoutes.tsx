// Wrapper component that provides shared academy context to all Shelbourne demo routes
import { ShelAcademyProvider } from '@contexts/ShelAcademyContext';
import type { ReactNode } from 'react';

// This component wraps children with the ShelAcademyProvider
const ShelRoutes = ({ children }: { children: ReactNode }) => (
  <ShelAcademyProvider>{children}</ShelAcademyProvider>
);

export default ShelRoutes;
