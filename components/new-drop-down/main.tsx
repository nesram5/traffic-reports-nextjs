import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { IMonthGroup, IItem } from '@/lib/types';
import MonthGroup from './month-group';
import Item from './item';


export const NewDropDown: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthData, setMonthData] = useState<IMonthGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const openModal = (item: IItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
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
        const updatedData: IMonthGroup[] | null = await response.json();
        if (!updatedData) {
          throw new Error('No data was returned from the API');
        }
        setMonthData(updatedData);
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
  }, [setLoading, setError, setMonthData]); // Added setLoading, setError, and setMonthData to the dependency array

  return (
    <div className="p-4 min-h-screen">      
      <div className="flex flex-wrap justify-center gap-4">
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {!loading && !error && monthData.map((monthGroup, index) => (
          <MonthGroup key={index} monthGroup={monthGroup} onSelectItem={openModal} />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Event Details</ModalHeader>
              <ModalBody>
                {selectedItem && (
                  <Item item={selectedItem} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
