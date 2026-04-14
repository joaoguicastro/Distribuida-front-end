import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { triageApi } from '@/api/triage';
import { TableSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { formatDateTime, getRiskBgClass, getStatusBgClass } from '@/utils';
import { TRIAGE_STATUS, RISK_LEVELS } from '@/config/constants';
import { TriageForm } from './TriageForm';
import { toast } from 'sonner';
import type { Triage } from '@/types';

const riskOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export default function TriagePage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Triage | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['triages', 'queue'],
    queryFn: () => triageApi.getQueue(),
    staleTime: 10000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => triageApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triages'] });
      toast.success('Status atualizado');
    },
    onError: () => toast.error('Erro ao atualizar status'),
  });

  const createMutation = useMutation({
    mutationFn: triageApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triages'] });
      setFormOpen(false);
      toast.success('Triagem criada com sucesso');
    },
    onError: () => toast.error('Erro ao criar triagem'),
  });

  const queue = [...(data?.data ?? [])].sort((a, b) => (riskOrder[a.riskLevel] ?? 4) - (riskOrder[b.riskLevel] ?? 4));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Triagem</h1>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nova Triagem</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Nova Triagem</DialogTitle></DialogHeader>
            <TriageForm onSubmit={(d) => createMutation.mutate(d)} loading={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* LEFT: Queue */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg mb-3">Fila de Atendimento</h2>
          {isLoading ? (
            <TableSkeleton rows={4} cols={1} />
          ) : queue.length === 0 ? (
            <EmptyState message="Fila vazia" />
          ) : (
            queue.map((t) => (
              <Card
                key={t.id}
                className={`cursor-pointer transition-all ${selected?.id === t.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                onClick={() => setSelected(t)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t.patientName}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getRiskBgClass(t.riskLevel)}>{RISK_LEVELS[t.riskLevel].label}</Badge>
                    <Badge className={getStatusBgClass(t.status)}>{TRIAGE_STATUS[t.status]}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* RIGHT: Detail */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Detalhes</h2>
          {selected ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{selected.patientName}</h3>
                    <p className="text-sm text-muted-foreground">ID: {selected.patientId}</p>
                  </div>
                  <Badge className={getRiskBgClass(selected.riskLevel)}>{RISK_LEVELS[selected.riskLevel].label}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sintomas</p>
                  <p className="text-sm mt-1">{selected.symptoms}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p className="text-sm mt-1">{formatDateTime(selected.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Atualizar Status</p>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => statusMutation.mutate({ id: selected.id, status: v })}
                  >
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WAITING">Aguardando</SelectItem>
                      <SelectItem value="IN_PROGRESS">Em Atendimento</SelectItem>
                      <SelectItem value="COMPLETED">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 rounded-lg border border-dashed text-muted-foreground">
              Selecione uma triagem para ver os detalhes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
