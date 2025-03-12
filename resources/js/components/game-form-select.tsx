import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Option {
    id: number;
    name: string;
}

interface GameFormSelectProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export function GameFormSelect({
    label,
    options,
    value,
    onChange,
    error,
    placeholder = "Select an option",
    disabled = false,
    required = false,
    className = "",
}: GameFormSelectProps) {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem 
                            key={option.id} 
                            value={option.id.toString()}
                        >
                            {option.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <InputError message={error} />}
        </div>
    );
}