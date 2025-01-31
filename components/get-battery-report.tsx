import React, { useState, useEffect } from 'react';
import { CodeBlock } from '@/components/copy';

export const GetBatteryReport: React.FC<{ test?: boolean }> = ({ test = false }) => {   
    const [progress, setProgress] = useState<number>(0);
    const [batteryResult, setBatteryResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const handleStart = () => {
        setLoading(true);
        setBatteryResult('  Cargando el reporte... ');
        setProgress(0);

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
            }
        }, 30); // Update every 600 ms for a 60-second total duration
         
        fetch('/api/get-report-battery-zabbix')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProgress(100);
                if (data && data.message) {
                    setBatteryResult(data.message.batteryResult); 
                } else {
                    setBatteryResult('Error fetching data.');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error.message);
                setBatteryResult('Error fetching data.');
                setLoading(false);
            });
            
    };


    useEffect(() => {
        handleStart(); 
    }, []);

    return (
        <div className="mt-5 p-4">
          <div className="flex place-items-start gap-4 px-12">
                {/* Display the results in CodeBlock components */}
                <CodeBlock code={batteryResult} />
            </div>
    
            {/* Conditionally render the progress bar */}
            {progress < 100 && (
                <div className="w-full my-4">
                    <div
                        className="h-5 bg-green-500 rounded-lg transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
};
