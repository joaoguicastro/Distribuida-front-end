import { FileX } from 'lucide-react';

export function EmptyState({ message = 'Nenhum dado encontrado' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <FileX className="h-16 w-16 mb-4 opacity-40" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm mt-1">Tente ajustar os filtros ou adicionar novos registros.</p>
    </div>
  );
}
