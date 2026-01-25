import { useCallback, useEffect, useState } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	title: string;
	description?: string;
	variant: ToastVariant;
	duration?: number;
}

export interface ToastOptions {
	title: string;
	description?: string;
	variant?: ToastVariant;
	duration?: number;
}

type ToastListener = (toasts: Toast[]) => void;

const DEFAULT_DURATION = 5000;

/**
 * グローバルなトースト状態管理
 *
 * 注意: グローバル変数はモジュールのライフサイクル中存在し続けます。
 * - toasts配列: トーストが dismiss されるか dismissAll が呼ばれると適切にクリアされます
 * - listeners Set: useToast フックの useEffect クリーンアップで確実に削除されます
 *
 * SPAでのページ遷移時にコンポーネントがアンマウントされても、
 * useEffect のクリーンアップ関数により listener は削除されるため、
 * メモリリークは発生しません。
 */
let toasts: Toast[] = [];
const listeners = new Set<ToastListener>();

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function notifyListeners(): void {
	for (const listener of listeners) {
		listener([...toasts]);
	}
}

export function toast(options: ToastOptions): string {
	const id = generateId();
	const newToast: Toast = {
		id,
		title: options.title,
		description: options.description,
		variant: options.variant ?? "info",
		duration: options.duration ?? DEFAULT_DURATION,
	};

	toasts = [...toasts, newToast];
	notifyListeners();

	return id;
}

export function dismissToast(id: string): void {
	toasts = toasts.filter((t) => t.id !== id);
	notifyListeners();
}

export function useToast() {
	const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

	useEffect(() => {
		const listener: ToastListener = (newToasts) => {
			setCurrentToasts(newToasts);
		};
		listeners.add(listener);

		// クリーンアップ: コンポーネントのアンマウント時に listener を確実に削除
		// これによりメモリリークを防止します
		return () => {
			listeners.delete(listener);
		};
	}, []);

	const showToast = useCallback((options: ToastOptions) => {
		return toast(options);
	}, []);

	const dismiss = useCallback((id: string) => {
		dismissToast(id);
	}, []);

	const dismissAll = useCallback(() => {
		toasts = [];
		notifyListeners();
	}, []);

	return {
		toasts: currentToasts,
		toast: showToast,
		dismiss,
		dismissAll,
	};
}
