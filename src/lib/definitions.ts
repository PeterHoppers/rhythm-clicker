export const NOTES_PER_BAR = 16;

export enum ResourceType {
    Wood = "Wood",
    Brick = "Brick",
    Stone = "Stone",
    Metal = "Metal",
    Money = "Money"
}

export type ResourceInfo = {    
    resourceType: ResourceType;
    displayIcon: string;
    collectionAmount: number;
    clickPathSFX: string;
    pattern?: number[];
}

export type ResourceData = {
    resource : Resource;
    currentAmount: number;
    clickSFX?: AudioBuffer;
}

export enum ActionType {
    TimePass,
    OnCollectResource,
    OnSpendResource,
    Upgrade,
}

export enum UpgradeType {
    CollectionRate,
    Capacity
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
    cost: number;
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
            case UpgradeType.CollectionRate:
                upgradeEffectDescription = `Increase collection rate of ${this.upgradeInfo.data.resourceType} by ${this.upgradeInfo.data.modifier}.`;
                break;
            case UpgradeType.Capacity:
                upgradeEffectDescription = `Increase max capacity of ${this.upgradeInfo.data.resourceType} by ${this.upgradeInfo.data.modifier}.`;
                break;
            default:
                upgradeEffectDescription = `Need to define new upgrade description.`;
                break;
        }

        return `${this.upgradeInfo.displayName}: cost ${this.upgradeInfo.cost}. ${upgradeEffectDescription}`;
    }
}