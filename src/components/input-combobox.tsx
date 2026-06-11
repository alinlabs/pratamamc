import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface ComboBoxProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function ComboBox({ options, value, onChange, placeholder, required }: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousValueRef = useRef(value || '');
  const previousLabelRef = useRef('');

  useEffect(() => {
    // If the external value changes closely to a known option, set input value to that label
    // or if it's a custom value, just set it to custom value.
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
      setInputValue(selectedOption.label);
    } else {
      setInputValue(value || '');
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (isOpen) {
          // If input is empty, restore previous value
          if (inputValue === '') {
            const oldOpt = options.find(opt => opt.value === previousValueRef.current);
            if (oldOpt) {
              setInputValue(oldOpt.label);
              onChange(oldOpt.value);
            } else {
              setInputValue(previousLabelRef.current || '');
              onChange(previousValueRef.current || '');
            }
          } else {
            // Keep the typed custom value
            const matched = options.find(opt => opt.label.toLowerCase() === inputValue.toLowerCase());
            if (matched) {
              setInputValue(matched.label);
              onChange(matched.value);
            } else {
              onChange(inputValue);
            }
          }
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, inputValue, options, value, onChange]);

  const handleFocus = () => {
    if (!isOpen) {
      previousValueRef.current = value || '';
      const selectedOption = options.find(opt => opt.value === value);
      previousLabelRef.current = selectedOption ? selectedOption.label : (value || '');
    }
    setInputValue('');
    setIsOpen(true);
  };

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(inputValue.toLowerCase()) || 
    opt.value.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          required={required}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={handleFocus}
          placeholder={placeholder}
          onClick={handleFocus}
          className="w-full px-4 py-3 pr-10 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all"
        />
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={() => {
            if (isOpen) {
              // trigger close restoration
              if (inputValue === '') {
                const oldOpt = options.find(opt => opt.value === previousValueRef.current);
                if (oldOpt) {
                  setInputValue(oldOpt.label);
                  onChange(oldOpt.value);
                } else {
                  setInputValue(previousLabelRef.current || '');
                  onChange(previousValueRef.current || '');
                }
              }
              setIsOpen(false);
            } else {
              handleFocus();
            }
          }}
        >
          <ChevronDown className="w-5 h-5 text-stone-400" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 flex items-center gap-3 text-stone-700 transition-colors"
                onClick={() => {
                  if (opt.value === value) {
                    setInputValue('');
                    onChange('');
                  } else {
                    setInputValue(opt.label);
                    onChange(opt.value);
                  }
                  setIsOpen(false);
                }}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${opt.value === value ? 'border-[#DCAF43] bg-[#DCAF43]/10' : 'border-stone-300'}`}>
                  {opt.value === value && (
                    <div className="w-2 h-2 rounded-full bg-[#DCAF43]" />
                  )}
                </div>
                <span className={opt.value === value ? 'font-medium text-[#DCAF43]' : ''}>{opt.label}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-stone-500 italic">
              Opsi tidak ditemukan, data "{inputValue}" akan ditambahkan sebagai input baru.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
