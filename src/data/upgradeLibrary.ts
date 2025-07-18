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
            resourceAmount: 15,
            resourceType: ResourceType.Fire
        }
        ]
    },
    {
        id: ResourceType.Wind,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Wind,
        },
        displayName: "Atmospheric Winds",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Sun
        },        
        {
            resourceAmount: 40,
            resourceType: ResourceType.Water,
        },
        {
            resourceAmount: 10,
            resourceType: ResourceType.Steam
        }
        ]
    },
    {
        id: ResourceType.Gem,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Gem,
        },
        displayName: "Pressure and Age",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Coal
        },        
        {
            resourceAmount: 10,
            resourceType: ResourceType.Storm,
        },
        {
            resourceAmount: 10,
            resourceType: ResourceType.Volcano
        }
        ]
    },
    {
        id: ResourceType.Heart,
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Heart,
        },
        displayName: "Feel It Beating Fast",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Lake
        },        
        {
            resourceAmount: 20,
            resourceType: ResourceType.Firework,
        },
        {
            resourceAmount: 5,
            resourceType: ResourceType.Gem
        }
        ]
    },
]