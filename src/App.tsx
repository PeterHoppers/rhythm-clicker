import { useEffect, useReducer } from 'react'
import { ResourceLibrary } from './data/resourceLibrary';
import { UpgradeLibrary } from './data/upgradeLibrary';
import './App.css'
import { ActionType, Resource, ResourceAction, ResourceData, ResourceType, Upgrade, ResourceTransaction, UpgradeType, UpgradeData } from './lib/definitions';
import ResourceDisplay from './component/ResourceDisplay';
import { useInterval } from './lib/useInterval';
import ResourceNode from './component/ResourceNode';
import UpgradeNode from './component/UpgradeNode';
import { NOTES_PER_BAR } from './lib/definitions';
import { getBeatNumbers } from './lib/rhythm/beatNotation';

const TICK_CHECK = 25;
const BEAT_LENGTH = .25;
const RHYTHM_LENIENCY = .25;
const INPUT_DELAY = .05;
const TEMPO = 100; //TODO: be able to change this
const AUDIO_BEATS = getBeatNumbers(4);
const CLICK_PATH = "metronone.wav";

let sampleSfx : AudioBuffer;

interface AppState {
  resources: ResourceData[],
  upgrades: Upgrade[],
  audioContext: AudioContext,
  scheduledBeat: BeatInfo
}

const initalState : AppState = {
  resources : createInitialResources(),
  upgrades : createUpgrades(), 
  audioContext: new AudioContext(),
  scheduledBeat: {time: 0, noteNumber: 0}
}

function createInitialResources() : ResourceData[] {
  const resources : ResourceData[] = [];
  {ResourceLibrary.map((resourceInfo) => (
    resources.push({
      resource: new Resource(resourceInfo),
      currentAmount: 0,
      isVisible: resourceInfo.startingResource
    })
  ))}

  return resources;
}

function createUpgrades() : Upgrade[] {
  const upgrades : Upgrade[] = [];
  {UpgradeLibrary.map((upgradeInfo) => (
    upgrades.push(new Upgrade(upgradeInfo))
  ))}

  return upgrades;
}


type UpgradeReturn = {
  upgrades:  Upgrade[],
  resources:  ResourceData[]
}
/**
 * Takes the resource info related to the resource and modifies it depending on the upgrade's information.
 * @param info 
 * @param upgrade 
 * @param modifier 
 * @returns 
 */
function performUpgrade(upgrade: UpgradeData, resources: ResourceData[], upgrades: Upgrade[]) : UpgradeReturn {
  switch (upgrade.upgradeType) {
    case UpgradeType.NewResource: {
      resources.map(resource => {
        if (!resource.resource.isMatchingResourceType(upgrade.resourceType)) {
          return resource;
        }

        resource.isVisible = true;
      });
      
      upgrades = upgrades.filter(x => x.upgradeInfo.data.upgradeType !== UpgradeType.NewResource && x.upgradeInfo.data.resourceType !== upgrade.resourceType);
    }
  }

  return {
    upgrades: upgrades,
    resources: resources
  };
}

/**
 * A standard reducer for modifying the state through actions, rather than creating a bunch of functions that called setState.
 * Each unique way to modify the state of the resources should have its own resource action and be implemented here.
 * @param state 
 * @param action 
 * @returns 
 */
