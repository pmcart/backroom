import { Handshake, BookOpen, GraduationCap, ArrowRight, Heart, Compass, Users, ExternalLink } from 'lucide-react';
import ShelDemoLayout from '@components/demo/shelbourne/ShelDemoLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { shelUpskillingPartners, shelUpskillingCourses } from '@data/shelbourneData';

interface UpskillingAftercareProps {
  role: 'admin' | 'coach' | 'player';
  userName: string;
}

const UpskillingAftercare = ({ role, userName }: UpskillingAftercareProps) => {
  const categories = ['Coaching', 'Sports Science', 'Analysis & Data', 'Education & Development'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Coaching': return GraduationCap;
      case 'Sports Science': return Heart;
      case 'Analysis & Data': return Compass;
      case 'Education & Development': return BookOpen;
      default: return BookOpen;
    }
  };

  return (
    <ShelDemoLayout role={role} userName={userName}>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Upskilling & Aftercare</h1>
        <p className="text-muted-foreground mt-1">Supporting players beyond the pitch — pathways, partnerships, and personal development</p>
      </div>

      {/* Philosophy Banner */}
      <Card className="mb-8 bg-gradient-to-r from-red-500/10 to-red-700/10 border-red-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Our Duty of Care</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Football is a short career — and not every academy player will become a professional. Shelbourne FC Academy is committed to preparing every young person for life beyond football,
                whether that means a career within the game or a successful path outside of it. This section connects our players to education, qualifications, and support structures
                that will serve them long after their time in the academy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="partnerships" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="courses">Courses & Qualifications</TabsTrigger>
          <TabsTrigger value="aftercare">Aftercare & Transition</TabsTrigger>
        </TabsList>

        {/* Partnerships Tab */}
        <TabsContent value="partnerships" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {shelUpskillingPartners.map((partner) => (
              <Card key={partner.id} className="bg-card border-border hover:border-red-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Handshake className="h-5 w-5 text-red-500" />
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">{partner.type}</Badge>
                  </div>
                  <CardTitle className="font-display text-base mt-2">{partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <ExternalLink className="h-3 w-3 mr-1" /> Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            const courses = shelUpskillingCourses.filter(c => c.category === category);
            if (courses.length === 0) return null;
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="h-5 w-5 text-red-500" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{category}</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Card key={course.id} className="bg-card border-border hover:border-red-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="bg-muted text-muted-foreground">{course.level}</Badge>
                          {course.available ? (
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Coming Soon</Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-foreground mb-1 text-sm">{course.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{course.provider} • {course.duration}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{course.description}</p>
                        {course.available && (
                          <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700 text-white">
                            <ArrowRight className="h-3 w-3 mr-1" /> View Details
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* Aftercare Tab */}
        <TabsContent value="aftercare" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-red-500" />
                </div>
                <CardTitle className="font-display text-base">Player Transition Support</CardTitle>
                <CardDescription>For players moving on from the academy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'One-to-one transition planning with welfare officer',
                  'Access to career guidance and education pathways',
                  'Continued access to upskilling courses for 12 months',
                  'Referral to partner clubs, colleges, or football programmes',
                  'Ongoing mental health and wellbeing support',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-2">
                  <Compass className="h-5 w-5 text-red-500" />
                </div>
                <CardTitle className="font-display text-base">Careers Within Football</CardTitle>
                <CardDescription>Alternative pathways in the game</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Coaching', desc: 'From grassroots to elite — FAI-accredited pathways' },
                  { title: 'Sports Science & S&C', desc: 'Degree programmes with TU Dublin and partner institutions' },
                  { title: 'Performance Analysis', desc: 'Video, data, and tactical analysis qualifications' },
                  { title: 'Club Administration', desc: 'Operations, governance, and management roles' },
                  { title: 'Media & Communications', desc: 'Journalism, broadcasting, and digital content' },
                  { title: 'Referee Development', desc: 'FAI referee pathway and match official training' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-red-500/5 to-red-700/5 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground mb-2">Long-Term Duty of Care</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Shelbourne FC Academy recognises that our responsibility to young people extends beyond their time in the academy. Every player who passes through our programme —
                    regardless of whether they progress to professional football — leaves with skills, qualifications, and support structures that will benefit them throughout their lives.
                    This is the foundation of our academy philosophy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ShelDemoLayout>
  );
};

export default UpskillingAftercare;
