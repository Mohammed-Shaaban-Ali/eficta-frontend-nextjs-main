'use client';

import './loadingScreenStyles.css';
import { useEffect, useState } from 'react';
import { Airplane, Briefcase, Map, Compass, Palm } from './icons';
import { useTranslations } from 'next-intl';

const LoadingScreen = () => {
  const t = useTranslations('Components.Parts.LoadingScreen');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(t('discovering'));

  useEffect(() => {
    const texts = [
      t('discovering'),
      t('finding_deals'),
      t('preparing_journey'),
      t('almost_ready'),
    ];

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 3;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    // Change loading text periodically
    const textInterval = setInterval(() => {
      const currentIndex = texts.indexOf(loadingText);
      const nextIndex = (currentIndex + 1) % texts.length;
      setLoadingText(texts[nextIndex]);
    }, 3000);

    // Cleanup intervals
    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [loadingText, t]);

  // Prevent scrolling when loading screen is active
  useEffect(() => {
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';

    // Also disable scrolling on html element for better cross-browser support
    document.documentElement.style.overflow = 'hidden';

    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="loading-screen">
      <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
        <div className="loading-logo mb-4">
          <div className="globe-container">
            <div className="d-flex justify-content-center align-items-center">
              <img
                src="/img/logo/eficta.png"
                alt="logo icon"
                style={{ width: '100px' }}
              />
            </div>
          </div>
        </div>

        <h1 className="loading-title mb-3" style={{ color: '#104e3b' }}>
          EFICTA
        </h1>
        <p className="loading-subtitle mb-4" style={{ color: '#104e3b' }}>
          {loadingText}...
        </p>

        <div className="loading-progress-container mb-4">
          <div
            className="loading-progress-bar"
            style={{ width: `${progress}%`, backgroundColor: '#104e3b' }}
          ></div>
        </div>

        <div className="loading-icons">
          <div className="icon-container" style={{ color: '#104e3b' }}>
            <Briefcase />
          </div>
          <div className="icon-container" style={{ color: '#104e3b' }}>
            <Map />
          </div>
          <div className="icon-container" style={{ color: '#104e3b' }}>
            <Compass />
          </div>
          <div className="icon-container" style={{ color: '#104e3b' }}>
            <Palm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
