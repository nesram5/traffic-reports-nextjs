import { useState, useEffect } from 'react';
import { Button, Card} from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/copy';
import { DateSearchComponent } from '@/components/search-component';
import { IYearGroup, IItem } from '@/lib/types';



export default function TimeContentViewer() {
  const [data, setData] = useState<IYearGroup[]>([]);
  const [first, setFirst ] = useState<string | undefined >(undefined);
  const [second, setSecond ] = useState<string | undefined >(undefined);  
  const [hour, setHour ] = useState<string>('');
  const [day, setDay ] = useState<string>('');
  const [month, setMonth ] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [searching, setSerching] = useState<boolean>(false);
  const [value, setValue] = useState<IItem>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
  });
  const [currentItems, setCurrentItems] = useState<IItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  const getFirstValue = (data: IYearGroup[]): { first: string, second: string } | null => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }
    const lastYearGroup = data[data.length - 1];
    if (!lastYearGroup || !Array.isArray(lastYearGroup.monthGroups) || lastYearGroup.monthGroups.length === 0) {
      return null;
    }
    
    //Save the year name for the H1
    setYear(lastYearGroup.year);

    const lastMonthGroup = lastYearGroup.monthGroups[lastYearGroup.monthGroups.length - 1];
    if (!lastMonthGroup || !Array.isArray(lastMonthGroup.dayGroups) || lastMonthGroup.dayGroups.length === 0) {
      return null;
    }
    //Save the month name for the H1
    setMonth(lastMonthGroup.month);

    const lastDayGroup = lastMonthGroup.dayGroups[lastMonthGroup.dayGroups.length - 1];
    if (!lastDayGroup || !Array.isArray(lastDayGroup.groupItems) || lastDayGroup.groupItems.length === 0) {
      return null;
    }
    //Save the day number for the H1
    setDay(lastDayGroup.day);
    
    const lastGroupItem = lastDayGroup.groupItems[lastDayGroup.groupItems.length - 1];
    if (!lastGroupItem || !Array.isArray(lastGroupItem.items) || lastGroupItem.items.length === 0) {
      return null;
    }

    //Save the hour name for the H1
    setHour(lastGroupItem.hour);

    const firstItem = lastGroupItem.items[0];
    if (!firstItem) {
      return null;
    }
    return { first: firstItem.first, second: firstItem.second };
  };

  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/traffic');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const updatedData: IYearGroup[] | null = await response.json();
        if (!updatedData) {
          throw new Error('No data was returned from the API');
        }
        setData(updatedData);
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
  }, []);
  
  useEffect(() => {
    const values = getFirstValue(data);
    setFirst(values?.first);
    setSecond(values?.second)
  }, [data]);


  
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, currentItems.length - 1));
  };

  const handleSearch = (
  ) => {
    let yearGroups = data
    // Step 1: Find the year group that matches the search year
    const yearGroup = yearGroups.find(yg => yg.year === searchParams.year);
    if (!yearGroup) {
      return; // or return an empty array, depending on your use case
    }
     //Save the year name for the H1
     setYear(yearGroup.year);
  
    // Step 2: Find the month group that matches the search month
    const monthGroup = yearGroup.monthGroups.find(mg => mg.month === searchParams.month);
    if (!monthGroup) {
      return;
    }
    //Save the month name for the H1
    setMonth(monthGroup.month);
  
    // Step 3: Find the day group that matches the search day
    const dayGroup = monthGroup.dayGroups.find(dg => dg.day === searchParams.day);
    if (!dayGroup) {
      return;
    }
    //Save the day name for the H1
    setDay(dayGroup.day);
  
    // Step 4: Find the group item that matches the search hour
    const groupItem = dayGroup.groupItems.find(gi => gi.hour === searchParams.hour);
    if (!groupItem) {
      return;
    }
    //Save the hour name for the H1
    setHour(groupItem.hour);

    const items = groupItem.items[0];
    setSerching(true);
    setValue(items);
  }

  const handleResetSearch = () => {
    setSearchParams( {year: '',
      month: '',
      day: '',
      hour: ''});
      
    const values = getFirstValue(data);
    setFirst(values?.first);
    setSecond(values?.second)
    setSerching(false);

  }
  return (    
    <main className="flex-1 p-6 flex flex-col items-center ">   
    <h1 className="text-3xl font-bold mb-6">Reporte de tráfico correspondiente al</h1>
    <h2 className="text-2xl italic mb-6"> {day} de {month} del {year} a las {hour}</h2>

    <div className="max-w-6xl mx-auto p-4">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div className="relative flex items-center justify-center gap-4 mb-8">
          <Button
            isIconOnly
            variant="light"
            onClick={handlePrevious}
            className="absolute left-0"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex place-items-start gap-4 px-12">
            {!searching && (            
              <>
                <CodeBlock code={first || 'No content available'} />
                <CodeBlock code={second || 'No content available'} />
              </>
            )}
            {searching && (            
              <>
                <CodeBlock code={value?.first || 'No content available'} />
                <CodeBlock code={value?.second || 'No content available'} />
              </>
            )}
          </div>

          <Button
            isIconOnly
            variant="light"
            onClick={handleNext}
            className="absolute right-0"
            disabled={currentIndex === currentItems.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
      <Card className="p-4 w-9/12">
        <div className='relative flex items-center justify-center'>
          <DateSearchComponent searchParams={searchParams} setSearchParams={setSearchParams} yearGroups={data} />    
          <Button
                className='m-2'
                color="primary"
                onPress={handleSearch}
              >
                Buscar
          </Button>
          <Button
                className='m-2'
                color="danger"
                onPress={handleResetSearch}
              >
                Reset
          </Button>
        </div>
      </Card>
    </div>    
    </main>
  );
}
