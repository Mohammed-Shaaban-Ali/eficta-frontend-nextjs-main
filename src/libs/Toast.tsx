import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 5000,
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          padding: '12px 20px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        // Customize specific toast types
        success: {
          duration: 3000,
          style: {
            background: 'rgba(40, 167, 69, 0.85)',
            backdropFilter: 'blur(8px)',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: 'rgba(220, 53, 69, 0.85)',
            backdropFilter: 'blur(8px)',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: 'rgba(108, 117, 125, 0.85)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    />
  );
}
