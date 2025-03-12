import { useEffect, useReducer } from 'react'
import { ResourceLibrary, MoneyInfo } from './data/resourceLibrary';
import { UpgradeLibrary } from './data/upgradeLibrary';
import './App.css'
import { ActionType, Resource, ResourceAction, ResourceData, ResourceInfo, ResourceType, Upgrade, UpgradeType } from './lib/definitions';
import ResourceDisplay from './component/ResourceDisplay';
import { useInterval } from './lib/useInterval';
import ResourceNode from './component/ResourceNode';
import UpgradeNode from './component/UpgradeNode';
import { NOTES_PER_BAR } from './lib/definitions';
import { getBeatNumbers } from './lib/rhythm/beatNotation';

const TICK_CHECK = 25;
const BEAT_LENGTH = .25;
const RHYTHM_LENIENCY = .125;
const INPUT_DELAY = .05;
const TEMPO = 100; //TODO: be able to change this
const AUDIO_BEATS = getBeatNumbers(4);

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
      currentAmount: 0
    })
  ))}

  resources.push({
    resource: new Resource(MoneyInfo),
    currentAmount: 0
  })

  return resources;
}

function createUpgrades() : Upgrade[] {
  const upgrades : Upgrade[] = [];
  {UpgradeLibrary.map((upgradeInfo) => (
    upgrades.push(new Upgrade(upgradeInfo))
  ))}

  return upgrades;
}

/**
 * Takes the resource info related to the resource and modifies it depending on the upgrade's information.
 * @param info 
 * @param upgrade 
 * @param modifier 
 * @returns 
 */
function performUpgrade(info: ResourceInfo, upgrade: UpgradeType, modifier: number) : ResourceInfo {
  switch (upgrade) {
    case UpgradeType.CollectionRate: {
      const newRate = info.collectionRate + modifier;
      info.collectionRate = newRate;
      break;
    }
    case UpgradeType.Capacity: {
      const newRate = info.maxCapacity + modifier;
      info.maxCapacity = newRate;
      break;
    }
  }

  return info;
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
        playNote(state.audioContext, sampleSfx, beat); 
        beat = createNextNote(TEMPO, beat);
      }

      return {
        ...state,
        scheduledBeat: beat,
      };
    }
    case ActionType.Upgrade: {
      const updatedResources = state.resources.map(resourceData => {
        if (resourceData.resource.isMatchingResourceType(action.upgradeAction?.resourceType)) {
          const upgradeType = action.upgradeAction?.upgradeType;
          if (upgradeType !== undefined) {
            resourceData.resource.resourceInfo = performUpgrade(resourceData.resource.resourceInfo, upgradeType, action.upgradeAction?.modifier ?? 0);
          }
        } 

        return resourceData;
      });

      return {
        ...state,
        resources: updatedResources
      };
    }
    case ActionType.OnCollectResource: {
      if (!action.resourceAction?.resourceType) {
        return state;
      }

      if (!isClickOnPattern(state.audioContext.currentTime, state.scheduledBeat, action.resourceAction?.pattern ?? [])) {
        return state;
      }


      const updatedResources = modifiyResource(state.resources, action.resourceAction?.resourceType, action.resourceAction.collectionRate);

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
    console.log(closerBeat.noteNumber, possibleBeatNumbers);
    return false;
  }
  
  const isOnBeat =  (Math.abs(closerBeat.time - pressTime) <= RHYTHM_LENIENCY); 
  
  return isOnBeat;
}

function playNote(audioContext : AudioContext, audioBuffer: AudioBuffer, note: BeatInfo) {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (AUDIO_BEATS.includes(note.noteNumber)) {
    playSample(audioContext, audioBuffer, note.time);  
  }
}

function playSample(audioContext : AudioContext, audioBuffer: AudioBuffer, time : number) {
  const sampleSource = new AudioBufferSourceNode(audioContext, {
    buffer: audioBuffer,
    playbackRate: 1,
  });
  sampleSource.connect(audioContext.destination);
  sampleSource.start(time);
  return sampleSource;
}

async function setupSample(audioContext : AudioContext) {
  const filePath = "Kick_Not Weird.wav";
  // Here we're waiting for the load of the file
  // To be able to use this keyword we need to be within an `async` function
  const sample = await getFile(audioContext, filePath);
  return sample;
}

async function getFile(audioContext : AudioContext, filepath : string) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function App() {
  const [gameData, dispatch] = useReducer(resourceReducer, initalState);

  useInterval(() => {
    dispatch({
      type: ActionType.TimePass
    });   
  }, TICK_CHECK);

  useEffect(() => {
    setupSample(gameData.audioContext).then((sample) => {
      sampleSfx = sample;
    });
    
  }, [gameData.audioContext])

  //render each of the resources on the top, the currency info in the middle, and the upgrades at the bottom
  return (
    <>
      <h1>Rhythm Clicker</h1>
      <div className='resource-main'>        
        <section className='resource-dashboard'>
          <h2>Resources Collected</h2>
          <div className='resource-dashboard__holder'>
            {gameData.resources.map((data) => {
              return <ResourceDisplay key={data.resource.resourceInfo.resourceType} resourceData={data} />
            })}
          </div>        
        </section>

        <section className='currency-section'>
          <h2>Resource Field</h2>
          <div className='currency-section__holder'>
            {gameData.resources.map((data, index) => {
              return <ResourceNode key={data.resource.resourceInfo.resourceType} resourceData={data} keyCode={index.toString()} onClickCallback = {() => {
                dispatch({
                  type: ActionType.OnCollectResource,
                  resourceAction: data.resource.resourceInfo
                })
              }}/>
            })}      
          </div>
        </section>

        <section className='upgrade-section'>
          <h2>Upgrades</h2>
          <div className='upgrade-section__holder'>
            {gameData.upgrades.map((upgrade) => {
              return <UpgradeNode key={upgrade.upgradeInfo.displayName} upgrade={upgrade} dispatch={dispatch} currentCurrency={0}/>
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
