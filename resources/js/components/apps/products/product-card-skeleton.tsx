export function ProductCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
            <div className="h-56 w-full bg-muted sm:h-64" />
            <div className="space-y-3 p-4">
                <div className="h-4 w-3/5 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="mt-2 h-6 w-24 rounded-full bg-muted" />
            </div>
        </div>
    );
}
