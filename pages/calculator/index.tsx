'use client'

import { useState, useEffect } from 'react';
import DefaultLayout from "@/layouts/default";
import { Input, Button, Card, CardBody, CardHeader } from '@nextui-org/react'

export default function IndexPage() {
  const [bcvUsdValue, setBcvUsdValue] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState('');
  const [result1, setResult1] = useState<number | null>(null);
  const [result2, setResult2] = useState<number | null>(null);
  const [totalResult, setTotalResult] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/get-usd-bcv')
      .then(response => response.json())
      .then(data => {
        setBcvUsdValue(Number(data.usdValue));
      })
      .catch(error => {
        console.error('Error fetching USD value:', error);
      });
  }, []);

  const handleCalculate = () => {
    const userValue = parseFloat(usdValue);
    if (isNaN(userValue)) {
      alert('Please enter a valid number');
      return;
    }

    const result1 = userValue * (bcvUsdValue || 0);
    const result2 = result1 * 0.16;
    const totalResult = result1 + result2;
    setResult1(result1);
    setResult2(result2);    
    setTotalResult(totalResult);
  }

  return (
    <DefaultLayout>
     <section className='flex flex-col items-center justify-center'>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0">
          <h1 className="text-2xl font-bold">Calculadora USD a BCV + IGTF</h1>
          <p className="text-sm text-default-500">Tasa del dia: {bcvUsdValue || 'N/A'} Bs</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            label="Ingrese monto en USD"
            placeholder="0.00"
            value={usdValue}
            onChange={(e) => setUsdValue(e.target.value)}
            type="number"
            step="0.01"
          />
          <Button color="primary" onPress={handleCalculate}>
            Calculate
          </Button>
          {totalResult !== null && (
            <div className="text-center">
              <p className="text-sm font-extralight">Valor Neto</p>
              <p className="text-base font-extralight">{result1?.toFixed(2)} Bs</p>
              <p className="text-sm font-extralight">Impuesto IGTF 16%:</p>
              <p className="text-base font-extralight">{result2?.toFixed(2)} Bs</p>
              <p className="text-2xl font-semibold">Total</p>
              <p className="text-2xl font-bold">{totalResult.toFixed(2)} Bs</p>
              <p className="text-sm font-extralight my-1.5">Nota importante: Si se paga una parte en USD y otra en bolívares, el IGTF se aplica sobre el monto total en USD.</p>
            </div>
          )}
        </CardBody>
      </Card>
      </section>
    </DefaultLayout>
  )
}