import { Link } from 'react-router-dom';
import { Building2, Shield, UserCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import ShelDemoBanner from '@components/demo/shelbourne/ShelDemoBanner';

const roles = [
  {
    id: 'admin',
    title: 'Academy Admin',
    description: 'Full academy oversight across boys and girls squads, education compliance, welfare tracking, and planning across all age groups.',
    icon: Building2,
    features: ['Cross-squad analytics', 'Education & welfare compliance', 'Staff management', 'Academy settings'],
    gradient: 'from-red-600 to-red-800',
    path: 'demo/shelbourne/admin',
  },
  {
    id: 'coach',
    title: 'Coach',
    description: 'Manage your squad, plan training sessions, track player development, and review wellness data within your age group.',
    icon: Shield,
    features: ['Session planning', 'IDP management', 'Wellness monitoring', 'Video feedback'],
    gradient: 'from-red-500 to-red-700',
    path: 'demo/shelbourne/coach',
  },
  {
    id: 'player',
    title: 'Player',
    description: 'Access your development plan, complete daily check-ins, review video feedback, and engage with education modules.',
    icon: UserCircle,
    features: ['My development', 'Daily check-in', 'Video review', 'Education modules'],
    gradient: 'from-red-400 to-red-600',
    path: 'demo/shelbourne/player',
  },
];

const ShelDemoEntry = () => {
  return (
    <div className="min-h-screen bg-background">
      <ShelDemoBanner />
      <div className="section-container py-12 lg:py-20">
        <Link to="/demo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Demos
        </Link>

        <div className="text-center mb-12">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800">
            <span className="text-2xl font-bold text-white">SFC</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl mb-4">
            Shelbourne FC Academy — Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience The Backroom Team as it could work for a League of Ireland academy. Select a role to explore the platform with illustrative sample data.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {roles.map((role) => (
            <Link key={role.id} to={`/${role.path}`} className="glass-card p-6 hover-lift group cursor-pointer">
              <div className="relative z-10">
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${role.gradient}`}>
                  <role.icon className="h-7 w-7 text-white" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-red-500 transition-colors">
                  {role.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{role.description}</p>
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
                  Enter as {role.title}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Demo environment — illustrative content only. No real personal data is displayed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShelDemoEntry;
