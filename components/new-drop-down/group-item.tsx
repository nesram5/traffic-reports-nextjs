import React from 'react';
import { Button } from "@nextui-org/react";
import { IGroupItem, IItem } from '@/lib/types';

interface Props {
  groupItem: IGroupItem;
  onSelectItem: (item: IItem) => void;
}

const GroupItem: React.FC<Props> = ({ groupItem, onSelectItem }) => {
  const handleSelect = () => {
    if (groupItem.items.length > 0) {
      onSelectItem(groupItem.items[0]);
    }
  };

  return (
    <Button
      color="primary"
      onPress={handleSelect}
      className="bg-blue-300 p-2 rounded-sm flex items-center justify-center hover:bg-blue-200"
    >
      <span className="text-blue-800 text-sm font-medium">{groupItem.hour}:00</span>
    </Button>
  );
};

export default GroupItem;