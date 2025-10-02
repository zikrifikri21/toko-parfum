import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import posts from '@/routes/posts';
import { Post } from '@/types';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface UpdatePostsModalProps {
    post: Post;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UpdatePostsModal: React.FC<UpdatePostsModalProps> = ({
    post,
    open,
    onOpenChange,
}) => {
    const {
        data,
        setData,
        post: updatePost,
        processing,
        errors,
        reset,
    } = useForm({
        title: post.title || '',
        description: post.description || '',
        image: null as File | null,
        _method: 'PUT',
    });

    const getImageUrl = (imagePath: string | null): string | null => {
        return imagePath ? `/storage/${imagePath}` : null;
    };

    const [preview, setPreview] = useState<string | null>(
        getImageUrl(post.image || null),
    );
    const isMobile = useIsMobile();

    useEffect(() => {
        if (open) {
            setData({
                title: post.title,
                description: post.description,
                image: null,
                _method: 'PUT',
            });
            setPreview(getImageUrl(post.image || null));
        } else {
            reset();
        }
    }, [open, post]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePreview = () => {
        setPreview(null);
        setData('image', null);
        const input = document.querySelector<HTMLInputElement>(
            '#update-image-input',
        );
        if (input) input.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updatePost(posts.update(post).url, {
            onSuccess: () => onOpenChange(false),
            preserveState: (page) => Object.keys(page.props.errors).length > 0,
            preserveScroll: true,
        });
    };

    const FormContent = (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="mt-1"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    type="text"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-1"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="update-image-input">Image</Label>
                {preview && (
                    <div className="relative mt-2 w-40">
                        <img
                            src={preview}
                            alt="Preview"
                            className="rounded-lg border object-cover"
                        />
                        <button
                            type="button"
                            onClick={removePreview}
                            className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                <Input
                    id="update-image-input"
                    type="file"
                    name="image"
                    accept=".jpg, .jpeg, .png, .gif, .svg"
                    onChange={handleImageChange}
                    className="mt-2"
                />
                {errors.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    Kosongkan jika tidak ingin mengubah gambar.
                </p>
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing ? 'Menyimpan...' : 'Update Postingan'}
            </Button>
        </form>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Update Postingan</DrawerTitle>
                        <DrawerDescription>
                            Form untuk mengubah postingan yang sudah ada.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">{FormContent}</div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Update Postingan</DialogTitle>
                <DialogDescription>
                    Form untuk mengubah postingan yang sudah ada.
                </DialogDescription>
                {FormContent}
            </DialogContent>
        </Dialog>
    );
};

export default UpdatePostsModal;
