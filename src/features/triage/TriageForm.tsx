import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Triage } from '@/types';

const schema = z.object({
  patientId: z.string().min(1, 'ID do paciente é obrigatório'),
  patientName: z.string().min(1, 'Nome do paciente é obrigatório'),
  symptoms: z.string().min(3, 'Descreva os sintomas'),
  riskLevel: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], { required_error: 'Selecione o nível de risco' }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: Partial<Triage>) => void;
  loading?: boolean;
}

export function TriageForm({ onSubmit, loading }: Props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => onSubmit({ ...d, status: 'WAITING' }))} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ID do Paciente</Label>
          <Input {...register('patientId')} placeholder="UUID" />
          {errors.patientId && <p className="text-xs text-destructive">{errors.patientId.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Nome do Paciente</Label>
          <Input {...register('patientName')} />
          {errors.patientName && <p className="text-xs text-destructive">{errors.patientName.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Sintomas</Label>
        <Textarea {...register('symptoms')} rows={3} placeholder="Descreva os sintomas..." />
        {errors.symptoms && <p className="text-xs text-destructive">{errors.symptoms.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Classificação de Risco</Label>
        <Select onValueChange={(v) => setValue('riskLevel', v as any)}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="CRITICAL">Crítico</SelectItem>
            <SelectItem value="HIGH">Alto</SelectItem>
            <SelectItem value="MEDIUM">Médio</SelectItem>
            <SelectItem value="LOW">Baixo</SelectItem>
          </SelectContent>
        </Select>
        {errors.riskLevel && <p className="text-xs text-destructive">{errors.riskLevel.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Criar Triagem
      </Button>
    </form>
  );
}
