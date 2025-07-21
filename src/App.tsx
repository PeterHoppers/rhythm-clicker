import { useEffect, useReducer } from 'react'
import { ResourceLibrary, ResourceHybrids } from './data/resourceLibrary';
import { UpgradeLibrary } from './data/upgradeLibrary';
import './App.css'
import { ActionType, Resource, GameAction, ResourceData, ResourceType, Upgrade, ResourceTransaction, UpgradeType, ResourceState, PressPreviewType, URL_ROOT } from './lib/definitions';
import ResourceDisplay from './component/ResourceDisplay';
import { useInterval } from './lib/useInterval';
import ResourceNode from './component/ResourceNode';
import UpgradeNode from './component/UpgradeNode';
import { QUARTERS_PER_PHRASE, ResourceDictionary } from './lib/definitions';
import { getBeatNumbers, BeatInfo, BeatNotation, createNextNote, isClickOnPattern, getPreviousBeatNumber, getPreviousBeat } from './lib/rhythm/beatNotation';
import { setupSFX, SFXInfo, playSFX } from './lib/rhythm/playback';
import MetronomeVisual from './component/Notation/MetronomeVisual';
import Sidebar from './component/Sidebar/Sidebar';
import { LogInfo } from './lib/logger';

const TICK_CHECK = 25;
const TEMPO = 150 * QUARTERS_PER_PHRASE; //TODO: be able to change this
const AUDIO_BEATS = getBeatNumbers(QUARTERS_PER_PHRASE);
const CLICK_PATH = `${URL_ROOT}/metronone.wav`;

let sampleSfx : AudioBuffer;

interface AppState {
  resources: ResourceDictionary,
  upgrades: Upgrade[],
  audioContext: AudioContext,
  scheduledBeat: BeatInfo,
  bottomRendererNotes?: BeatNotation[]
  previewingResource?: ResourceType
}

const initalState : AppState = {
  resources : createInitialResources(),
  upgrades : createUpgrades(), 
  audioContext: new AudioContext(),
  scheduledBeat: {time: 0, noteNumber: 0, barNumber: 0}
}

