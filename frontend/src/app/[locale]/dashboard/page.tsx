import { Header } from '@/components/dashboard/header';
import { UserWelcome } from '@/components/dashboard/user-welcome';
import { CreditsOverview } from '@/components/dashboard/credits-overview';
import { StatsCards } from '@/components/dashboard/stats-cards';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Overview" description="Welcome back to your dashboard" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Welcome Section */}
        <UserWelcome />

        {/* Stats Overview */}
        <StatsCards />

        {/* Credits Section */}
        <CreditsOverview />
      </div>
    </div>
  );
}

