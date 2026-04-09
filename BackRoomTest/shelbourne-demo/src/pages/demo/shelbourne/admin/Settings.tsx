import { Building2, Shield, Bell, Palette, Globe, Mail, Database, Key } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Switch } from '@components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Badge } from '@components/ui/badge';

const ShelSettings = () => {
  return (
    <ShelDemoLayout role="admin" userName="Mark O'Reilly">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Settings</h1>
        <p className="text-muted-foreground mt-1">Academy configuration and preferences</p>
      </div>
      <Tabs defaultValue="organisation" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="organisation">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Building2 className="h-5 w-5 text-red-500" /> Organisation Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm text-muted-foreground">Organisation Name</label><Input value="Shelbourne FC — League of Ireland Academy" className="mt-1" readOnly /></div>
                <div><label className="text-sm text-muted-foreground">Primary Contact Email</label><Input value="academy@shelbournefc.ie" className="mt-1" readOnly /></div>
                <div><label className="text-sm text-muted-foreground">Country</label><Input value="Ireland" className="mt-1" readOnly /></div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Save Changes</Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Palette className="h-5 w-5 text-red-500" /> Branding</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">SFC</span>
                  </div>
                  <Button variant="outline" size="sm">Upload Logo</Button>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Primary Colour</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-8 w-8 rounded bg-red-600" />
                    <Input value="#DC2626" className="flex-1" readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-red-500" /> Academy Structure</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {['U14 Boys', 'U15 Boys', 'U17 Boys', 'U19 Boys', 'U17 Girls', 'U19 Girls'].map(age => (
                    <div key={age} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="font-medium text-foreground">{age}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-lg">User Management</CardTitle>
                <CardDescription>Manage staff access</CardDescription>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Invite User</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Alan Quinn', role: 'Lead Coach — U17 Boys', email: 'alan@shelbournefc.ie', status: 'active' },
                  { name: "Joey O'Brien", role: 'Lead Coach — U19 Boys', email: 'joey@shelbournefc.ie', status: 'active' },
                  { name: 'Lisa Fallon', role: 'Lead Coach — U17 Girls', email: 'lisa@shelbournefc.ie', status: 'active' },
                  { name: 'Noel King', role: 'Lead Coach — U19 Girls', email: 'noel@shelbournefc.ie', status: 'pending' },
                ].map(u => (
                  <div key={u.email} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-foreground">{u.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.role} • {u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>{u.status}</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Bell className="h-5 w-5 text-red-500" /> Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: 'Wellness Alerts', desc: 'Notify when player wellness drops below threshold', on: true },
                { title: 'IDP Review Reminders', desc: 'Remind coaches of upcoming IDP reviews', on: true },
                { title: 'Education Deadlines', desc: 'Alert when mandatory modules are incomplete', on: true },
                { title: 'Session Planning', desc: 'Notify when sessions are approved or modified', on: false },
              ].map(p => (
                <div key={p.title} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                  <Switch defaultChecked={p.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-red-500" /> Security Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Database className="h-5 w-5 text-red-500" /> Data & Privacy</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start"><Key className="h-4 w-4 mr-2" /> Export Organisation Data</Button>
                <Button variant="outline" className="w-full justify-start"><Mail className="h-4 w-4 mr-2" /> Request Data Deletion</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ShelDemoLayout>
  );
};
export default ShelSettings;
