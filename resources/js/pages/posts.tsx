import CreatePostsModal from '@/components/apps/posts/create';
import TableListPosts from '@/components/apps/posts/table-posts';
import UpdatePostsModal from '@/components/apps/posts/update';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Post } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export interface PostsProps {
    products: {
        data: Post[];
    };
    categories: {
        id: number;
        name: string;
    }[];
}

export default function Posts({ products, categories }: PostsProps) {
    const productList = products.data;
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = (post: Post) => {
        setSelectedPost(post);
        setIsOpen(true);
    };

    const handleDelete = (postId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
            router.delete(`/posts/destroy/${postId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div>
                        <CreatePostsModal categories={categories} />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-4">
                        <TableListPosts
                            data={productList}
                            actionHandlers={{
                                onEdit: (post) => handleEdit(post),
                                onDelete: (id) => handleDelete(id),
                            }}
                        />

                        {selectedPost && (
                            <UpdatePostsModal
                                categories={categories}
                                post={selectedPost}
                                open={isOpen}
                                onOpenChange={setIsOpen}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
