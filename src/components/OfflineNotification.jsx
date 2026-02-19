import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const OfflineNotification = () => {
  const { t } = useTranslation('common');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineMessage(true);
      // Hide online message after 3 seconds
      setTimeout(() => setShowOnlineMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineMessage(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showOnlineMessage) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transition-transform duration-300 ${
        isOnline ? 'translate-y-0' : 'translate-y-0'
      }`}
    >
      {!isOnline ? (
        <div className="bg-slate-800 text-white px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
            <span className="font-medium text-sm">
              {t('offline.title')}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {t('offline.message')}
          </p>
        </div>
      ) : showOnlineMessage ? (
        <div className="bg-emerald-600 text-white px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium text-sm">{t('online.title')}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OfflineNotification;
