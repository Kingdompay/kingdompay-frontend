import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrencyState] = useState(() => {
        return localStorage.getItem('currency') || 'KES';
    });
    const [exchangeRate, setExchangeRate] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await response.json();

                if (data && data.rates) {
                    // Store rates in localStorage for offline use or fallback
                    localStorage.setItem('exchange_rates', JSON.stringify(data.rates));

                    if (currency === 'KES') {
                        setExchangeRate(data.rates.KES);
                    } else {
                        setExchangeRate(1);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                // Fallback to cached rates
                const cachedRates = JSON.parse(localStorage.getItem('exchange_rates'));
                if (cachedRates && currency === 'KES') {
                    setExchangeRate(cachedRates.KES);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, [currency]);

    const setCurrency = (newCurrency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    const formatCurrency = (amount) => {
        const value = amount * exchangeRate;
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
    };

    const convertAmount = (amount) => {
        return amount * exchangeRate;
    };

    const convertToUSD = (amount) => {
        if (currency === 'USD') return amount;
        return amount / exchangeRate;
    };

    const value = {
        currency,
        setCurrency,
        exchangeRate,
        formatCurrency,
        convertAmount,
        convertToUSD,
        loading
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyContext;
