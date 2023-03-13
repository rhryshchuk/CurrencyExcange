import * as React from "react";
import { useState, useEffect, useRef } from 'react';
import "../App.css";

export default function Currency() {
    const [apiResponse, setApiResponse] = useState(null);
    const dataFetchedRef = useRef(false);

    const fetchData = () => {
        fetch('https://api.apilayer.com/exchangerates_data/latest?base=UAH', {
                    method: "GET",
                    mode: "cors",
                    headers: {
//                            "Content-Type": "application/json",
                             'apikey': '6LdWKmQ2tgi97gU1dZ7nDTl7jfc9xqiz',
                      }
                  })
                  .then(async response => {
                      const data = await response.json();
                      if (!response.ok) {
                          const error = (data && data.message) || response.statusText;
                          return Promise.reject(error);
                      }

                      setApiResponse(data);
                  })
                  .catch(error => {
                        console.error('There was an error!', error);
                  });
        }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        fetchData();
    }, []);
  return (
    <div className="App__header d__flex ">
      <div>
        Курс валют:
      </div>
      <div>
        {apiResponse && (`EUR - ${apiResponse.rates.EUR}  USD - ${apiResponse.rates.USD}`)}
      </div>
    </div>
  )
}