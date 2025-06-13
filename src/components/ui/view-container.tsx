import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ViewContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const ViewContainer = forwardRef<HTMLDivElement, ViewContainerProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("mx-[10px] md:mx-12", className)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

ViewContainer.displayName = "ViewContainer";

export { ViewContainer };

export type { ViewContainerProps };
