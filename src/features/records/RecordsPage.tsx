import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { recordsApi } from '@/api/records';
import { patientsApi } from '@/api/patients';
import { TableSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { formatDateTime } from '@/utils';
import type { MedicalRecord } from '@/types';

export default function RecordsPage() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // We list patients first and then pull records — simplified approach
  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['patients', 'all'],
    queryFn: () => patientsApi.list({ page: 1, size: 100 }),
    staleTime: 30000,
  });

  // For a real app, there would be a /records endpoint listing all records.
  // Here we demonstrate the UI structure.

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prontuários</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por paciente..." className="pl-9" />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(patientsData?.data?.data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyState message="Nenhum prontuário encontrado" />
                  </TableCell>
                </TableRow>
              ) : (
                (patientsData?.data?.data ?? []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detalhes do Prontuário</DialogTitle></DialogHeader>
          {selectedRecord && (
            <div className="space-y-3">
              <p><strong>Data:</strong> {formatDateTime(selectedRecord.date)}</p>
              <p><strong>Tipo:</strong> {selectedRecord.type}</p>
              <p><strong>Anotações:</strong> {selectedRecord.notes}</p>
              {selectedRecord.exams.length > 0 && (
                <div>
                  <strong>Exames:</strong>
                  <div className="flex gap-1 flex-wrap mt-1">{selectedRecord.exams.map(e => <Badge key={e} variant="outline">{e}</Badge>)}</div>
                </div>
              )}
              {selectedRecord.medications.length > 0 && (
                <div>
                  <strong>Medicamentos:</strong>
                  <div className="flex gap-1 flex-wrap mt-1">{selectedRecord.medications.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
