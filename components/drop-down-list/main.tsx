import React, { useState, useEffect } from 'react';
import { IMonthGroup } from '@/lib/types';
import { MonthGroup } from './month-group';

export const DropDownList: React.FC = () => {
  const [monthData, setMonthData] = useState<IMonthGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/traffic');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const updatedData: IMonthGroup[] = await response.json();
        setMonthData(updatedData);
      } catch (error) {
        console.error('Error fetching updated traffic data:', error);
        setError('Failed to fetch updated data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Poll the server every 60 seconds (60000 ms)
    const intervalId = setInterval(fetchLiveData, 60000);

    // Fetch data initially when the component mounts
    fetchLiveData();

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Removed monthData from the dependency array

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