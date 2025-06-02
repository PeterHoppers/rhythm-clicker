import { useEffect, useReducer } from 'react'
import { ResourceLibrary, ResourceHybrids } from './data/resourceLibrary';
import { UpgradeLibrary } from './data/upgradeLibrary';
import './App.css'
import { ActionType, Resource, GameAction, ResourceData, ResourceType, Upgrade, ResourceTransaction, UpgradeType, ResourceState } from './lib/definitions';
import ResourceDisplay from './component/ResourceDisplay';
import { useInterval } from './lib/useInterval';
import ResourceNode from './component/ResourceNode';
import UpgradeNode from './component/UpgradeNode';
import { NOTES_PER_BAR } from './lib/definitions';
import { getBeatNumbers, BeatInfo, createNextNote, isClickOnPattern, getPreviousBeatNumber, getPreviousBeat } from './lib/rhythm/beatNotation';
import { setupSFX, SFXInfo, playSFX } from './lib/rhythm/playback';
import MetronomeVisual from './component/Notation/MetronomeVisual';

const TICK_CHECK = 25;
const TEMPO = 400; //TODO: be able to change this
const AUDIO_BEATS = getBeatNumbers(4);
const CLICK_PATH = "metronone.wav";

let sampleSfx : AudioBuffer;

interface AppState {
  resources: ResourceData[],
  upgrades: Upgrade[],
  audioContext: AudioContext,
  scheduledBeat: BeatInfo,
  bottomRendererNotes?: string
}

const initalState : AppState = {
  resources : createInitialResources(),
  upgrades : createUpgrades(), 
  audioContext: new AudioContext(),
  scheduledBeat: {time: 0, noteNumber: 0, barNumber: 0}
}

