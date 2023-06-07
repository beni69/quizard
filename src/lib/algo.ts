// card sorter/iterator algorighm that reruns cards
// that can be told to repeat

// term -> definition
import type { Card } from "@prisma/client"

// Fischer-Yates inplace balanced shuffle
export function shuffle<T>(a: T[]): T[] {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export interface QuizItem {
    card: Card,
    // callback to tell whether the card was correct
    fn: (b: boolean) => void,
    // percentage float
    progress: number,
}

export interface QuizResult {
    succ: number,
    fail: number,
}

interface CardItem extends Card {
    score: number,
}

const MAX_RUNS = 2,
    REPEAT_FAILED = 5;

export function* quiz(_array: Card[]) {
    const array = shuffle(_array.map(x => ({ ...x, score: 0 } as CardItem)));
    const res: QuizResult = { succ: 0, fail: 0 };

    while (true) {
        console.debug(res.succ / ((array.length * 2) + res.fail), array.map(c => `${c.term} => ${c.definition} (${c.score})`));

        const cardI = array.findIndex(c => c.score < MAX_RUNS);
        if (cardI < 0) break;
        const card = array.splice(cardI, 1)[0];

        let choice;
        const item: QuizItem = {
            card,
            fn: (b) => { choice = b; },
            progress: res.succ / ((array.length * 2) + res.fail),
        };
        yield item;

        // current "bucket" start and end indexes
        const first = array.findIndex(c => c.score === card.score),
            last = array.lastIndexOf(array.filter(c => c.score === card.score).at(-1)!)
        if (choice === true) {
            card.score++;
            array.push(card);
            res.succ++;
        } else if (choice === false) {
            card.score--;
            // put `REPEAT_FAILED` times after the current score first
            const insert = Math.max(first + REPEAT_FAILED, last + 1)
            array.splice(insert, 0, card);
            res.fail++;
        } else {
            console.error("CARD CALLBACK NEVER CALLED!!", item);
            // put back at the end of the same scored ones
            array.splice(last + 1, 0, card);
        }
    }
    console.debug(res);
    return res;
}
