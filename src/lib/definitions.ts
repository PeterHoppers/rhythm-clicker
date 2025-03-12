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
    collectionRate: number;
    maxCapacity: number;
    pattern?: number[];
}

export type ResourceData = {
    resource : Resource;
    currentAmount: number;
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
    resourceAction?: ResourceInfo
}

export class Resource {
    resourceInfo: ResourceInfo;

    constructor(resourceInfo: ResourceInfo) {
        this.resourceInfo = resourceInfo;
    }

    performCollection(currentValue: number) : number {
        const maxCapacity = this.resourceInfo.maxCapacity;
        const newValue = currentValue + this.resourceInfo.collectionRate;
        if (newValue < maxCapacity) {
            return newValue;
        } else {
            return maxCapacity;
        }
    }

    isMatchingResourceType(resourceType : ResourceType | undefined) : boolean {
        return this.resourceInfo.resourceType === resourceType;
    }

    isCurrency() : boolean {
        return this.resourceInfo.resourceType === ResourceType.Money;
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