function createInitialResources() : ResourceData[] {
  const resources : ResourceData[] = [];
  {ResourceLibrary.forEach(resourceInfo => {
    let startingState : ResourceState;
    if (resourceInfo.startingResource) {
      startingState = ResourceState.Clickable;
    } else {
      startingState = ResourceState.Hidden;
    }

    resources.push({
      resource: new Resource(resourceInfo),
      currentAmount: 0,
      successNotes: [],
      interactionState: startingState
    })
  })}

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
 * A standard reducer for modifying the state through actions, rather than creating a bunch of functions that called setState.
 * Each unique way to modify the state of the resources should have its own resource action and be implemented here.
 * @param state 
 * @param action 
 * @returns 
 */
function resourceReducer(state : AppState, action : GameAction) {
  switch (action.type) {
    case ActionType.TimePass: {
      if (state.audioContext.state === "suspended") {
        state.audioContext.resume();
        return state;
      }

      const updatedResources = state.resources;
      let beat = state.scheduledBeat;
      if (beat && beat.time <= state.audioContext.currentTime) {
        playMetronone(state.audioContext, sampleSfx, beat); 
        visualizeBeats(state.resources, beat);
        previewBeats(state.resources, state.audioContext, beat);

        if (beat.noteNumber % NOTES_PER_BAR === 0) {
          resetNotes(state.resources);
        }
        
        const previousBeat = getPreviousBeat(beat, TEMPO);
        updatedResources.map(data => {
          const pattern = data.resource.resourceInfo.pattern ?? [];
          if (pattern.includes(previousBeat.noteNumber)) {
            if (data.successNotes.findIndex(x => x.barNumber === previousBeat.barNumber && x.noteNumber === previousBeat.noteNumber) === -1) {
              data.successNotes = data.successNotes.slice(1);
            } else {
              if (isPatternCompleted(data.successNotes, pattern)) {
                data.successNotes = data.successNotes.slice(0, pattern.length);
              }              
            }
            
          }
        });

        beat = createNextNote(TEMPO, beat);
      }

      return {
        ...state,        
        scheduledBeat: beat,
        resources: updatedResources,
      };
    }
    
    case ActionType.Upgrade: {
      if (!action.effect) {
        return state;
      }

      const upgrade = action.effect;
      let newResource : ResourceData[] = state.resources;
      let newUpgrades : Upgrade[] = state.upgrades;

      switch (upgrade.upgradeType) {
        case UpgradeType.NewResource: {
          newResource = state.resources.map(resource => {
            if (!resource.resource.isMatchingResourceType(upgrade.resourceType)) {
              return resource;
            }
    
            resource.interactionState = ResourceState.Clickable;
            return resource;
          });
          
          newUpgrades = state.upgrades.filter(x => x.upgradeInfo.effect.resourceType !== upgrade.resourceType);
          break;
        }
        case UpgradeType.CollectionIncrease: {
          newResource = state.resources.map(resource => {
            if (!resource.resource.isMatchingResourceType(upgrade.resourceType)) {
              return resource;
            }
    
            resource.resource.resourceInfo.collectionAmount += upgrade.modifier ?? 0;
            resource.resource.resourceInfo.completedBarAmount += upgrade.modifier ?? 0;
            return resource;
          });
          break;
        }
        default:
          break;
      }

      return {
        ...state,
        resources: newResource,
        upgrades: newUpgrades
      }
    }
    
    case ActionType.OnCollectResource: {
      const effect = action.effect;
      if (!effect) {
        return state;
      }

      const resourceType = effect.resourceType;
      const resourceData = state.resources.find(x => x.resource.isMatchingResourceType(resourceType));
      if (!resourceData || !resourceType) {
        return state;
      }
      const resource = resourceData.resource;
      const resourceInfo = resource.resourceInfo;
      const beatPress = isClickOnPattern(state.audioContext.currentTime, state.scheduledBeat, resourceInfo.pattern ?? [], TEMPO);
      if (!beatPress.isOnBeat) {
        const updatedResources = state.resources.map(resource => {
          if (resource.resource.isMatchingResourceType(resourceType)) {
            resource.successNotes = resource.successNotes.slice(0, -1);
            resource.isPreviewed = false;
          }
          return resource;
        })
        return {
          ...state,
          resources: updatedResources
        };
      }

      const updatedResources = modifiyResource(state.resources, resourceType, resourceInfo.collectionAmount ?? 0);
      
      if (resourceData.clickSFX) {
        playSFX(state.audioContext, resourceData.clickSFX, state.audioContext.currentTime);        
      }    
      
      updatedResources.map(data => {
        if (data.resource.isMatchingResourceType(resourceType) && !data.successNotes.includes(beatPress.beatInfo)) {
          data.successNotes.push(beatPress.beatInfo);
          if (isPatternCompleted(data.successNotes, data.resource.resourceInfo.pattern ?? [])) {
            data.currentAmount += data.resource.resourceInfo.completedBarAmount;
          }
        }
      });

      const resourceCompleted = updatedResources.filter(re => isPatternCompleted(re.successNotes, re.resource.resourceInfo.pattern ?? [])).map(x => x.resource.getResourceType());

      if (resourceCompleted.length > 1) {
        ResourceHybrids.forEach(hybrid => {
          const isCompeleted = hybrid.completed.every(x => resourceCompleted.includes(x));
          if (isCompeleted) {
            updatedResources.map(data => {
              if (data.resource.isMatchingResourceType(hybrid.made)) {
                if (data.interactionState === ResourceState.Hidden) {
                  data.interactionState = ResourceState.Gainable;
                }
      
                data.currentAmount += data.resource.resourceInfo.collectionAmount;
              }
      
              return data;
            })
          }
        });
      }

      return {
        ...state,
        resources: updatedResources
      };
    }

    case ActionType.OnSpendResource: {
      const resourceType = action.effect.resourceType;
      if (!resourceType) {
        return state;
      }

      const updatedResources = modifiyResource(state.resources, resourceType, (action.effect?.modifier ?? 0) * -1);

      return {
        ...state,
        resources: updatedResources
      };
    }

    case ActionType.OnPreviewResource: {
      const resourceType = action.effect.resourceType;
      if (!resourceType) {
        return state;
      }

      const isPreviewing = action.effect.modifier === 1;
      let meternoneNotes = undefined;

      const updatedResources = state.resources.map(resourceData => {
        if (resourceData.resource.isMatchingResourceType(resourceType)) {
          resourceData.isPreviewed = isPreviewing;

          if (isPreviewing) {
            meternoneNotes = resourceData.resource.resourceInfo.patternNotation;
          }
        }
        return resourceData;
      });

      return {
        ...state,
        resources: updatedResources,
        bottomRendererNotes : meternoneNotes
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

function visualizeBeats(resources : ResourceData[], note : BeatInfo) {
  resources.map(resource => {
    if (resource.interactionState !== ResourceState.Clickable) {
      return resource;
    }
    resource.shouldPress = resource.resource.resourceInfo.pattern?.includes(note.noteNumber);
  });
}

function previewBeats(resources : ResourceData[], audioContext : AudioContext, note : BeatInfo) {
  resources.forEach(resource => {
    if (resource.shouldPress && resource.clickSFX && resource.isPreviewed) {
      playSFX(audioContext, resource.clickSFX, note.time);
    }
  });
}

function isPatternCompleted(successNotes : BeatInfo[], pattern: number[]) : boolean {
  return successNotes.length >= pattern.length;
}

function resetNotes(resources : ResourceData[]) {
  resources.map(data => {
    if (data.successNotes.length === 0) {
      return data;
    }

    //data.successNotes = data.successNotes.slice(0, -2);
    return data;
  });
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
      type: ActionType.TimePass,
      effect: {}
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
      console.log(`${rejected}`);
    });    
  }, [gameData.audioContext, gameData.resources]);

  //render each of the resources on the top, the currency info in the middle, and the upgrades at the bottom
  return (
    <div className='resource-app'>
      <h1 className='resource-title'>Rhythm Clicker</h1>
      <main className='resource-main'>        
        <section className='resource-dashboard'>
          <h2>Resources Collected</h2>
          <div className='resource-dashboard__holder'>
            {gameData.resources.filter(x => x.interactionState !== ResourceState.Hidden).map((data) => {
              return <ResourceDisplay key={data.resource.resourceInfo.resourceType} resourceData={data} dispatch={dispatch} />
            })}
          </div>        
        </section>

        <section className='currency-section'>
          <h2 className='resource-title'>Resource Field</h2>
          <div className='currency-section__holder'>
            {gameData.resources.map((data, index) => {
              const resourceType = data.resource.getResourceType();
              //TODO: create field notes that can have resource nodes assigned to them
              return <ResourceNode key={resourceType} resourceData={data} keyCode={(index + 1).toString()} onClickCallback = {() => {
                dispatch({
                  type: ActionType.OnCollectResource,
                  effect: {
                    resourceType: resourceType
                  }
                })
              }}/>
            })}      
          </div>
          <MetronomeVisual beatToRender={Math.floor(getPreviousBeatNumber(gameData.scheduledBeat.noteNumber) / 2)} notesToDisplay={gameData.bottomRendererNotes}/>
        </section>       
      </main>
      <div className='resource-side'>   
        <section className='upgrade-section'>
          <h2>Upgrades</h2>
          <div className='upgrade-section__holder'>
            {gameData.upgrades.map((upgrade) => {
              return <UpgradeNode key={upgrade.upgradeInfo.displayName} upgrade={upgrade} dispatch={dispatch} currentResources={resourcesCollected}/>
            })}
          </div>
        </section>
      </div>
    </div>    
  )
}

export default App
