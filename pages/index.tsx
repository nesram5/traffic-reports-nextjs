import { useState } from 'react';
import DefaultLayout from "@/layouts/default";
import TimeContentViewer from '@/components/time-content-viewer';
import { ModalGetReport } from '@/components/modal-get-report';

export default function Component() {
  return (
    <DefaultLayout>
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1"> 
          <TimeContentViewer />
        <aside className="w-64 p-6 ">
          <h2 className="text-xl font-semibold mb-4">Generar nuevo reporte</h2>
          <p className="mb-4">
            ¿Deseas generar un reporte en este momento? Pulsa aqui
          </p>
          <ModalGetReport>Generar ahora</ModalGetReport>          
        </aside>
      </div>
    </div>
    </DefaultLayout>
  )
}