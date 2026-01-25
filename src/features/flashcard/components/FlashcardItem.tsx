import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
	question: string;
	answer: string;
	className?: string;
};

export const FlashcardItem = ({ question, answer, className }: Props) => {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<button
			type="button"
			className={cn(
				"group h-64 w-full cursor-pointer perspective-1000 bg-transparent border-none p-0 outline-hidden focus:ring-2 focus:ring-primary rounded-xl text-left",
				className,
			)}
			onClick={() => setIsFlipped(!isFlipped)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					setIsFlipped(!isFlipped);
				}
			}}
		>
			<div
				className={cn(
					"relative h-full w-full transition-all duration-500 transform-style-3d shadow-xl rounded-xl",
					isFlipped ? "rotate-y-180" : "",
				)}
			>
				{/* Front (Question) */}
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl backface-hidden p-6 border-2 border-slate-200 dark:border-slate-700">
					<h3 className="text-xl font-bold text-center text-slate-800 dark:text-slate-100">
						{question}
					</h3>
					<p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
						クリックして答えを見る
					</p>
				</div>

				{/* Back (Answer) */}
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-950 rounded-xl backface-hidden rotate-y-180 p-6 border-2 border-indigo-200 dark:border-indigo-800">
					<p className="text-lg text-center text-slate-800 dark:text-slate-100">
						{answer}
					</p>
				</div>
			</div>
		</button>
	);
};
