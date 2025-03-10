import { ResourceType, UpgradeInfo, UpgradeType } from "../lib/definitions";

//a file to define the implementation of each of the upgrades. Keeps the definition of all of them in one spot
export const UpgradeLibrary : UpgradeInfo[] = [
    {
        data: {
            upgradeType: UpgradeType.CollectionRate,
            resourceType: ResourceType.Wood,
            modifier: 1,
        },
        displayIcon: "🪓",
        displayName: "Axe",
        cost: 15,
    },
    {
        data: {
            upgradeType: UpgradeType.Capacity,
            resourceType: ResourceType.Wood,
            modifier: 10,
        },
        displayIcon: "🏚️",
        displayName: "Shed",
        cost: 10
    },
    {
        data: {
            upgradeType: UpgradeType.CollectionRate,
            resourceType: ResourceType.Brick,
            modifier: 1,
        },
        displayIcon: "👷",
        displayName: "Worker",
        cost: 25,
    },
    {
        data: {
            upgradeType: UpgradeType.Capacity,
            resourceType: ResourceType.Brick,
            modifier: 10,
        },
        displayIcon: "🏗️",
        displayName: "Storage",
        cost: 50
    },
    {
        data: {
            upgradeType: UpgradeType.CollectionRate,
            resourceType: ResourceType.Metal,
            modifier: 1,
        },
        displayIcon: "⛏️",
        displayName: "Pickaxe",
        cost: 100
    },
    {
        data: {
            upgradeType: UpgradeType.Capacity,
            resourceType: ResourceType.Metal,
            modifier: 10,
        },
        displayIcon: "🧰",
        displayName: "Toolbox",
        cost: 75
    },    
    {
        data: {
            upgradeType: UpgradeType.CollectionRate,
            resourceType: ResourceType.Money,
            modifier: 1,
        },
        displayIcon: "🏦",
        displayName: "Bank",
        cost: 55
    }
]