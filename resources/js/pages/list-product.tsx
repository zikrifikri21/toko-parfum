import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type Post = {
    id: number;
    title: string;
    description: string;
    image: string;
};

type Pagination = {
    data: Post[];
    current_page: number;
    last_page: number;
};

export default function ListProducts({ posts }: { posts: Pagination }) {
    const [perfumes, setPerfumes] = useState<Post[]>(posts.data);
    const [page, setPage] = useState(posts.current_page);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(
        posts.current_page < posts.last_page,
    );

    const fetchMoreData = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const nextPage = page + 1;
            const res = await axios.get(`/list-product?page=${nextPage}`, {
                headers: { Accept: 'application/json' },
            });

            const newData: Pagination = res.data;

            setPerfumes((prev) => [...prev, ...newData.data]);
            setPage(newData.current_page);
            setHasMore(newData.current_page < newData.last_page);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight - 100 &&
                !loading &&
                hasMore
            ) {
                fetchMoreData();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, page]);

    return (
        <>
            <Head title="SF Parfum" />
            <div className="min-h-screen bg-background p-4 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">
                        Koleksi Parfum
                    </h2>
                    <h1 className="mb-8 text-center text-3xl font-bold text-foreground sm:text-4xl">
                        Toko SF
                    </h1>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {perfumes.map((perfume) => (
                            <div
                                key={perfume.id}
                                className="overflow-hidden rounded-lg border border-border bg-card shadow-md transition-shadow duration-300 hover:shadow-lg"
                            >
                                <div className="flex h-64 items-center justify-center overflow-hidden sm:h-80">
                                    <Zoom key={perfume.id}>
                                        <img
                                            src={'/storage/' + perfume.image}
                                            alt={perfume.title}
                                            className="h-full w-full cursor-zoom-in object-contain transition-transform duration-500 hover:scale-105"
                                        />
                                    </Zoom>
                                </div>

                                <div className="p-4">
                                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-foreground">
                                        {perfume.title}
                                    </h3>
                                    <p className="line-clamp-3 text-sm text-muted-foreground">
                                        {perfume.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {loading && (
                        <div className="my-8 flex justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                        </div>
                    )}

                    {!hasMore && perfumes.length > 0 && (
                        <div className="mt-8 border-t border-border py-4 text-center text-muted-foreground">
                            Tidak ada produk lagi untuk ditampilkan
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
