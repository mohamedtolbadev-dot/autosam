import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../components/AdminLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    admin,
    stats, 
    recentBookings, 
    monthlyBookings,
    topCars,
    topLocations,
    fetchDashboard, 
    loading,
    initializing,
    isAuthenticated 
  } = useAdmin();

  const formatNumber = (num) => new Intl.NumberFormat('fr-FR').format(num);
  const formatCurrency = (num) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(num);
  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[monthNum - 1];
  };

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchDashboard();
  }, [initializing, isAuthenticated, navigate, fetchDashboard]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tableau de bord</h1>
          <p className="text-sm sm:text-base text-slate-500">Bienvenue, {admin?.username}. Voici les dernières informations.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-1">Revenus totaux</p>
                    <p className="text-lg sm:text-2xl font-bold text-slate-800">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-red-600">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <span className="text-slate-600">Ce mois: {formatCurrency(stats.monthRevenue)}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-1">Réservations</p>
                    <p className="text-lg sm:text-2xl font-bold text-slate-800">{formatNumber(stats.totalBookings)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-red-600">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-sm gap-1 sm:gap-4">
                  <span className="text-slate-600">{stats.pendingBookings} en attente</span>
                  <span className="text-slate-600">{stats.confirmedBookings} confirmées</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-1">Voitures</p>
                    <p className="text-lg sm:text-2xl font-bold text-slate-800">{formatNumber(stats.totalCars)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-red-600">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path fill="rgba(193, 23, 42, 1.00)" d="M199.2 181.4L173.1 256L466.9 256L440.8 181.4C436.3 168.6 424.2 160 410.6 160L229.4 160C215.8 160 203.7 168.6 199.2 181.4zM103.6 260.8L138.8 160.3C152.3 121.8 188.6 96 229.4 96L410.6 96C451.4 96 487.7 121.8 501.2 160.3L536.4 260.8C559.6 270.4 576 293.3 576 320L576 512C576 529.7 561.7 544 544 544L512 544C494.3 544 480 529.7 480 512L480 480L160 480L160 512C160 529.7 145.7 544 128 544L96 544C78.3 544 64 529.7 64 512L64 320C64 293.3 80.4 270.4 103.6 260.8zM192 368C192 350.3 177.7 336 160 336C142.3 336 128 350.3 128 368C128 385.7 142.3 400 160 400C177.7 400 192 385.7 192 368zM480 400C497.7 400 512 385.7 512 368C512 350.3 497.7 336 480 336C462.3 336 448 350.3 448 368C448 385.7 462.3 400 480 400z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-500 truncate">
                  {topCars.length > 0 && `Top: ${topCars[0].name}`}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-1">Utilisateurs</p>
                    <p className="text-lg sm:text-2xl font-bold text-slate-800">{formatNumber(stats.totalUsers)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-red-600">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-500">
                  {stats.completedBookings} réservations complétées
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Réservations récentes */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800">Réservations récentes</h2>
                  <button 
                    onClick={() => navigate('/admin/bookings')}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">Voiture</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recentBookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-slate-600">#{booking.id}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="text-sm font-medium text-slate-800">{booking.first_name} {booking.last_name}</div>
                            <div className="text-xs sm:text-sm text-slate-500">{booking.email}</div>
                            <div className="text-xs text-slate-500 sm:hidden">{booking.car_name}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-slate-600 hidden sm:table-cell">{booking.car_name}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-slate-800">{formatCurrency(booking.total_price)}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmée' :
                               booking.status === 'pending' ? 'En attente' :
                               booking.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar Analytics */}
              <div className="space-y-8">
                {/* Top Voitures */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Voitures</h3>
                  <div className="space-y-3">
                    {topCars.slice(0, 5).map((car, index) => (
                      <div key={car.id} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{car.name}</p>
                          <p className="text-xs text-slate-500">{car.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{car.booking_count} rés.</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Locations */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Lieux populaires</h3>
                  <div className="space-y-3">
                    {topLocations.slice(0, 5).map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{location.pickup_location}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${(location.count / topLocations[0].count) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-500 w-8">{location.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Répartition des statuts */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Répartition</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">En attente</span>
                        <span className="font-medium">{stats.pendingBookings}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Confirmées</span>
                        <span className="font-medium">{stats.confirmedBookings}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.confirmedBookings / stats.totalBookings) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Terminées</span>
                        <span className="font-medium">{stats.completedBookings}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(stats.completedBookings / stats.totalBookings) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Annulées</span>
                        <span className="font-medium">{stats.cancelledBookings}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(stats.cancelledBookings / stats.totalBookings) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique des réservations par mois */}
            {monthlyBookings.length > 0 && (
              <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Réservations par mois ({new Date().getFullYear()})</h3>
                <div className="h-64">
                  <Line
                    data={{
                      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                      datasets: [
                        {
                          label: 'Réservations',
                          data: Array.from({ length: 12 }, (_, i) => {
                            const monthData = monthlyBookings.find(m => m.month === i + 1);
                            return monthData ? monthData.count : 0;
                          }),
                          borderColor: 'rgba(239, 68, 68, 1)',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          borderWidth: 3,
                          tension: 0.4,
                          fill: true,
                          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                          pointBorderColor: '#fff',
                          pointBorderWidth: 2,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.raw} réservation${context.raw > 1 ? 's' : ''}`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
