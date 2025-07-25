import { NOTES_PER_BAR, INPUT_DELAY, RHYTHM_LENIENCY} from "../definitions";

export type BeatInfo = {
    noteNumber: number,
    barNumber: number,
    time: number
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

export function isClickOnPattern(clickTime: number, upcomingBeat: BeatInfo, possibleBeatNumbers: number[], tempo : number) : BeatInfo | undefined {
  const pressTime = clickTime - INPUT_DELAY;
  const minTime = pressTime - RHYTHM_LENIENCY;
  const maxTime = pressTime + RHYTHM_LENIENCY;

  const possibleBeats : BeatInfo[] = [];
  if (upcomingBeat.time > minTime && upcomingBeat.time < maxTime) {
    possibleBeats.push(upcomingBeat);
  }

  let possibleBeat = getPreviousBeat(upcomingBeat, tempo);
  while (possibleBeat.time > minTime) {
    possibleBeats.push(possibleBeat);
    possibleBeat = getPreviousBeat(possibleBeat, tempo); 
  }

  possibleBeat = getNextBeat(upcomingBeat, tempo);
  while (possibleBeat.time < maxTime) {
    possibleBeats.push(possibleBeat);
    possibleBeat = getNextBeat(possibleBeat, tempo); 
  }

  const beatsInPattern = possibleBeats.filter(x => possibleBeatNumbers.includes(x.noteNumber));

  if (beatsInPattern.length === 0) {
    return undefined;
  }

  if (beatsInPattern.length === 1) {
    return beatsInPattern[0];
  }

  const possibleBeatsSortedByClosest = beatsInPattern.sort((a, b) => Math.abs(pressTime - a.time) - Math.abs(pressTime - b.time));

  return possibleBeatsSortedByClosest[0];
}

export function getNextBeat(currentBeat: BeatInfo, tempo : number) : BeatInfo {
    const note = (currentBeat.noteNumber + 1) % NOTES_PER_BAR;
    const barNumber = (note === 0) ? currentBeat.barNumber + 1 : currentBeat.barNumber;

    return {
        time:  getGapToNextTime(tempo) + currentBeat.time,
        noteNumber: note,
        barNumber: barNumber
    }
}

export function getPreviousBeat(upcomingBeat: BeatInfo, tempo : number) {
  const previousBeatNumber = getPreviousBeatNumber(upcomingBeat.noteNumber);
  const previousBarNumber = (previousBeatNumber === NOTES_PER_BAR - 1) ? upcomingBeat.barNumber - 1 : upcomingBeat.barNumber;

  return {
    time: upcomingBeat.time - getGapToNextTime(tempo),
    noteNumber: previousBeatNumber,
    barNumber: previousBarNumber
  } 
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