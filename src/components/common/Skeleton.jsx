import React from 'react';

export const SkeletonText = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-plum/5 dark:bg-ivory/5 rounded ${className}`} />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="border border-plum/5 dark:border-ivory/5 p-4 flex flex-col gap-4 animate-pulse">
      <div className="bg-plum/5 dark:bg-ivory/5 h-64 w-full" />
      <div className="flex flex-col gap-2">
        <SkeletonText className="h-6 w-3/4" />
        <SkeletonText className="h-4 w-1/2" />
        <SkeletonText className="h-5 w-1/4" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
