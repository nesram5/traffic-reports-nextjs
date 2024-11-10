"use client";
import { useState } from 'react';
import { CodeBlock } from '@/components/copy';
import { type IItem } from '@/lib/types';

interface GroupItemProps {
  hour: string;
  items: IItem[];
}

export function GroupItem({ hour, items }: GroupItemProps) {
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
        {hour}
      </button>
      
      {isExpanded && (
        <div className="ml-6">
          {items.map((item, index) => (
            <section key={index} className="flex flex-col-reverse ml-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <CodeBlock code={item.first.toString()} />
                <CodeBlock code={item.second.toString()} />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-md w-full m-2 mt-1 p-2 transition-colors"
                onClick={() => setIsExpanded(false)}
              >
                ⬇️ cerrar {hour}
              </button>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}