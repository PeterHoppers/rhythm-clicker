import { ResourceCreation, ResourceInfo, ResourceType, QUARTERS_PER_PHRASE, EIGHTH_VALUE, QUARTER_VALUE, SIXTEENTH_VALUE } from "../lib/definitions";
import { getBeatNumbers, BeatNotation } from "../lib/rhythm/beatNotation";

const everyOther = getBeatNumbers(QUARTERS_PER_PHRASE * 2);

const swung16 = getBeatNumbers(8);
swung16.push(15);

export const METRONOME_NOTATION = createNotation(getBeatNumbers(QUARTERS_PER_PHRASE), repeatStringIntoArray('z', QUARTERS_PER_PHRASE));
const underPressureNotes = [0, EIGHTH_VALUE, QUARTER_VALUE, QUARTER_VALUE + SIXTEENTH_VALUE, QUARTER_VALUE + EIGHTH_VALUE, QUARTER_VALUE * 2,  QUARTER_VALUE * 2 + EIGHTH_VALUE];

//a file to define the implementation of each of the resources. This allows easy creation of new resources when needed
export const ResourceLibrary : ResourceInfo[] = [
    {
        resourceType: ResourceType.Water,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_C_HH_2"),
        description: "A constantly dripping that keeps the world grounded.",
        pattern: getBeatNumbers(QUARTERS_PER_PHRASE),
        patternNotation: createNotation(getBeatNumbers(QUARTERS_PER_PHRASE), repeatStringIntoArray('c', QUARTERS_PER_PHRASE)), //"cccc :|\n",       
        startingResource: true,
    },
    {
        resourceType: ResourceType.Seed,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_S_1"),
        pattern: getBeatNumbers(QUARTERS_PER_PHRASE, QUARTERS_PER_PHRASE),
        patternNotation: createNotation(getBeatNumbers(QUARTERS_PER_PHRASE), repeatStringIntoArray('z/2 ', QUARTERS_PER_PHRASE)).concat(createNotation(getBeatNumbers(QUARTERS_PER_PHRASE, QUARTERS_PER_PHRASE), repeatStringIntoArray('c/2 ', QUARTERS_PER_PHRASE))),        
        startingResource: true
    },
    {
        resourceType: ResourceType.Wood,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("wood-knock"),
        patternNotation: createNotation(everyOther, repeatStringArrayIntoArray(['c/2', 'c/2 '], QUARTERS_PER_PHRASE)), //"c/2 c/2 c/2 c/2 c/2 c/2 c/2 c/2 :|\n",
        pattern: everyOther,
        startingResource: true
    },
    {
        resourceType: ResourceType.Money,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_K_1"),
        pattern: underPressureNotes,
        patternNotation: [
            {
                startingBeatNumber: underPressureNotes[0],
                notation: "c/2"
            },
            {
                startingBeatNumber: underPressureNotes[1],
                notation: "c/2 "
            },
            {
                startingBeatNumber: underPressureNotes[2],
                notation: "c/2"
            },
            {
                startingBeatNumber: underPressureNotes[3],
                notation: "c/4"
            },
            {
                startingBeatNumber: underPressureNotes[4],
                notation: "c/4 "
            },
            {
                startingBeatNumber: underPressureNotes[5],
                notation: "c/2"
            },
            {
                startingBeatNumber: underPressureNotes[6],
                notation: "c/2"
            },
            {
                startingBeatNumber: QUARTER_VALUE * 3,
                notation: "z"
            },
        ],
        startingResource: true
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
        pattern: getBeatNumbers(4, 4),        
        patternNotation: createNotation(getBeatNumbers(QUARTERS_PER_PHRASE / 2), repeatStringIntoArray('z', QUARTERS_PER_PHRASE / 2)).concat(createNotation(getBeatNumbers(QUARTERS_PER_PHRASE / 2, 4), repeatStringIntoArray('c', QUARTERS_PER_PHRASE / 2)))//"z c z c :|\n"
    },
    {
        resourceType: ResourceType.Storm,
        collectionAmount: 1,
        completedBarAmount: 10,
        clickPathSFX: createFilePath("RD_C_HH_8"),
        pattern: swung16,
        //patternNotation:  "c z c z | c z c c | c z c z | c z c z:|\n"
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

function createNotation(beatNotes: number[], notation: string[]) : BeatNotation[] {
    const patterNotation : BeatNotation[] = [];
    for (let index = 0; index < beatNotes.length; index++) {
        patterNotation[index] =  {
            startingBeatNumber: beatNotes[index],
            notation: notation[index]
        }
    }

    return patterNotation;
}

function repeatStringIntoArray(stringToRepeat : string, amountOfTimes : number) : string[] {
    const stringArray : string[] = [];
    for (let index = 0; index < amountOfTimes; index++) {
        stringArray.push(stringToRepeat);
    }

    return stringArray;
}

function repeatStringArrayIntoArray(stringToRepeat : string[], amountOfTimes : number) : string[] {
    const stringArray : string[] = [];
    for (let index = 0; index < amountOfTimes; index++) {
        stringToRepeat.forEach((msg : string) => {
            stringArray.push(msg);   
        });        
    }

    return stringArray;
}