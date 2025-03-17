import { ResourceType, UpgradeInfo, UpgradeType } from "../lib/definitions";
import { getResourceDisplay } from "./resourceLibrary";

//a file to define the implementation of each of the upgrades. Keeps the definition of all of them in one spot
export const UpgradeLibrary : UpgradeInfo[] = [
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Brick,
        },
        displayIcon: getResourceDisplay(ResourceType.Brick),
        displayName: "Brick Maker",
        cost: [
        {
            resourceAmount: 50,
            resourceType: ResourceType.Wood
        },        
        ]
    },
    {
        effect: {
            upgradeType: UpgradeType.NewResource,
            resourceType: ResourceType.Money,
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