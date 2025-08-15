'use client';

import { useEffect } from 'react';

const withMetrics = (WrappedComponent) => {
  return (props) => {
    useEffect(() => {
      const incrementMetrics = async () => {
        try {
          await fetch('https://count-man-production.up.railway.app/increment', {
            method: 'POST',
          });
        } catch (error) {
          console.error('Error incrementing metrics', error);
        }
      };

      incrementMetrics();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withMetrics;
