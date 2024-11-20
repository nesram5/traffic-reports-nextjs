"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody, Input, Button, Link, Checkbox, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import DefaultLayout from "@/layouts/default";
import { useRouter } from "next/router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
  
      if (!response.ok) {
        throw new Error(response.statusText);
      }
  
      const result = await response.json();
  
      if (result.success) {
        console.log("Login successful");
        router.push("/config-page");
      } else {
        console.error("Login failed:", result.message);
        onOpen();
      }
    } catch (error) {
      console.error("An error occurred during login", error);
      onOpen();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col gap-1 items-center">
            <h1 className="text-2xl font-bold">¡Bienvenido!</h1>
            <p className="text-sm text-default-500">Por favor ingresa tus credenciales</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="username"
                label="Usuario"
                placeholder="Ingresa el nombre de usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Contraseña"
                placeholder="Ingresa la contraseña"
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-between items-center">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                >
                  Recuerdame
                </Checkbox>
              </div>
              <Button type="submit" color="primary" className="w-full">
                Sign In
              </Button>
            </form>
          </CardBody>
        </Card>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            <ModalHeader>Contraseña incorrecta</ModalHeader>
            <ModalBody>
              <p>Verifica que tus credenciales sean correctas.</p>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onOpenChange}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  )
}

