export interface Flashcard {
	id: string; // 一意のID
	question: string;
	answer: string;
}

export interface Deck {
	id: string;
	title: string;
	description?: string;
	cards: Flashcard[];
}
