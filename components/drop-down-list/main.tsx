import React, { useState, useEffect } from 'react';
import { IMonthGroup } from '@/lib/types';
import { MonthGroup } from '@/components/drop-down-list/month-group';

const address: string = process.env.NEXT_PUBLIC_API_URL || 'localhost';

export const DropDownList: React.FC = () => {
  const [monthData, setMonthData] = useState<IMonthGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data from /api/traffic
    async function fetchInitialData() {
      try {
        const response = await fetch('/api/traffic');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: IMonthGroup[] = await response.json();
        setMonthData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial traffic data:', error);
        setError('Failed to fetch initial data. Please try again later.');
        setLoading(false);
      }
    }

    fetchInitialData();

    // Establish a WebSocket connection for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${address}/api/traffic-updates`);

    socket.onmessage = (event) => {
      const updatedData: IMonthGroup[] = JSON.parse(event.data);
      setMonthData(updatedData);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error. Please try again later.');
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className='flex flex-col-reverse'>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {!loading && !error && monthData.map((monthGroup, index) => (
        <MonthGroup key={index} month={monthGroup.month} dayGroups={monthGroup.dayGroups} />
      ))}
    </div>
  );
};