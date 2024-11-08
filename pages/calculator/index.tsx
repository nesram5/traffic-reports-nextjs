'use client'

import { useState, useEffect } from 'react';
import DefaultLayout from "@/layouts/default";
import { Input, Button, Card, CardBody, CardHeader, Checkbox } from '@nextui-org/react'

export default function IndexPage() {
  const [bcvUsdValue, setBcvUsdValue] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState('');
  const [bsAmount, setBsAmount] = useState('');
  const [result1, setResult1] = useState<number | null>(null);
  const [iva, setIva] = useState<number | null>(null);
  const [result3, setResult3] = useState<number | null>(null);
  const [partialBs, setPartialBs] = useState<number | null>(null);
  const [totalResult, setTotalResult] = useState<number | null>(null);
  const [parcialPay, setParcialPay] = useState<boolean>(false);

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
  const handleParcialPay = (isSelected: boolean) => {
    setParcialPay(isSelected)
  };
  const handleClear = () => {
      setResult1(null);
      setIva(null);
      setResult3(null);
      setTotalResult(null);
      setParcialPay(false);
      setUsdValue('');
      setBsAmount('');
      setPartialBs(null);
  };
  const handleCalculate = () => {
    const userValue = parseFloat(usdValue);
    if (isNaN(userValue)) {
      alert('Please enter a valid number');
      return;
    }
    if(parcialPay){
      const result1 = (userValue + Number(bsAmount)) * (bcvUsdValue || 0);    
      const partialBs = Number(bsAmount) * (bcvUsdValue || 0);        
      const iva = result1 * 0.16;     
      const resultUsd = (userValue + Number(bsAmount));
      const result3 = Number(bsAmount) * (bcvUsdValue || 0);
      const totalResult = result3 + iva;
      setResult1(resultUsd);
      setIva(iva);
      setResult3(result3);
      setTotalResult(totalResult);
      setPartialBs(partialBs);
    }
    else{
      const result1 = userValue * (bcvUsdValue || 0);
      const iva = result1 * 0.16;
      const totalResult = result1 + iva;
      setResult1(result1);
      setIva(iva);    
      setTotalResult(totalResult);
    }
  }

  return (
    <DefaultLayout>
     <section className='flex flex-col items-center justify-center'>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0">
          <h1 className="text-2xl font-bold m-4">Calculadora USD a BCV + IVA</h1>
          <p className="text-sm text-default-500">Tasa del dia: {bcvUsdValue || 'N/A'} Bs</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
        <Checkbox isSelected={parcialPay} onValueChange={handleParcialPay}>
          ¿Pago parcial en Bs?
          </Checkbox>
          {parcialPay && (
            <section>
               <Input
                  label="Ingrese monto a pagar en USD"
                  placeholder="0.00"
                  value={usdValue}
                  onChange={(e) => setUsdValue(e.target.value)}
                  type="number"
                  step="0.01"
                />
                <Input
                    className='my-2'
                    label="Ingrese monto a pagar en Bs expresado en USD"
                    placeholder="0.00"
                    value={bsAmount}
                    onChange={(e) => setBsAmount(e.target.value)}
                    type="number"
                    step="0.01"
                  />
            </section>
          )}
          {parcialPay === false && (
           <Input
            label="Ingrese monto en USD"
            placeholder="0.00"
            value={usdValue}
            onChange={(e) => setUsdValue(e.target.value)}
            type="number"
            step="0.01"
          />)}
          <section className='flex place-content-around'>
            <Button className='inline-flex' color="primary" onPress={handleCalculate}>
              Calcular
            </Button>
            <Button className='mx-1 inline-flex'  color="danger" onPress={handleClear}>
              Borrar
            </Button>
          </section>
          {(totalResult !== null && parcialPay) && (
            <div className="text-center">
              <p className="text-sm font-extralight">Total en USD</p>
              <p className="text-base font-extralight">{result1?.toFixed(2)} USD</p>
              <p className="text-sm font-extralight">Parte en BS + IVA 16%:</p>
              <p className="text-base font-extralight">{partialBs?.toFixed(2)} + {iva?.toFixed(2)} Bs</p>
              <p className="text-2xl font-semibold">Total a pagar en BS</p>
              <p className="text-2xl font-bold">{totalResult.toFixed(2)} Bs</p>
              <p className="text-sm font-extralight my-1.5">Nota importante: Si se paga una parte en USD y otra en bolívares, el IVA se aplica sobre el monto total en USD.</p>
            </div>
          )}
          {(totalResult !== null && parcialPay === false) &&  (
            <div className="text-center">
              <p className="text-sm font-extralight">Valor Neto</p>
              <p className="text-base font-extralight">{result1?.toFixed(2)} Bs</p>
              <p className="text-sm font-extralight">IVA 16%:</p>
              <p className="text-base font-extralight">{iva?.toFixed(2)} Bs</p>
              <p className="text-2xl font-semibold">Total</p>
              <p className="text-2xl font-bold">{totalResult.toFixed(2)} Bs</p>
              <p className="text-sm font-extralight my-1.5">Nota importante: Si se paga una parte en USD y otra en bolívares, el IVA se aplica sobre el monto total en USD.</p>
            </div>
          )}
        </CardBody>
      </Card>
      </section>
    </DefaultLayout>
  )
}