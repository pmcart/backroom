import { Play, MessageSquare, Mic, Clock, User, CheckCircle, Plus, Filter, Search } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Badge } from '@components/ui/badge';
import { Textarea } from '@components/ui/textarea';
import { shelVideoClips } from '@data/shelbourneData';

const ShelCoachVideoAnalysis = () => {
  const getTypeColor = (t: string) => {
    switch (t) {
      case 'match': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'training': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'individual': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  return (
    <ShelDemoLayout role="coach" userName="Alan Quinn">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Video Analysis</h1>
        <p className="text-muted-foreground mt-1">Upload, analyse, and provide feedback on player footage</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search videos..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white"><Plus className="h-4 w-4 mr-2" /> Upload Video</Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Recent Videos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {shelVideoClips.map(v => (
                <div key={v.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="h-16 w-24 rounded bg-muted flex items-center justify-center relative flex-shrink-0">
                      <Play className="h-6 w-6 text-muted-foreground" />
                      <span className="absolute bottom-1 right-1 text-xs bg-black/70 px-1 rounded">{v.duration}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">{v.title}</h4>
                      <p className="text-xs text-muted-foreground">{v.match}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`${getTypeColor(v.type)} text-xs`}>{v.type}</Badge>
                        {v.feedback && <CheckCircle className="h-3 w-3 text-green-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Counter-Attack Opportunity</CardTitle>
            <CardDescription>vs Bohemian FC U17 • Match • Mar 8</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6 relative">
              <Play className="h-16 w-16 text-muted-foreground" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <div className="h-1 bg-red-500/30 flex-1 rounded">
                  <div className="h-full w-1/3 bg-red-500 rounded" />
                </div>
                <span className="text-xs text-muted-foreground">0:18 / 0:52</span>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3">Timestamped Notes</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Badge variant="outline" className="bg-red-500/20 text-red-500">0:10</Badge>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Good initial break — pace on the counter was excellent</p>
                    <p className="text-xs text-muted-foreground">Coach Quinn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400">0:18</Badge>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Final ball needed more weight — slightly overhit</p>
                    <p className="text-xs text-muted-foreground">Coach Quinn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400">0:22</Badge>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Good recovery run to support the second ball</p>
                    <p className="text-xs text-muted-foreground">Coach Quinn</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Add Feedback</h4>
              <div className="flex gap-2 mb-3">
                <Button variant="outline" size="sm"><Clock className="h-4 w-4 mr-1" /> Add at 0:18</Button>
                <Button variant="outline" size="sm"><Mic className="h-4 w-4 mr-1" /> Voice Note</Button>
              </div>
              <Textarea placeholder="Write your feedback..." className="mb-3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Assign to</span>
                  <Badge variant="outline">Aaron Connolly</Badge>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white"><MessageSquare className="h-4 w-4 mr-1" /> Send Feedback</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShelDemoLayout>
  );
};
export default ShelCoachVideoAnalysis;
