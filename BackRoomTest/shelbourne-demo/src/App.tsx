import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ShelAcademyLayout from '@pages/demo/shelbourne/ShelAcademyLayout';
import ShelDemoEntry from '@pages/demo/shelbourne/ShelDemoEntry';
import ShelAdminDashboard from '@pages/demo/shelbourne/ShelAdminDashboard';
import ShelCoachDashboard from '@pages/demo/shelbourne/ShelCoachDashboard';
import ShelPlayerDashboard from '@pages/demo/shelbourne/ShelPlayerDashboard';
import SquadManagement from '@pages/demo/shelbourne/admin/SquadManagement';
import EducationHub from '@pages/demo/shelbourne/admin/EducationHub';
import PlanningOverview from '@pages/demo/shelbourne/admin/PlanningOverview';
import IDPManagement from '@pages/demo/shelbourne/admin/IDPManagement';
import Monitoring from '@pages/demo/shelbourne/admin/Monitoring';
import VideoLibrary from '@pages/demo/shelbourne/admin/VideoLibrary';
import AdminUpskillingAftercare from '@pages/demo/shelbourne/admin/UpskillingAftercare';
import AdminSettings from '@pages/demo/shelbourne/admin/Settings';
import MySquad from '@pages/demo/shelbourne/coach/MySquad';
import SessionPlanning from '@pages/demo/shelbourne/coach/SessionPlanning';
import PlayerIDPs from '@pages/demo/shelbourne/coach/PlayerIDPs';
import WellnessData from '@pages/demo/shelbourne/coach/WellnessData';
import VideoAnalysis from '@pages/demo/shelbourne/coach/VideoAnalysis';
import CoachEducation from '@pages/demo/shelbourne/coach/Education';
import CoachUpskillingAftercare from '@pages/demo/shelbourne/coach/UpskillingAftercare';
import DailyCheckin from '@pages/demo/shelbourne/player/DailyCheckin';
import Learning from '@pages/demo/shelbourne/player/Learning';
import MethodologyHub from '@pages/demo/shelbourne/shared/MethodologyHub';

const AdminMethodology = () => <MethodologyHub role="admin" userName="Mark O'Reilly" />;
const CoachMethodology = () => <MethodologyHub role="coach" userName="Alan Quinn" />;
const PlayerMethodology = () => <MethodologyHub role="player" userName="Aaron Connolly" />;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/demo/shelbourne" replace />} />
        <Route path="/demo/shelbourne" element={<ShelAcademyLayout />}>
          <Route index element={<ShelDemoEntry />} />

          {/* Admin routes */}
          <Route path="admin" element={<ShelAdminDashboard />} />
          <Route path="admin/squads" element={<SquadManagement />} />
          <Route path="admin/education" element={<EducationHub />} />
          <Route path="admin/planning" element={<PlanningOverview />} />
          <Route path="admin/idp" element={<IDPManagement />} />
          <Route path="admin/monitoring" element={<Monitoring />} />
          <Route path="admin/video" element={<VideoLibrary />} />
          <Route path="admin/upskilling" element={<AdminUpskillingAftercare />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/methodology" element={<AdminMethodology />} />

          {/* Coach routes */}
          <Route path="coach" element={<ShelCoachDashboard />} />
          <Route path="coach/squad" element={<MySquad />} />
          <Route path="coach/planning" element={<SessionPlanning />} />
          <Route path="coach/idp" element={<PlayerIDPs />} />
          <Route path="coach/monitoring" element={<WellnessData />} />
          <Route path="coach/video" element={<VideoAnalysis />} />
          <Route path="coach/education" element={<CoachEducation />} />
          <Route path="coach/upskilling" element={<CoachUpskillingAftercare />} />
          <Route path="coach/methodology" element={<CoachMethodology />} />

          {/* Player routes */}
          <Route path="player" element={<ShelPlayerDashboard />} />
          <Route path="player/checkin" element={<DailyCheckin />} />
          <Route path="player/learning" element={<Learning />} />
          <Route path="player/methodology" element={<PlayerMethodology />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
