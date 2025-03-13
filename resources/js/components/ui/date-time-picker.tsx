import * as React from "react"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { useDateTime } from "@/hooks/use-date-time"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
}

function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hours, minutes] = value ? value.split(":") : ["00", "00"]

  const hours24 = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  )

  const minutes60 = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  )

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    onChange(`${newHours}:${newMinutes}`)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[120px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "00:00"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="grid grid-cols-2 divide-x">
          {/* Hours */}
          <div>
            <div className="border-b bg-muted/50 px-2 py-1.5 text-center text-sm font-medium text-muted-foreground">
              Hour
            </div>
            <div className="max-h-[200px] overflow-y-auto overscroll-contain">
              {hours24.map((hour) => (
                <div
                  key={hour}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-center text-sm transition-colors",
                    "hover:bg-muted/50",
                    hours === hour && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTimeChange(hour, minutes)}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>

          {/* Minutes */}
          <div>
            <div className="border-b bg-muted/50 px-2 py-1.5 text-center text-sm font-medium text-muted-foreground">
              Minute
            </div>
            <div className="max-h-[200px] overflow-y-auto overscroll-contain">
              {minutes60.map((minute) => (
                <div
                  key={minute}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-center text-sm transition-colors",
                    "hover:bg-muted/50",
                    minutes === minute && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTimeChange(hours, minute)}
                >
                  {minute}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface PopoverDateTimePickerProps {
  date?: Date | string | null
  startTime?: string
  endTime?: string
  onDateChange?: (date: Date) => void
  onStartTimeChange?: (time: string) => void
  onEndTimeChange?: (time: string) => void
  showEndTime?: boolean
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function DateTimePicker({
  date,
  startTime = "",
  endTime = "",
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  showEndTime = true,
  className,
  placeholder = "Select date and time",
  disabled = false,
}: PopoverDateTimePickerProps) {
  const { toLocalDate, toUTCString } = useDateTime()
  const [isOpen, setIsOpen] = React.useState(false)

  // Convert input date to local date using the hook
  const initialDate = React.useMemo(() => {
    if (date instanceof Date) {
      return date
    }
    return toLocalDate(date)
  }, [date])

  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate)
  const [selectedStartTime, setSelectedStartTime] = React.useState(startTime)
  const [selectedEndTime, setSelectedEndTime] = React.useState(endTime)
  const [currentMonth, setCurrentMonth] = React.useState(initialDate)

  // Update state when props change
  React.useEffect(() => {
    if (date) {
      const newDate = date instanceof Date ? date : toLocalDate(date)
      setSelectedDate(newDate)
      setCurrentMonth(newDate)
    }
  }, [date])

  React.useEffect(() => {
    setSelectedStartTime(startTime)
  }, [startTime])

  React.useEffect(() => {
    setSelectedEndTime(endTime)
  }, [endTime])

  // Format the date in a human-readable way
  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    }

    return date.toLocaleDateString("en-US", {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatButtonText = () => {
    const dateText = formatDate(selectedDate)
    if (selectedStartTime) {
      if (showEndTime && selectedEndTime) {
        return `${dateText} | ${selectedStartTime} - ${selectedEndTime}`
      }
      return `${dateText} | ${selectedStartTime}`
    }
    return dateText
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const prevMonth = new Date(prev)
      prevMonth.setMonth(prev.getMonth() - 1)
      return prevMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const nextMonth = new Date(prev)
      nextMonth.setMonth(prev.getMonth() + 1)
      return nextMonth
    })
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth)
    newDate.setDate(day)
    setSelectedDate(newDate)
  }

  const handleSave = () => {
    // Combine date and time
    const dateWithTime = new Date(selectedDate)
    if (selectedStartTime) {
      const [hours, minutes] = selectedStartTime.split(':')
      dateWithTime.setHours(parseInt(hours), parseInt(minutes))
    }

    onDateChange?.(dateWithTime)
    onStartTimeChange?.(selectedStartTime)
    if (showEndTime) {
      onEndTimeChange?.(selectedEndTime)
    }
    setIsOpen(false)
  }

  const isToday = (day: number) => {
    const today = new Date()
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return checkDate.toDateString() === today.toDateString()
  }

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const today = new Date()

    const days = []

    // Previous month days (grayed out)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 text-center text-sm text-muted-foreground/30">
          ·
        </div>
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isSelected = date.toDateString() === selectedDate.toDateString()
      const isPast = date < new Date(today.setHours(0, 0, 0, 0))

      days.push(
        <div
          key={`day-${day}`}
          className={cn(
            "relative p-2 text-center text-sm transition-colors",
            isToday(day) && "font-bold",
            isSelected && "bg-primary text-primary-foreground rounded-full",
            !isSelected && !isPast && "hover:bg-muted/50 cursor-pointer rounded-full",
            isPast && "text-muted-foreground/50 cursor-not-allowed",
            !isPast && "cursor-pointer"
          )}
          onClick={() => !isPast && handleDateSelect(day)}
        >
          {day}
          {isToday(day) && (
            <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
          )}
        </div>
      )
    }

    return days
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatButtonText() || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* Time Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="mb-2 block">Start Time</Label>
              <TimePicker
                value={selectedStartTime}
                onChange={setSelectedStartTime}
              />
            </div>
            {showEndTime && (
              <div className="flex-1">
                <Label className="mb-2 block">End Time</Label>
                <TimePicker
                  value={selectedEndTime}
                  onChange={setSelectedEndTime}
                />
              </div>
            )}
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>

          {/* Save Button */}
          <Button className="w-full" onClick={handleSave}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
