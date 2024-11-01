"use client"

import { useState } from 'react';
import DefaultLayout from "@/layouts/default";
import { GetReport } from "@/components/reports/get/get-report";
import { TrafficReportDropDown } from '@/components/reports/list/drop-down-list'
import { Button } from "@nextui-org/react"

export default function Component() {
  const [showGetReport, setShowGetReport] = useState(false);
  return (
    <DefaultLayout>
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-1">
        <main className="flex-1 p-6 flex flex-col items-center ">
          <h1 className="text-3xl font-bold mb-6">Reportes de tráfico por hora</h1>
          {showGetReport && (
                  <div>
                    <GetReport />
                  </div>
                )}
            <section className="w-full flex flex-col-reverse">
          <TrafficReportDropDown />
          </section>
        </main>

        <aside className="w-64 p-6 ">
          <h2 className="text-xl font-semibold mb-4">Generar nuevo reporte</h2>
          <p className="mb-4">
            ¿Deseas generar un reporte en este momento? Pulsa aqui
          </p>
          <Button onClick={() => setShowGetReport(true)} color="primary">
          Generar ahora
          </Button>
        </aside>
      </div>
    </div>
    </DefaultLayout>
  )
}