import { ResourceType, UpgradeInfo, UpgradeType } from "../lib/definitions";

//a file to define the implementation of each of the upgrades. Keeps the definition of all of them in one spot
export const UpgradeLibrary : UpgradeInfo[] = [
    {
        id: ResourceType.Seed,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Seed,
        },
        displayName: "Seedlings",
        cost: [
        {
            resourceAmount: 5,
            resourceType: ResourceType.Water
        },        
        ]
    },
    {
        id: "🪓",
        effect: {
            upgradeType: UpgradeType.CollectionIncrease,
            resourceType: ResourceType.Tree,
            modifier: 3
        },
        displayName: "Axe",
        cost: [
        {
            resourceAmount: 1,
            resourceType: ResourceType.Tree
        },               
        ]
    },
    {
        id: ResourceType.Tree,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Tree,
        },
        displayName: "Forestery",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Tree
        },        
        ]
    },    
    {
        id: ResourceType.Fire,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Fire,
        },
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
        id: ResourceType.Earth,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Earth,
        },
        displayName: "Earth Renewal",
        cost: [
        {
            resourceAmount: 3,
            resourceType: ResourceType.Earth
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
        id: ResourceType.Energy,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Energy,
        },
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
        id: ResourceType.Storm,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Storm,
        },
        displayName: "A Storm Brewing",
        cost: [
        {
            resourceAmount: 3,
            resourceType: ResourceType.Energy
        },        
        {
            resourceAmount: 3,
            resourceType: ResourceType.Earth,
        },
        {
            resourceAmount: 150,
            resourceType: ResourceType.Water
        }
        ]
    },
]