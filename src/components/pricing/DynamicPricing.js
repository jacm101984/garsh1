import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Save,
  AlertTriangle
} from 'lucide-react';

const DynamicPricing = ({ space, reservations }) => {
  // Estados para manejar precios y configuraciones
  const [basePrice, setBasePrice] = useState(space?.price || 0);
  const [seasonalMultipliers, setSeasonalMultipliers] = useState({
    summer: 1.3,
    winter: 0.9,
    holidays: 1.5
  });
  const [demandMultiplier, setDemandMultiplier] = useState(1);
  const [durationDiscounts, setDurationDiscounts] = useState({
    weekly: 0.9,
    monthly: 0.8,
    quarterly: 0.7
  });
  const [priceHistory, setPriceHistory] = useState([]);
  const [suggestedPrice, setSuggestedPrice] = useState(0);

  // Función para calcular la demanda actual
  const calculateDemand = () => {
    if (!reservations || reservations.length === 0) return 1;

    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    const recentReservations = reservations.filter(res => {
      const resDate = new Date(res.startDate);
      return resDate >= lastMonth;
    });

    // Factor de demanda basado en reservas recientes
    const demandFactor = recentReservations.length / 30; // Normalizado a un mes
    return Math.max(0.8, Math.min(1.5, 1 + demandFactor * 0.2));
  };

  // Función para verificar si una fecha es temporada alta
  const isHighSeason = (date) => {
    const month = date.getMonth();
    // Temporada alta: Junio (5) a Septiembre (8)
    return month >= 5 && month <= 8;
  };

  // Función para verificar si es temporada de vacaciones
  const isHolidaySeason = (date) => {
    const month = date.getMonth();
    // Vacaciones: Diciembre (11) y Julio (6)
    return month === 11 || month === 6;
  };

  // Calcular precio sugerido
  const calculateSuggestedPrice = () => {
    const now = new Date();
    let price = basePrice;

    // Ajuste por temporada
    if (isHolidaySeason(now)) {
      price *= seasonalMultipliers.holidays;
    } else if (isHighSeason(now)) {
      price *= seasonalMultipliers.summer;
    } else {
      price *= seasonalMultipliers.winter;
    }

    // Ajuste por demanda
    const currentDemand = calculateDemand();
    price *= currentDemand;

    return Math.round(price);
  };

  // Efecto para actualizar el precio sugerido
  useEffect(() => {
    const newPrice = calculateSuggestedPrice();
    setSuggestedPrice(newPrice);

    // Actualizar historial de precios
    const newHistory = [...priceHistory];
    if (newHistory.length > 30) newHistory.shift();
    newHistory.push({
      date: new Date().toLocaleDateString(),
      price: newPrice,
      basePrice: basePrice
    });
    setPriceHistory(newHistory);
  }, [basePrice, seasonalMultipliers, demandMultiplier]);

  const PriceCard = ({ title, value, icon: Icon, info }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg mr-3">
            <Icon className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        {info && (
          <div className="text-sm text-gray-500 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {info}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900">
        ${typeof value === 'number' ? value.toFixed(2) : value}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PriceCard
          title="Precio Base"
          value={basePrice}
          icon={DollarSign}
          info="Precio de referencia"
        />
        <PriceCard
          title="Precio Sugerido"
          value={suggestedPrice}
          icon={TrendingUp}
          info="Basado en demanda y temporada"
        />
        <PriceCard
          title="Factor de Demanda"
          value={calculateDemand()}
          icon={Calendar}
          info="Multiplicador actual"
        />
      </div>

      {/* Configuración de multiplicadores por temporada */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Multiplicadores por Temporada</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Temporada Alta (Verano)
            </label>
            <input
              type="number"
              min="0.1"
              max="3"
              step="0.1"
              value={seasonalMultipliers.summer}
              onChange={(e) => setSeasonalMultipliers(prev => ({
                ...prev,
                summer: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Temporada Baja (Invierno)
            </label>
            <input
              type="number"
              min="0.1"
              max="3"
              step="0.1"
              value={seasonalMultipliers.winter}
              onChange={(e) => setSeasonalMultipliers(prev => ({
                ...prev,
                winter: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vacaciones
            </label>
            <input
              type="number"
              min="0.1"
              max="3"
              step="0.1"
              value={seasonalMultipliers.holidays}
              onChange={(e) => setSeasonalMultipliers(prev => ({
                ...prev,
                holidays: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Descuentos por duración */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Descuentos por Duración</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semanal (multiplicador)
            </label>
            <input
              type="number"
              min="0.1"
              max="1"
              step="0.05"
              value={durationDiscounts.weekly}
              onChange={(e) => setDurationDiscounts(prev => ({
                ...prev,
                weekly: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mensual (multiplicador)
            </label>
            <input
              type="number"
              min="0.1"
              max="1"
              step="0.05"
              value={durationDiscounts.monthly}
              onChange={(e) => setDurationDiscounts(prev => ({
                ...prev,
                monthly: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trimestral (multiplicador)
            </label>
            <input
              type="number"
              min="0.1"
              max="1"
              step="0.05"
              value={durationDiscounts.quarterly}
              onChange={(e) => setDurationDiscounts(prev => ({
                ...prev,
                quarterly: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Gráfico de historial de precios */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Precios</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                name="Precio Sugerido"
              />
              <Line
                type="monotone"
                dataKey="basePrice"
                stroke="#9ca3af"
                name="Precio Base"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Botón de guardar cambios */}
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          onClick={() => {
            // Aquí implementarías la lógica para guardar los cambios
            console.log('Guardando configuración de precios dinámicos');
          }}
        >
          <Save className="h-5 w-5 mr-2" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default DynamicPricing;