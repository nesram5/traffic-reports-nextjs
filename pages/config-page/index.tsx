"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import AceEditor from "react-ace";
import DefaultLayout from "@/layouts/default";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

export default function DocsPage() {
  const [jsonContent, setJsonContent] = useState("");

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

  const handleEditorChange = (newValue: string) => {
    setJsonContent(newValue);
  }

  const handleTest = () => {
    // Implement test logic here
    console.log("Testing edited JSON:", jsonContent);
  }

  const handleSubmit = async () => {
    // Implement submit logic here
    console.log("Submitting edited JSON:", jsonContent);
    //Replace this with actual API call
    await fetch("/api/push-list-devices-zabbix", {
      method: "POST",
       headers: { "Content-Type": "application/json" },
      body: jsonContent
     })
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
        <div className="w-1/6 bg-gray-100 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Left Column</h3>
          <div className="space-y-2">
            <Button size="sm" color="primary" className="w-full" onClick={fetchZabbixfile} >Editar archivo Zabbix_devices</Button>
            <Button size="sm" color="primary" className="w-full"onClick={fetchSnmpfile} >Editar archivo SNMP_devices</Button>
            <Button size="sm" color="primary" className="w-full">Demo Link 3</Button>
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
            <Button color="secondary" onClick={handleTest}>Test</Button>
            <Button color="primary" onClick={handleSubmit}>Submit</Button>
          </div>
        </div>

        <div className="w-1/6 bg-gray-100 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Right Column</h3>
          <div className="space-y-2">
            <Button size="sm" color="primary" className="w-full">Demo Link 4</Button>
            <Button size="sm" color="primary" className="w-full">Demo Link 5</Button>
            <Button size="sm" color="primary" className="w-full">Demo Link 6</Button>
          </div>
        </div>
      </div>
    </div>
    </DefaultLayout>
  )
}