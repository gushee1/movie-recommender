import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: any;
    playerSpeed: number = 200;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.player = this.physics.add.sprite(100, 100, "character-idle");
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.wasd = this.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.up?.isDown || this.wasd.up?.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        } else if (this.cursors.down?.isDown || this.wasd.down?.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        } else if (this.cursors.right?.isDown || this.wasd.right?.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        } else if (this.cursors.left?.isDown || this.wasd.left?.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
