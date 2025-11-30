'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

interface InactivityModalProps {
  timeoutMinutes?: number;
}

const InactivityModal = ({ timeoutMinutes = 5 }: InactivityModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const t = useTranslations('Components.Modals.InactivityModal');

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
    ];

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(
        () => {
          setShowModal(true);
        },
        timeoutMinutes * 60 * 1000,
      );
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    resetTimer();

    // Clean up event listeners on unmount
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeoutMinutes]);

  const refreshPage = () => {
    window.location.reload();
    setShowModal(false);
  };

  const dismissModal = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed-top vh-100 w-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '35rem' }}
        role="document"
      >
        <div
          className="modal-content border-0 shadow-lg bg-white"
          style={{ borderRadius: '15px', overflow: 'hidden' }}
        >
          <div className="modal-header bg-primary text-white text-center justify-content-center py-4 border-0">
            <div
              className="d-flex flex-column align-items-center w-100"
              style={{ padding: '20px' }}
            >
              <div className="d-flex justify-content-center mb-3">
                <div
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                  style={{ width: '60px', height: '60px' }}
                >
                  <i className="bi bi-arrow-clockwise fs-3 text-primary"></i>
                </div>
              </div>
              <h3 className="modal-title fs-4 fw-bold mb-0">
                {t('update_available')}
              </h3>
            </div>
          </div>

          <div
            className="modal-body px-4 py-5 text-center p-20"
            style={{ padding: '20px' }}
          >
            <div
              className="mb-4 position-relative"
              style={{ height: '120px', padding: '20px' }}
            >
              <img
                src="/img/general/refresh-page.svg"
                alt="Refresh page"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>

            <p className="text-muted mb-4">{t('inactive_message')}</p>

            <div className="d-flex justify-content-center gap-2 mb-10">
              <button
                onClick={refreshPage}
                className="btn btn-outline-secondary px-4"
              >
                {t('refresh_page')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactivityModal;