function resourceReducer(state : AppState, action : ResourceAction) {
  switch (action.type) {
    case ActionType.TimePass: {
      if (state.audioContext.state === "suspended") {
        state.audioContext.resume();
        return state;
      }

      let beat = state.scheduledBeat;
      if (beat && beat.time <= state.audioContext.currentTime && sampleSfx) {
        playMetronone(state.audioContext, sampleSfx, beat); 
        beat = createNextNote(TEMPO, beat);
      }

      return {
        ...state,
        scheduledBeat: beat,
      };
    }
    case ActionType.Upgrade: {
      const upgradeAction = action.upgradeAction;
      if (!upgradeAction) {
        return state;
      }

      const upgradeReturns = performUpgrade(upgradeAction, state.resources, state.upgrades);

      return {
        ...state,
        resources: upgradeReturns.resources,
        upgrades: upgradeReturns.upgrades
      };
    }
    case ActionType.OnCollectResource: {
      const resourceAction = action.resourceAction;
      if (!resourceAction) {
        return state;
      }

      const resource = resourceAction.resource;
      const resourceType = resource.getResourceType();
      if (!isClickOnPattern(state.audioContext.currentTime, state.scheduledBeat, resource.resourceInfo.pattern ?? [])) {
        return state;
      }

      const updatedResources = modifiyResource(state.resources, resourceType, resource.resourceInfo.collectionAmount ?? 0);
      if (resourceAction.clickSFX) {
        playSample(state.audioContext, resourceAction.clickSFX, state.audioContext.currentTime);
      }      

      return {
        ...state,
        resources: updatedResources
      };
    }

    case ActionType.OnSpendResource: {
      if (!action.upgradeAction?.resourceType) {
        return state;
      }

      const updatedResources = modifiyResource(state.resources, action.upgradeAction?.resourceType, (action.upgradeAction?.modifier ?? 0) * -1);

      return {
        ...state,
        resources: updatedResources
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

function modifiyResource(resources : ResourceData[], resourceType : ResourceType, amount : number) : ResourceData[] {
  return resources.map(resourceData => {
    if (resourceData.resource.isMatchingResourceType(resourceType)) {
      const newAmount = resourceData.currentAmount + amount;
      resourceData.currentAmount = newAmount;
    }
    return resourceData;
  });
}

function isClickOnPattern(clickTime: number, upcomingBeat: BeatInfo, possibleBeatNumbers: number[]) : boolean {
  const pressTime = clickTime - INPUT_DELAY;
  let previousBeatNumber = upcomingBeat.noteNumber - 1;
  if (previousBeatNumber < 0) {
    previousBeatNumber = NOTES_PER_BAR - 1;
  }

  const previousBeat : BeatInfo = {
    time: upcomingBeat.time - getGapToNextTime(TEMPO),
    noteNumber: previousBeatNumber
  }

  const closerBeat = (upcomingBeat.time - pressTime < pressTime - previousBeat.time) ? upcomingBeat : previousBeat;
  if (!possibleBeatNumbers.includes(closerBeat.noteNumber)) {
    return false;
  }
  
  return (Math.abs(closerBeat.time - pressTime) <= RHYTHM_LENIENCY);
}

function playMetronone(audioContext : AudioContext, audioBuffer: AudioBuffer, note: BeatInfo) {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (AUDIO_BEATS.includes(note.noteNumber)) {   
    const stressedNote = (note.noteNumber % NOTES_PER_BAR === 0) ? 1.25 : .5;
    playSample(audioContext, audioBuffer, note.time, stressedNote);
  }
}

function playSample(audioContext : AudioContext, audioBuffer: AudioBuffer, time : number, volume?: number) {
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

interface SFXInfo {
  sfx: AudioBuffer;
  path: string;
}

async function setupSample(audioContext : AudioContext, filePath: string) {
  // Here we're waiting for the load of the file
  // To be able to use this keyword we need to be within an `async` function
  const sample = await getFile(audioContext, filePath);
  return sample;
}

async function getFile(audioContext : AudioContext, filepath : string) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const audioInfo : SFXInfo = {
    sfx: audioBuffer,
    path: filepath
  }
  return audioInfo;
}

function App() {
  const [gameData, dispatch] = useReducer(resourceReducer, initalState);

  const resourcesCollected : ResourceTransaction[] = gameData.resources.map(x => {
    return {
      resourceAmount: x.currentAmount,
      resourceType: x.resource.getResourceType()
    }
  });

  useInterval(() => {
    dispatch({
      type: ActionType.TimePass
    });   
  }, TICK_CHECK);

  useEffect(() => {
    const promises : Promise<SFXInfo>[] = [];

    gameData.resources.forEach(resource => {
      const path = resource.resource.resourceInfo.clickPathSFX;

      if (path && path !== "") {
        promises.push(setupSample(gameData.audioContext, resource.resource.resourceInfo.clickPathSFX));
      }
    });

    promises.push(setupSample(gameData.audioContext, CLICK_PATH));

    Promise.all(promises).then((values) => {
      values.forEach(sfxInfo => {
        const sfxPath = sfxInfo.path;
        if (sfxPath === CLICK_PATH) {
          sampleSfx = sfxInfo.sfx;
        } else {
          const resource = gameData.resources.find(x => x.resource.resourceInfo.clickPathSFX === sfxPath);
          if (resource) {
            resource.clickSFX = sfxInfo.sfx;
          }
        }
      });
    }).catch((rejected) => {
      console.log(rejected);
    });    
  }, [gameData.audioContext, gameData.resources])

  //render each of the resources on the top, the currency info in the middle, and the upgrades at the bottom
  return (
    <>
      <h1>Rhythm Clicker</h1>
      <div className='resource-main'>        
        <section className='resource-dashboard'>
          <h2>Resources Collected</h2>
          <div className='resource-dashboard__holder'>
            {gameData.resources.filter(x => x.isVisible).map((data) => {
              return <ResourceDisplay key={data.resource.resourceInfo.resourceType} resourceData={data} />
            })}
          </div>        
        </section>

        <section className='currency-section'>
          <h2>Resource Field</h2>
          <div className='currency-section__holder'>
            {gameData.resources.filter(x => x.isVisible).map((data, index) => {
              return <ResourceNode key={data.resource.resourceInfo.resourceType} resourceData={data} keyCode={index.toString()} onClickCallback = {() => {
                dispatch({
                  type: ActionType.OnCollectResource,
                  resourceAction: data
                })
              }}/>
            })}      
          </div>
        </section>

        <section className='upgrade-section'>
          <h2>Upgrades</h2>
          <div className='upgrade-section__holder'>
            {gameData.upgrades.map((upgrade) => {
              return <UpgradeNode key={upgrade.upgradeInfo.displayName} upgrade={upgrade} dispatch={dispatch} currentResources={resourcesCollected}/>
            })}
          </div>
        </section>
      </div>
    </>    
  )
}

function createNextNote(tempo : number, currentBeat: BeatInfo) : BeatInfo {
  const nextNoteTime = getGapToNextTime(tempo) + currentBeat.time;
  const note = (currentBeat.noteNumber + 1) % NOTES_PER_BAR;

  return {
    noteNumber: note,
    time: nextNoteTime
  }
}

function getGapToNextTime(tempo: number) {
  // Advance current note and time by a 16th note...
  const secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
  // tempo value to calculate beat length.
  return (BEAT_LENGTH * secondsPerBeat);   // Add beat length to last beat time
}

interface BeatInfo {
  noteNumber: number,
  time: number
}

export default App
