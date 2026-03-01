import React from 'react';

export default function PostCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-[var(--radius)] p-[22px] flex flex-col h-full animate-pulse">
            {/* Tags */}
            <div className="flex gap-1.5 mb-3.5">
                <div className="h-5 w-14 bg-surface rounded-[6px]"></div>
                <div className="h-5 w-12 bg-surface rounded-[6px]"></div>
            </div>

            {/* Title */}
            <div className="h-5 w-3/4 bg-surface rounded-md mb-2"></div>

            {/* Meta */}
            <div className="flex gap-3 mb-3">
                <div className="h-3 w-16 bg-surface rounded-md"></div>
                <div className="h-3 w-12 bg-surface rounded-md"></div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-4 flex-grow">
                <div className="h-3 w-full bg-surface rounded-md"></div>
                <div className="h-3 w-3/4 bg-surface rounded-md"></div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <div className="h-9 flex-1 bg-surface rounded-[8px]"></div>
                <div className="h-9 flex-1 bg-surface rounded-[8px]"></div>
            </div>
        </div>
    );
}
