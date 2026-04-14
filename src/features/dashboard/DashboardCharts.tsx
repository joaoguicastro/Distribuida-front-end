import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

const weeklyData = [
  { day: 'Seg', atendimentos: 0 },
  { day: 'Ter', atendimentos: 0 },
  { day: 'Qua', atendimentos: 0 },
  { day: 'Qui', atendimentos: 0 },
  { day: 'Sex', atendimentos: 0 },
  { day: 'Sáb', atendimentos: 0 },
  { day: 'Dom', atendimentos: 0 },
];

const riskData = [
  { period: 'Sem 1', critico: 0, alto: 0, medio: 0, baixo: 0 },
  { period: 'Sem 2', critico: 0, alto: 0, medio: 0, baixo: 0 },
  { period: 'Sem 3', critico: 0, alto: 0, medio: 0, baixo: 0 },
  { period: 'Sem 4', critico: 0, alto: 0, medio: 0, baixo: 0 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atendimentos por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="atendimentos" fill="hsl(213 52% 24%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribuição de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="critico" stroke="hsl(0 84% 60%)" strokeWidth={2} />
              <Line type="monotone" dataKey="alto" stroke="hsl(25 95% 53%)" strokeWidth={2} />
              <Line type="monotone" dataKey="medio" stroke="hsl(45 93% 47%)" strokeWidth={2} />
              <Line type="monotone" dataKey="baixo" stroke="hsl(142 71% 45%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
