import React, { useState, useEffect } from 'react';
import { IMonthGroup } from '@/lib/types';
import { MonthGroup } from './month-group';

export const DropDownList: React.FC = () => {
  const [monthData, setMonthData] = useState<IMonthGroup[]>([]);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('/api/traffic');
        const updatedData: IMonthGroup[] = await response.json();
        setMonthData(updatedData);
      } catch (error) {
        console.error('Error fetching updated traffic data:', error);
      }
    };

    // Poll the server every 30 seconds (30000 ms)
    const intervalId = setInterval(fetchLiveData, 60000);

    // Fetch data initially when the component mounts
    fetchLiveData();

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Removed monthData from the dependency array

  return (
    <div className='flex flex-col-reverse'>
      {monthData.map((monthGroup, index) => (
        <MonthGroup key={index} month={monthGroup.month} dayGroups={monthGroup.dayGroups} />
      ))}
    </div>
  );
};