import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface ImageDropZoneProps {
    onImageSelect: (file: File) => void;
    currentImage?: string | null;
    disabled?: boolean;
    error?: string;
}

export function ImageDropZone({ onImageSelect, currentImage, disabled, error }: ImageDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files[0];

        if (imageFile && imageFile.type.startsWith('image/')) {
            onImageSelect(imageFile);
        }
    }, [disabled, onImageSelect]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    }, [onImageSelect]);

    return (
        <div className="grid gap-2">
            <div
                className={cn(
                    "relative group rounded-lg border-2 border-dashed transition-colors",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    error ? "border-destructive" : "",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Preview Image */}
                {currentImage && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">Drop new image or click to change</p>
                        </div>
                    </div>
                )}

                {/* Upload Placeholder */}
                {!currentImage && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Drag and drop your image here</p>
                        <p className="text-sm text-muted-foreground">or click to select a file</p>
                    </div>
                )}

                {/* Hidden File Input */}
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={disabled}
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}