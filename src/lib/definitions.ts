import { BeatInfo, BeatNotation } from "./rhythm/beatNotation";
import { createDescription } from "../data/resourceLibrary";
import { getPlayableNotesOnly, getResourcePattern } from "../data/patternLibrary";

export const NOTES_PER_BAR = 32;
export const QUARTERS_PER_PHRASE = NOTES_PER_BAR / 8;
export const RHYTHM_LENIENCY = .175;
export const INPUT_DELAY = 0.02933;

export enum ResourceType {
    Seed = "Seed",
    Water = "Water",
    Wood = "Wood",
    Brick = "Brick",
    Fire = "Fire",
    Smoke = "Smoke",
    Storm = "Storm",
    Swing = "Swing",
    Clap = "Clap",
    Steam = "Steam",
    Money = "Money"
}

export enum ResourceState {
    Hidden,
    Gainable,
    Clickable
}

export enum ActionType {
    TimePass,
    OnCollectResource,
    OnSpendResource,
    Upgrade,
    OnUpdateNotesWithResource,
    OnPreviewPattern
}

export enum UpgradeType {
    NewResource,
    CollectionIncrease
}

export enum PressPreviewType {
    None,
    NoteBefore,
    NoteIncluded
}

export type ResourceInfo = {    
    resourceType: ResourceType;
    collectionAmount: number;
    completedBarAmount: number;
    clickPathSFX: string;
    description?: string;  
    startingResource?: boolean;
}

export type ResourceData = {
    resource : Resource;
    currentAmount: number;
    successNotes: BeatInfo[];
    interactionState: ResourceState;
    pressPreviewState?: PressPreviewType;
    isPlayed?: boolean;
    areNotesDisplayed?: boolean;
    clickSFX?: AudioBuffer;
}

export type UpgradeInfo = {    
    effect: GameEffect,
    displayName: string;
    displayIcon: string;
    cost: ResourceTransaction[];
}

export type ResourceCreation = {
    completed: ResourceType[],
    made: ResourceType
}

export type ResourceTransaction = {
    resourceType: ResourceType;
    resourceAmount: number;
    resourceDisplay?: string;
}

export type GameAction = {
    type: ActionType,
    effect: GameEffect,
}

export type GameEffect = {
    resourceType?: ResourceType,
    modifier?: number
    upgradeType?: UpgradeType,
}

export class ResourceDictionary {
    resourceDatas : Partial<Record<ResourceType, ResourceData>>;

    constructor() {
        this.resourceDatas = {};
    }    

    getData(type: ResourceType) : ResourceData | undefined {
        const data = this.resourceDatas[type];
        return data;
    }

    getAllData() : ResourceData[] {
        return Object.values(this.resourceDatas);
    }

    setData(type: ResourceType, data: ResourceData) {
        this.resourceDatas[type] = data;
    }

    setAllData(datas: ResourceData[]) {
        datas.forEach(data => {
            this.setData(data.resource.getResourceType(), data);
        }) 
    }
}

export class Resource {
    resourceInfo: ResourceInfo;

    constructor(resourceInfo: ResourceInfo) {
        this.resourceInfo = resourceInfo;
    }

    isMatchingResourceType(resourceType : ResourceType | undefined) : boolean {
        return this.getResourceType() === resourceType;
    }

    getResourceType() {
        return this.resourceInfo.resourceType;
    }

    getFullDisplayDescription() {
        return createDescription(this.resourceInfo.description ?? "", this.getResourceType());
    }

    getPatternNotation() : BeatNotation[] { 
        return getResourcePattern(this.getResourceType());
    }

    getPatternNotes() : number[] {
        if (!this.getPatternNotation()) {
            return [];
        }

        return getPlayableNotesOnly(this.getPatternNotation());
    }
}

export class Upgrade {
    upgradeInfo: UpgradeInfo;

    constructor(upgradeInfo: UpgradeInfo) {
        this.upgradeInfo = upgradeInfo;
    }

    //render information for each different upgrade type here. Would like to move closer to where upgrade types are created
    displayInfo() : string {
        let upgradeEffectDescription = "";
        switch(this.upgradeInfo.effect.upgradeType) {   
            case UpgradeType.NewResource:
                upgradeEffectDescription = `This upgrade unlocks the ability to collect ${this.upgradeInfo.effect.resourceType} resource.`;
                break;
            case UpgradeType.CollectionIncrease:
                upgradeEffectDescription = `This upgrade increased the amount of ${this.upgradeInfo.effect.resourceType} resource collected by ${this.upgradeInfo.effect.modifier}.`;
                break;
            default:
                upgradeEffectDescription = `Need to define new upgrade description.`;
                break;
        }
        
        return `${upgradeEffectDescription}`;
    }
}