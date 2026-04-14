import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Patient } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  dateOfBirth: z.string().min(1, 'Data de nascimento obrigatória'),
  sex: z.enum(['M', 'F'], { required_error: 'Selecione o sexo' }),
  phone: z.string().min(8, 'Telefone inválido'),
  allergies: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: Partial<Patient>) => void;
  loading?: boolean;
  defaultValues?: Partial<Patient>;
}

export function PatientForm({ onSubmit, loading, defaultValues }: Props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name || '',
      dateOfBirth: defaultValues?.dateOfBirth?.split('T')[0] || '',
      sex: defaultValues?.sex || undefined,
      phone: defaultValues?.phone || '',
      allergies: defaultValues?.allergies?.join(', ') || '',
    },
  });

  const handle = (data: FormData) => {
    onSubmit({
      name: data.name,
      dateOfBirth: data.dateOfBirth,
      sex: data.sex,
      phone: data.phone,
      allergies: data.allergies ? data.allergies.split(',').map(s => s.trim()) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit(handle)} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome completo</Label>
        <Input {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Nascimento</Label>
          <Input type="date" {...register('dateOfBirth')} />
          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Sexo</Label>
          <Select onValueChange={(v) => setValue('sex', v as 'M' | 'F')} defaultValue={defaultValues?.sex}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Feminino</SelectItem>
            </SelectContent>
          </Select>
          {errors.sex && <p className="text-xs text-destructive">{errors.sex.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Telefone</Label>
        <Input {...register('phone')} placeholder="(00) 00000-0000" />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Alergias (separadas por vírgula)</Label>
        <Input {...register('allergies')} placeholder="Penicilina, Dipirona" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar
      </Button>
    </form>
  );
}
