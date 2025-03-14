import { ResourceInfo, ResourceType } from "../lib/definitions";
import { getBeatNumbers } from "../lib/rhythm/beatNotation";

const everyOther = getBeatNumbers(8);
everyOther.push(30);

const swung16 = getBeatNumbers(8);
swung16.push(15);

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        resourceType: ResourceType.Wood,
        collectionAmount: 3,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_C_HH_2"),
        pattern: getBeatNumbers(4),
        startingResource: true,
    },
    {
        resourceType: ResourceType.Brick,
        collectionAmount: 2,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_S_1"),
        pattern: getBeatNumbers(4, 4),     
    },
    {
        resourceType: ResourceType.Metal,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_K_1"),
        pattern: everyOther,     
    },
    {
        resourceType: ResourceType.Money,
        collectionAmount: 5,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_S_1"),
        pattern: [31],
    },
    {
        resourceType: ResourceType.Stone,
        collectionAmount: 5,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("Hat_Closed"),
        pattern: getBeatNumbers(4, 4),
    },
    {
        resourceType: ResourceType.House,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_C_HH_8"),
        pattern: swung16,
    },
    {
        resourceType: ResourceType.Clap,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("Clap_Stack 2"),
        pattern: getBeatNumbers(2, 8),
    },
]

function createFilePath(fileName: string) : string {
    return `sfx/${fileName}.wav`;
}

export function getResourceDisplay(resourceType: ResourceType) : string {
    switch (resourceType) {
        case ResourceType.Brick:        
            return "🧱";
        case ResourceType.Clap:
            return "👏";
        case ResourceType.Wood:
            return "🌳";
        case ResourceType.House:
            return "🏠";
        case ResourceType.Money:
            return "💰";
        case ResourceType.Metal:
            return "⚙️";
        case ResourceType.Swing:
        default:
            return "🌱";
    }
}