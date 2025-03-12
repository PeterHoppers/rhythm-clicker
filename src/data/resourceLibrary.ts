import { ResourceInfo, ResourceType } from "../lib/definitions";
import { getBeatNumbers } from "../lib/rhythm/beatNotation";

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        displayIcon: "🌳",
        resourceType: ResourceType.Wood,
        collectionAmount: 3,
        clickPathSFX: "",
        pattern: getBeatNumbers(4)
    },
    {
        displayIcon: "🧱",
        resourceType: ResourceType.Brick,
        collectionAmount: 2,
        clickPathSFX: "sfx/Hat_Closed.wav",
        pattern: getBeatNumbers(4, 2)
    },
    {
        displayIcon: "⚙️",
        resourceType: ResourceType.Metal,
        collectionAmount: 1,
        clickPathSFX: "",
    },
    {
        displayIcon: "💰",
        resourceType: ResourceType.Money,
        collectionAmount: 5,
        clickPathSFX: "",
    }
]