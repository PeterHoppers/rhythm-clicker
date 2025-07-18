import { ReactElement, createElement } from "react";
import { ResourceCreation, ResourceInfo, ResourceType, URL_ROOT } from "../lib/definitions";

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        resourceType: ResourceType.Water,
        clickPathSFX: createFilePath("MC00"),
        description: "A constantly dripping that keeps the world grounded.",     
        startingResource: true,
        isCollectable: true
    },
    {
        resourceType: ResourceType.Seed,
        clickPathSFX: createFilePath("CH"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Tree,
        clickPathSFX: createFilePath("RS"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Fire,
        clickPathSFX: createFilePath("CP"),
        isCollectable: true
    },    
    {
        resourceType: ResourceType.Earth,
        clickPathSFX: createFilePath("MA"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Energy,
        clickPathSFX: createFilePath("OH50"),
        isCollectable: true
    },    
    {
        resourceType: ResourceType.Heart,
        clickPathSFX: createFilePath("HT25"),
        isCollectable: true
    },
    {
        resourceType: ResourceType.Money,
        isCollectable: false
    },
    {
        resourceType: ResourceType.Storm,
        isCollectable: false
    },
    {
        resourceType: ResourceType.Coal,
        isCollectable: false
    },
];

export const ResourceHybrids : ResourceCreation[] = [
    {
        completed: [
            ResourceType.Seed,
            ResourceType.Water
        ],
        made: ResourceType.Tree
    },
    {
        completed: [
            ResourceType.Tree,
            ResourceType.Fire
        ],
        made: ResourceType.Coal
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
    return `${window.location.href}/sfx/${fileName}.WAV`;
}

export function createDescription(startingDescription: string, resourceType : ResourceType, resourceNodeclassName: string) : ReactElement {
    const descriptionClass = "node-description";
    const description = createHTMLForString(startingDescription, descriptionClass);
    const resourceCreation = ResourceHybrids.find(x => x.made === resourceType);

    if (!resourceCreation) {
        return description;
    }

    const creationDescription = "\nCan be made by collecting a full bar of";
    const startingHTML = createHTMLForString(creationDescription, descriptionClass);
    const appender = " & ";
    const descriptionHTML : ReactElement[] = [];
    resourceCreation.completed.forEach(element => {
        descriptionHTML.push(getHTMLForResourceDisplay(element, resourceNodeclassName));
        descriptionHTML.push(createHTMLForString(appender, descriptionClass));
    });

    descriptionHTML.pop();
    descriptionHTML.push(createHTMLForString("."));

    return createElement("span", {}, [description, startingHTML, ...descriptionHTML]);
}

export function getResourceDisplay(resourceType: ResourceType) : string {
    switch (resourceType) {
        case ResourceType.Tree:
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
        case ResourceType.Heart:
            return "❤️";
        default:
            return "";
    }
}

export function getFilePathName(resourceType: ResourceType) : string { 
    return `${URL_ROOT}/images/${resourceType.toLocaleLowerCase()}.png`;
}

export function getHTMLForResourceDisplay(resourceType: ResourceType, className?: string) : ReactElement {
    const targetEmoji = getResourceDisplay(resourceType);
    if (targetEmoji) {         
        return createHTMLForString(targetEmoji, className);
    }

    const targetURL = getFilePathName(resourceType);
    const imageElement = createElement("img", {src: targetURL, className: `${className}`});
    return imageElement;
}

export function createHTMLForString(emoji: string, className?: string) : ReactElement{
    const span = createElement("span", {className: `${className}`}, emoji);
    return span;
}