// filepath: /phaser-setup/phaser-setup/main.js
// -----------------------------
// 1) phaser game configuration
// -----------------------------
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    backgroundColor: "#000000", // black background
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 900 }, // pulls player downward
            debug: true // shows debug boxes for physics bodies, useful for development
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

// -----------------------------
// 2) variables used by scene
// -----------------------------
let player;
let ground;
let keys;

// -----------------------------
// 3) scene lifecycle methods
// -----------------------------
function preload() {
    this.load.image("idle", "../assets/Idle.gif");
    this.load.image("run", "../assets/Run.gif");
    this.load.image("jump", "../assets/Jump.gif");
    this.load.image("fall", "../assets/Fall.gif");
}

function create() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    ground = this.add.rectangle(gameWidth / 2, gameHeight - 25, gameWidth, 50, 0x8b5a2b);
    this.physics.add.existing(ground, true);

    player = this.physics.add.image(120, gameHeight - 200, "idle");
    this.physics.add.existing(player);
    player.setScale(2);

    const playerBody = player.body;
    playerBody.setCollideWorldBounds(true);
    playerBody.setBounce(0.05);

    this.physics.add.collider(player, ground);

    keys = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        jump: Phaser.Input.Keyboard.KeyCodes.W
    });

    this.physics.world.setBounds(0, 0, gameWidth, gameHeight);

    this.scale.on("resize", (gameSize) => {
        const newWidth = gameSize.width;
        const newHeight = gameSize.height;

        ground.setPosition(newWidth / 2, newHeight - 25);
        ground.width = newWidth;
        ground.body.updateFromGameObject();

        this.physics.world.setBounds(0, 0, newWidth, newHeight);
    });
}

function update() {
    const playerBody = player.body;

    if (keys.left.isDown) {
        playerBody.setVelocityX(-320);
        player.setFlipX(true);
    } else if (keys.right.isDown) {
        playerBody.setVelocityX(320);
        player.setFlipX(false);
    } else {
        playerBody.setVelocityX(0);
    }

    if (keys.jump.isDown && playerBody.blocked.down) {
        playerBody.setVelocityY(-450);
    }

    if (!playerBody.blocked.down) {
        if (playerBody.velocity.y < 0) {
            player.setTexture("jump");
        } else {
            player.setTexture("fall");
        }
    } else if (playerBody.velocity.x !== 0) {
        player.setTexture("run");
    } else {
        player.setTexture("idle");
    }
}