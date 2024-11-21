import { useState } from 'react';
import DefaultLayout from "@/layouts/default";
import { DropDownList } from '@/components/drop-down-list/main';
import { NewDropDown } from '@/components/new-drop-down/main';
import { ModalGetReport } from '@/components/modal-get-report';

export default function Component() {
  return (
    <DefaultLayout>
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-1">
        <main className="flex-1 p-6 flex flex-col items-center ">
          <h1 className="text-3xl font-bold mb-6">Reportes de tráfico por hora</h1>
           <section className="w-full flex-col-reverse">
          <DropDownList />
          </section>
        </main>

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