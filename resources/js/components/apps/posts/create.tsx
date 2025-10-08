import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import posts from '@/routes/posts';
import { Form } from '@inertiajs/react';
import { X } from 'lucide-react';
import React from 'react';

const CreatePostsModal: React.FC<React.PropsWithChildren> = () => {
    const [open, onOpenChange] = React.useState(false);
    const [preview, setPreview] = React.useState<string | null>(null);

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open);
        if (!open) setPreview(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePreview = () => {
        setPreview(null);
        const input = document.querySelector<HTMLInputElement>(
            'input[name="image"]',
        );
        if (input) input.value = '';
    };

    const isMobile = useIsMobile();

    const FormContent = (
        <Form
            method="POST"
            action={posts.store()}
            encType="multipart/form-data"
            className="grid gap-4 py-4"
            onSuccess={() => {
                onOpenChange(false);
                setPreview(null);
            }}
        >
            <Label>Title</Label>
            <Input name="title" type="text" />
            <Label>Description</Label>
            <Input name="description" type="text" />

            <Label>Image</Label>
            {preview && (
                <div className="relative w-40">
                    <img
                        src={preview}
                        alt="Preview"
                        className="rounded-lg border object-cover"
                    />
                    <button
                        type="button"
                        onClick={removePreview}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            <Input
                type="file"
                name="image"
                accept=".jpg, .jpeg, .png, .gif, .svg"
                onChange={handleImageChange}
            />

            <Button type="submit">Tambah Postingan</Button>
        </Form>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={handleOpenChange}>
                <DrawerTrigger asChild className="w-full">
                    <Button onClick={() => handleOpenChange(true)}>
                        Tambah Postingan
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Tambah Postingan</DrawerTitle>
                        <DrawerDescription>
                            Form untuk menambah postingan
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">{FormContent}</div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild className="w-full">
                <Button>Tambah Postingan</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Tambah Postingan</DialogTitle>
                <DialogDescription>
                    Form untuk menambah postingan
                </DialogDescription>
                {FormContent}
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostsModal;
