import Phaser from "phaser";
import { useStory } from "../../composables/useStory";
import { generateStoryResponse } from "../../composables/useAI";
import { getRandomMotivation, Level1Genre } from "../../composables/personas";

export class NPC extends Phaser.Physics.Arcade.Sprite {
    motivation: string;
    story: any = useStory();

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

    buildStoryPrompt(): string {
        return ` 
            You are an NPC in an interactive narrative game. 

            ---
            NPC MOTIVATION:
            ${this.motivation}

            STORY SO FAR:
            ${this.story.summary}
            ---

            Your task:
            Write a brief narrative segment (3–5 sentences) that moves the story forward, based on the NPC’s motivation and the story so far. 
            Keep the tone consistent and immersive. 
            At the end of your response, suggest two plausible next player actions that could meaningfully continue the story.
        `;
    }
      

    async interact() {
        let prompt = this.buildStoryPrompt();
        let response = await generateStoryResponse(prompt);
    }
};