import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

let deferredPrompt = null;

const InstallPrompt = () => {
  const { t, i18n } = useTranslation('common');
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstall(false);
      deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if prompt was shown before (stored preference)
    const installDismissed = localStorage.getItem('installDismissed');
    const dismissedTime = installDismissed ? parseInt(installDismissed) : 0;
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Show again after 1 day if dismissed
    if (deferredPrompt && (!dismissedTime || Date.now() - dismissedTime > oneDay)) {
      setShowInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt, try to show instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert(i18n.language === 'fr' 
          ? 'Sur iOS, appuyez sur le bouton Partager puis "Ajouter à l\'écran d\'accueil"'
          : 'On iOS, tap the Share button then "Add to Home Screen"');
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    deferredPrompt = null;
    setShowInstall(false);
  };

    const handleDismiss = () => {
    setShowInstall(false);
    localStorage.setItem('installDismissed', Date.now().toString());
  };

  // Show button in header if available but not shown as banner
  if (!showInstall && deferredPrompt && !isInstalled) {
    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>{t('install.app') || 'Install App'}</span>
      </button>
    );
  }

  if (!showInstall || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <img 
              src="/icons/icon_app.jpg" 
              alt="AutoSam" 
              className="w-10 h-10 rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <Download className="w-6 h-6 text-red-600 hidden" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              {t('install.title') || 'Install AutoSam App'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t('install.description') || 'Access quickly from home screen, even offline!'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleDismiss}
          className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {t('actions.later') || 'Later'}
        </button>
        <button
          onClick={handleInstallClick}
          className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
        >
          {t('install.button') || 'Install'}
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
export { deferredPrompt };
