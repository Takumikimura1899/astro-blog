"use client";

import * as React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";

import { cn } from "@/lib/utils";

// ============================================================================
// Dialog Context
// ============================================================================

interface DialogContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	titleId: string;
	descriptionId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error("Dialog components must be used within a Dialog");
	}
	return context;
}

// ============================================================================
// Dialog (Root)
// ============================================================================

interface DialogProps {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	defaultOpen?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
	children,
	open: controlledOpen,
	onOpenChange,
	defaultOpen = false,
}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const uniqueId = useId();

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;

	const setOpen = useCallback(
		(newOpen: boolean) => {
			if (!isControlled) {
				setUncontrolledOpen(newOpen);
			}
			onOpenChange?.(newOpen);
		},
		[isControlled, onOpenChange],
	);

	const titleId = `dialog-title-${uniqueId}`;
	const descriptionId = `dialog-description-${uniqueId}`;

	return (
		<DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>
			{children}
		</DialogContext.Provider>
	);
};
Dialog.displayName = "Dialog";

// ============================================================================
// DialogTrigger
// ============================================================================

interface DialogTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
	({ children, asChild, onClick, ...props }, ref) => {
		const { setOpen } = useDialogContext();

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(e);
			setOpen(true);
		};

		if (asChild && React.isValidElement(children)) {
			return React.cloneElement(
				children as React.ReactElement<{
					onClick?: (e: React.MouseEvent) => void;
				}>,
				{
					onClick: (e: React.MouseEvent) => {
						(
							children as React.ReactElement<{
								onClick?: (e: React.MouseEvent) => void;
							}>
						).props.onClick?.(e);
						setOpen(true);
					},
				},
			);
		}

		return (
			<button ref={ref} type="button" onClick={handleClick} {...props}>
				{children}
			</button>
		);
	},
);
DialogTrigger.displayName = "DialogTrigger";

// ============================================================================
// DialogPortal
// ============================================================================

interface DialogPortalProps {
	children: React.ReactNode;
}

const DialogPortal: React.FC<DialogPortalProps> = ({ children }) => {
	const { open } = useDialogContext();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || !open) {
		return null;
	}

	return <>{children}</>;
};
DialogPortal.displayName = "DialogPortal";

// ============================================================================
// DialogOverlay
// ============================================================================

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
	({ className, ...props }, ref) => {
		const { open } = useDialogContext();
		const [isVisible, setIsVisible] = useState(false);

		useEffect(() => {
			if (open) {
				requestAnimationFrame(() => {
					setIsVisible(true);
				});
			} else {
				setIsVisible(false);
			}
		}, [open]);

		return (
			<div
				ref={ref}
				className={cn(
					"fixed inset-0 z-50 bg-black/50 transition-opacity duration-200",
					isVisible ? "opacity-100" : "opacity-0",
					className,
				)}
				{...props}
			/>
		);
	},
);
DialogOverlay.displayName = "DialogOverlay";

// ============================================================================
// DialogContent
// ============================================================================

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
	({ className, children, ...props }, ref) => {
		const { open, setOpen, titleId, descriptionId } = useDialogContext();
		const [isVisible, setIsVisible] = useState(false);
		const contentRef = useRef<HTMLDivElement>(null);
		const previousActiveElement = useRef<HTMLElement | null>(null);

		// フォーカス管理とアニメーション
		useEffect(() => {
			if (open) {
				previousActiveElement.current = document.activeElement as HTMLElement;
				document.body.style.overflow = "hidden";

				requestAnimationFrame(() => {
					setIsVisible(true);
					// ダイアログ内の最初のフォーカス可能な要素にフォーカス
					const focusableElements =
						contentRef.current?.querySelectorAll<HTMLElement>(
							'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
						);
					if (focusableElements && focusableElements.length > 0) {
						focusableElements[0].focus();
					}
				});
			} else {
				setIsVisible(false);
				document.body.style.overflow = "";
				previousActiveElement.current?.focus();
			}

			return () => {
				document.body.style.overflow = "";
			};
		}, [open]);

		// ESCキーで閉じる
		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape" && open) {
					setOpen(false);
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, [open, setOpen]);

		// フォーカストラップ
		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key !== "Tab" || !open) return;

				const focusableElements =
					contentRef.current?.querySelectorAll<HTMLElement>(
						'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
					);

				if (!focusableElements || focusableElements.length === 0) return;

				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, [open]);

		return (
			<DialogPortal>
				<DialogOverlay />
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						ref={(node) => {
							contentRef.current = node;
							if (typeof ref === "function") {
								ref(node);
							} else if (ref) {
								ref.current = node;
							}
						}}
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						aria-describedby={descriptionId}
						className={cn(
							"relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg transition-all duration-200",
							isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
							className,
						)}
						{...props}
					>
						{children}
					</div>
				</div>
			</DialogPortal>
		);
	},
);
DialogContent.displayName = "DialogContent";

// ============================================================================
// DialogHeader
// ============================================================================

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex flex-col space-y-1.5 text-center sm:text-left",
				className,
			)}
			{...props}
		/>
	),
);
DialogHeader.displayName = "DialogHeader";

// ============================================================================
// DialogTitle
// ============================================================================

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
	({ className, ...props }, ref) => {
		const { titleId } = useDialogContext();

		return (
			<h2
				ref={ref}
				id={titleId}
				className={cn(
					"text-lg font-semibold leading-none tracking-tight",
					className,
				)}
				{...props}
			/>
		);
	},
);
DialogTitle.displayName = "DialogTitle";

// ============================================================================
// DialogDescription
// ============================================================================

interface DialogDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = React.forwardRef<
	HTMLParagraphElement,
	DialogDescriptionProps
>(({ className, ...props }, ref) => {
	const { descriptionId } = useDialogContext();

	return (
		<p
			ref={ref}
			id={descriptionId}
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
});
DialogDescription.displayName = "DialogDescription";

// ============================================================================
// DialogFooter
// ============================================================================

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
				className,
			)}
			{...props}
		/>
	),
);
DialogFooter.displayName = "DialogFooter";

// ============================================================================
// DialogClose
// ============================================================================

interface DialogCloseProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
	({ className, children, onClick, ...props }, ref) => {
		const { setOpen } = useDialogContext();

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(e);
			setOpen(false);
		};

		return (
			<button
				ref={ref}
				type="button"
				className={cn(
					"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
					className,
				)}
				onClick={handleClick}
				aria-label="Close"
				{...props}
			>
				{children || (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
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
				)}
			</button>
		);
	},
);
DialogClose.displayName = "DialogClose";

// ============================================================================
// Exports
// ============================================================================

export {
	Dialog,
	DialogTrigger,
	DialogPortal,
	DialogOverlay,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
};
