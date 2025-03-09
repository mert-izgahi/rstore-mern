import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
    className?: string;
    children: React.ReactNode;
}

const Container = ({ className, children }: ContainerProps) => {
    return (
        <div
            className={cn(
                "mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8",
                className
            )}
        >
            {children}
        </div>
    );
};

export default Container;