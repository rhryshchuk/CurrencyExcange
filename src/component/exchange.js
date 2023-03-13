import * as React from "react";
import { useState, useEffect, useRef } from 'react';

export default function Exchange() {
    const [latestRates, setLatestRates] = useState(null);
    const [baseCurrency, setBaseCurrency] = useState('EUR');
    const dataFetchedRef = useRef(false);

    const [right, setRightInput] = useState({
        rightInput: '',
        updated: true
    });

    const [left, setLeftInput] = useState({
       leftInput: '',
       updated: true
   });

   const [rightCurrency, setRightCurrency] = useState('EUR');
   const [leftCurrency, setLeftCurrency] = useState('USD');
   const [rate, setRate] = useState(1);



  const fetchExchangeRates = (baseCurrency) => {
  fetch(`https://api.apilayer.com/exchangerates_data/latest?base=${baseCurrency}`, {
              method: "GET",
              mode: "cors",
              headers: {
                    "Content-Type": "application/json",
                     'apikey': '6LdWKmQ2tgi97gU1dZ7nDTl7jfc9xqiz',
                  }
            })
            .then(async response => {
                        const data = await response.json();
                        if (!response.ok) {
                            const error = (data && data.message) || response.statusText;
                            return Promise.reject(error);
                        }
                        setLatestRates(data);
                    })
            .catch(error => {
                  console.error('There was an error!', error);
              });
  }

useEffect(() => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      fetchExchangeRates('EUR');
}, [baseCurrency]);
useEffect(() => {
    if (latestRates){
        if (leftCurrency === baseCurrency){
            setRate(1 / latestRates.rates[rightCurrency]);
        } else {
            setRate(latestRates.rates[leftCurrency])
        }
    }
}, [latestRates]);

useEffect(() => {
    if (right.updated) return
    setLeftInput({ leftInput:Number(Number(right.rightInput * rate).toFixed(6)), updated: true });
}, [right.rightInput, rate]);
useEffect(() => {
    if (left.updated) return
    setRightInput({ rightInput:Number(Number(left.leftInput / rate).toFixed(6)), updated: true });
}, [left.leftInput]);

  function handleRightInputChange(event) {
      setRightInput({ rightInput:event.target.value, updated: false });
    }
  function handleLeftInputChange(event) {
      setLeftInput({ leftInput:event.target.value, updated: false });
    }
function handleRightCurrencyChange(event) {
    if (event.target.value === leftCurrency){
        setLeftCurrency(rightCurrency);
        setRate(1 / rate);
        setRightInput({rightInput:right.rightInput, updated: false });
    } else if (event.target.value !== baseCurrency && leftCurrency !== baseCurrency){
            setBaseCurrency(event.target.value);
            fetchExchangeRates(event.target.value);
    } else {
        setRate(latestRates.rates[event.target.value]);
    }
    setRightCurrency(event.target.value);
  }
 function handleLeftCurrencyChange(event) {
     if (event.target.value === rightCurrency){
         setRightCurrency(leftCurrency);
         setRate(1 / rate);
     } else if (event.target.value !== baseCurrency && rightCurrency !== baseCurrency){
        setBaseCurrency(event.target.value);
        fetchExchangeRates(event.target.value);
     } else {
        setRate(latestRates.rates[event.target.value]);
     }
     setLeftCurrency(event.target.value);
   }

  return (
    <div className="d__flex main">
    <select name="base_ccy" id="base_ccy" value={rightCurrency} onChange={handleRightCurrencyChange}>
    {latestRates && Object.keys(latestRates.rates).map((i) =>
        <option key={i} value={i}>{i}</option>
      )}
    </select>
      <input type="number" name="base_ccy_val" value={right.rightInput} onChange={handleRightInputChange}/>
  <select name="ccy" id="ccy" value={leftCurrency} onChange={handleLeftCurrencyChange}>
          {latestRates && Object.keys(latestRates.rates).map((i) =>
                  <option key={i} value={i}>{i}</option>
                )}
      </select>
      <input type="number" name="ccy_val" value={left.leftInput} onChange={handleLeftInputChange}/>
    </div>
  );
}