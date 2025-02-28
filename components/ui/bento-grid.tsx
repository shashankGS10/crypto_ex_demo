// components/ui/bento-grid.tsx
"use client";
import { cn } from "@/lib/utils";  // classNames merger (see Aceternity UI utils)
import React from "react";

export const BentoGrid: React.FC<{ className?: string, children: React.ReactNode }> = 
({ className, children }) => {
  return (
    <div className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto auto-rows-[18rem]",
        className
      )}>
      {children}
    </div>
  );
};

export const BentoGridItem: React.FC<{
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ className, title, description, header, icon }) => {
  return (
    <div 
      className={cn(
        "row-span-1 rounded-xl p-4 flex flex-col justify-between space-y-4 transition duration-200",
        "group hover:shadow-xl shadow-sm dark:bg-neutral-900 dark:border-white/20 bg-white border border-transparent",
        className
      )}>
      {header}
      <div className="transition duration-200 group-hover:translate-x-1">
        {icon}
        <div className="font-bold text-neutral-700 dark:text-neutral-200 mt-2">{title}</div>
        <div className="text-sm font-normal text-neutral-600 dark:text-neutral-300">{description}</div>
      </div>
    </div>
  );
};
