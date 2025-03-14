export interface SFXInfo {
  sfx: AudioBuffer;
  path: string;
}

export async function setupSFX(audioContext : AudioContext, filePath: string) {
  // Here we're waiting for the load of the file
  // To be able to use this keyword we need to be within an `async` function
  const sample = await getFile(audioContext, filePath);
  return sample;
}

export async function getFile(audioContext : AudioContext, filepath : string) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const audioInfo : SFXInfo = {
    sfx: audioBuffer,
    path: filepath
  }
  return audioInfo;
}

export function playSFX(audioContext : AudioContext, audioBuffer: AudioBuffer, time : number, volume?: number) {
  const sampleSource = new AudioBufferSourceNode(audioContext, {
    buffer: audioBuffer,
    playbackRate: 1,
  });

  if (volume) {
    const gainNode = audioContext.createGain();
    sampleSource.connect(gainNode).connect(audioContext.destination);
    gainNode.gain.value = volume;
  } else {
    sampleSource.connect(audioContext.destination);
  }

  sampleSource.start(time);
  return sampleSource;
}