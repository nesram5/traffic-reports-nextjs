import { useState, useEffect } from 'react';
import {
  Card, Button, Dropdown, DropdownTrigger,
  DropdownMenu, DropdownItem
} from '@nextui-org/react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { CodeBlock } from '@/components/copy';

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

interface IYearGroup {
  year: string;
  monthGroups: IMonthGroup[];
}

export default function TimeContentViewer() {
  const [data, setData] = useState<IYearGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [hours, setHours] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
  });
  const [currentItems, setCurrentItems] = useState<IItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (data.length > 0) {
      setYears(data.map(yearGroup => yearGroup.year));
    }
  }, [data]);

  useEffect(() => {
    const selectedYear = data.find(item => item.year === searchParams.year);
    if (selectedYear) {
      setMonths([...new Set(selectedYear.monthGroups.map(monthGroup => monthGroup.month))]);
    } else {
      setMonths([]);
    }
  }, [data, searchParams.year]);

  useEffect(() => {
    const selectedYear = data.find(item => item.year === searchParams.year);
    const selectedMonth = selectedYear?.monthGroups.find(item => item.month === searchParams.month);
    if (selectedMonth) {
      setDays([...new Set(selectedMonth.dayGroups.map(dayGroup => dayGroup.day))]);
    } else {
      setDays([]);
    }
  }, [data, searchParams.year, searchParams.month]);

  useEffect(() => {
    const selectedYear = data.find(item => item.year === searchParams.year);
    const selectedMonth = selectedYear?.monthGroups.find(item => item.month === searchParams.month);
    const selectedDay = selectedMonth?.dayGroups.find(item => item.day === searchParams.day);
    if (selectedDay) {
      setHours([...new Set(selectedDay.groupItems.map(groupItem => groupItem.hour))]);
    } else {
      setHours([]);
    }
  }, [data, searchParams.year, searchParams.month, searchParams.day]);

  useEffect(() => {
    setSearchParams(prev => ({ ...prev, month: '', day: '', hour: '' }));
  }, [searchParams.year]);

  useEffect(() => {
    setSearchParams(prev => ({ ...prev, day: '', hour: '' }));
  }, [searchParams.month]);

  useEffect(() => {
    setSearchParams(prev => ({ ...prev, hour: '' }));
  }, [searchParams.day]);

