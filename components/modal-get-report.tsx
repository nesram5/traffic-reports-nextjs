import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {GetReport} from "@/components/get-report";

export const ModalGetReport: React.FC<{ children: string}> = ({ children}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  return (
    <>
      <Button color="secondary" onPress={onOpen}>{children}</Button>
      <Modal className="overflow-y-scroll max-h-screen" size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader >{'Reporte de tráfico hora actual'}</ModalHeader>
          <ModalBody>
            <GetReport/>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onOpenChange}>
              Close
            </Button>            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

