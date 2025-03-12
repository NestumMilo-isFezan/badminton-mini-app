"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

// Memoized options arrays to prevent recreation on each render
const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
const minutesOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

export function DateTimePicker({
    value,
    onChange,
    disabled
}: DateTimePickerProps) {
    // Single state object to reduce state updates
    const [state, setState] = React.useState(() => {
        const date = value ? new Date(value) : new Date()
        return {
            selectedDate: date,
            hours: format(date, "HH"),
            minutes: format(date, "mm"),
            isCalendarOpen: false,
            isTimeOpen: false
        }
    })

    // Memoized handler for date updates
    const handleDateChange = React.useCallback((date: Date | undefined) => {
        if (!date) return

        const newDate = new Date(date)
        newDate.setHours(Number.parseInt(state.hours, 10))
        newDate.setMinutes(Number.parseInt(state.minutes, 10))

        // Convert to ISO string while preserving timezone
        const localISOString = new Date(
            newDate.getTime() - (newDate.getTimezoneOffset() * 60000)
        ).toISOString()

        setState(prev => ({
            ...prev,
            selectedDate: newDate,
            isCalendarOpen: false
        }))

        onChange?.(localISOString)
    }, [state.hours, state.minutes, onChange])

    // Memoized handler for time updates
    const handleTimeChange = React.useCallback((type: 'hours' | 'minutes', value: string) => {
        setState(prev => {
            const newDate = new Date(prev.selectedDate)
            if (type === 'hours') {
                newDate.setHours(Number.parseInt(value, 10))
            } else {
                newDate.setMinutes(Number.parseInt(value, 10))
            }

            // Call onChange with the new date inside setState callback
            onChange?.(newDate.toISOString())

            return {
                ...prev,
                [type]: value,
                selectedDate: newDate,
                isTimeOpen: false
            }
        })
    }, [onChange])

    // Update internal state when value prop changes
    React.useEffect(() => {
        if (value) {
            const newDate = new Date(value)
            setState(prev => ({
                ...prev,
                selectedDate: newDate,
                hours: format(newDate, "HH"),
                minutes: format(newDate, "mm")
            }))
        }
    }, [value])

    // Memoized time selector component
    const TimeSelector = React.memo(() => (
        <div className="flex gap-2">
            {[
                { label: 'Hours', value: state.hours, options: hoursOptions },
                { label: 'Minutes', value: state.minutes, options: minutesOptions }
            ].map(({ label, value, options }) => (
                <div key={label} className="flex flex-col gap-2">
                    <p className="text-sm font-medium">{label}</p>
                    <Select
                        value={value}
                        onValueChange={(newValue) =>
                            handleTimeChange(label.toLowerCase() as 'hours' | 'minutes', newValue)
                        }
                    >
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder={label} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>
    ))

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Popover
                open={state.isCalendarOpen}
                onOpenChange={(open) => setState(prev => ({ ...prev, isCalendarOpen: open }))}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal sm:w-[240px]",
                            !state.selectedDate && "text-muted-foreground"
                        )}
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {state.selectedDate ? format(state.selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={state.selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
                <Popover
                    open={state.isTimeOpen}
                    onOpenChange={(open) => setState(prev => ({ ...prev, isTimeOpen: open }))}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal sm:w-[120px]",
                                !state.selectedDate && "text-muted-foreground"
                            )}
                            disabled={disabled}
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            {state.selectedDate ?
                                format(state.selectedDate, "HH:mm") :
                                <span>Set time</span>
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                        <TimeSelector />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
