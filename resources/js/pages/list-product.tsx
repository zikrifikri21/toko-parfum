import { FavoriteProductsGrid } from '@/components/apps/products/favorite-products-grid';
import { ProductsGrid } from '@/components/apps/products/product-grid';
import { Spinner } from '@/components/sipnner';
import { Button } from '@/components/ui/button';
import { Heart, Home, Search } from 'lucide-react';
import { Suspense, useState } from 'react';

const categories = ['botol', 'parfum'];

export default function Page() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [tempSearchQuery, setTempSearchQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'favorites'>('home');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(tempSearchQuery);
        setSearchOpen(false);
    };

    const clearSearch = () => {
        setTempSearchQuery('');
        setSearchQuery('');
    };

    const clearFilters = () => {
        setCategoryFilter(null);
        clearSearch();
    };

    return (
        <main className="min-h-screen bg-background">
            <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <h1 className="text-lg font-semibold text-balance sm:text-xl">
                        SF Parfum
                    </h1>
                    <div className="flex gap-2">
                        <button
                            aria-label="Search"
                            className="rounded-full bg-card p-2 ring-1 ring-border hover:bg-accent"
                            onClick={() => setSearchOpen(true)}
                        >
                            <span className="sr-only">Search</span>
                            <Search className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {(categoryFilter || searchQuery) && (
                    <div className="mx-auto flex max-w-6xl px-4 pb-3 sm:px-6">
                        <div className="flex flex-wrap gap-2">
                            {categoryFilter && (
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    Kategori: {categoryFilter}
                                    <button
                                        onClick={() => setCategoryFilter(null)}
                                        className="ml-1 text-primary/70 hover:text-primary"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                            {searchQuery && (
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    Cari: {searchQuery}
                                    <button
                                        onClick={clearSearch}
                                        className="ml-1 text-primary/70 hover:text-primary"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                            {(categoryFilter || searchQuery) && (
                                <button
                                    onClick={clearFilters}
                                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent"
                                >
                                    Bersihkan
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>
            <div className="mb-3 w-full rounded-xl bg-card p-3 shadow">
                <h3 className="mb-3 text-sm font-medium">Filter Kategori</h3>
                <div className="flex w-full flex-row flex-wrap gap-3">
                    <Button
                        variant={!categoryFilter ? 'default' : 'secondary'}
                        className={`${!categoryFilter ? '' : 'bg-accent shadow-none'}`}
                        onClick={() => {
                            setCategoryFilter(null);
                        }}
                    >
                        Semua
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={
                                categoryFilter === cat ? 'default' : 'secondary'
                            }
                            className={`${categoryFilter === cat ? '' : 'bg-accent shadow-none'}`}
                            onClick={() => {
                                setCategoryFilter(cat);
                            }}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            <section className="mx-auto max-w-6xl px-4 pt-2 pb-24 sm:px-6">
                {activeTab === 'home' ? (
                    <Suspense
                        fallback={
                            <div className="py-16">
                                <Spinner />
                            </div>
                        }
                    >
                        <ProductsGrid
                            searchQuery={searchQuery}
                            categoryFilter={categoryFilter}
                            onClearSearch={clearSearch}
                        />
                    </Suspense>
                ) : (
                    <Suspense
                        fallback={
                            <div className="py-16">
                                <Spinner />
                            </div>
                        }
                    >
                        <FavoriteProductsGrid />
                    </Suspense>
                )}
            </section>

            <nav
                aria-label="Bottom navigation"
                className="fixed inset-x-0 bottom-0 z-10 m-4 rounded-2xl bg-background/80 backdrop-blur"
            >
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 rounded-2xl px-6 py-3">
                    <button
                        className={`flex items-center justify-center rounded-xl bg-card py-2 ring-1 ring-border hover:bg-accent ${activeTab === 'home' ? 'bg-primary text-primary-foreground' : ''}`}
                        aria-label="Home"
                        onClick={() => setActiveTab('home')}
                    >
                        <Home className="h-5 w-5" />
                    </button>
                    <button
                        className={`flex items-center justify-center rounded-xl bg-card py-2 ring-1 ring-border hover:bg-accent ${activeTab === 'favorites' ? 'bg-primary text-primary-foreground' : ''}`}
                        aria-label="Favorites"
                        onClick={() => setActiveTab('favorites')}
                    >
                        <Heart className="h-5 w-5" />
                    </button>
                </div>
            </nav>

            {searchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setSearchOpen(false)}
                    ></div>
                    <div className="relative z-10 w-full max-w-md rounded-xl bg-card p-4 shadow-lg">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                value={tempSearchQuery}
                                onChange={(e) =>
                                    setTempSearchQuery(e.target.value)
                                }
                                autoFocus
                            />
                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                                    onClick={() => {
                                        setTempSearchQuery('');
                                        setSearchOpen(false);
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
