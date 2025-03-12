import { NOTES_PER_BAR } from "../definitions";

export function getBeatNumbers(numberOfBeats : number, offset? : number) : number[] {
    const noteNumbers : number[] = [];

    for (let start = 0; start < NOTES_PER_BAR; start += (NOTES_PER_BAR / numberOfBeats)) {
        noteNumbers.push(start + (offset ?? 0));
    } 

    return noteNumbers;
}