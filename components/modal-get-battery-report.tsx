import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { GetBatteryReport } from "@/components/get-battery-report";

export const ModalGetBatteryReport: React.FC<{ children: string}> = ({ children}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  return (
    <>
    <div className="p-2">
      <Button color="secondary" onPress={onOpen}>{children}</Button>
      <Modal className="overflow-y-scroll max-h-screen" size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader >{'Reporte de baterias hora actual'}</ModalHeader>
          <ModalBody>
            <GetBatteryReport/>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onOpenChange}>
              Close
            </Button>            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
    </>
  );
};

