import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, TrendingUp, Users, DollarSign } from 'lucide-react';

const StatCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center mb-4">
      {Icon && <Icon className="h-5 w-5 text-orange-500 mr-2" />}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const Analytics = ({ spaces = [], reservations = [] }) => {
  // Estados para los datos procesados
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [occupancyRate, setOccupancyRate] = useState([]);
  const [spaceTypeAnalysis, setSpaceTypeAnalysis] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    if (!spaces.length || !reservations.length) {
      setMonthlyIncome([{ month: '1/2024', total: 0 }]);
      setOccupancyRate([{ name: 'Sin datos', occupancyRate: 0 }]);
      setSpaceTypeAnalysis([{ type: 'Sin datos', value: 0 }]);
      setBookingTrends([{ month: '1/2024', bookings: 0 }]);
      return;
    }

    // Procesar ingresos mensuales
    const processMonthlyIncome = () => {
      const monthlyData = {};
      reservations.forEach(reservation => {
        const date = new Date(reservation.startDate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + reservation.totalPrice;
      });

      return Object.entries(monthlyData).map(([month, total]) => ({
        month,
        total
      })).sort((a, b) => {
        const [monthA, yearA] = a.month.split('/');
        const [monthB, yearB] = b.month.split('/');
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
      });
    };

    // Calcular tasa de ocupación
    const calculateOccupancyRate = () => {
      const spaceOccupancy = {};
      spaces.forEach(space => {
        const spaceReservations = reservations.filter(r => r.spaceId === space.id);
        const totalDays = spaceReservations.reduce((acc, res) => {
          const start = new Date(res.startDate);
          const end = new Date(res.endDate);
          return acc + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        }, 0);
        spaceOccupancy[space.id] = {
          name: space.name,
          occupancyRate: Math.min((totalDays / 365) * 100, 100)
        };
      });
      return Object.values(spaceOccupancy);
    };

    // Analizar tipos de espacios
    const analyzeSpaceTypes = () => {
      const typeAnalysis = {};
      spaces.forEach(space => {
        const spaceReservations = reservations.filter(r => r.spaceId === space.id);
        const typeIncome = spaceReservations.reduce((acc, res) => acc + res.totalPrice, 0);
        typeAnalysis[space.type] = (typeAnalysis[space.type] || 0) + typeIncome;
      });
      return Object.entries(typeAnalysis).map(([type, value]) => ({
        type,
        value: Math.round(value * 100) / 100
      }));
    };

    // Calcular tendencias de reservas
    const calculateBookingTrends = () => {
      const monthlyBookings = {};
      reservations.forEach(reservation => {
        const date = new Date(reservation.startDate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyBookings[monthYear] = (monthlyBookings[monthYear] || 0) + 1;
      });
      return Object.entries(monthlyBookings).map(([month, bookings]) => ({
        month,
        bookings
      })).sort((a, b) => {
        const [monthA, yearA] = a.month.split('/');
        const [monthB, yearB] = b.month.split('/');
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
      });
    };

    // Actualizar estados con los datos procesados
    try {
      setMonthlyIncome(processMonthlyIncome());
      setOccupancyRate(calculateOccupancyRate());
      setSpaceTypeAnalysis(analyzeSpaceTypes());
      setBookingTrends(calculateBookingTrends());
    } catch (error) {
      console.error('Error processing analytics data:', error);
      setMonthlyIncome([{ month: 'Error', total: 0 }]);
      setOccupancyRate([{ name: 'Error', occupancyRate: 0 }]);
      setSpaceTypeAnalysis([{ type: 'Error', value: 0 }]);
      setBookingTrends([{ month: 'Error', bookings: 0 }]);
    }
  }, [spaces, reservations]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="text-sm">{label}</p>
          <p className="text-sm text-orange-600 font-bold">
            {typeof payload[0].value === 'number' ?
              new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(payload[0].value) :
              payload[0].value
            }
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingresos Mensuales */}
        <StatCard title="Ingresos Mensuales" icon={DollarSign}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#f97316"
                  name="Ingresos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StatCard>

        {/* Tasa de Ocupación */}
        <StatCard title="Tasa de Ocupación" icon={Activity}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="occupancyRate"
                  fill="#f97316"
                  name="Tasa de Ocupación (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </StatCard>

        {/* Análisis por Tipo de Espacio */}
        <StatCard title="Ingresos por Tipo de Espacio" icon={TrendingUp}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spaceTypeAnalysis}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, value }) => `${type}: ${value}€`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {spaceTypeAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </StatCard>

        {/* Tendencias de Reservas */}
        <StatCard title="Tendencias de Reservas" icon={Users}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#f97316"
                  name="Reservas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StatCard>
      </div>
    </div>
  );
};

export default Analytics;