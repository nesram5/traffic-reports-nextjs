import {
    Card, Button, Dropdown, DropdownTrigger,
    DropdownMenu, DropdownItem
  } from '@nextui-org/react';
  import { ChevronDown } from 'lucide-react';
import { IYearGroup, IItem} from '@/lib/types';
  
  // Define the props for the component
  interface Props {
    searchParams: { year: string; month: string; day: string; hour: string };
    setSearchParams: (params: { year: string; month: string; day: string; hour: string }) => void;
    yearGroups: IYearGroup[];
  }
  
  export const DateSearchComponent: React.FC<Props> = ({
    searchParams,
    setSearchParams,
    yearGroups,
  }) => {
    // Function to get available years
    const getAvailableYears = () => yearGroups.map(yearGroup => yearGroup.year);
  
    // Function to get available months based on selected year
    const getAvailableMonths = () => {
      const selectedYearGroup = yearGroups.find(yg => yg.year === searchParams.year);
      return selectedYearGroup?.monthGroups.map(monthGroup => monthGroup.month) || [];
    };
  
    // Function to get available days based on selected year and month
    const getAvailableDays = () => {
      const selectedYearGroup = yearGroups.find(yg => yg.year === searchParams.year);
      if (!selectedYearGroup) return [];
      const selectedMonthGroup = selectedYearGroup.monthGroups.find(mg => mg.month === searchParams.month);
      return selectedMonthGroup?.dayGroups.map(dayGroup => dayGroup.day) || [];
    };
  
    // Function to get available hours based on selected year, month, and day
    const getAvailableHours = () => {
      const selectedYearGroup = yearGroups.find(yg => yg.year === searchParams.year);
      if (!selectedYearGroup) return [];
      const selectedMonthGroup = selectedYearGroup.monthGroups.find(mg => mg.month === searchParams.month);
      if (!selectedMonthGroup) return [];
      const selectedDayGroup = selectedMonthGroup.dayGroups.find(dg => dg.day === searchParams.day);
      return selectedDayGroup?.groupItems.map(groupItem => groupItem.hour) || [];
    };
  
    // Handlers for dropdown selections
    const handleYearSelect = (year: string) => {
      setSearchParams({ year, month: '', day: '', hour: '' });
    };
  
    const handleMonthSelect = (month: string) => {
      setSearchParams({ year: searchParams.year, month, day: '', hour: '' });
    };
  
    const handleDaySelect = (day: string) => {
      setSearchParams({ year: searchParams.year, month: searchParams.month, day, hour: '' });
    };
  
    const handleHourSelect = (hour: string) => {
      setSearchParams({ year: searchParams.year, month: searchParams.month, day: searchParams.day, hour });
    };
  
    return (
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-center">Buscar una fecha específica</h2>
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" endContent={<ChevronDown className="w-4 h-4" />}>
                {searchParams.year || 'Year'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Year selection"
              onAction={(key) => handleYearSelect(key as string)}
            >
              {getAvailableYears().map(year => (
                <DropdownItem key={year} value={year}>
                  {year}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
  
          <Dropdown>
            <DropdownTrigger>
            <Button 
            variant="bordered" 
            endContent={
              <ChevronDown 
                className={`w-4 h-4 ${searchParams.year ? '' : 'opacity-50'}`} 
              />
            } 
            disabled={!searchParams.year}
          >
                {searchParams.month || 'Month'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Month selection"
              onAction={(key) => handleMonthSelect(key as string)}
              hideEmptyContent={!searchParams.year}
            >
              {getAvailableMonths().map(month => (
                <DropdownItem key={month} value={month}>
                  {month}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
  
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" endContent={<ChevronDown className={`w-4 h-4" ${searchParams.month ? '' : 'opacity-50'}`} />} disabled={!searchParams.month}>
                {searchParams.day || 'Day'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              className='overflow-y-auto h-48'
              aria-label="Day selection"
              onAction={(key) => handleDaySelect(key as string)}
              hideEmptyContent	={!searchParams.month}
            >
              {getAvailableDays().map(day => (
                <DropdownItem key={day} value={day}>
                  {day}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
  
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" endContent={<ChevronDown className={`w-4 h-4" ${searchParams.day ? '' : 'opacity-50'}`} />} disabled={!searchParams.day}>
                {searchParams.hour || 'Hour'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
            className='overflow-y-auto h-48'
              aria-label="Hour selection"
              onAction={(key) => handleHourSelect(key as string)}
              hideEmptyContent	={!searchParams.day}
            >
              {getAvailableHours().map(hour => (
                <DropdownItem key={hour} value={hour}>
                  {hour}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </Card>
    );
  };
  