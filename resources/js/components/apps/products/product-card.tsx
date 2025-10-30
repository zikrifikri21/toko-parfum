import { Heart } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
export type Post = {
    id: number;
    title: string;
    price: number;
    barcode: string;
    description: string;
    image: string;
    category: string;
};

export function ProductCard({
    post,
    isFavorite,
    onToggleFavorite,
    detailModal,
}: {
    post: Post;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    detailModal?: (post: Post) => void;
}) {
    return (
        <article
            key={post.id}
            id={`product-card-${post.id}`}
            className="relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            onClick={() => detailModal && detailModal(post)}
        >
            <div className="absolute top-3 right-3 z-10">
                <button
                    aria-pressed={isFavorite}
                    aria-label={
                        isFavorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                    }
                    onClick={onToggleFavorite}
                    className={`rounded-full p-2 ring-1 ring-border ${isFavorite ? 'bg-primary text-primary-foreground' : 'bg-background/80 hover:bg-accent'}`}
                >
                    <span className="sr-only">
                        {isFavorite ? 'Favorited' : 'Not favorited'}
                    </span>
                    <Heart
                        className="h-5 w-5"
                        fill={isFavorite ? 'currentColor' : 'none'}
                    />
                </button>
            </div>

            <div className="flex h-56 items-center justify-center bg-accent/60 mask-b-from-60% mask-b-to-100% p-3 sm:h-64">
                {/* <Zoom> */}
                <LazyLoadImage
                    loading="lazy"
                    effect="blur"
                    wrapperProps={{
                        style: { transitionDelay: '1s' },
                    }}
                    src={
                        post.image?.startsWith('default')
                            ? post.image
                            : `/storage/${post.image}`
                    }
                    alt={post.title}
                    className="h-full w-full rounded-xl object-cover"
                />
                {/* </Zoom> */}
            </div>

            <div className="space-y-2 p-4">
                <div className="z-50 rounded-b-2xl">
                    <h3 className="line-clamp-1 text-sm font-semibold sm:text-base">
                        {post.title}
                    </h3>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                    {post.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                    <button
                        className="rounded-full bg-background px-2 ring-1 ring-border hover:bg-accent"
                        aria-label="Locked"
                    >
                        {post?.category ?? '-'}
                    </button>
                </div>
            </div>
        </article>
    );
}
