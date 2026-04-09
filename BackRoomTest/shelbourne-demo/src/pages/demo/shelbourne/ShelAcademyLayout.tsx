// Layout component that wraps all Shelbourne demo routes with shared state
import { Outlet } from 'react-router-dom';
import { ShelAcademyProvider } from '@contexts/ShelAcademyContext';

const ShelAcademyLayout = () => (
  <ShelAcademyProvider>
    <Outlet />
  </ShelAcademyProvider>
);

export default ShelAcademyLayout;
