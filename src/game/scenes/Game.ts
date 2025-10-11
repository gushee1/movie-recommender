import { getRandomMotivation, Level1Genre } from '../../composables/personas';
import { queryGPT, StoryResponse } from '../../composables/useAI';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { NPC } from '../prefabs/NPC';

export class Game extends Scene
{
    // General
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    // Controls
    arrowKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: any;
    interactKey: any;

    // Player
    player: Phaser.Physics.Arcade.Sprite;
    playerSpeed: number = 200;
    conversationsThisLevel: number = 0;

    // NPCs
    npcs!: Phaser.Physics.Arcade.Group;
    numNpcs: number = 5;

    // UI
    displayText: any

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // General
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        // Events
        EventBus.on("goto-next-level", () => this.changeScene());
        EventBus.on('npc-response', this.handleNPCResponse, this);

        // Assign Controls
        this.arrowKeys = this.input.keyboard!.createCursorKeys();

        this.wasd = this.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Create Player
        this.player = this.physics.add.sprite(100, 100, "character-idle");
        this.player.setCollideWorldBounds(true);

        // Create NPCs
        this.npcs = this.physics.add.group();

        for (const genre of Object.values(Level1Genre)) {
            const x = Phaser.Math.Between(50, this.scale.width - 50);
            const y = Phaser.Math.Between(50, this.scale.height - 50);
            const texture = 'npc';

            const npc = new NPC(this, x, y, texture, genre);

            this.npcs.add(npc);
        }

        // Collisions
        this.physics.add.collider(this.player, this.npcs);
        this.physics.add.collider(this.npcs, this.npcs);

        // Create UI
        const panelHeight = 100;
        const panel = this.add.rectangle(
            this.scale.width / 2,              // center X
            this.scale.height - panelHeight/2, // center Y
            this.scale.width,                  // full width
            panelHeight,                        // height
            0x000000,                          // black color
            0.7                                 // opacity
        );
        panel.setStrokeStyle(2, 0xffffff);     // optional white border

        this.displayText = this.add.text(
            20, this.scale.height - panelHeight + 20, // position inside panel
            "",                                       // empty string initially
            {
                font: "20px Arial",
                color: "#ffffff",
                wordWrap: { width: this.scale.width - 40 } // padding
            }
        );

        EventBus.emit('current-scene-ready', this);
    }

    handleNPCResponse(data: {response: StoryResponse}) {
        this.displayText.setText(data.response.narrative);
        this.conversationsThisLevel++;
        if (this.conversationsThisLevel >= 4) {
            EventBus.emit('level-done', this);
        }
    }

    changeScene ()
    {
        this.scene.start('Game');
    }

    update() {
        // Player Movement
        this.player.setVelocity(0);

        if (this.arrowKeys.up?.isDown || this.wasd.up?.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        } else if (this.arrowKeys.down?.isDown || this.wasd.down?.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        } else if (this.arrowKeys.right?.isDown || this.wasd.right?.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        } else if (this.arrowKeys.left?.isDown || this.wasd.left?.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        }

        // NPC Movement
        this.npcs.children.each((npc: Phaser.GameObjects.GameObject) => {
            const sprite = npc as Phaser.Physics.Arcade.Sprite;
            // TODO: invoke one movement frame via npc?
            return true;
        })
    }
}
