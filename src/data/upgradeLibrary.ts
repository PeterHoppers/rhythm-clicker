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
            resourceAmount: 5,
            resourceType: ResourceType.Water
        },        
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.CollectionIncrease,
            resourceType: ResourceType.Tree,
            modifier: 3
        },
        displayIcon: "🪓",
        displayName: "Axe",
        cost: [
        {
            resourceAmount: 1,
            resourceType: ResourceType.Tree
        },               
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Tree,
        },
        displayIcon: getResourceDisplay(ResourceType.Tree),
        displayName: "Forestery",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Tree
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
            resourceAmount: 50,
            resourceType: ResourceType.Tree
        },        
        {
            resourceAmount: 10,
            resourceType: ResourceType.Seed
        }
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Park,
        },
        displayIcon: getResourceDisplay(ResourceType.Park),
        displayName: "Park Reservation",
        cost: [
        {
            resourceAmount: 3,
            resourceType: ResourceType.Park
        },        
        {
             resourceAmount: 20,
            resourceType: ResourceType.Tree
        },
        {
             resourceAmount: 20,
            resourceType: ResourceType.Seed
        },
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Energy,
        },
        displayIcon: getResourceDisplay(ResourceType.Energy),
        displayName: "Energy Production",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Coal
        },        
        {
            resourceAmount: 10,
            resourceType: ResourceType.Steam
        },
        {
            resourceAmount: 35,
            resourceType: ResourceType.Fire
        }
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