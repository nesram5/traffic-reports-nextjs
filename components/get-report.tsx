import React, { useState, useEffect } from 'react';
import { CodeBlock } from '@/components/copy';

export const GetReport: React.FC<{ test?: boolean }> = ({ test = false }) => {   
    const [progress, setProgress] = useState<number>(0);
    const [simpleResult, setSimpleResult] = useState<string>('');
    const [detailedResult, setDetailedResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const handleStart = () => {
        setLoading(true);
        setSimpleResult('  Cargando el reporte... ');
        setDetailedResult('Por favor espere 30 seg');
        setProgress(0);

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
            }
        }, 30); // Update every 600 ms for a 60-second total duration
        if (test) {
            fetch('/api/get-report-zabbix-test')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProgress(100);
                if (data && data.message) {
                    setSimpleResult(data.message.simpleResult); 
                    setDetailedResult(data.message.detailedResult); 
                } else {
                    setSimpleResult('Error fetching data.');
                    setDetailedResult('');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error.message);
                setSimpleResult('Error fetching data.');
                setDetailedResult('');
                setLoading(false);
            });
        } else {  
            fetch('/api/get-report-zabbix')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setProgress(100);
                    if (data && data.message) {
                        setSimpleResult(data.message.simpleResult); 
                        setDetailedResult(data.message.detailedResult); 
                    } else {
                        setSimpleResult('Error fetching data.');
                        setDetailedResult('');
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                    setSimpleResult('Error fetching data.');
                    setDetailedResult('');
                    setLoading(false);
                });
            };
    };


    useEffect(() => {
        handleStart(); 
    }, []);

    return (
        <div className="mt-5 p-4">
          <div className="flex place-items-start gap-4 px-12">
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
