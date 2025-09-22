import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

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
    npcSpeed: number = 200;
    numNpcs: number = 5;
    npcTalkRadius: number = 30;

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
        for (let i: number = 0; i < 5; i++) {
            const x = Phaser.Math.Between(50, this.scale.width - 50);
            const y = Phaser.Math.Between(50, this.scale.height - 50);

            const npc = this.npcs.create(x, y, 'npc') as Phaser.Physics.Arcade.Sprite;
            npc.setCollideWorldBounds(true);
            npc.setImmovable(true);

            npc.setInteractive();

            npc.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                if (pointer.leftButtonDown()) {
                    this.interactNPC(`Hello, I am NPC number ${i}`)
                }
            })
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

    interactNPC(prompt: string) {
        // TODO: move player to NPC before adding text
        this.displayText.setText(prompt);
        this.conversationsThisLevel++;
        if (this.conversationsThisLevel >= 4) {
            EventBus.emit('level-done', this);
        }
    }

    moveNPC(npc: Phaser.Physics.Arcade.Sprite) {
        const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 }
        ];
    
        const dir = Phaser.Math.RND.pick(directions);
        npc.setVelocity(dir.x * this.npcSpeed, dir.y * this.npcSpeed);
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
            //this.moveNPC(sprite);
            return true;
        })
    }
}
