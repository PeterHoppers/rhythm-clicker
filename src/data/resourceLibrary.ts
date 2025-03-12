import { ResourceInfo, ResourceType } from "../lib/definitions";
import { getBeatNumbers } from "../lib/rhythm/beatNotation";

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        displayIcon: "🌳",
        resourceType: ResourceType.Wood,
        collectionRate: 3,
        maxCapacity: 50,
        pattern: getBeatNumbers(4)
    },
    {
        displayIcon: "🧱",
        resourceType: ResourceType.Brick,
        collectionRate: 2,
        maxCapacity: 10,
        pattern: getBeatNumbers(4, 2)
    },
    {
        displayIcon: "⚙️",
        resourceType: ResourceType.Metal,
        collectionRate: 1,
        maxCapacity: 5
    },
]

export const MoneyInfo : ResourceInfo = {
    displayIcon: "💰",
    resourceType: ResourceType.Money,
    collectionRate: 5,
    maxCapacity: Number.MAX_SAFE_INTEGER
}