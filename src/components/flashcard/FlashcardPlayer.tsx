import { useState } from "react";
import type { Deck } from "@/data/flashcards/types";
import { FlashcardItem } from "./FlashcardItem";

type Props = {
	deck: Deck;
};

export const FlashcardPlayer = ({ deck }: Props) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	// カードIDをセットで保持
	const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

	const currentCard = deck.cards[currentIndex];
	const totalCards = deck.cards.length;

	const handleNext = () => {
		if (currentIndex < totalCards - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const handleMarkKnown = () => {
		const newKnown = new Set(knownCards);
		if (knownCards.has(currentCard.id)) {
			newKnown.delete(currentCard.id);
		} else {
			newKnown.add(currentCard.id);
		}
		setKnownCards(newKnown);
	};

	const handleReset = () => {
		setCurrentIndex(0);
		setKnownCards(new Set());
	};

	return (
		<div className="flex flex-col items-center max-w-2xl mx-auto">
			<div className="text-muted-foreground mb-6">
				{currentIndex + 1} / {totalCards}　|　 覚えた: {knownCards.size} /{" "}
				{totalCards}
			</div>

			<div className="w-full mb-8">
				{/* keyにcurrentIndexを指定することで、カード切り替え時にコンポーネントを再マウントし、
            反転状態をリセットする */}
				<FlashcardItem
					key={currentCard.id}
					question={currentCard.question}
					answer={currentCard.answer}
					className={
						knownCards.has(currentCard.id)
							? "border-green-500 ring-2 ring-green-500/20"
							: ""
					}
				/>
			</div>

			<div className="flex gap-4 mb-8">
				<button
					type="button"
					onClick={handlePrev}
					disabled={currentIndex === 0}
					className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50 hover:bg-secondary/80 transition font-medium"
				>
					← 前へ
				</button>

				<button
					type="button"
					onClick={handleMarkKnown}
					className={`px-6 py-2 rounded-lg transition font-medium text-white ${
						knownCards.has(currentCard.id)
							? "bg-green-600 hover:bg-green-700"
							: "bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
					}`}
				>
					{knownCards.has(currentCard.id) ? "✓ 覚えた" : "覚えた"}
				</button>

				<button
					type="button"
					onClick={handleNext}
					disabled={currentIndex === totalCards - 1}
					className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50 hover:bg-secondary/80 transition font-medium"
				>
					次へ →
				</button>
			</div>

			<button
				type="button"
				onClick={handleReset}
				className="text-muted-foreground hover:text-foreground transition text-sm underline underline-offset-4"
			>
				進捗をリセットして最初に戻る
			</button>

			{/* 進捗バー */}
			<div className="w-full mt-8">
				<div className="flex gap-1 h-2">
					{deck.cards.map((card, index) => (
						<button
							type="button"
							key={card.id}
							onClick={() => setCurrentIndex(index)}
							className={`flex-1 rounded-full transition-all duration-300 ${
								index === currentIndex
									? "bg-primary scale-110"
									: knownCards.has(card.id)
										? "bg-green-500"
										: "bg-muted"
							}`}
							aria-label={`${index + 1}枚目のカードへ移動`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
