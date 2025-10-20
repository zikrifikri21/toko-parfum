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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { PostsProps } from '@/pages/posts';
import { type Post } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import ImageUploader from './image-uplader';

interface UpdatePostsModalProps {
    post: Post;
    categories: PostsProps['categories'];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UpdatePostsModal: React.FC<UpdatePostsModalProps> = ({
    post,
    categories,
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
        category_id: post.category_id || '',
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
                title: post.title || '',
                description: post.description || '',
                category_id: post.category_id || '',
                image: null,
                _method: 'PUT',
            });
            setPreview(getImageUrl(post.image || null));
        } else {
            reset();
        }
    }, [open, post, reset, setData]);

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
        updatePost(`/posts/update/${post.id}`, {
            onSuccess: () => onOpenChange(false),
            preserveState: (page) => Object.keys(page.props.errors).length > 0,
            preserveScroll: true,
        });
    };

    const FormContent = (
        <form onSubmit={handleSubmit} className="grid gap-4 px-2 py-4">
            {/* Nama */}
            <div>
                <Label htmlFor="title">Nama</Label>
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

            {/* Deskripsi */}
            <div>
                <Label htmlFor="description">Deskripsi</Label>
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

            {/* 🆕 Kategori */}
            <div>
                <Label htmlFor="category_id">Kategori</Label>
                <Select
                    value={data.category_id?.toString()}
                    onValueChange={(val) => setData('category_id', val)}
                >
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category_id && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.category_id}
                    </p>
                )}
            </div>

            {/* Gambar */}
            <ImageUploader
                id="update-image-input"
                preview={preview}
                onChange={(file) => {
                    if (file) {
                        setData('image', file);
                        const reader = new FileReader();
                        reader.onloadend = () =>
                            setPreview(reader.result as string);
                        reader.readAsDataURL(file);
                    } else {
                        setData('image', null);
                        setPreview(null);
                    }
                }}
                note="Kosongkan jika tidak ingin mengubah gambar."
            />

            <Button type="submit" disabled={processing} className="w-full">
                {processing ? 'Menyimpan...' : 'Update Postingan'}
            </Button>
        </form>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="h-full max-h-screen">
                    <DrawerHeader>
                        <DrawerTitle>Update Postingan</DrawerTitle>
                        <DrawerDescription>
                            Form untuk mengubah postingan yang sudah ada.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="h-full max-h-screen overflow-auto p-4">
                        {FormContent}
                    </div>
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
