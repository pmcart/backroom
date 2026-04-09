import { Video, Play, Clock, Users, Filter, Search, Upload, FolderOpen, Calendar } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { shelVideoClips } from '@data/shelbourneData';

const ShelVideoLibrary = () => {
  const collections = [
    { name: 'U17 Boys Match Footage', count: 18, lastUpdated: '2 days ago' },
    { name: 'U19 Boys Match Footage', count: 22, lastUpdated: '3 days ago' },
    { name: 'U17 Girls Match Footage', count: 12, lastUpdated: '1 day ago' },
    { name: 'U19 Girls Match Footage', count: 14, lastUpdated: 'Today' },
    { name: 'Training Sessions', count: 35, lastUpdated: '1 day ago' },
    { name: 'Individual Analysis', count: 24, lastUpdated: 'Today' },
  ];
  const recentVideos = [
    { title: 'U17 Boys vs Bohemian FC — Full Match', type: 'match', duration: '90:00', date: 'Mar 8', views: 10 },
    { title: 'Pressing Drill — U17 Boys', type: 'training', duration: '8:30', date: 'Mar 10', views: 6 },
    { title: 'Aaron Connolly — Movement Analysis', type: 'individual', duration: '5:45', date: 'Mar 9', views: 4 },
    { title: 'U19 Girls vs Shamrock Rovers', type: 'match', duration: '90:00', date: 'Mar 5', views: 12 },
  ];
  const getTypeColor = (t: string) => {
    switch (t) {
      case 'match': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'training': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'individual': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Video Library</h1>
        <p className="text-muted-foreground mt-1">Academy-wide video analysis and feedback</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search videos..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white"><Upload className="h-4 w-4 mr-2" /> Upload Video</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Video className="h-6 w-6 text-red-500 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">125</p><p className="text-xs text-muted-foreground">Total Videos</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">42h</p><p className="text-xs text-muted-foreground">Total Duration</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Users className="h-6 w-6 text-green-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">36</p><p className="text-xs text-muted-foreground">Players Analysed</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><Calendar className="h-6 w-6 text-amber-400 mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">10</p><p className="text-xs text-muted-foreground">This Week</p></CardContent></Card>
      </div>
      <Tabs defaultValue="collections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="recent">Recent Videos</TabsTrigger>
          <TabsTrigger value="feedback">Pending Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="collections">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map(c => (
              <Card key={c.name} className="bg-card border-border hover:border-red-500/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-red-500/20 flex items-center justify-center"><FolderOpen className="h-6 w-6 text-red-500" /></div>
                    <Badge variant="outline" className="bg-muted">{c.count} videos</Badge>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">Updated {c.lastUpdated}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentVideos.map((v, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center relative">
                      <Play className="h-6 w-6 text-muted-foreground" />
                      <span className="absolute bottom-1 right-1 text-xs bg-black/70 px-1 rounded">{v.duration}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{v.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getTypeColor(v.type)}>{v.type}</Badge>
                        <span className="text-sm text-muted-foreground">{v.date} • {v.views} views</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Videos Awaiting Feedback</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shelVideoClips.filter(v => !v.feedback).map(v => (
                  <div key={v.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded bg-muted flex items-center justify-center"><Play className="h-4 w-4 text-muted-foreground" /></div>
                      <div>
                        <h4 className="font-medium text-foreground">{v.title}</h4>
                        <p className="text-sm text-muted-foreground">{v.match} • {v.date}</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Add Feedback</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ShelDemoLayout>
  );
};
export default ShelVideoLibrary;
