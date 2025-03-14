import { ResourceInfo, ResourceType } from "../lib/definitions";
import { getBeatNumbers } from "../lib/rhythm/beatNotation";

const everyOther = getBeatNumbers(8);
everyOther.push(30);

const swung16 = getBeatNumbers(8);
swung16.push(15);

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        displayIcon: "🌳",
        resourceType: ResourceType.Wood,
        collectionAmount: 3,
        clickPathSFX: createFilePath("RD_C_HH_2"),
        pattern: everyOther,
        startingResource: false,
    },
    {
        displayIcon: "🧱",
        resourceType: ResourceType.Brick,
        collectionAmount: 2,
        clickPathSFX: createFilePath("RD_S_1"),
        pattern: getBeatNumbers(4),        
        startingResource: false,
    },
    {
        displayIcon: "⚙️",
        resourceType: ResourceType.Metal,
        collectionAmount: 1,
        clickPathSFX: createFilePath("RD_K_1"),
        pattern: getBeatNumbers(4),        
        startingResource: true,
    },
    {
        displayIcon: "💰",
        resourceType: ResourceType.Money,
        collectionAmount: 5,
        clickPathSFX: createFilePath("RD_S_1"),
        pattern: [31],
        startingResource: true
    },
    {
        displayIcon: "🧹",
        resourceType: ResourceType.Stone,
        collectionAmount: 5,
        clickPathSFX: createFilePath("Hat_Closed"),
        pattern: getBeatNumbers(4, 4),
        startingResource: true
    },
    {
        displayIcon: "🏠",
        resourceType: ResourceType.House,
        collectionAmount: 1,
        clickPathSFX: createFilePath("RD_C_HH_8"),
        pattern: swung16,
        startingResource: true
    },
    {
        displayIcon: "👏",
        resourceType: ResourceType.Clap,
        collectionAmount: 1,
        clickPathSFX: createFilePath("Clap_Stack 2"),
        pattern: getBeatNumbers(2, 8),
        startingResource: true
    },
]
//[0, 3, 6, 8, 11, 14, 16, 19, 22, 24, 27, 30],

function createFilePath(fileName: string) : string {
    return `sfx/${fileName}.wav`;
}