import { NOTES_PER_BAR, INPUT_DELAY, RHYTHM_LENIENCY} from "../definitions";

export type BeatInfo = {
    noteNumber: number,
    barNumber: number,
    time: number
}  

export type BeatPress = {
  isOnBeat: boolean,
  beatInfo: BeatInfo
}

export type BeatNotation = {
  notation: string,
  startingBeatNumber: number
}

export function getNotationFromBeatNotation(beats : BeatNotation[]) : string {
  let patternNotation: string = "";
  beats.sort(x => x.startingBeatNumber).forEach(x => {
    patternNotation += x.notation;
  });

  return patternNotation;
}

export function getBeatNumbers(numberOfBeats : number, offset? : number) : number[] {
    const noteNumbers : number[] = [];

    for (let start = 0; start < NOTES_PER_BAR; start += (NOTES_PER_BAR / numberOfBeats)) {
        noteNumbers.push(start + (offset ?? 0));
    } 

    return noteNumbers;
}

export function isClickOnPattern(clickTime: number, upcomingBeat: BeatInfo, possibleBeatNumbers: number[], tempo : number) : BeatPress {
  const pressTime = clickTime - INPUT_DELAY;
  const previousBeat = getPreviousBeat(upcomingBeat, tempo);
 

  //determine which note was trying to be hit by looking to see if eitehr of them are valid notes
  const isPreviousValid = possibleBeatNumbers.includes(previousBeat.noteNumber);
  const isUpcomingValid = possibleBeatNumbers.includes(upcomingBeat.noteNumber);

  let targetBeat : BeatInfo;
  if (isPreviousValid && !isUpcomingValid) {
    targetBeat = previousBeat;
  } else if (!isPreviousValid && isUpcomingValid) {
    targetBeat = upcomingBeat
  } else if (isPreviousValid && isUpcomingValid) {
    targetBeat = (Math.abs(upcomingBeat.time - pressTime) < Math.abs(pressTime - previousBeat.time)) ? upcomingBeat : previousBeat;
  } else {
    return {
      isOnBeat: false,
      beatInfo: upcomingBeat
    };
  }

  const isOnBeat = (Math.abs(targetBeat.time - pressTime) <= RHYTHM_LENIENCY);  
  return {
    isOnBeat: isOnBeat,
    beatInfo: targetBeat
  };
}

export function createNextNote(tempo : number, currentBeat: BeatInfo) : BeatInfo {
    const nextNoteTime = getGapToNextTime(tempo) + currentBeat.time;
    const note = (currentBeat.noteNumber + 1) % NOTES_PER_BAR;
    const barNumber = (note === 0) ? currentBeat.barNumber + 1 : currentBeat.barNumber;

    return {
        noteNumber: note,
        time: nextNoteTime,
        barNumber: barNumber
    }
}

export function getPreviousBeat(upcomingBeat: BeatInfo, tempo : number) {
  const previousBeatNumber = getPreviousBeatNumber(upcomingBeat.noteNumber);
  const previousBarNumber = (previousBeatNumber === NOTES_PER_BAR - 1) ? upcomingBeat.barNumber - 1 : upcomingBeat.barNumber;

  const previousBeat : BeatInfo = {
    time: upcomingBeat.time - getGapToNextTime(tempo),
    noteNumber: previousBeatNumber,
    barNumber: previousBarNumber
  }  

  return previousBeat;
}

export function getPreviousBeatNumber(currentBeatNumber : number) {
  let previousBeatNumber = currentBeatNumber - 1;
  if (previousBeatNumber < 0) {
    previousBeatNumber = NOTES_PER_BAR - 1;
  }
  return previousBeatNumber;
}
  
function getGapToNextTime(tempo: number) {
    // Advance current note and time by a 16th note...
    const secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
    // tempo value to calculate beat length.
    return (secondsPerBeat);   // Add beat length to last beat time
}