import { useCallback, useEffect, useState } from 'react';
import { ProductCard, type Post } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';

function getFavoritesFromStorage(): Record<number, boolean> {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : {};
    }
    return {};
}

export function FavoriteProductsGrid() {
    const [favorites, setFavorites] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Post[]>([]);
    const [fetchError, setFetchError] = useState<Error | null>(null);

    useEffect(() => {
        const favs = getFavoritesFromStorage();
        setFavorites(favs);
    }, []);

    useEffect(() => {
        const favoriteIds = Object.keys(favorites)
            .filter((id) => favorites[Number(id)])
            .map(Number);

        if (favoriteIds.length === 0) {
            setLoading(false);
            setProducts([]);
            return;
        }

        const fetchFavoriteProducts = async () => {
            setLoading(true);
            try {
                const ids = favoriteIds.join(',');
                const res = await fetch(`/api/favorites?ids=${ids}`);
                const data = await res.json();
                setFetchError(null);

                let productsData: Post[] = [];

                if (Array.isArray(data)) {
                    productsData = data;
                } else if (data && Array.isArray(data.data)) {
                    productsData = data.data;
                } else {
                    console.warn('Format data tidak dikenali');
                    productsData = [];
                }

                setProducts(productsData);
                setLoading(false);
            } catch (e: any) {
                console.error('Gagal memuat produk favorit', e);
                setFetchError(e);
                setLoading(false);
            }
        };

        fetchFavoriteProducts();
    }, [favorites]);

    const toggleFavorite = useCallback((id: number) => {
        setFavorites((prev) => {
            const newFav = { ...prev, [id]: !prev[id] };
            localStorage.setItem('favorites', JSON.stringify(newFav));
            return newFav;
        });
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="col-span-full text-center text-red-500">
                Gagal memuat produk favorit: {fetchError.message}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground">
                    Tidak ada produk favorit
                </div>
            ) : (
                products.map((p) => (
                    <ProductCard
                        key={p.id}
                        post={p}
                        isFavorite={!!favorites[p.id]}
                        onToggleFavorite={() => toggleFavorite(p.id)}
                    />
                ))
            )}
        </div>
    );
}
