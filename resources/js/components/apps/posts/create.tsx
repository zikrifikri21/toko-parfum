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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { PostsProps } from '@/pages/posts';
import posts from '@/routes/posts';
import { useForm } from '@inertiajs/react';
import React from 'react';
import ImageUploader from './image-uplader';

type CreatePostsModalProps = {
    categories: PostsProps['categories'];
};

const CreatePostsModal: React.FC<
    React.PropsWithChildren<CreatePostsModalProps>
> = ({ categories }) => {
    const [open, onOpenChange] = React.useState(false);
    const [preview, setPreview] = React.useState<string | null>(null);

    const { data, setData, post, reset } = useForm({
        title: '',
        description: '',
        category_id: '',
        image: null as File | null,
    });

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open);
        if (!open) {
            setPreview(null);
            reset();
        }
    };

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
            'input[name="image"]',
        );
        if (input) input.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(posts.store().url, {
            onSuccess: () => {
                handleOpenChange(false);
            },
        });
    };

    const isMobile = useIsMobile();

    const FormContent = (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="grid gap-4 py-4"
        >
            {/* Title */}
            <div className="space-y-1">
                <Label>Title</Label>
                <Input
                    name="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
            </div>

            {/* Description */}
            <div className="space-y-1">
                <Label>Description</Label>
                <Input
                    name="description"
                    type="text"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    required
                />
            </div>

            {/* Category */}
            <div className="space-y-1">
                <Label>Kategori</Label>
                <Select
                    onValueChange={(val) => setData('category_id', val)}
                    value={data.category_id}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={String(category.id)}
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Image Preview ala Edit */}
            <ImageUploader
                id="create-image-input"
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
            />

            <Button type="submit" className="w-full">
                Tambah Postingan
            </Button>
        </form>
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
