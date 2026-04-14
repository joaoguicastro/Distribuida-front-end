import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { triageApi } from '@/api/triage';
import { patientsApi } from '@/api/patients';
import { getRiskBgClass, formatRelative } from '@/utils';
import { TRIAGE_STATUS } from '@/config/constants';

export function RecentActivity() {
  const { data: triages } = useQuery({
    queryKey: ['triages', 'recent'],
    queryFn: () => triageApi.list(),
    staleTime: 30000,
  });

  const { data: patients } = useQuery({
    queryKey: ['patients', 'recent'],
    queryFn: () => patientsApi.list({ page: 1, size: 5 }),
    staleTime: 30000,
  });

  const recentTriages = (triages?.data ?? []).slice(0, 5);
  const recentPatients = (patients?.data?.data ?? []).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimas Triagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTriages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma triagem recente</p>
          ) : (
            recentTriages.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{t.patientName}</p>
                  <p className="text-xs text-muted-foreground">{formatRelative(t.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getRiskBgClass(t.riskLevel)}>{t.riskLevel}</Badge>
                  <Badge variant="outline">{TRIAGE_STATUS[t.status]}</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos Cadastros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPatients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum cadastro recente</p>
          ) : (
            recentPatients.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.phone}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
