import { QUARTERS_PER_PHRASE, EIGHTH_VALUE, QUARTER_VALUE, SIXTEENTH_VALUE } from "../lib/definitions";
import { getBeatNumbers, BeatNotation } from "../lib/rhythm/beatNotation";

export const METRONOME_NOTATION = createNotation(getBeatNumbers(QUARTERS_PER_PHRASE), repeatStringIntoArray('z', QUARTERS_PER_PHRASE));
export const UNDER_PRESSURE_NOTATION : BeatNotation[] = [{
                startingBeatNumber: 0,
                notation: "c/2"
            },
            {
                startingBeatNumber: EIGHTH_VALUE,
                notation: "c/2 "
            },
            {
                startingBeatNumber: QUARTER_VALUE,
                notation: "c/2"
            },
            {
                startingBeatNumber: QUARTER_VALUE + SIXTEENTH_VALUE,
                notation: "c/4"
            },
            {
                startingBeatNumber: QUARTER_VALUE + EIGHTH_VALUE,
                notation: "c/4 "
            },
            {
                startingBeatNumber: QUARTER_VALUE * 2,
                notation: "c/2"
            },
            {
                startingBeatNumber: QUARTER_VALUE * 2 + EIGHTH_VALUE,
                notation: "c/2 "
            },
            {
                startingBeatNumber: QUARTER_VALUE * 3,
                notation: "z"
            },
];

export const TAPPING_PATTERN = createBeatNotationFromNoteValues([EIGHTH_VALUE, SIXTEENTH_VALUE, SIXTEENTH_VALUE, EIGHTH_VALUE, SIXTEENTH_VALUE, SIXTEENTH_VALUE,EIGHTH_VALUE, SIXTEENTH_VALUE, SIXTEENTH_VALUE, EIGHTH_VALUE, EIGHTH_VALUE]);

function createBeatNotationFromNoteValues(noteValues : number[], baseString: string = "c") : BeatNotation[] {
    const beatNotations : BeatNotation[] = [];
    let previousNote : BeatNotation;
    noteValues.forEach(noteValue => {
        let targetString = "";
        switch (noteValue) {
            case QUARTER_VALUE:
                targetString = `${baseString}`;
                break;
            case EIGHTH_VALUE:
                targetString = `${baseString}/2`;
                break;
            case SIXTEENTH_VALUE:
                targetString = `${baseString}/4`;
                break;
        }       
        
        let newBeatNotation : BeatNotation 
        if (!previousNote) {
            newBeatNotation = {
                startingBeatNumber: 0,
                notation: targetString
            }
        } else {
            if (targetString == previousNote.notation) {
                targetString += " ";
            }

            newBeatNotation = {
                startingBeatNumber: previousNote.startingBeatNumber + noteValue,
                notation: targetString
            }
        }

        beatNotations.push(newBeatNotation);
        previousNote = newBeatNotation;
    });

    return beatNotations;
}

export function getPlayableNotesOnly(notation : BeatNotation[]) : number[] {
    const beats = notation.filter(x => !x.notation.includes("z")).map(x => x.startingBeatNumber);
    return beats;
}

export function createPatternNotation(numberOfBeats: number, notationPerBeat: string) : BeatNotation[] {
    return createNotation(getBeatNumbers(numberOfBeats), repeatStringIntoArray(notationPerBeat, numberOfBeats));
}

export function createNotation(beatNotes: number[], notation: string[]) : BeatNotation[] {
    const patterNotation : BeatNotation[] = [];
    for (let index = 0; index < beatNotes.length; index++) {
        patterNotation[index] =  {
            startingBeatNumber: beatNotes[index],
            notation: notation[index]
        }
    }

    return patterNotation;
}

export function repeatStringIntoArray(stringToRepeat : string, amountOfTimes : number) : string[] {
    const stringArray : string[] = [];
    for (let index = 0; index < amountOfTimes; index++) {
        stringArray.push(stringToRepeat);
    }

    return stringArray;
}

export function repeatStringArrayIntoArray(stringToRepeat : string[], amountOfTimes : number) : string[] {
    const stringArray : string[] = [];
    for (let index = 0; index < amountOfTimes; index++) {
        stringToRepeat.forEach((msg : string) => {
            stringArray.push(msg);   
        });        
    }

    return stringArray;
}