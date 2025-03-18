import { ResourceCreation, ResourceInfo, ResourceType } from "../lib/definitions";
import { getBeatNumbers } from "../lib/rhythm/beatNotation";

const everyOther = getBeatNumbers(8);

const swung16 = getBeatNumbers(8);
swung16.push(15);

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        resourceType: ResourceType.Water,
        collectionAmount: 3,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_C_HH_2"),
        description: "A constantly dripping that keeps the world grounded.",
        pattern: getBeatNumbers(4),
        patternNotation: "X:1 \nBzzz:|\n",
        startingResource: true,
    },
    {
        resourceType: ResourceType.Seed,
        collectionAmount: 2,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_S_1"),
        pattern: getBeatNumbers(4, 4),
        patternNotation: "X:1 \nzzBz:|\n",    
    },
    {
        resourceType: ResourceType.Wood,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_K_1"),
        patternNotation: "X:1 \nBzBz:|\n",
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
        resourceType: ResourceType.Fire,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("Clap_Stack 2"),
        pattern: getBeatNumbers(2, 8),
    },
];

export const ResourceHybrids : ResourceCreation[] = [
    {
        completed: [
            ResourceType.Seed,
            ResourceType.Water
        ],
        made: ResourceType.Wood
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
        case ResourceType.Seed:
            return "🌱";
        case ResourceType.Water:
            return "💧";
        case ResourceType.Fire:
            return "🔥";
        default:
            return "🙃";
    }
}