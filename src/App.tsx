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
import { getBeatNumbers, BeatInfo, createNextNote, isClickOnPattern } from './lib/rhythm/beatNotation';
import { setupSFX, SFXInfo, playSFX } from './lib/rhythm/playback';

const TICK_CHECK = 25;
const TEMPO = 500; //TODO: be able to change this
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
      successNotes: [],
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
      if (beat && beat.time <= state.audioContext.currentTime) {
        playMetronone(state.audioContext, sampleSfx, beat); 
        previewBeats(state.resources, beat);
        //playBeats(state.resources, state.audioContext, beat);

        if (beat.noteNumber % NOTES_PER_BAR === 0) {
          resetNotes(state.resources);
        }

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
      const beatPress = isClickOnPattern(state.audioContext.currentTime, state.scheduledBeat, resource.resourceInfo.pattern ?? [], TEMPO)
      if (!beatPress.isOnBeat) {
        const updatedResources = state.resources.map(resource => {
          if (resource.resource.isMatchingResourceType(resourceType)) {
            resource.successNotes = [];
          }
          return resource;
        })
        return {
          ...state,
          resources: updatedResources
        };
      }

      const updatedResources = modifiyResource(state.resources, resourceType, resource.resourceInfo.collectionAmount ?? 0);
      if (resourceAction.clickSFX) {
        playSFX(state.audioContext, resourceAction.clickSFX, state.audioContext.currentTime);
        updatedResources.map(resource => {
          if (resource.resource.isMatchingResourceType(resourceType)) {
            resource.successNotes.push(beatPress.beatNumber);
          }
        })
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

function playMetronone(audioContext : AudioContext, audioBuffer: AudioBuffer, note: BeatInfo) {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (!audioBuffer) {
    return;
  }

  const isNewBar = (note.noteNumber % NOTES_PER_BAR === 0);

  if (AUDIO_BEATS.includes(note.noteNumber)) {   
    const noteVolume = (isNewBar) ? 2 : .5;
    playSFX(audioContext, audioBuffer, note.time, noteVolume);
  }
}

function previewBeats(resources : ResourceData[], note : BeatInfo) {
  resources.map(resource => {
    if (!resource.isVisible) {
      return resource;
    }
    resource.shouldPress = resource.resource.resourceInfo.pattern?.includes(note.noteNumber);
  });
}

function playBeats(resources : ResourceData[], audioContext : AudioContext, note : BeatInfo) {
  resources.forEach(resource => {
    if (resource.shouldPress && resource.clickSFX) {
      playSFX(audioContext, resource.clickSFX, note.time);
      resource.isPlayed = true;
    } else {
      resource.isPlayed = false;
    }
  });
}

function resetNotes(resources : ResourceData[]) {
  resources.map(resource => {
    if (resource.successNotes.length == resource.resource.resourceInfo.pattern?.length) {
      resource.currentAmount += resource.resource.resourceInfo.completedBarAmount;
    }
    resource.successNotes = [];
  })
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
        promises.push(setupSFX(gameData.audioContext, resource.resource.resourceInfo.clickPathSFX));
      }
    });

    promises.push(setupSFX(gameData.audioContext, CLICK_PATH));

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
              //TODO: create field notes that can have resource nodes assigned to them
              return <ResourceNode key={data.resource.resourceInfo.resourceType} resourceData={data} keyCode={(index + 1).toString()} onClickCallback = {() => {
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

export default App
