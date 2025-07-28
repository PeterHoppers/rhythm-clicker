import { BeatInfo, BeatNotation } from "./rhythm/beatNotation";
import { createDescription } from "../data/resourceLibrary";
import { getPlayableNotesOnly, getResourcePattern } from "../data/patternLibrary";
import { ReactElement } from "react";

export const NOTES_PER_BAR = 32;
export const QUARTERS_PER_PHRASE = NOTES_PER_BAR / 8;
export const RHYTHM_LENIENCY = .15;
export const INPUT_DELAY = 0.02933;

export const URL_ROOT = window.location.href;

export enum ResourceType {
    Water = "Water",
    Seed = "Seed",
    Tree = "Tree",
    Wood = "Wood",
    Fire = "Fire",
    Earth = "Earth",
    Garden = "Garden",
    Coal = "Coal",
    Steam = "Steam",
    Storm = "Storm",
    Energy = "Energy",
    Volcano = "Volcano",
    Sun = "Sun",
    Wind = "Wind",
    Firework = "Firework",
    Lake = "Lake",
    Heart = "Heart",
    Lightbulb = "Lightbulb",
    Gem = "Gem",
    Crown = "Crown"
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
    CollectionIncrease,
    IncreaseRhythmCapacity,
}

export enum PressPreviewType {
    None,
    NoteBefore,
    NoteIncluded
}

export type ResourceInfo = {    
    resourceType: ResourceType;
    collectionAmount?: number;
    completedBarAmount?: number;
    clickPathSFX?: string;
    description?: string;  
    startingResource?: boolean;
    isCollectable?: boolean;
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
    id: ResourceType | string;
    effect: GameEffect,
    displayName: string;
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
    patternNotation:  BeatNotation[];
    playableNotation: number[];
    description: ReactElement | undefined;

    readonly DEFAULT_COLLECTION_AMOUNT = 0;
    readonly DEFAULT_COMPLETED_AMOUNT = 1;

    constructor(resourceInfo: ResourceInfo) {
        this.resourceInfo = resourceInfo;
        this.patternNotation = getResourcePattern(this.getResourceType());
        this.playableNotation = getPlayableNotesOnly(this.getPatternNotation());
    }

    isMatchingResourceType(resourceType : ResourceType | undefined) : boolean {
        return this.getResourceType() === resourceType;
    }

    getResourceType() {
        return this.resourceInfo.resourceType;
    }
   
    getFullDisplayDescription(className: string) {
        if (!this.description) {
            this.description = createDescription(this.resourceInfo.description ?? "", this.getResourceType(), className)
        }
        return this.description;
    }

    getPatternNotation() : BeatNotation[] { 
        return this.patternNotation;
    }

    getPatternNotes() : number[] {
        if (!this.getPatternNotation()) {
            return [];
        }

        return this.playableNotation;
    }

    getCollectionAmount() {
        return this.resourceInfo.collectionAmount ?? this.DEFAULT_COLLECTION_AMOUNT;
    }

    getCompletedPatternAmount() {
        return this.resourceInfo.completedBarAmount ?? this.DEFAULT_COMPLETED_AMOUNT;
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
                upgradeEffectDescription = `Unlock the ability to collect the ${this.upgradeInfo.effect.resourceType} resource.`;
                break;
            case UpgradeType.CollectionIncrease:
                upgradeEffectDescription = `Increase the amount of ${this.upgradeInfo.effect.resourceType} resource collected by ${this.upgradeInfo.effect.modifier}.`;
                break;
            default:
                upgradeEffectDescription = `Need to define new upgrade description.`;
                break;
        }
        
        return `${upgradeEffectDescription}`;
    }
}