"use client"
import DefaultLayout from "@/layouts/default";
import React, { useState } from "react"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, Checkbox, Button, Textarea } from "@nextui-org/react"

export default function Component() {
  const [serialNumbers, setSerialNumbers] = useState("")
  const [vlanNumber, setVlanNumber] = useState("")
  const [gponNumber, setGponNumber] = useState("")
  const [bridgeMode, setBridgeMode] = useState(false)
  const [configOutput, setConfigOutput] = useState("")

  const generateConfig = () => {
    // This is a placeholder function. Replace with actual configuration generation logic.
    const config = `Configuration for:
VLAN: ${vlanNumber}
GPON: ${gponNumber}
Bridge Mode: ${bridgeMode ? "Yes" : "No"}
Serial Numbers:
${serialNumbers}
`
    setConfigOutput(config)
  }

  const copyConfig = () => {
    navigator.clipboard.writeText(configOutput)
      .then(() => alert("Configuration copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err))
  }

  return (
    <DefaultLayout>
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">ONU Configuration Generator</h1>
        
        <div className="space-y-6">
          <Textarea
            label="Enter Serial Numbers (one per line)"
            placeholder="Enter serial numbers here..."
            value={serialNumbers}
            onChange={(e) => setSerialNumbers(e.target.value)}
            rows={10}
          />
          
          <Input
            type="number"
            label="Enter VLAN Number"
            placeholder="Enter VLAN number"
            value={vlanNumber}
            onChange={(e) => setVlanNumber(e.target.value)}
          />
          
          <Input
            type="number"
            label="Enter GPON Number"
            placeholder="Enter GPON number"
            value={gponNumber}
            onChange={(e) => setGponNumber(e.target.value)}
          />
          
          <Checkbox
            isSelected={bridgeMode}
            onValueChange={setBridgeMode}
          >
            Put all ONU"s in bridge mode?
          </Checkbox>
          
          <Button color="primary" onPress={generateConfig}>
            Generate Configuration
          </Button>
        </div>

        {configOutput && (
          <div className="mt-6 relative">
            <Button size="sm" color="secondary" onPress={copyConfig} className="absolute top-2 right-2 z-10">
              Copy
            </Button>
            <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap overflow-x-auto">
              {configOutput}
            </pre>
          </div>
        )}
      </main>
    </div>
    </DefaultLayout>
  )
}