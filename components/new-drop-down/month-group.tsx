import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { IMonthGroup, IItem } from '@/lib/types'; 
import { ChevronDown, ChevronUp } from 'lucide-react';
import DayGroup from './day-group';

interface Props {
  monthGroup: IMonthGroup;
  onSelectItem: (item: IItem) => void;
}

const MonthGroup: React.FC<Props> = ({ monthGroup, onSelectItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-64">
      <CardHeader className="bg-blue-800 p-4">
        <Button
          color="primary"
          onPress={() => setIsExpanded(!isExpanded)}
          className="w-full p-0 justify-between"
        >
          <span className="text-white text-xl font-bold">{monthGroup.month}</span>
          {isExpanded ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardBody className="p-2 bg-blue-800">
          {monthGroup.dayGroups.map((dayGroup, index) => (
            <DayGroup key={index} dayGroup={dayGroup} onSelectItem={onSelectItem} />
          ))}
        </CardBody>
      )}
    </Card>
  );
};

export default MonthGroup;