import React, { useState, useRef, useEffect } from 'react';

const ModernDatePicker = ({ value, onChange, label, placeholder = 'Select date', minDate, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value || '');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const pickerRef = useRef(null);

    useEffect(() => {
        if (value) setSelectedDate(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDisplayDate = (dateString) => {
        if (!dateString) return placeholder;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
        return days;
    };

    const handleDateSelect = (date) => {
        const dateString = date.toISOString().split('T')[0];
        setSelectedDate(dateString);
        onChange({ target: { value: dateString } });
        setIsOpen(false);
    };

    const isDateDisabled = (date) => {
        if (!minDate) return false;
        return date < new Date(minDate);
    };

    const isToday = (date) => date.toDateString() === new Date().toDateString();
    const isSelected = (date) => selectedDate && date.toDateString() === new Date(selectedDate).toDateString();

    const days = getDaysInMonth(currentMonth);
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div ref={pickerRef} className="relative">
            {label && <label className="block text-sm font-medium text-[#1A3F22] dark:text-[#E8F5E8] mb-2">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 rounded-xl bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] focus:border-[#6f9c16] outline-none transition-colors text-left flex items-center justify-between ${className}`}
            >
                <span className={selectedDate ? 'text-gray-900 dark:text-[#E8F5E8]' : 'text-gray-400 dark:text-gray-500'}>
                    {formatDisplayDate(selectedDate)}
                </span>
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-xl">calendar_today</span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-72 bg-white dark:bg-[#1A2E1D] rounded-xl shadow-2xl border border-gray-200 dark:border-[#2D4A32] p-2">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-[#243B28] rounded transition-colors border-none cursor-pointer">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-base">chevron_left</span>
                        </button>
                        <span className="font-semibold text-xs text-[#1A3F22] dark:text-[#E8F5E8]">{monthYear}</span>
                        <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-[#243B28] rounded transition-colors border-none cursor-pointer">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-base">chevron_right</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-[9px] font-medium text-gray-500 dark:text-gray-400 py-1">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0.5">
                        {days.map((date, index) => {
                            if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
                            const disabled = isDateDisabled(date);
                            const today = isToday(date);
                            const selected = isSelected(date);

                            return (
                                <button
                                    key={date.toISOString()}
                                    type="button"
                                    onClick={() => !disabled && handleDateSelect(date)}
                                    disabled={disabled}
                                    className={`aspect-square rounded text-[11px] font-medium transition-all border-none cursor-pointer ${disabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : ''} ${selected ? 'bg-[#6f9c16] text-white' : ''} ${!selected && !disabled ? 'hover:bg-gray-100 dark:hover:bg-[#243B28] text-gray-700 dark:text-gray-300' : ''} ${today && !selected ? 'ring-1 ring-[#6f9c16]' : ''}`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-[#2D4A32] flex gap-1">
                        <button type="button" onClick={() => { const today = new Date().toISOString().split('T')[0]; setSelectedDate(today); onChange({ target: { value: today } }); setIsOpen(false); }} className="flex-1 px-2 py-1 text-[10px] bg-gray-100 dark:bg-[#243B28] text-[#1A3F22] dark:text-[#E8F5E8] rounded hover:bg-gray-200 dark:hover:bg-[#2D4A32] transition-colors border-none cursor-pointer">Today</button>
                        <button type="button" onClick={() => { setSelectedDate(''); onChange({ target: { value: '' } }); setIsOpen(false); }} className="flex-1 px-2 py-1 text-[10px] bg-gray-100 dark:bg-[#243B28] text-[#1A3F22] dark:text-[#E8F5E8] rounded hover:bg-gray-200 dark:hover:bg-[#2D4A32] transition-colors border-none cursor-pointer">Clear</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModernDatePicker;
