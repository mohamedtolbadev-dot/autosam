import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useTranslation } from 'react-i18next';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { login, loading } = useCustomer();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = t('login.errors.emailRequired', 'Email requis');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = t('login.errors.emailInvalid', 'Email invalide');
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = t('login.errors.passwordRequired', 'Mot de passe requis');
        } else if (value.length < 8) {
          newErrors.password = t('login.errors.passwordMin', 'Au moins 8 caractères');
        } else if (!/(?=.*[a-zA-Z])/.test(value)) {
          newErrors.password = t('login.errors.passwordLetter', 'Doit contenir des lettres');
        } else if (!/(?=.*\d)/.test(value)) {
          newErrors.password = t('login.errors.passwordNumber', 'Doit contenir des chiffres');
        } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
          newErrors.password = t('login.errors.passwordSymbol', 'Doit contenir un symbole (!@#$...)');
        } else {
          delete newErrors.password;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAll = () => {
    const fields = ['email', 'password'];
    let isValid = true;
    fields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateAll()) {
      setGeneralError(t('login.errors.fixErrors', 'Veuillez corriger les erreurs'));
      return;
    }
    
    const result = await login(formData);
    
    if (result.success) {
      onClose();
      navigate('/my-bookings');
    } else {
      setGeneralError(result.error || t('login.error', 'Échec de la connexion'));
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
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
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
              {t('booking:login.title')}
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              {t('booking:login.subtitle')}
            </p>
          </div>

          {generalError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs animate-in slide-in-from-top-2">
              {generalError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="modal-email" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                {t('booking:login.fields.email')}
              </label>
              <input
                id="modal-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200'}`}
                placeholder={t('booking:login.fields.emailPlaceholder')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="modal-password" className="block text-xs font-medium text-slate-700 mb-1 ml-1">
                {t('booking:login.fields.password')}
              </label>
              <div className="relative">
                <input
                  id="modal-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 pr-10 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm placeholder:text-slate-400 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
              <p className="text-xs text-slate-500 mt-1 ml-1">
                {t('booking:login.fields.passwordHint')}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 mt-1"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('booking:login.loggingIn')}</span>
                </div>
              ) : t('booking:login.submit')}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              {t('booking:login.noAccount')}{' '}
              <button 
                onClick={() => {
                  onClose();
                  onSwitchToRegister?.();
                }} 
                className="text-red-600 hover:text-red-700 font-bold ml-1"
              >
                {t('booking:login.createAccount')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