function createInitialResources() : ResourceDictionary {
  const resources : ResourceDictionary = new ResourceDictionary();
  let type : keyof typeof ResourceType;
  for (type in ResourceType) {
    let startingState : ResourceState = ResourceState.Hidden;
    let targetResourceInfo = ResourceLibrary.find(x => x.resourceType === type);
    if (!targetResourceInfo) {
      targetResourceInfo = {
        resourceType: ResourceType[type],
        isCollectable: false
      }
    } else {
      targetResourceInfo.isCollectable = true;
    }

    if (targetResourceInfo.startingResource) {
      if (targetResourceInfo.isCollectable) {
        startingState = ResourceState.Clickable;
      } else {
        startingState = ResourceState.Gainable;
      }      
    }

    resources.setData(ResourceType[type], {
      resource: new Resource(targetResourceInfo),
      currentAmount: 0,
      successNotes: [],
      interactionState: startingState
    });
  }

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

      const currentResource = state.resources.getAllData();
      const beat = state.scheduledBeat;
      if (!beat || beat.time > state.audioContext.currentTime) {
        return state;
      }

      const previewingResource = state.previewingResource;
      const nextBeat = createNextNote(TEMPO, beat);
      visualizeBeats(currentResource, beat, previewingResource);
      if (previewingResource) {
        const targetResource = state.resources.getData(previewingResource);

        if (targetResource) {
          previewResource(targetResource, state.audioContext, beat);
        }

        return {
          ...state,        
          scheduledBeat: nextBeat
        };
      }

      playMetronone(state.audioContext, sampleSfx, beat); 
      const previousBeat = getPreviousBeat(beat, TEMPO);
      const updatedResources = currentResource.map(data => {
        const pattern = data.resource.getPatternNotes();
        if (pattern.includes(previousBeat.noteNumber)) {
          if (data.successNotes.findIndex(x => x.barNumber === previousBeat.barNumber && x.noteNumber === previousBeat.noteNumber) === -1) {
            data.successNotes = data.successNotes.slice(1);
          } else {
            if (isPatternCompleted(data.successNotes, pattern)) {
              data.successNotes = data.successNotes.slice(0, pattern.length);
            }              
          }
        }
        return data;
      });

      state.resources.setAllData(updatedResources);            

      return {
        ...state,        
        scheduledBeat: nextBeat
      };
    }
    
    case ActionType.Upgrade: {
      if (!action.effect) {
        return state;
      }

      const upgrade = action.effect;
      let newUpgrades : Upgrade[] = state.upgrades;
      const resourceType = upgrade.resourceType;
      if (!resourceType) {
        return state;
      }

      const resourceData = state.resources.getData(resourceType);
      if (!resourceData) {
        return state;
      }

      switch (upgrade.upgradeType) {
        case UpgradeType.NewResource: {
          resourceData.interactionState = ResourceState.Clickable;
          newUpgrades = state.upgrades.filter(x => x.upgradeInfo.effect.resourceType !== upgrade.resourceType);
          break;
        }
        case UpgradeType.CollectionIncrease: {
          if (!resourceData.resource.resourceInfo.completedBarAmount) {
            resourceData.resource.resourceInfo.completedBarAmount = 0;
          }
          resourceData.resource.resourceInfo.completedBarAmount += upgrade.modifier ?? 0;
          break;
        }
        default:
          break;
      }

      state.resources.setData(resourceType, resourceData);
      return {
        ...state,
        upgrades: newUpgrades
      }
    }
    
    case ActionType.OnCollectResource: {
      const effect = action.effect;
      if (!effect) {
        return state;
      }

      const resourceType = effect.resourceType;
      if (!resourceType) {
        return state;
      }
      
      let resourceData = state.resources.getData(resourceType);
      if (!resourceData) {
        return state;
      }

      const resource = resourceData.resource;
      const beatPress = isClickOnPattern(state.audioContext.currentTime, state.scheduledBeat, resource.getPatternNotes(), TEMPO);
      LogInfo(`${beatPress.beatInfo.time} for ${resource.getResourceType()}`);
      const alreadyPressedNotes = resourceData.successNotes.find(x => x.barNumber == beatPress.beatInfo.barNumber && x.noteNumber == beatPress.beatInfo.noteNumber);
      if (!beatPress.isOnBeat || alreadyPressedNotes) {
        resourceData.successNotes = resourceData.successNotes.slice(0, -1);
        resourceData.areNotesDisplayed = false;
        
        state.resources.setData(resourceType, resourceData);
        return {
          ...state,
          previewingResource: undefined
        };
      }

      resourceData = modifiyResource(resourceData, resource.getCollectionAmount());
      
      if (resourceData.clickSFX) {
        playSFX(state.audioContext, resourceData.clickSFX, state.audioContext.currentTime);        
      }    

      if (!resourceData.successNotes.includes(beatPress.beatInfo)) {
        resourceData.successNotes.push(beatPress.beatInfo);
        if (isPatternCompleted(resourceData.successNotes, resourceData.resource.getPatternNotes())) {
          resourceData.currentAmount += resourceData.resource.getCompletedPatternAmount();
        }
      }      

      state.resources.setData(resourceType, resourceData);    
      const updatedResources = updateCompletedPatterns(state.resources.getAllData());
      state.resources.setAllData(updatedResources);

      return {
        ...state,   
        previewingResource: undefined
      };
    }

    case ActionType.OnSpendResource: {
      const resourceType = action.effect.resourceType;
      if (!resourceType) {
        return state;
      }

      let resourceData = state.resources.getData(resourceType);
      if (!resourceData) {
        return state;
      }

      resourceData = modifiyResource(resourceData, (action.effect?.modifier ?? 0) * -1);
      state.resources.setData(resourceType, resourceData);

      return {
        ...state,
      };
    }

    case ActionType.OnUpdateNotesWithResource: {
      const resourceType = action.effect.resourceType;
      if (!resourceType) {
        return state;
      }

      if (state.previewingResource) {
        return state;
      }

      const targetResource =  state.resources.getData(resourceType);
      if (!targetResource) {
        return state;
      }

      const isAddingNotes = action.effect.modifier === 1;
      let meternoneNotes = undefined;     

      targetResource.areNotesDisplayed = isAddingNotes;
      if (isAddingNotes) {
        meternoneNotes = targetResource.resource.getPatternNotation();
      }

      state.resources.setData(resourceType, targetResource);

      return {
        ...state,
        bottomRendererNotes : meternoneNotes
      };
    }

    case ActionType.OnPreviewPattern: {
      const resourceType = action.effect.resourceType;
      if (!resourceType) {
        return state;
      }

      if (state.previewingResource === resourceType) {
          return {
          ...state,
          previewingResource : undefined,
          bottomRendererNotes : undefined
        };
      }

      const resourceData = state.resources.getData(resourceType);
      if (!resourceData) {
        return state;
      }

      resourceData.areNotesDisplayed = true;
      const meternoneNotes = resourceData.resource.getPatternNotation();
      state.resources.setData(resourceType, resourceData);

      return {
        ...state,
        previewingResource : resourceType,
        bottomRendererNotes : meternoneNotes
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

function modifiyResource(resource : ResourceData, amount : number) : ResourceData {
  const newAmount = resource.currentAmount + amount;
  resource.currentAmount = newAmount;
  return resource;
}

function playMetronone(audioContext : AudioContext, audioBuffer: AudioBuffer, note: BeatInfo) {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (!audioBuffer) {
    return;
  }

  const isNewBar = (note.noteNumber === 0);

  if (AUDIO_BEATS.includes(note.noteNumber)) {
    const noteVolume = (isNewBar) ? .75 : .25;
    playSFX(audioContext, audioBuffer, note.time, noteVolume);
  }
}

function visualizeBeats(resources : ResourceData[], note : BeatInfo, previewingBeat: ResourceType | undefined) {
  resources.map(resource => {
    if (resource.interactionState !== ResourceState.Clickable) {
      return resource;
    }

    if (previewingBeat && !resource.resource.isMatchingResourceType(previewingBeat)) {
      resource.pressPreviewState = PressPreviewType.None;
      return resource;
    }

    visualizeBeat(resource, note);
  });
}

function visualizeBeat(resource: ResourceData, note: BeatInfo) {
  const pattern = resource.resource.getPatternNotes();
  if (pattern.includes(note.noteNumber)) {
    resource.pressPreviewState = PressPreviewType.NoteIncluded;
  } else {
    const nextNote = createNextNote(TEMPO, note);
    if (pattern.includes(nextNote.noteNumber)) {
      resource.pressPreviewState = PressPreviewType.NoteBefore;        
    } else {
      resource.pressPreviewState = PressPreviewType.None;
    }
  }
}

function previewResource(resource : ResourceData, audioContext : AudioContext, note : BeatInfo) {
  if (resource.pressPreviewState == PressPreviewType.NoteIncluded && resource.clickSFX) {
    playSFX(audioContext, resource.clickSFX, note.time);
  }
}

function toggleResourcePreview(dispatch: React.ActionDispatch<[action: GameAction]>, resourceType: ResourceType, isAddingNotes: boolean ) {
  dispatch({
      type: ActionType.OnUpdateNotesWithResource,
      effect: {
          resourceType: resourceType,
          modifier: (isAddingNotes) ? 1 : 0
      }                   
  });
}

function isPatternCompleted(successNotes : BeatInfo[], pattern: number[]) : boolean {
  return successNotes.length >= pattern.length;
}

function updateCompletedPatterns(resources : ResourceData[]) : ResourceData[]{
  const resourceCompleted = resources.filter(re => isPatternCompleted(re.successNotes, re.resource.getPatternNotes())).map(x => x.resource.getResourceType());

  if (resourceCompleted.length > 1) {
    ResourceHybrids.forEach(hybrid => {
      const isCompeleted = hybrid.completed.every(x => resourceCompleted.includes(x));
      if (isCompeleted) {
        resources.map(data => {
          if (data.resource.isMatchingResourceType(hybrid.made)) {
            if (data.interactionState === ResourceState.Hidden) {
              data.interactionState = ResourceState.Gainable;
            }
  
            data.currentAmount += data.resource.getCompletedPatternAmount();
          }
  
          return data;
        })
      }
    });
  }

  return resources;
}

function App() {
  const [gameData, dispatch] = useReducer(resourceReducer, initalState);

  const resourcesCollected : ResourceTransaction[] = gameData.resources.getAllData().map(x => {
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

    gameData.resources.getAllData().forEach(resource => {
      const path = resource.resource.resourceInfo.clickPathSFX;

      if (path && path !== "") {
        promises.push(setupSFX(gameData.audioContext, path));
      }
    });

    promises.push(setupSFX(gameData.audioContext, CLICK_PATH));

    Promise.all(promises).then((values) => {
      values.forEach(sfxInfo => {
        const sfxPath = sfxInfo.path;
        if (sfxPath === CLICK_PATH) {
          sampleSfx = sfxInfo.sfx;
        } else {
          const resource = gameData.resources.getAllData().find(x => x.resource.resourceInfo.clickPathSFX === sfxPath);
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
          <h2 className='resource-subtitle'>Resource Inventory</h2>
          <div className='resource-dashboard__holder'>
            {gameData.resources.getAllData().filter(x => x.interactionState !== ResourceState.Hidden).map((data) => {
              const resourceType = data.resource.resourceInfo.resourceType;
              return <ResourceDisplay key={resourceType} resourceData={data} isPreviewing={resourceType === gameData.previewingResource} onClickCallback={() => {
                dispatch({
                  type: ActionType.OnPreviewPattern,
                  effect: {
                    resourceType: resourceType
                  }
                })
              }}/>
            })}
          </div>        
        </section>
        <section className='currency-section'>
          <h2 className='resource-subtitle'>Resource Field</h2>
          <div className='currency-section__holder'>
            {gameData.resources.getAllData().filter(x => x.resource.resourceInfo.isCollectable).map((data, index) => {
              const resourceType = data.resource.getResourceType();
              //TODO: create field notes that can have resource nodes assigned to them
              return <ResourceNode key={resourceType} resourceData={data} keyCode={(index + 1).toString()} onHoverCallback={(isHover: boolean) => {
                toggleResourcePreview(dispatch, resourceType, isHover)
              }}
              onClickCallback = {() => {
                dispatch({
                  type: ActionType.OnCollectResource,
                  effect: {
                    resourceType: resourceType
                  }
                })
              }}/>
            })}      
          </div>
          <div className='beat-holder'>
            <MetronomeVisual beatToRender={getPreviousBeatNumber(gameData.scheduledBeat.noteNumber)} notesToDisplay={gameData.bottomRendererNotes}/>
          </div>
        </section>       
      </main> 
      <Sidebar>
        <section className='upgrade-section'>
          <h2>Upgrades</h2>
          <div className='upgrade-section__holder'>
            {gameData.upgrades.map((upgrade) => {
              return <UpgradeNode key={upgrade.upgradeInfo.displayName} upgrade={upgrade} dispatch={dispatch} currentResources={resourcesCollected}/>
            })}
          </div>
        </section>
      </Sidebar>    
    </div>    
  )
}

export default App
