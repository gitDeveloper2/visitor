"use client"
import React, { useEffect, useState } from 'react';
const Metrics: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('https://count-man-production.up.railway.app/count');
        const data = await response.json();
        
        setCount(data.count);
      } catch (error) {
        console.error('Error fetching count:', error);
      }
    };

    fetchCount();
  }, []);

  return (
    <div>
      <h1>Current Count: {count}</h1>
    </div>
  );
};

export default Metrics;
