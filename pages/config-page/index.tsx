"use client";

import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {GetReport} from "@/components/get-report";
import DefaultLayout from "@/layouts/default";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

export default function DocsPage() {
  const [jsonContent, setJsonContent] = useState("");
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    // Simulating fetching JSON from backend
    const fetchJson = async () => {
      // Replace this with actual API call
      const response = await fetch("/api/get-list-devices-zabbix");
      const data = await response.json();
      setJsonContent(JSON.stringify(data, null, 2));
    }

    fetchJson();
  }, [])

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleSubmission = async (onClose: () => void) => {
    try {
      await handleSubmit();
      onClose();
    } catch (err) {
      setError(`An error occurred during submission. ${err}`);
    }
  };

  const handleTestError = async () => {
    try {
      await handleTest();
    } catch (err) {
      setError(`An error occurred during test. ${err}`);
    }
  };
  
  const handleTest = async () => {
    if (!jsonContent) {
      setError("Error: jsonContent is null or undefined");
      return;
    }
  
    try {
      let jsonContent_checked: string;
      try {
        jsonContent_checked = JSON.stringify(JSON.parse(jsonContent), null, 2);
      } catch (error) {
        setError("Error: jsonContent is not a valid JSON format");
        return;
      }
  
      const response = await fetch("/api/test-zabbix-device-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonContent_checked
      });
  
      if (!response.ok) {
        setError(`Error: Failed to submit data. ${response.statusText}`);
        return;
      }
  
      console.log("Data submitted successfully");
    } catch (error) {
      setError(`Error: An unexpected error occurred during submission. ${error}`);
    }
  };
  const handleEditorChange = (newValue: string | null) => {
    if (newValue === null) {
      console.error("Error: newValue is null");
      return;
    }

    try {
      setJsonContent(newValue);
    } catch (error) {
      console.error("Error: Failed to set jsonContent", error);
    }
  }


  const handleSubmit = async () => {
    try {
      if (!jsonContent) {
        console.error("Error: jsonContent is null or undefined");
        return;
      }
      
      console.log("Submitting edited JSON:", jsonContent);
      
      const response = await fetch("/api/push-zabbix-device-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonContent
      });
      
      if (!response.ok) {
        console.error("Error: Failed to submit data", response.statusText);
      } else {
        console.log("Data submitted successfully");
      }
    } catch (error) {
      console.error("Error: An unexpected error occurred during submission", error);
    }
  }
  
  const fetchZabbixfile = async () => {
    const response = await fetch("/api/get-list-devices-zabbix")
    const data = await response.json()
    setJsonContent(JSON.stringify(data, null, 2))
  }
  const fetchSnmpfile = async () => {
    const response = await fetch("/api/get-list-devices-snmp")
    const data = await response.json()
    setJsonContent(JSON.stringify(data, null, 2))
  }

  return (
    <DefaultLayout>
    <div className="flex flex-col h-screen">      
      <div className="flex flex-1">
        <div className="w-1/6 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">¿Que archivo deseas editar?</h3>
          <div className="space-y-2">
            <Button size="sm" color="primary" className="w-full" onClick={fetchZabbixfile} >Editar archivo Zabbix_devices</Button>            
            {//<Button size="sm" color="primary" className="w-full"onClick={fetchSnmpfile} >Editar archivo SNMP_devices</Button>
            }
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <AceEditor
            mode="json"
            theme="monokai"
            onChange={handleEditorChange}
            value={jsonContent}
            name="json-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              useWorker: false
            }}
            style={{ width: "100%", height: "calc(100vh - 200px)" }}
          />
          <div className="mt-4 space-x-4">
            <>
          <Button color="secondary" onPress={onOpen} onClick={handleTestError}>Modo Prueba</Button>
            <Modal className="overflow-y-scroll max-h-screen" size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                <ModalHeader>{error ? 'Error' : 'Modo Prueba'}</ModalHeader>
                <ModalBody className="overflow-y-scroll">
                  {error ? error : <GetReport test={true} />}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={() => { setError(null); onOpenChange(); }}>
                    Close
                  </Button>
                  {!error && (
                    <Button color="primary" onPress={() => handleSubmission(() => onOpenChange())}>
                      Guardar cambios
                    </Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
          </div>
        </div>        
      </div>
    </div>
    </DefaultLayout>
  )
}

