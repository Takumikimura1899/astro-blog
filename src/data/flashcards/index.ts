import type { Deck } from "@/features/flashcard/types";
import { vpcDeck } from "./vpc";

export const decks: Deck[] = [
	vpcDeck,
	// 将来的なデッキはここに追加
];

export const getDeck = (id: string): Deck | undefined => {
	return decks.find((d) => d.id === id);
};

export const getAllDecks = (): Deck[] => {
	return decks;
};
