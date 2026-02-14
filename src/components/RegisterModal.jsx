import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useTranslation } from 'react-i18next';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register, loading } = useCustomer();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch', 'Les mots de passe ne correspondent pas'));
      return;
    }
    
    if (formData.password.length < 6) {
      setError(t('register.passwordTooShort', 'Le mot de passe doit contenir au moins 6 caractères'));
      return;
    }
    
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };
    
    const result = await register(userData);
    
    if (result.success) {
      onClose();
      navigate('/my-bookings');
    } else {
      setError(result.error || t('register.error', 'Échec de l\'inscription'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <img 
              src="/imgs/autosam1.jpg" 
              alt="Logo" 
              className="h-10 w-auto mx-auto mb-3 object-contain"
            />
            <h2 className="text-xl font-bold text-slate-800">
              Créer un compte
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Suivez vos réservations en temps réel
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-reg-firstName" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                  Prénom
                </label>
                <input
                  id="modal-reg-firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="modal-reg-lastName" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                  Nom
                </label>
                <input
                  id="modal-reg-lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-reg-email" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                Email
              </label>
              <input
                id="modal-reg-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="modal-reg-phone" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                Téléphone
              </label>
              <input
                id="modal-reg-phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400"
                placeholder="+212 6XX XXX XXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-reg-password" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                  Mot de passe
                </label>
                <input
                  id="modal-reg-password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="modal-reg-confirmPassword" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                  Confirmer
                </label>
                <input
                  id="modal-reg-confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 mt-1"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Création...</span>
                </div>
              ) : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Déjà un compte ?{' '}
              <button 
                onClick={() => {
                  onClose();
                  onSwitchToLogin?.();
                }} 
                className="text-red-600 hover:text-red-700 font-bold ml-1"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
