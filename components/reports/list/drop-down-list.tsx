import React, { useState, useEffect } from 'react';
import { CodeBlock } from '../../copy-box/copy';
import '@/envConfig'

const address: string = process.env.SERVER || '192.168.0.1';
// Data interfaces
interface IItem {
    first: string;
    second: string;
}

interface IGroupItem {
    hour: string;
    items: IItem[];
}

interface IDayGroup {
    day: string;
    groupItems: IGroupItem[];
}
interface IMonthGroup {
    month: string;
    dayGroups: IDayGroup[];
}

function checkIfCurrentMonth(month: string) {
    const monthsInSpanish = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    // Get the current month index (0 = January) and convert to Spanish month
    const currentMonthInSpanish = monthsInSpanish[new Date().getMonth()];
  
    return month.toLowerCase() === currentMonthInSpanish;
}
// MonthGroup component (top level)
const MonthGroup: React.FC<{ month: string, dayGroups: IDayGroup[] }> = ({ month, dayGroups }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (checkIfCurrentMonth(month)) {
          setIsExpanded(true);
        }
      }, [month]);
      
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    

    return (
        <div className='flex flex-col-reverse mt-1'>
            <div 
                className={`cursor-pointer p-2 m-2 mb-1 rounded-full h-8 text-lg font-bold text-left ${isExpanded ? 'bg-blue-300 border-blue-300' : 'bg-blue-500 border-blue-500'} hover:border-blue-700`} 
                onClick={toggleExpand}>
                {month}
            </div>
            {isExpanded && (
                <div className="ml-14 m-2 flex flex-col-reverse">
                    {dayGroups.map((dayGroup, index) => (
                        <DayGroup key={index} day={dayGroup.day} groupItems={dayGroup.groupItems} />
                    ))}
                    <button className='bg-blue-500 border border-blue-500 rounded-full font-medium text-md w-full m-2 mt-1 p-2 hover:border-blue-700' onClick={toggleExpand}>
                        ⬇️ cerrar {month}
                    </button>
                </div>
            )}
        </div>
    );
};

// DayGroup component (second level)
const DayGroup: React.FC<{ day: string, groupItems: IGroupItem[] }> = ({ day, groupItems }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='flex flex-col-reverse mt-1'>
            <div className={`cursor-pointer p-2 m-2 mb-1 rounded-full h-8 text-lg ${isExpanded ? 'bg-blue-300 border-blue-300' : 'bg-blue-500 border-blue-500'} hover:border-blue-700`} onClick={toggleExpand}>
                {day}
            </div>
            
            {isExpanded && (
                <div className="ml-14 m-2 flex flex-col-reverse">
                    {groupItems.map((groupItem, index) => (
                        <GroupItem key={index} hour={groupItem.hour} items={groupItem.items} />
                    ))}
                    <button className='bg-blue-500 border border-blue-500 rounded-full font-medium text-md w-full m-2 mt-1 p-2 hover:border-blue-700' onClick={toggleExpand}>
                        ⬇️ cerrar {day}
                    </button>
                </div>
            )}
        </div>
    );
};

// GroupItem component (third level)
const GroupItem: React.FC<{ hour: string, items: IItem[] }> = ({ hour, items }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='flex flex-col-reverse mt-1 '>
           <div className={`cursor-pointer p-2 m-2 mb-1 rounded-full h-8 text-lg ${isExpanded ? 'bg-blue-300 border-blue-300' : 'bg-blue-500 border-blue-500'} hover:border-blue-700`} onClick={toggleExpand}>
                {hour}
            </div>
            {isExpanded && (
                <div className="ml-6">
                    {items.map((item, index) => (
                        <section key={index} className='flex flex-col-reverse ml-4'>
                            <div className='flex flex-col md:md:flex-row items-center'>
                                <CodeBlock code={item.first.toString()} />
                                <CodeBlock code={item.second.toString()} />
                            </div>
                            <button className='bg-blue-500 border border-blue-500 rounded-full font-medium text-md w-full m-2 mt-1 p-2 hover:border-blue-700' onClick={toggleExpand}>
                                ⬇️ cerrar {hour}
                            </button>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main component that renders the whole structure
export const TrafficReportDropDown: React.FC = () => {
    const [monthData, setMonthData] = useState<IMonthGroup[]>([]);

    useEffect(() => {
        // Fetch initial data from /api/traffic
        async function fetchInitialData() {
            try {
                const response = await fetch('/api/traffic');
                setMonthData(await response.json());
            } catch (error) {
                console.error('Error fetching initial traffic data:', error);
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
        };

        // Cleanup WebSocket connection on component unmount
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className='flex flex-col-reverse'>
            {monthData.map((monthGroup, index) => (
                <MonthGroup key={index} month={monthGroup.month} dayGroups={monthGroup.dayGroups} />
            ))}
        </div>
    );
};