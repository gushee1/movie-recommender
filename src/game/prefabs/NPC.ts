import Phaser from "phaser";
import { getStory } from "../../composables/useStory";
import { generateStoryResponse } from "../../composables/useAI";
import { getRandomMotivation, Level1Genre } from "../../composables/personas";
import { EventBus } from "../EventBus";

export class NPC extends Phaser.Physics.Arcade.Sprite {
    motivation: string;
    walkSpeed: number = 200;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, genre: Level1Genre) {
        super(scene, x, y, texture);

        // Physics config
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        
        // TODO: this is temp until I code the AI movement
        this.setImmovable(true);

        // Add to scene
        scene.add.existing(this);

        // Make interactive
        this.setInteractive();
        this.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.interact();
            }
        })

        this.motivation = getRandomMotivation(genre);
    }

    buildStoryPrompt(summary: string): string {
        // TODO: how does this account for empty stories or adding player input into the story?
        return ` 
            You are an NPC in an interactive narrative game. 

            ---
            NPC MOTIVATION:
            ${this.motivation}

            STORY SO FAR:
            ${summary}
            ---

            Your task:
            Write a brief narrative segment (3–5 sentences) that moves the story forward, based on the NPC’s motivation and the story so far. 
            Keep the tone consistent and immersive. 
            At the end of your response, suggest two plausible next player actions that could meaningfully continue the story.
        `;
    }
      

    async interact() {
        const story = getStory();
        let prompt = this.buildStoryPrompt(story.getSummary());
        let response = await generateStoryResponse(prompt);
        EventBus.emit('npc-response', {'response': response});

        // TODO: how does this get added to the current story?
        // Is this the right way?
        story.addMessage("npc", response.narrative);
        await story.updateSummary();
    }
};