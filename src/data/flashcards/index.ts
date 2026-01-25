import type { Deck } from "@/features/flashcard/types";
import { vpcDeck } from "./vpc";

const decks: Deck[] = [
	vpcDeck,
	// 将来的なデッキはここに追加
];

export const getAllDecks = (): Deck[] => {
	return decks;
};
