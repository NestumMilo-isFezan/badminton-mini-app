import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useId } from "react";

type Option = {
    value: string;
    label: string;
    sublabel?: string;
    description?: string;
};

type RadioCardGroupProps = {
    options: Option[];
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    orientation?: "vertical" | "horizontal";
};

export function RadioCardGroup({
    options,
    value,
    onValueChange,
    disabled,
    className,
    orientation = "vertical"
}: RadioCardGroupProps) {
    const id = useId();

    return (
        <RadioGroup
            className={cn(
                "grid",
                orientation === "horizontal" && "grid-cols-1 md:grid-cols-2",
                className
            )}
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
        >
            {options.map((option) => (
                <div
                    key={option.value}
                    className={cn(
                        "border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none",
                        "transition-colors duration-200 hover:bg-muted/50",
                        "cursor-pointer"
                    )}
                >
                    <RadioGroupItem
                        value={option.value}
                        id={`${id}-${option.value}`}
                        aria-describedby={`${id}-${option.value}-description`}
                        className="order-1 after:absolute after:inset-0"
                    />
                    <div className="grid grow gap-2">
                        <Label
                            htmlFor={`${id}-${option.value}`}
                            className="cursor-pointer"
                        >
                            {option.label}{" "}
                            {option.sublabel && (
                                <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                                    ({option.sublabel})
                                </span>
                            )}
                        </Label>
                        {option.description && (
                            <p
                                id={`${id}-${option.value}-description`}
                                className="text-muted-foreground text-xs"
                            >
                                {option.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </RadioGroup>
    );
}
