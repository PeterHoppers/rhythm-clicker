export const NOTES_PER_BAR = 32;
export const RHYTHM_LENIENCY = .1;
export const INPUT_DELAY = 0.02933;

export enum ResourceType {
    Wood = "Wood",
    Brick = "Brick",
    Stone = "Stone",
    House = "House",
    Swing = "Swing",
    Clap = "Clap",
    Metal = "Metal",
    Money = "Money"
}

export enum ActionType {
    TimePass,
    OnCollectResource,
    OnSpendResource,
    Upgrade,
}

export enum UpgradeType {
    NewResource,
    CollectionIncrease
}

export type ResourceInfo = {    
    resourceType: ResourceType;
    collectionAmount: number;
    completedBarAmount: number;
    clickPathSFX: string;
    pattern?: number[];    
    startingResource?: boolean;
}

export type ResourceData = {
    resource : Resource;
    currentAmount: number;
    successNotes: number[];
    isVisible?: boolean;
    shouldPress?: boolean;
    isPlayed?: boolean;
    clickSFX?: AudioBuffer;
}

export type UpgradeInfo = {    
    effect: GameEffect,
    displayName: string;
    displayIcon: string;
    cost: ResourceTransaction[];
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
                upgradeEffectDescription = `Buy this upgrade to unlock to the ${this.upgradeInfo.effect.resourceType} resource.`;
                break;
            default:
                upgradeEffectDescription = `Need to define new upgrade description.`;
                break;
        }
        
        return `${upgradeEffectDescription}`;
    }
}