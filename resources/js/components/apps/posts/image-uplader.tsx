import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X } from 'lucide-react';
import React from 'react';

interface ImageUploaderProps {
    id: string;
    preview: string | null;
    onChange: (file: File | null) => void;
    label?: string;
    note?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    id,
    preview,
    onChange,
    label = 'Gambar',
    note,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault();
        onChange(null);
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) input.value = '';
    };

    return (
        <div className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative w-full max-w-xs">
                <label
                    htmlFor={id}
                    className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-background p-4 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                >
                    {preview ? (
                        <>
                            <img
                                src={preview}
                                alt="Preview"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 z-20 rounded-full bg-black/60 p-1 text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500 transition-colors group-hover:text-gray-700">
                            <ImagePlus className="mb-1 h-8 w-8" />
                            <span className="text-sm">Pilih gambar</span>
                            <span className="text-xs">JPG, JPEG, PNG, SVG</span>
                        </div>
                    )}
                </label>

                <Input
                    id={id}
                    type="file"
                    name="image"
                    accept=".jpg, .jpeg, .png, .svg"
                    onChange={handleChange}
                    className="hidden"
                />
            </div>
            {note && <p className="mt-1 text-sm text-gray-500">{note}</p>}
        </div>
    );
};

export default ImageUploader;
