import { vpcDeck } from "./vpc";
import type { Deck } from "./types";

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
