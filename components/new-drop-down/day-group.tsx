import React, { useState } from 'react';
import { Card, CardHeader, Button,  } from "@nextui-org/react";
import { IDayGroup, IItem } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import GroupItem from './group-item';

interface Props {
  dayGroup: IDayGroup;
  onSelectItem: (item: IItem) => void;
}

const DayGroup: React.FC<Props> = ({ dayGroup, onSelectItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-2 bg-blue-800">
      <CardHeader className="p-3">
        <Button
          color="primary"
          onPress={() => setIsExpanded(!isExpanded)}
          className="w-full p-0 justify-between"
        >
          <span className="text-white text-lg font-semibold">Day {dayGroup.day}</span>
          {isExpanded ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <div className="p-3 pt-0 bg-blue-800">
          <div className="grid grid-cols-3 gap-1">
            {dayGroup.groupItems.map((groupItem, index) => (
              <GroupItem key={index} groupItem={groupItem} onSelectItem={onSelectItem} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DayGroup;