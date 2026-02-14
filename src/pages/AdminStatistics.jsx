import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../components/AdminLayout';

const AdminStatistics = () => {
  const navigate = useNavigate();
  const { 
    stats,
    monthlyBookings,
    detailedStats,
    fetchDashboard,
    fetchStatistics,
    loading,
    initializing,
    isAuthenticated 
  } = useAdmin();

  const [period, setPeriod] = useState('year');

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchDashboard();
    fetchStatistics(period);
  }, [initializing, isAuthenticated, navigate, fetchDashboard, fetchStatistics, period]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const formatCurrency = (num) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(num || 0);
  const formatNumber = (num) => new Intl.NumberFormat('fr-FR').format(num || 0);

  const getMonthName = (monthNum) => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[monthNum - 1];
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Statistiques Détaillées</h1>
            <p className="text-sm text-slate-500">Analyse approfondie de vos performances</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none w-full sm:w-auto"
          >
            <option value="month">30 derniers jours</option>
            <option value="quarter">3 derniers mois</option>
            <option value="year">Année en cours</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-linear-to-br from-red-500 to-red-600 rounded-xl p-4 sm:p-6 text-white">
                <p className="text-red-100 text-xs sm:text-sm mb-1">Chiffre d'affaires</p>
                <p className="text-xl sm:text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-red-100 text-xs sm:text-sm mt-2">Ce mois: {formatCurrency(stats.monthRevenue)}</p>
              </div>

              <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
                <p className="text-blue-100 text-xs sm:text-sm mb-1">Réservations</p>
                <p className="text-xl sm:text-3xl font-bold">{formatNumber(stats.totalBookings)}</p>
                <p className="text-blue-100 text-xs sm:text-sm mt-2">{stats.pendingBookings} en attente</p>
              </div>

              <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
                <p className="text-green-100 text-xs sm:text-sm mb-1">Taux de conversion</p>
                <p className="text-xl sm:text-3xl font-bold">{detailedStats?.conversionRate?.rate || 0}%</p>
                <p className="text-green-100 text-xs sm:text-sm mt-2">
                  {detailedStats?.conversionRate?.confirmed || 0} sur {detailedStats?.conversionRate?.total || 0}
                </p>
              </div>

              <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
                <p className="text-purple-100 text-xs sm:text-sm mb-1">Panier moyen</p>
                <p className="text-xl sm:text-3xl font-bold">
                  {formatCurrency(stats.totalBookings > 0 ? stats.totalRevenue / stats.totalBookings : 0)}
                </p>
                <p className="text-purple-100 text-xs sm:text-sm mt-2">Par réservation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Graphique des revenus par mois */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Évolution des revenus ({new Date().getFullYear()})</h3>
                {monthlyBookings.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {monthlyBookings.map((month) => (
                      <div key={month.month} className="flex items-center gap-2 sm:gap-4">
                        <span className="w-12 sm:w-20 text-xs sm:text-sm text-slate-600 shrink-0">{getMonthName(month.month).substring(0, 3)}</span>
                        <div className="flex-1 h-6 sm:h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full bg-green-500 rounded-lg transition-all duration-500"
                            style={{ width: `${(month.revenue / Math.max(...monthlyBookings.map(m => m.revenue))) * 100}%` }}
                          ></div>
                          <span className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-slate-700">
                            {formatCurrency(month.revenue)}
                          </span>
                        </div>
                        <span className="w-8 sm:w-12 text-xs sm:text-sm text-slate-500 text-right">{month.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">Aucune donnée disponible</p>
                )}
              </div>

              {/* Répartition par catégorie */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Répartition par catégorie</h3>
                {detailedStats?.categoryDistribution?.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {detailedStats.categoryDistribution.map((cat) => (
                      <div key={cat.category} className="flex items-center gap-2 sm:gap-4">
                        <span className="w-20 sm:w-32 text-xs sm:text-sm text-slate-600 shrink-0 truncate">{cat.category}</span>
                        <div className="flex-1 h-6 sm:h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                          <div 
                            className="h-full bg-blue-500 rounded-lg transition-all duration-500"
                            style={{ width: `${(cat.bookings / Math.max(...detailedStats.categoryDistribution.map(c => c.bookings))) * 100}%` }}
                          ></div>
                          <span className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-slate-700">
                            {cat.bookings} rés.
                          </span>
                        </div>
                        <span className="w-16 sm:w-24 text-xs sm:text-sm text-slate-500 text-right">{formatCurrency(cat.revenue)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">Aucune donnée disponible</p>
                )}
              </div>
            </div>

            {/* Évolution quotidienne */}
            {detailedStats?.dailyEvolution?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Évolution des 30 derniers jours</h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full min-w-[360px] sm:min-w-[500px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase">Rés.</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase">Revenus</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-slate-500 uppercase">Moy.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {detailedStats.dailyEvolution.slice(0, 10).map((day) => (
                        <tr key={day.date} className="hover:bg-slate-50">
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                            {new Date(day.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-800">{day.bookings}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap">{formatCurrency(day.revenue)}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                            {day.bookings > 0 ? formatCurrency(day.revenue / day.bookings) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Résumé des statuts */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Résumé des réservations par statut</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-700 text-xs sm:text-sm font-medium">En attente</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-800">{stats.pendingBookings}</p>
                </div>
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 text-xs sm:text-sm font-medium">Confirmées</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-800">{stats.confirmedBookings}</p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-700 text-xs sm:text-sm font-medium">Terminées</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-800">{stats.completedBookings}</p>
                </div>
                <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-700 text-xs sm:text-sm font-medium">Annulées</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-800">{stats.cancelledBookings}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
