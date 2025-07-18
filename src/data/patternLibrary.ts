import { ResourceType } from "../lib/definitions";
import { getBeatNumbers, BeatNotation } from "../lib/rhythm/beatNotation";

export const NOTES_PER_BAR = 32;
export const QUARTER_VALUE = NOTES_PER_BAR / 4;
export const EIGHTH_VALUE = NOTES_PER_BAR / 8;
export const SIXTEENTH_VALUE = NOTES_PER_BAR / 16;

enum RhythmName {
    Ta,
    Tum,
    Ti,
    TiTi,
    TumTi,
    Tika,
    TikaTika,
    TiTika,
    TimKa,
    Rest,
    HalfRest,
    RestTi
}

export const METRONOME_NOTATION = createBeatNotationFromRhythmNames([RhythmName.Rest, RhythmName.Rest, RhythmName.Rest, RhythmName.Rest]);

export function getResourcePattern(resourceType: ResourceType) : BeatNotation[] {
    let targetNotation : RhythmName[] = [RhythmName.Rest, RhythmName.Rest, RhythmName.Rest, RhythmName.Rest];
    switch (resourceType) {     
        case ResourceType.Water:
            targetNotation = [RhythmName.Ta, RhythmName.Ta, RhythmName.Ta, RhythmName.Ta];
            break;
        case ResourceType.Seed:
            targetNotation = [RhythmName.TiTi, RhythmName.TiTi, RhythmName.TiTi, RhythmName.TiTi];
            break;
        case ResourceType.Tree:
            targetNotation = [RhythmName.Ta, RhythmName.Ta, RhythmName.TiTi, RhythmName.Ta];
            break;
        case ResourceType.Fire:
            targetNotation = [RhythmName.Rest,  RhythmName.Ta,  RhythmName.Rest,  RhythmName.Ta];
            break;
        case ResourceType.Earth:
            targetNotation = [RhythmName.TikaTika,  RhythmName.Ta,  RhythmName.TikaTika,  RhythmName.Ta];
            break;
        case ResourceType.Energy:
            targetNotation = [RhythmName.Tum, RhythmName.Ti, RhythmName.Tum, RhythmName.Ti];
            break;
        case ResourceType.Wind:
            targetNotation = [RhythmName.HalfRest, RhythmName.Ti, RhythmName.HalfRest, RhythmName.Ti, RhythmName.HalfRest, RhythmName.Ti, RhythmName.HalfRest, RhythmName.Ti];
            break;
        case ResourceType.Gem:
            targetNotation = [RhythmName.TiTi, RhythmName.Rest, RhythmName.TiTi, RhythmName.Rest];
            break;
        case ResourceType.Heart:
            targetNotation = [RhythmName.TimKa, RhythmName.Ta, RhythmName.TimKa, RhythmName.Ta];
            break;
        default:
            break;
    }

    return createBeatNotationFromRhythmNames(targetNotation);
}

function createBeatNotationFromRhythmNames(names : RhythmName[]) : BeatNotation[] {
    const beatNotations : BeatNotation[] = [];
    let currentOffset = 0;
    names.forEach(name => {
        let nameNotation : BeatNotation[];
        let offsetAmount = QUARTER_VALUE;
        switch (name) {
            case RhythmName.Ta:
                nameNotation = createBeatNotationFromNoteValues([QUARTER_VALUE], currentOffset);
                break;
            case RhythmName.Tum:
                nameNotation = createBeatNotationFromNoteValues([QUARTER_VALUE + EIGHTH_VALUE], currentOffset);
                offsetAmount = QUARTER_VALUE + EIGHTH_VALUE;
                break;
            case RhythmName.Ti:
                nameNotation = createBeatNotationFromNoteValues([EIGHTH_VALUE], currentOffset);
                offsetAmount = EIGHTH_VALUE;
                break;
            case RhythmName.TiTi:
                nameNotation = createBeatNotationFromNoteValues([EIGHTH_VALUE, EIGHTH_VALUE], currentOffset);
                break;
             case RhythmName.TumTi:
                nameNotation = createBeatNotationFromNoteValues([QUARTER_VALUE + EIGHTH_VALUE, EIGHTH_VALUE], currentOffset);
                offsetAmount = QUARTER_VALUE + QUARTER_VALUE;
                break;
            case RhythmName.TiTika:
                nameNotation = createBeatNotationFromNoteValues([EIGHTH_VALUE, SIXTEENTH_VALUE, SIXTEENTH_VALUE], currentOffset);
                break;
            case RhythmName.TimKa:
                nameNotation = createBeatNotationFromNoteValues([EIGHTH_VALUE + SIXTEENTH_VALUE, SIXTEENTH_VALUE], currentOffset);
                offsetAmount = QUARTER_VALUE;
                break;
            case RhythmName.Tika:
                nameNotation = createBeatNotationFromNoteValues([SIXTEENTH_VALUE, SIXTEENTH_VALUE], currentOffset);
                offsetAmount = EIGHTH_VALUE;
                break;
            case RhythmName.TikaTika:
                nameNotation = createBeatNotationFromNoteValues([SIXTEENTH_VALUE, SIXTEENTH_VALUE, SIXTEENTH_VALUE, SIXTEENTH_VALUE], currentOffset);
                break;
            case RhythmName.HalfRest:
                nameNotation = createBeatNotationFromNoteValues([EIGHTH_VALUE], currentOffset, 'z');
                offsetAmount = EIGHTH_VALUE;
                break;
            case RhythmName.Rest:
                nameNotation = createBeatNotationFromNoteValues([QUARTER_VALUE], currentOffset, 'z');
                break;
            case RhythmName.RestTi:
                nameNotation = createBeatNotationFromNoteValues([EIGHTH_VALUE], currentOffset, ' z');
                nameNotation.push(... createBeatNotationFromNoteValues([EIGHTH_VALUE], currentOffset + EIGHTH_VALUE));
                break;
            default:
                nameNotation = createBeatNotationFromNoteValues([QUARTER_VALUE], currentOffset);
                break;
        }

        beatNotations.push(...nameNotation);
        currentOffset += offsetAmount;
    })

    return beatNotations;
}

function createBeatNotationFromNoteValues(noteValues : number[], startingValue: number = 0, baseString: string = "c") : BeatNotation[] {
    const beatNotations : BeatNotation[] = [];
    let previousNote : BeatNotation;
    let previousLength : number;
    noteValues.forEach(noteValue => {
        let targetString = "";
        switch (noteValue) {
            case QUARTER_VALUE:
                targetString = `${baseString}`;
                break;
            case QUARTER_VALUE + EIGHTH_VALUE:
                targetString = `${baseString}3/2`;
                break;
            case EIGHTH_VALUE:
                targetString = `${baseString}/2`;
                break;
            case SIXTEENTH_VALUE + EIGHTH_VALUE:
                targetString = `${baseString}3/4`;
                break;
            case SIXTEENTH_VALUE:
                targetString = `${baseString}/4`;
                break;
        }       
        
        let newBeatNotation : BeatNotation 
        if (!previousNote) {
            if (noteValues.length === 1) {
                targetString += " ";
            }
            newBeatNotation = {
                startingBeatNumber: startingValue,
                notation: targetString
            }
        } else {
            if (targetString == previousNote.notation && noteValue !== SIXTEENTH_VALUE) {
                targetString += " ";
            }

            newBeatNotation = {
                startingBeatNumber: previousNote.startingBeatNumber + previousLength,
                notation: targetString
            }
        }

        beatNotations.push(newBeatNotation);
        previousLength = noteValue;
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