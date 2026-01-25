import * as React from "react";

import { cn } from "@/lib/utils";
import { Toast } from "./toast";
import { useToast } from "./use-toast";

export interface ToasterProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Position of the toaster container
	 * @default "top-right"
	 */
	position?:
		| "top-right"
		| "top-left"
		| "bottom-right"
		| "bottom-left"
		| "top-center"
		| "bottom-center";
}

const positionClasses: Record<NonNullable<ToasterProps["position"]>, string> = {
	"top-right": "top-0 right-0",
	"top-left": "top-0 left-0",
	"bottom-right": "bottom-0 right-0",
	"bottom-left": "bottom-0 left-0",
	"top-center": "top-0 left-1/2 -translate-x-1/2",
	"bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
};

const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(
	({ className, position = "top-right", ...props }, ref) => {
		const { toasts, dismiss } = useToast();

		if (toasts.length === 0) {
			return null;
		}

		return (
			<div
				ref={ref}
				className={cn(
					"fixed z-50 flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]",
					positionClasses[position],
					className,
				)}
				{...props}
			>
				{toasts.map((toast) => (
					<Toast key={toast.id} toast={toast} onDismiss={dismiss} />
				))}
			</div>
		);
	},
);
Toaster.displayName = "Toaster";

export { Toaster };
