import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { Toast as ToastType, ToastVariant } from "./use-toast";

const toastVariants = cva(
	"pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
	{
		variants: {
			variant: {
				success:
					"border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
				error:
					"border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive dark:bg-destructive/20 dark:text-red-200",
				warning:
					"border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
				info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
			},
		},
		defaultVariants: {
			variant: "info",
		},
	},
);

const iconMap: Record<ToastVariant, React.ReactNode> = {
	success: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
			aria-hidden="true"
		>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<path d="m9 11 3 3L22 4" />
		</svg>
	),
	error: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-5 w-5 text-destructive dark:text-red-400"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="15" x2="9" y1="9" y2="15" />
			<line x1="9" x2="15" y1="9" y2="15" />
		</svg>
	),
	warning: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-5 w-5 text-amber-600 dark:text-amber-400"
			aria-hidden="true"
		>
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
			<path d="M12 9v4" />
			<path d="M12 17h.01" />
		</svg>
	),
	info: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-5 w-5 text-blue-600 dark:text-blue-400"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 16v-4" />
			<path d="M12 8h.01" />
		</svg>
	),
};

export interface ToastProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof toastVariants> {
	toast: ToastType;
	onDismiss: (id: string) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
	({ className, toast: toastData, onDismiss, ...props }, ref) => {
		const [isVisible, setIsVisible] = useState(false);
		const [isLeaving, setIsLeaving] = useState(false);

		useEffect(() => {
			// マウント時にアニメーション開始
			const showTimer = requestAnimationFrame(() => {
				setIsVisible(true);
			});

			return () => cancelAnimationFrame(showTimer);
		}, []);

		const handleDismiss = React.useCallback(() => {
			setIsLeaving(true);
			setTimeout(() => {
				onDismiss(toastData.id);
			}, 150); // アニメーション完了を待つ
		}, [onDismiss, toastData.id]);

		useEffect(() => {
			if (toastData.duration && toastData.duration > 0) {
				const timer = setTimeout(() => {
					handleDismiss();
				}, toastData.duration);

				return () => clearTimeout(timer);
			}
		}, [toastData.duration, handleDismiss]);

		return (
			<div
				ref={ref}
				className={cn(
					toastVariants({ variant: toastData.variant }),
					"transform transition-all duration-150 ease-out",
					isVisible && !isLeaving
						? "translate-x-0 opacity-100"
						: "translate-x-full opacity-0",
					className,
				)}
				{...props}
			>
				<div className="flex items-start gap-3">
					<div className="shrink-0">{iconMap[toastData.variant]}</div>
					<div className="grid gap-1">
						<div className="text-sm font-semibold">{toastData.title}</div>
						{toastData.description && (
							<div className="text-sm opacity-90">{toastData.description}</div>
						)}
					</div>
				</div>
				<button
					onClick={handleDismiss}
					className="absolute right-2 top-2 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
					type="button"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
						aria-hidden="true"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			</div>
		);
	},
);
Toast.displayName = "Toast";

export { Toast, toastVariants };
