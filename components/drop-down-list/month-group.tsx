"use client";
import { useState, useEffect } from 'react';
import { DayGroup } from '@/components/drop-down-list/day-group';
import { type IDayGroup } from '@/lib/types';
import { checkIfCurrentMonth } from '@/lib/utils';

interface MonthGroupProps {
  month: string;
  dayGroups: IDayGroup[];
}

export function MonthGroup({ month, dayGroups }: MonthGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (checkIfCurrentMonth(month)) {
      setIsExpanded(true);
    }
  }, [month]);

  return (
    <div className="flex flex-col-reverse mt-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-2 m-2 mb-1 rounded-full h-8 text-lg font-bold text-left transition-colors ${
          isExpanded
            ? 'bg-blue-300 hover:bg-blue-400'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {month}
      </button>
      
      {isExpanded && (
        <div className="ml-14 m-2 flex flex-col-reverse">
          {dayGroups.map((dayGroup, index) => (
            <DayGroup key={index} {...dayGroup} />
          ))}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-md w-full m-2 mt-1 p-2 transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            ⬇️ cerrar {month}
          </button>
        </div>
      )}
    </div>
  );
}