import { ResourceType, UpgradeInfo, UpgradeType } from "../lib/definitions";

//a file to define the implementation of each of the upgrades. Keeps the definition of all of them in one spot
export const UpgradeLibrary : UpgradeInfo[] = [
    {
        data: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Money,
            modifier: 1,
        },
        displayIcon: "🪓",
        displayName: "Axe",
        cost: [
        {
            resourceAmount: 10,
            resourceType: ResourceType.Wood
        },
        {
            resourceAmount: 10,
            resourceType: ResourceType.Metal
        },
        {
            resourceAmount: 10,
            resourceType: ResourceType.Brick
        },
        ]
    }
]