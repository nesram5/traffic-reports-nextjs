import React from 'react';
import { IItem } from '@/lib/types';
import { CodeBlock } from '../copy';
interface Props {
  item: IItem;
}

const Item: React.FC<Props> = ({ item }) => {
  return (
    <div>
     <CodeBlock code={item.first.toString()} />
     <CodeBlock code={item.second.toString()} />
    </div>
  );
};

export default Item;