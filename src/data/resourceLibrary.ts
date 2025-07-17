import { ResourceCreation, ResourceInfo, ResourceType } from "../lib/definitions";

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        resourceType: ResourceType.Water,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("MC00"),
        description: "A constantly dripping that keeps the world grounded.",     
        startingResource: true,
        isCollectable: true
    },
    {
        resourceType: ResourceType.Seed,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("CH"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Wood,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RS"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Fire,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("CP"),
        isCollectable: true
    },    
    {
        resourceType: ResourceType.Park,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("MA"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Energy,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("OH50"),
        isCollectable: true
    },    
    {
        resourceType: ResourceType.Heart,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("HT25"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Money,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("MC25"),
        isCollectable: false
    },
    {
        resourceType: ResourceType.Storm,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("MA"),
        isCollectable: false
    },
    {
        resourceType: ResourceType.Brick,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("LC25"),
        isCollectable: false
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
        made: ResourceType.Park
    },
    {
        completed: [
            ResourceType.Water,
            ResourceType.Fire
        ],
        made: ResourceType.Energy
    },    
]

function createFilePath(fileName: string) : string {
    return `${window.location.href}/sfx/${fileName}.WAV`;
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
        case ResourceType.Energy:
            return "⚡";
        case ResourceType.Seed:
            return "🌱";
        case ResourceType.Water:
            return "💧";
        case ResourceType.Fire:
            return "🔥";
        case ResourceType.Park:
            return "🏞️";
        case ResourceType.Heart:
            return "❤️";
        default:
            return "🙃";
    }
}