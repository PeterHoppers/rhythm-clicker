import { ResourceInfo, ResourceType } from "../lib/definitions";
import { getBeatNumbers } from "../lib/rhythm/beatNotation";

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        displayIcon: "🌳",
        resourceType: ResourceType.Wood,
        collectionAmount: 3,
        clickPathSFX: createFilePath("RD_C_HH_2"),
        pattern: getBeatNumbers(8)
    },
    {
        displayIcon: "🧱",
        resourceType: ResourceType.Brick,
        collectionAmount: 2,
        clickPathSFX: createFilePath("RD_S_1"),
        pattern: getBeatNumbers(2, 8)
    },
    {
        displayIcon: "⚙️",
        resourceType: ResourceType.Metal,
        collectionAmount: 1,
        clickPathSFX: createFilePath("Kick_Not Weird"),
        pattern: getBeatNumbers(2)
    },
    {
        displayIcon: "💰",
        resourceType: ResourceType.Money,
        collectionAmount: 5,
        clickPathSFX: "",
    }
]

function createFilePath(fileName: string) : string {
    return `sfx/${fileName}.wav`;
}