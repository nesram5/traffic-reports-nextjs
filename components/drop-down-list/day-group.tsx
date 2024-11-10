"use client";
import { useState } from 'react';
import { GroupItem } from './group-item';
import { type IGroupItem } from '@/lib/types';

interface DayGroupProps {
  day: string;
  groupItems: IGroupItem[];
}

export function DayGroup({ day, groupItems }: DayGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col-reverse mt-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-2 m-2 mb-1 rounded-full h-8 text-lg transition-colors ${
          isExpanded
            ? 'bg-blue-300 hover:bg-blue-400'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {day}
      </button>
      
      {isExpanded && (
        <div className="ml-14 m-2 flex flex-col-reverse">
          {groupItems.map((groupItem, index) => (
            <GroupItem key={index} {...groupItem} />
          ))}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-md w-full m-2 mt-1 p-2 transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            ⬇️ cerrar {day}
          </button>
        </div>
      )}
    </div>
  );
}