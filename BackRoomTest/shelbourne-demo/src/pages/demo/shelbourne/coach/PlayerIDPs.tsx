import { useState } from 'react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import IDPPlayerList from '@components/demo/shelbourne/idp/IDPPlayerList';
import IDPCreateForm from '@components/demo/shelbourne/idp/IDPCreateForm';
import IDPDetailView from '@components/demo/shelbourne/idp/IDPDetailView';
import { useShelAcademy } from '@contexts/ShelAcademyContext';
import { COACH_CONFIG } from '@data/shelCoachConfig';
import type { IDPFull } from '@data/idpData';

const ShelPlayerIDPs = () => {
  const { idpSummaries, detailedIDPs, addIDP, updateIDP, deleteIDP } = useShelAcademy();

  // Filter to coach's assigned team only
  const teamIDPs = idpSummaries.filter(i => i.ageGroup === COACH_CONFIG.assignedAgeGroup);

  const [selectedId, setSelectedId] = useState<string | null>(teamIDPs[0]?.id ?? null);
  const [showCreate, setShowCreate] = useState(false);

  const selectedIDP = selectedId ? detailedIDPs[selectedId] ?? null : null;

  const handleCreate = (idp: IDPFull) => {
    addIDP(idp);
    setSelectedId(idp.id);
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    deleteIDP(id);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <ShelDemoLayout role="coach" userName="Alan Quinn">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Player IDPs</h1>
        <p className="text-muted-foreground mt-1">Individual Development Plans — create, edit, and review</p>
      </div>

      {showCreate ? (
        <IDPCreateForm onSave={handleCreate} onCancel={() => setShowCreate(false)} lockedAgeGroup={COACH_CONFIG.assignedAgeGroup} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <IDPPlayerList
            idps={teamIDPs}
            selectedId={selectedId}
            onSelect={id => setSelectedId(id)}
            onCreateClick={() => setShowCreate(true)}
            onDelete={handleDelete}
          />
          <div className="lg:col-span-2">
            {selectedIDP ? (
              <IDPDetailView idp={selectedIDP} onChange={updateIDP} />
            ) : (
              <div className="flex items-center justify-center h-96 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">Select a player to view their IDP, or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-6">Demo prototype — changes are stored in this session only. No data is persisted.</p>
    </ShelDemoLayout>
  );
};

export default ShelPlayerIDPs;
