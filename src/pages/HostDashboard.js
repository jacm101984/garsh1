import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Warehouse,
  Clock,
  Plus,
  Search,
  Filter,
  ChartBar,
  Calendar
} from 'lucide-react';
import Analytics from '../components/analytics/Analytics';
import DynamicPricing from '../components/pricing/DynamicPricing';
import SpacesTable from '../components/tables/SpacesTable';
import ReservationsTable from '../components/tables/ReservationsTable';

const HostDashboard = ({ spaces = [], onDeleteSpace, onEditSpace, reservations = [] }) => {
  // Estados
  const [activeTab, setActiveTab] = useState('spaces');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSpace, setSelectedSpace] = useState(spaces[0] || null);

  // Cálculos y filtros
  const calculateStats = () => {
    const activeSpaces = spaces.filter(space => space.status === 'active');
    const totalEarnings = reservations.reduce((sum, res) => sum + res.totalPrice, 0);
    const totalReservations = reservations.length;

    return {
      activeSpaces: activeSpaces.length,
      totalEarnings,
      totalReservations
    };
  };

  const stats = calculateStats();

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch =
      space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || space.type === filterType;
    const matchesStatus = filterStatus === 'all' || space.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredReservations = reservations.filter(reservation => {
    const space = spaces.find(s => s.id === reservation.spaceId);
    return space && space.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Componente de tarjeta para estadísticas
  const StatCard = ({ icon: Icon, title, value, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Anfitrión</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona tus espacios y reservaciones
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Warehouse}
              title="Espacios Activos"
              value={stats.activeSpaces}
            />
            <StatCard
              icon={DollarSign}
              title="Ingresos Totales"
              value={`$${stats.totalEarnings}`}
            />
            <StatCard
              icon={Calendar}
              title="Reservas Totales"
              value={stats.totalReservations}
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('spaces')}
                className={`${
                  activeTab === 'spaces'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Warehouse className="h-4 w-4" />
                Espacios
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`${
                  activeTab === 'reservations'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Calendar className="h-4 w-4" />
                Reservaciones
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`${
                  activeTab === 'analytics'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <ChartBar className="h-4 w-4" />
                Análisis
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`${
                  activeTab === 'pricing'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <DollarSign className="h-4 w-4" />
                Precios Dinámicos
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Filters */}
            {activeTab !== 'analytics' && activeTab !== 'pricing' && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={`Buscar ${activeTab === 'spaces' ? 'espacios' : 'reservaciones'}...`}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {activeTab === 'spaces' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="all">Todos los tipos</option>
                          <option value="garage">Garaje</option>
                          <option value="almacen">Almacén</option>
                          <option value="oficina">Oficina</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="all">Todos los estados</option>
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Space selector for pricing */}
            {activeTab === 'pricing' && spaces.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700">
                  Seleccionar Espacio
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  value={selectedSpace?.id}
                  onChange={(e) => {
                    const space = spaces.find(s => s.id === parseInt(e.target.value));
                    setSelectedSpace(space);
                  }}
                >
                  {spaces.map(space => (
                    <option key={space.id} value={space.id}>
                      {space.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Main Content */}
            {activeTab === 'spaces' ? (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={() => window.location.href = '#/add-space'}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Espacio
                  </button>
                </div>
                <SpacesTable
                  spaces={filteredSpaces}
                  onDeleteSpace={onDeleteSpace}
                  onEditSpace={onEditSpace}
                />
              </>
            ) : activeTab === 'reservations' ? (
              <ReservationsTable
                reservations={filteredReservations}
                spaces={spaces}
              />
            ) : activeTab === 'analytics' ? (
              <Analytics spaces={spaces} reservations={reservations} />
            ) : (
              <DynamicPricing space={selectedSpace} reservations={reservations} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;