import { useQuery } from '@tanstack/react-query';
import { Users, AlertTriangle, FileText, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardSkeleton } from '@/components/Skeletons';
import { patientsApi } from '@/api/patients';
import { triageApi } from '@/api/triage';
import { DashboardCharts } from './DashboardCharts';
import { RecentActivity } from './RecentActivity';

export default function DashboardPage() {
  const { data: patientsData, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients', 'summary'],
    queryFn: () => patientsApi.list({ page: 1, size: 1 }),
    staleTime: 30000,
  });

  const { data: triageData, isLoading: loadingTriage } = useQuery({
    queryKey: ['triages', 'queue'],
    queryFn: () => triageApi.getQueue(),
    staleTime: 30000,
  });

  const summaryCards = [
    { label: 'Total de Pacientes', value: patientsData?.data?.total ?? '-', icon: Users, loading: loadingPatients },
    { label: 'Triagens Ativas', value: triageData?.data?.length ?? '-', icon: AlertTriangle, loading: loadingTriage },
    { label: 'Prontuários Pendentes', value: '-', icon: FileText, loading: false },
    { label: 'Usuários Online', value: '-', icon: Wifi, loading: false },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) =>
          c.loading ? (
            <CardSkeleton key={c.label} />
          ) : (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{c.value}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <DashboardCharts />
      <RecentActivity />
    </div>
  );
}
