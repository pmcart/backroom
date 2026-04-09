import { Info } from 'lucide-react';

const ShelDemoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-red-700/20 via-red-600/15 to-red-700/20 border-b border-red-500/30">
      <div className="section-container py-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Info className="h-4 w-4 text-red-500" />
          <span className="text-muted-foreground">
            <span className="font-semibold text-red-500">Shelbourne FC Academy — Demo Environment</span>
            {' '}— Illustrative content only. Explore the platform with sample data.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShelDemoBanner;
