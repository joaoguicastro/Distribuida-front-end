import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '@/api/patients';
import { recordsApi } from '@/api/records';
import { triageApi } from '@/api/triage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, formatDateTime, calculateAge, getRiskBgClass, getStatusBgClass } from '@/utils';
import { TRIAGE_STATUS } from '@/config/constants';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: patientRes, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsApi.getById(id!),
    enabled: !!id,
  });

  const { data: historyRes } = useQuery({
    queryKey: ['patient', id, 'history'],
    queryFn: () => patientsApi.getHistory(id!),
    enabled: !!id,
  });

  const { data: recordsRes } = useQuery({
    queryKey: ['records', id],
    queryFn: () => recordsApi.listByPatient(id!),
    enabled: !!id,
  });

  const { data: triagesRes } = useQuery({
    queryKey: ['triages', 'patient', id],
    queryFn: () => triageApi.list(),
    enabled: !!id,
  });

  if (isLoading) return <TableSkeleton />;

  const patient = patientRes?.data;
  if (!patient) return <EmptyState message="Paciente não encontrado" />;

  const records = recordsRes?.data ?? [];
  const triages = (triagesRes?.data ?? []).filter(t => t.patientId === id);
  const history = historyRes?.data ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{patient.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground">Idade:</span> <strong>{calculateAge(patient.dateOfBirth)} anos</strong></div>
            <div><span className="text-muted-foreground">Sexo:</span> <strong>{patient.sex === 'M' ? 'Masculino' : 'Feminino'}</strong></div>
            <div><span className="text-muted-foreground">Telefone:</span> <strong>{patient.phone}</strong></div>
            <div><span className="text-muted-foreground">Nascimento:</span> <strong>{formatDate(patient.dateOfBirth)}</strong></div>
          </div>
          {patient.allergies.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Alergias:</span>
              {patient.allergies.map((a) => (
                <Badge key={a} variant="destructive">{a}</Badge>
              ))}
            </div>
          )}
          {patient.vaccines.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Vacinas:</span>
              {patient.vaccines.map((v) => (
                <Badge key={v.id} variant="secondary">{v.name} ({formatDate(v.date)})</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Histórico Clínico</TabsTrigger>
          <TabsTrigger value="records">Prontuários</TabsTrigger>
          <TabsTrigger value="triages">Triagens</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-3 mt-4">
          {history.length === 0 ? (
            <EmptyState message="Nenhum histórico clínico" />
          ) : (
            history.map((h: any, i: number) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <p className="text-sm">{h.description || JSON.stringify(h)}</p>
                  {h.date && <p className="text-xs text-muted-foreground mt-1">{formatDateTime(h.date)}</p>}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="records" className="space-y-3 mt-4">
          {records.length === 0 ? (
            <EmptyState message="Nenhum prontuário registrado" />
          ) : (
            records.map((r) => (
              <Card key={r.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{r.type}</p>
                      <p className="text-sm text-muted-foreground mt-1">{r.notes}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDateTime(r.date)}</span>
                  </div>
                  {r.exams.length > 0 && <div className="mt-2 flex gap-1 flex-wrap">{r.exams.map(e => <Badge key={e} variant="outline">{e}</Badge>)}</div>}
                  {r.medications.length > 0 && <div className="mt-1 flex gap-1 flex-wrap">{r.medications.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}</div>}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="triages" className="space-y-3 mt-4">
          {triages.length === 0 ? (
            <EmptyState message="Nenhuma triagem registrada" />
          ) : (
            triages.map((t) => (
              <Card key={t.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">{t.symptoms}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDateTime(t.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getRiskBgClass(t.riskLevel)}>{t.riskLevel}</Badge>
                      <Badge className={getStatusBgClass(t.status)}>{TRIAGE_STATUS[t.status]}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
