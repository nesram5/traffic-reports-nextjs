import { Button, Card} from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/copy';
import { DateSearchComponent } from '@/components/search-component';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
interface IDate {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export default function TimeContentViewer() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR<{
    message: string;
    date: string;
  }>('/api/traffic', fetcher);

  const [date, setDate] = useState<IDate | null>(
    null
  );

  const handleDate = (date: string) => {
    const [yearMonthDay, hour] = date.split(' ');
    const [year, month, day] = yearMonthDay.split('-');
    setDate({ year, month, day, hour });
  };
  
  useEffect(() => {
    if (data) {
      setLoading(false);
      handleDate(data.date);
    }
  }, [data]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  
  return (    
    <main className="flex-1 p-6 flex flex-col items-center ">   
    <h1 className="text-3xl font-bold mb-6">Reporte de tráfico y baterias correspondiente al</h1>
    {date && (
      <h2 className="text-2xl italic mb-6"> {date.day} de {date.month} del {date.year} a las {date.hour}</h2>
    )}
    

    <div className="max-w-6xl mx-auto p-4">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div className="relative flex items-center justify-center gap-4 mb-8">
          <Button
            isIconOnly
            variant="light"
            className="absolute left-0"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex place-items-start gap-4 px-12">
                       
              <>
                <CodeBlock code={data?.message || 'No content available'} />
                
              </>
            
              
          </div>

          <Button
            isIconOnly
            variant="light"
            className="absolute right-0"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
      
    </div>    
    </main>
  );
}