useEffect(() => {
  if (data.length > 0) {
    const mostRecent = getMostRecentItem(data);
    if (mostRecent) {
      const { year, month, day, hour } = mostRecent;
      setSearchParams({ year, month, day, hour });
      const items = getItemsForSearchParams(data, { year, month, day, hour });
      setCurrentItems(items);
      setCurrentIndex(0);
    }
  }
}, [data, getItemsForSearchParams, setSearchParams, setCurrentItems, setCurrentIndex]);

  useEffect(() => {
    const items = getItemsForSearchParams(data, searchParams);
    setCurrentItems(items);
    setCurrentIndex(0);
  }, [data, searchParams]);


  function getMostRecentItem(data: IYearGroup[]) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const monthNames = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const currentMonthStr = monthNames[currentMonth];
    const currentHourStr = currentHour.toString().padStart(2, '0') + ':' + currentMinute.toString().padStart(2, '0');

    let yearGroup = data.find(yg => yg.year === currentYear.toString());
    if (!yearGroup) {
      yearGroup = data[data.length - 1];
      if (!yearGroup) {
        return null;
      }
    }

    let monthGroup = yearGroup.monthGroups.find(mg => mg.month === currentMonthStr);
    if (!monthGroup) {
      monthGroup = yearGroup.monthGroups[yearGroup.monthGroups.length - 1];
      if (!monthGroup) {
        return null;
      }
    }

    let dayGroup = monthGroup.dayGroups.find(dg => dg.day === currentDay.toString());
    if (!dayGroup) {
      dayGroup = monthGroup.dayGroups[monthGroup.dayGroups.length - 1];
      if (!dayGroup) {
        return null;
      }
    }

    let hourGroup = dayGroup.groupItems.find(hg => hg.hour === currentHourStr);
    if (!hourGroup) {
      hourGroup = dayGroup.groupItems[dayGroup.groupItems.length - 1];
      if (!hourGroup) {
        return null;
      }
    }

    return {
      year: yearGroup.year,
      month: monthGroup.month,
      day: dayGroup.day,
      hour: hourGroup.hour,
      items: hourGroup.items
    };
  }

  function getItemsForSearchParams(
    data: IYearGroup[],
    searchParams: { year: string; month: string; day: string; hour: string }
  ) {
    let result: any = data;
    const { year, month, day: dayParam, hour } = searchParams;
  
    if (year) {
      result = result.filter((y: IYearGroup) => y.year === year);
    }
    if (month && result.length > 0) {
      result = (result as IYearGroup[]).flatMap((y: IYearGroup) =>
        y.monthGroups.filter((m: IMonthGroup) => m.month === month)
      ) as IMonthGroup[];
    } else if (!month && result.length > 0) {
      result = (result as IYearGroup[]).flatMap((y: IYearGroup) => y.monthGroups) as IMonthGroup[];
    }
    if (dayParam && result.length > 0) {
      result = (result as IMonthGroup[]).flatMap((m: IMonthGroup) =>
        m.dayGroups.filter((d: IDayGroup) => d.day === dayParam)
      ) as IDayGroup[];
    } else if (!dayParam && result.length > 0) {
      result = (result as IMonthGroup[]).flatMap((m: IMonthGroup) => m.dayGroups) as IDayGroup[];
    }
    if (hour && result.length > 0) {
      result = (result as IDayGroup[]).flatMap((d: IDayGroup) =>
        d.groupItems.filter((g: IGroupItem) => g.hour === hour)
      ) as IGroupItem[];
    } else if (!hour && result.length > 0) {
      result = (result as IDayGroup[]).flatMap((d: IDayGroup) => d.groupItems) as IGroupItem[];
    }
    return (result as IGroupItem[]).flatMap((g: IGroupItem) => g.items || []);
  };
  
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, currentItems.length - 1));
  };

  const handleSearch = () => {
    console.log('Searching for:', searchParams);
  };

  return (
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

          <div className="flex gap-4 px-12">
            {currentItems.length > 0 ? (
              <>
                <CodeBlock code={currentItems[currentIndex]?.first || 'No content available'} />
                <CodeBlock code={currentItems[currentIndex]?.second || 'No content available'} />
              </>
            ) : (
              <p>No items found for the selected parameters.</p>
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

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-center">Buscar una fecha específica</h2>
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" endContent={<ChevronDown className="w-4 h-4" />}>
                {searchParams.year !== undefined ? searchParams.year.toString() : 'Year'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Year selection"
              onAction={(key) => setSearchParams({ ...searchParams, year: key ? key.toString() : '' })}
            >
              {years.map(year => (
                <DropdownItem key={year} value={year.toString()}>
                  {year}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" endContent={<ChevronDown className="w-4 h-4" />}>
                {searchParams.month || 'Month'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Month selection"
              onAction={(key) => setSearchParams({ ...searchParams, month: key.toString() })}
            >
              {months.map(month => (
                <DropdownItem key={month} value={month}>
                  {month}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" endContent={<ChevronDown className="w-4 h-4" />}>
                {searchParams.day || 'Day'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Day selection"
              onAction={(key) => setSearchParams({ ...searchParams, day: key.toString() })}
            >
              {days.map(day => (
                <DropdownItem key={day} value={day}>
                  {day}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" endContent={<ChevronDown className="w-4 h-4" />}>
                {searchParams.hour || 'Hour'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Hour selection"
              onAction={(key) => setSearchParams({ ...searchParams, hour: key.toString() })}
            >
              {hours.map(hour => (
                <DropdownItem key={hour} value={hour}>
                  {hour}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button color="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Card>
    </div>
  );
}
