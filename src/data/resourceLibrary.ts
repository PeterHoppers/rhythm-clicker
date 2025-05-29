import { ResourceCreation, ResourceInfo, ResourceType } from "../lib/definitions";
import { getBeatNumbers } from "../lib/rhythm/beatNotation";

const everyOther = getBeatNumbers(8);

const swung16 = getBeatNumbers(8);
swung16.push(15);

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        resourceType: ResourceType.Water,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_C_HH_2"),
        description: "A constantly dripping that keeps the world grounded.",
        pattern: getBeatNumbers(4),
        patternNotation: "X:1 \nBzzz:|\n",
        startingResource: true,
    },
    {
        resourceType: ResourceType.Seed,
        collectionAmount: 1,
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
        pattern: everyOther
    },
    {
        resourceType: ResourceType.Money,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_K_1"),        
        patternNotation: "X:1 \nB/2B/2B/2B/2| B/2z B/2B/2:|\n",
        pattern: [0, 2, 4, 6, 8, 12, 14, 16, 18, 20, 22, 24, 28, 30],
        startingResource: false
    },
    {
        resourceType: ResourceType.Smoke,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("Hat_Closed"),
        pattern: getBeatNumbers(4, 4),
    },
    {
        resourceType: ResourceType.Steam,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("Hat_Closed"),
        pattern: getBeatNumbers(4, 4),
    },    
    {
        resourceType: ResourceType.Fire,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("Clap_Stack 2"),
        pattern: getBeatNumbers(2, 8),        
        patternNotation: "X:1 \nz4 | Bzzz:|\n",
    },
    {
        resourceType: ResourceType.Storm,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_C_HH_8"),
        pattern: swung16,
        patternNotation:  "X:1 \nB z B z | B z B B | B z B z | B z B z:|\n"
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
    {
        completed: [
            ResourceType.Wood,
            ResourceType.Fire
        ],
        made: ResourceType.Smoke
    },
    {
        completed: [
            ResourceType.Water,
            ResourceType.Fire
        ],
        made: ResourceType.Steam
    },    
]

function createFilePath(fileName: string) : string {
    return `sfx/${fileName}.wav`;
}

export function createDescription(startingDescription: string, resourceType : ResourceType) : string {
    const description = startingDescription;
    const resourceCreation = ResourceHybrids.find(x => x.made === resourceType);

    if (!resourceCreation) {
        return description;
    }

    let creationDescription = "Can be made by collecting a full bar of";
    const appender = " & ";
    resourceCreation.completed.forEach(element => {
        creationDescription += ` ${getResourceDisplay(element)}${appender}`;
    });

    creationDescription = creationDescription.slice(0, appender.length * -1);
    creationDescription += ".";

    return `${description}\n${creationDescription}`;
}

export function getResourceDisplay(resourceType: ResourceType) : string {
    switch (resourceType) {
        case ResourceType.Brick:        
            return "🧱";
        case ResourceType.Clap:
            return "👏";
        case ResourceType.Wood:
            return "🌳";
        case ResourceType.Storm:
            return "⛈️";
        case ResourceType.Money:
            return "💰";
        case ResourceType.Steam:
            return "☁️";
        case ResourceType.Seed:
            return "🌱";
        case ResourceType.Water:
            return "💧";
        case ResourceType.Fire:
            return "🔥";
        case ResourceType.Smoke:
            return "🌫️";
        default:
            return "🙃";
    }
}