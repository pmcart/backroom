import { AlertTriangle, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import type { IDPSummary, IDPMode } from '@data/idpData';

interface Props {
  idps: IDPSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateClick: () => void;
  onDelete: (id: string) => void;
}

const getModeColor = (m: IDPMode) => m === 'elite'
  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

const IDPPlayerList = ({ idps, selectedId, onSelect, onCreateClick, onDelete }: Props) => {
  const filtered = idps;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg">Player IDPs</CardTitle>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>
        <CardDescription className="mt-1">{filtered.length} IDP{filtered.length !== 1 ? 's' : ''}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
        {filtered.map(idp => (
          <div
            key={idp.id}
            onClick={() => onSelect(idp.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors group ${
              selectedId === idp.id ? 'bg-red-500/20 border border-red-500/30' : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-foreground">{idp.playerName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{idp.playerName}</p>
                  <p className="text-xs text-muted-foreground">{idp.position} • {idp.ageGroup}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getModeColor(idp.mode ?? 'basic')}`}>
                  {idp.mode === 'elite' ? 'Elite' : 'Basic'}
                </Badge>
                <Button
                  variant="ghost" size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  onClick={e => { e.stopPropagation(); onDelete(idp.id); }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Progress value={idp.overallProgress} className="h-1.5 flex-1 mr-3" />
              <span className="text-xs text-muted-foreground">{idp.overallProgress}%</span>
            </div>
            {idp.goalsAtRisk > 0 && (
              <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-400">
                <AlertTriangle className="h-3 w-3" /> {idp.goalsAtRisk} goal{idp.goalsAtRisk > 1 ? 's' : ''} at risk
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No IDPs for this age group.</p>}
      </CardContent>
    </Card>
  );
};

export default IDPPlayerList;
