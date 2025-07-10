import { ResourceType, UpgradeInfo, UpgradeType } from "../lib/definitions";
import { getResourceDisplay } from "./resourceLibrary";

//a file to define the implementation of each of the upgrades. Keeps the definition of all of them in one spot
export const UpgradeLibrary : UpgradeInfo[] = [
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Seed,
        },
        displayIcon: getResourceDisplay(ResourceType.Seed),
        displayName: "Seedlings",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Water
        },        
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.CollectionIncrease,
            resourceType: ResourceType.Wood,
            modifier: 5
        },
        displayIcon: "🪓",
        displayName: "Axe",
        cost: [
        {
            resourceAmount: 3,
            resourceType: ResourceType.Wood
        },               
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Wood,
        },
        displayIcon: getResourceDisplay(ResourceType.Wood),
        displayName: "Forestery",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Wood
        },        
        ]
    },    
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Fire,
        },
        displayIcon: getResourceDisplay(ResourceType.Fire),
        displayName: "Forest Fire",
        cost: [
        {
            resourceAmount: 100,
            resourceType: ResourceType.Wood
        },        
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Money,
        },
        displayIcon: getResourceDisplay(ResourceType.Money),
        displayName: "Bank Time",
        cost: [
        {
            resourceAmount: 100,
            resourceType: ResourceType.Fire
        },        
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Storm,
        },
        displayIcon: getResourceDisplay(ResourceType.Storm),
        displayName: "A Storm Brewing",
        cost: [
        {
            resourceAmount: 3,
            resourceType: ResourceType.Energy
        },        
        {
            resourceAmount: 3,
            resourceType: ResourceType.Park,
        },
        {
            resourceAmount: 150,
            resourceType: ResourceType.Water
        }
        ]
    },
]