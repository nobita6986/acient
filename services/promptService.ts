import type { Scene } from '../types';

// 1a. STYLE_LOCK (Bản thiết kế nghệ thuật)
const STYLE_LOCK = "ultra-realistic prehistoric ASMR cinematic documentary. Primary character strictly matches 3 uploaded references (face, hair, scary, outfit) to ensure consistency. Supporting characters follow same style but not identity-locked. Lighting: warm amber rimlight, cool fill, fog haze. Lens: 45mm f/2.0 for shallow DoF. Film grain: subtle. Color grade: amber-teal cinematic tone.";

// 1c. Technical Suffix (Hậu tố kỹ thuật cho ảnh)
const TECHNICAL_SUFFIX = "Distinct moment in the story. Tactile ASMR details. Photorealistic. No text, words, or logos.";

// Components for Video Prompt
const SCENE_DURATION_SECONDS = 8;
const CINEMATIC_INSTRUCTIONS = `Direct continuation of the still image, bringing it to life with subtle motion. Handheld camera (3-5% sway), focus breathing. Prehistoric ambient sounds only. Duration ${SCENE_DURATION_SECONDS}s. Family safe for monetization.`;


// 1b. Action Description (Mô tả hành động) - from Scenario
const NARRATIVE_STAGES = {
  Hook: [
    "A wide cinematic shot of a prehistoric sky at late dusk, the sun almost gone below the horizon as orange fades into purple-blue, with a tiny silhouette line of early humans walking across the landscape below, 16:9, no text.",
    "Medium-wide shot of a small group of early hominids with dark muddy skin and animal-skin clothing moving from open grassland into an area of taller grass and scattered bushes, the light between the plants noticeably darker, cinematic, no text.",
  ],
  Quest: [
    "Close-up of a tired prehistoric human face as the warm light disappears, skin tones shifting from orange to cold bluish gray, shadows deepening around the eyes while they scan the surroundings anxiously, no text.",
    "Low-angle close-up of a bare muddy foot stepping unknowingly onto a hidden root in the dim light, stumbling slightly and dropping to one knee before quickly pushing back up, no injury shown, cinematic, no text.",
    "Medium handheld shot of another group member immediately reaching out a hand to pull the stumbling person back to their feet, both resuming their hurried walk without stopping, prehistoric environment, no text.",
  ],
  Conflict: [
    "Medium-wide shot of the group tightening their formation as the leader gestures for everyone to move closer together, individuals with primitive weapons shifting to the outside while the more vulnerable stay toward the center, no text.",
    "Close-up of a rough hand gripping a simple wooden club or stone-tipped stick more tightly, knuckles tense, only a faint rim of light outlining the weapon and fingers in the growing darkness, cinematic 4K, no text.",
  ],
  Innovation: [
    "Medium shot of several early humans climbing onto a low mound or rocky rise to gain a slightly higher vantage point, while the rest of the group waits below at the base, dusk light almost gone, no text.",
    "POV shot from the top of the mound looking out across the landscape, where trees, bushes and horizon have turned into indistinct dark shapes with no clear detail, making it impossible to tell safety from danger, cinematic, no text.",
  ],
  Civilization: [
    "High-angle wide shot showing the small group huddled together as a tiny cluster in the middle of a vast area of dark grass and scattered trees, the sky above now a deep blue, emphasizing their vulnerability, cinematic 4K, no text.",
  ],
  Reflection: [
    "Close-up of the leader’s eyes in the dim light, pupils widened as he squints into the darkness, only a faint reflection of the purple sky visible in his gaze, prehistoric mood, no text.",
    "Close-up of a human ear and side of the head in near darkness, camera slightly shaking, then cutting to a close-up of leaves gently rustling in the faint wind, while unseen nighttime sounds rise around them, atmospheric, no text.",
  ],
};

const getRandomTemplate = (stage: keyof typeof NARRATIVE_STAGES): string => {
    const templates = NARRATIVE_STAGES[stage];
    return templates[Math.floor(Math.random() * templates.length)];
}


export const generatePromptsFromScenario = (scenario: string, duration: number): Scene[] => {
    const scenes: Scene[] = [];
    // Assuming approx. 2 scenes per minute for calculation
    const totalScenes = duration * 2;
    if (totalScenes <= 0) return [];

    const stageBoundaries = {
        Hook: Math.ceil(totalScenes * 0.1),
        Quest: Math.ceil(totalScenes * 0.4),
        Conflict: Math.ceil(totalScenes * 0.6),
        Innovation: Math.ceil(totalScenes * 0.75),
        Civilization: Math.ceil(totalScenes * 0.9),
        Reflection: totalScenes,
    };
    
    for (let i = 1; i <= totalScenes; i++) {
        let actionDescription = '';
        if (i <= stageBoundaries.Hook) {
            actionDescription = getRandomTemplate('Hook');
        } else if (i <= stageBoundaries.Quest) {
            actionDescription = getRandomTemplate('Quest');
        } else if (i <= stageBoundaries.Conflict) {
            actionDescription = getRandomTemplate('Conflict');
        } else if (i <= stageBoundaries.Innovation) {
            actionDescription = getRandomTemplate('Innovation');
        } else if (i <= stageBoundaries.Civilization) {
            actionDescription = getRandomTemplate('Civilization');
        } else {
            actionDescription = getRandomTemplate('Reflection');
        }

        // 2a. Cấu trúc Image Prompt
        const imagePrompt = `${STYLE_LOCK} ${actionDescription} ${TECHNICAL_SUFFIX}`;
        // 2b. Cấu trúc Video Prompt
        const videoPrompt = `Scene ${i}: "${actionDescription}". ${CINEMATIC_INSTRUCTIONS}`;

        scenes.push({
            id: i,
            source: 'Scenario',
            imagePrompt,
            videoPrompt,
            image: null,
            isLoading: false,
        });
    }

    return scenes;
}


export const generatePromptsFromScript = (scriptLines: string[]): Scene[] => {
    return scriptLines.map((line, index) => {
        const sceneNumber = index + 1;
        const actionDescription = line.trim();

        // 2a. Cấu trúc Image Prompt
        const imagePrompt = `${STYLE_LOCK} ${actionDescription} ${TECHNICAL_SUFFIX}`;
        // 2b. Cấu trúc Video Prompt
        const videoPrompt = `Scene ${sceneNumber}: "${actionDescription}". ${CINEMATIC_INSTRUCTIONS}`;
        
        return {
            id: sceneNumber,
            source: 'Script',
            imagePrompt,
            videoPrompt,
            image: null,
            isLoading: false,
        };
    });
};
