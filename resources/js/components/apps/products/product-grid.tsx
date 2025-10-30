import { Spinner } from '@/components/sipnner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import useSWRInfinite from 'swr/infinite';
import { ProductCard, type Post } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';
import 'react-lazy-load-image-component/src/effects/blur.css';

type Pagination = {
    data: Post[];
    meta: {
        current_page: number;
        last_page: number;
    };
    links: {
        next?: string | null;
        prev?: string | null;
    };
};

interface ProductsGridProps {
    searchQuery: string;
    categoryFilter?: string | null;
    onClearSearch?: () => void;
}

const fetcher = (url: string) =>
    fetch(url, { headers: { Accept: 'application/json' } }).then(
        (r) => r.json() as Promise<Pagination>,
    );

const getKey = (
    pageIndex: number,
    previousPageData: Pagination | null,
    searchQuery: string,
    categoryFilter?: string | null,
) => {
    if (
        previousPageData &&
        previousPageData.meta.current_page >= previousPageData.meta.last_page
    )
        return null;

    const next = pageIndex + 1;
    const params = new URLSearchParams();

    params.append('page', next.toString());
    if (searchQuery) params.append('q', searchQuery);
    if (categoryFilter) params.append('category', categoryFilter);

    return `/list-product?${params.toString()}`;
};

export function ProductsGrid({
    searchQuery,
    categoryFilter,
    onClearSearch,
}: ProductsGridProps) {
    const { data, setSize, isValidating, error, mutate, isLoading } =
        useSWRInfinite<Pagination>(
            (index, previousPageData) =>
                getKey(index, previousPageData, searchQuery, categoryFilter),
            fetcher,
            {
                revalidateOnFocus: false,
                revalidateFirstPage: false,
            },
        );

    const pages = useMemo(() => data ?? [], [data]);
    const items = useMemo(() => pages.flatMap((p) => p.data), [pages]);

    const current = pages.at(-1);
    const hasMore = current
        ? current.meta.current_page < current.meta.last_page
        : true;

    const [favorites, setFavorites] = useState<Record<number, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('favorites');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = useCallback((id: number) => {
        setFavorites((prev) => {
            const newFav = { ...prev, [id]: !prev[id] };
            return newFav;
        });
    }, []);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!sentinelRef.current || !hasMore || isValidating) return;

        const el = sentinelRef.current;
        const io = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                if (e.isIntersecting) {
                    setSize((s) => s + 1);
                }
            },
            { rootMargin: '160px 0px' },
        );
        io.observe(el);

        return () => io.disconnect();
    }, [hasMore, setSize, isValidating]);

    const isInitialLoading = isLoading;
    const isLoadingMore = isValidating && data;
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Post | null>(null);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isInitialLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            {items.map((p) => (
                <ProductCard
                    key={p.id}
                    post={p}
                    isFavorite={!!favorites[p.id]}
                    onToggleFavorite={() => toggleFavorite(p.id)}
                    detailModal={(p) => (
                        setOpenModal(true),
                        setSelectedProduct(p)
                    )}
                />
            ))}

            {openModal && (
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogContent className="p-6 shadow-xs">
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogDescription>{''}</DialogDescription>
                        {selectedProduct && (
                            <div>
                                <h2 className="mb-4 text-lg font-medium">
                                    {selectedProduct.title}
                                </h2>
                                <Zoom>
                                    <LazyLoadImage
                                        className="mb-4 h-auto max-h-[400px] w-full rounded-lg object-cover"
                                        effect="blur"
                                        wrapperProps={{
                                            style: { transitionDelay: '1s' },
                                        }}
                                        src={
                                            typeof selectedProduct.image ===
                                                'string' &&
                                            selectedProduct.image.startsWith(
                                                'default',
                                            )
                                                ? selectedProduct.image
                                                : `/storage/${selectedProduct.image}`
                                        }
                                        alt={selectedProduct.title}
                                        loading="lazy"
                                    />
                                </Zoom>
                                <p className="mb-2">
                                    <strong>Category:</strong>{' '}
                                    {selectedProduct.category || '-'}
                                </p>
                                <p>
                                    <strong>Description:</strong>{' '}
                                    {selectedProduct.description}
                                </p>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {error && (
                <div className="col-span-full rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm">
                    Gagal memuat produk.{' '}
                    <button className="underline" onClick={() => mutate()}>
                        Coba Lagi
                    </button>
                </div>
            )}

            {isLoadingMore && (
                <div className="col-span-full flex justify-center py-8">
                    <Spinner />
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <div className="col-span-full text-center text-muted-foreground">
                    Tidak ada produk lagi untuk ditampilkan
                </div>
            )}

            {hasMore && (
                <div
                    ref={sentinelRef}
                    aria-hidden
                    className="col-span-full h-2"
                />
            )}

            {searchQuery && items.length === 0 && !isLoading && (
                <div className="col-span-full text-center text-muted-foreground">
                    Tidak ditemukan produk untuk: <strong>{searchQuery}</strong>
                    <button
                        className="ml-2 text-primary underline"
                        onClick={onClearSearch}
                    >
                        Hapus pencarian
                    </button>
                </div>
            )}

            {categoryFilter && items.length === 0 && !isLoading && (
                <div className="col-span-full text-center text-muted-foreground">
                    Tidak ditemukan produk untuk kategori:{' '}
                    <strong>{categoryFilter}</strong>
                </div>
            )}
        </div>
    );
}
