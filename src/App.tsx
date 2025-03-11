import { useEffect, useReducer, useState } from 'react'
import { ResourceLibrary, MoneyInfo } from './data/resourceLibrary';
import { UpgradeLibrary } from './data/upgradeLibrary';
import './App.css'
import { ActionType, Resource, ResourceAction, ResourceData, ResourceInfo, Upgrade, UpgradeType } from './lib/definitions';
import ResourceNode from './component/ResourceNode';
import { useInterval } from './lib/useInterval';
import CurrencyNode from './component/CurrencyNode';
import UpgradeNode from './component/UpgradeNode';

const NOTES_PER_BAR = 16;
const TICK_CHECK = 250;

interface AppState {
  resources: ResourceData[],
  upgrades: Upgrade[],
  audioContext: AudioContext,
  currentBeat: BeatInfo
}

const initalState : AppState = {
  resources : createInitialResources(),
  upgrades : createUpgrades(), 
  audioContext: new AudioContext(),
  currentBeat: {time: 0, noteNumber: 0}
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
      let beat = state.currentBeat;
      if (beat && beat.time >= state.audioContext.currentTime) {
        playNote(beat); 
        beat = createNextNote(60, beat);
      }

      return {
        ...state,
        currentBeat: beat
      };
    }
    case ActionType.Upgrade: {
      const updatedResources = state.resources.map(resourceData => {
        if (resourceData.resource.isMatchingResourceType(action.payload?.resourceType)) {
          const upgradeType = action.payload?.upgradeType;
          if (upgradeType !== undefined) {
            resourceData.resource.resourceInfo = performUpgrade(resourceData.resource.resourceInfo, upgradeType, action.payload?.modifier ?? 0);
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
      const updatedResources = state.resources.map(resourceData => {
        if (resourceData.resource.isCurrency()) {
          const newAmount = resourceData.resource.performCollection(resourceData.currentAmount);
          resourceData.currentAmount = newAmount;
        }

        return resourceData;
      });
      return {
        ...state,
        resources: updatedResources
      };
    }
    case ActionType.OnSpendResource: {
      const updatedResources = state.resources.map(resourceData => {
        if (resourceData.resource.isMatchingResourceType(action.payload?.resourceType)) {
          const newAmount = resourceData.currentAmount - (action.payload?.modifier ?? 0);
          resourceData.currentAmount = newAmount;
        }
        return resourceData;
      });

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

function playNote(note: BeatInfo) {
  console.log(note);    
}

function App() {
  const [gameData, dispatch] = useReducer(resourceReducer, initalState);

  //split the resource data into two pieces, one for the currency and another for the standard resources
  const resourceDashboardData = gameData.resources.filter((resource) => !resource.resource.isCurrency());
  const moneyData = gameData.resources.find((resource) => resource.resource.isCurrency());

  useInterval(() => {
    dispatch({
      type: ActionType.TimePass
    });   
  }, TICK_CHECK);

  //render each of the resources on the top, the currency info in the middle, and the upgrades at the bottom
  return (
    <div className='resource-main'>
      <section className='resource-dashboard'>
        <h1>Resource Dashboard</h1>
        <div className='resource-dashboard__holder'>
          {resourceDashboardData.map((data) => {
            return <ResourceNode key={data.resource.resourceInfo.resourceType} resourceData={data} />
          })}
        </div>        
      </section>

      <section className='currency-section'>
        <h2>Currency</h2>
        <span>{moneyData?.currentAmount}</span>
        <div className='currency-section__holder'>
          {moneyData &&
            <CurrencyNode moneyData={moneyData} onClickCallback = {() => {
              dispatch({
                type: ActionType.OnCollectResource
              })
            }}/>
          }        
        </div>
      </section>

      <section className='upgrade-section'>
        <h2>Upgrades</h2>
        <div className='upgrade-section__holder'>
          {gameData.upgrades.map((upgrade) => {
            return <UpgradeNode key={upgrade.upgradeInfo.displayName} upgrade={upgrade} dispatch={dispatch} currentCurrency={(moneyData?.currentAmount ?? 0)}/>
          })}
        </div>
      </section>
    </div>
  )
}

function createNextNote(tempo : number, currentBeat: BeatInfo) : BeatInfo {
  // Advance current note and time by a 16th note...
  const secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
      // tempo value to calculate beat length.
  const nextNoteTime = (0.25 * secondsPerBeat) + currentBeat.time;   // Add beat length to last beat time
  const note = (currentBeat.noteNumber + 1) % NOTES_PER_BAR;

  return {
    noteNumber: note,
    time: nextNoteTime
  }
}

interface BeatInfo {
  noteNumber: number,
  time: number
}

export default App
