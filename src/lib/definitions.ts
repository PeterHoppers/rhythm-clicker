export const NOTES_PER_BAR = 32;

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

export type ResourceInfo = {    
    resourceType: ResourceType;
    displayIcon: string;
    collectionAmount: number;
    clickPathSFX: string;
    pattern?: number[];    
    startingResource?: boolean;
}

export type ResourceData = {
    resource : Resource;
    currentAmount: number;
    isVisible?: boolean;
    shouldPress?: boolean;
    clickSFX?: AudioBuffer;
}

export enum ActionType {
    TimePass,
    OnCollectResource,
    OnSpendResource,
    Upgrade,
}

export enum UpgradeType {
    NewResource
}

export type UpgradeData = {
    modifier: number
    resourceType?: ResourceType,
    upgradeType?: UpgradeType,
}

export type UpgradeInfo = {
    data: UpgradeData,
    displayName: string;
    displayIcon: string;
    cost: ResourceTransaction[];
}

export type ResourceTransaction = {
    resourceType: ResourceType;
    resourceAmount: number
}

export type ResourceAction = {
    type: ActionType,
    upgradeAction?: UpgradeData,
    resourceAction?: ResourceData
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
        switch(this.upgradeInfo.data.upgradeType) {            
            default:
                upgradeEffectDescription = `Need to define new upgrade description.`;
                break;
        }

        return `${this.upgradeInfo.displayName}: cost ${this.upgradeInfo.cost}. ${upgradeEffectDescription}`;
    }
}