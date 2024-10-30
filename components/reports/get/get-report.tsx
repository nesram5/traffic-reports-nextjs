import React, { useState, useEffect } from 'react';
import { CodeBlock } from '../../copy-box/copy';

export const GetReport: React.FC = () => {
    const [progress, setProgress] = useState<number>(0);
    const [simpleResult, setSimpleResult] = useState<string>('');
    const [detailedResult, setDetailedResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const handleStart = () => {
        setLoading(true);
        setSimpleResult('  Cargando el reporte... ');
        setDetailedResult('Por favor espere 30 sec');
        setProgress(0);

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
            }
        }, 30); // Update every 600 ms for a 60-second total duration

        fetch('/api/get-report-zabbix')
            .then(response => response.json())
            .then(data => {
                setProgress(100);
                setSimpleResult(data.message.simpleResult); 
                setDetailedResult(data.message.detailedResult); 
                setLoading(false);
            })
            .catch(error => {
                setProgress(50); 
                console.error('Error:', error);
                setSimpleResult('Error fetching data.');
                setDetailedResult('');
                setLoading(false);
            });
    };

    useEffect(() => {
        handleStart(); 
    }, []);

    return (
        <div className="mt-5 p-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                {/* Display the results in CodeBlock components */}
                <CodeBlock code={simpleResult} />
                <CodeBlock code={detailedResult} />
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
