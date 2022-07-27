const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 960,
    height: 480,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: true,
        }
    }
};

const game = new Phaser.Game(config);
var score = 0;
var scoreText;

var startX;
var startY;
var endX;
var endY;

function preload() {
    this.load.image('tiles', 'assets/Terrain/Terrain (16x16).png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
    this.load.spritesheet('maskDudeRun', 'assets/Main Characters/Mask Dude/Run (32x32).png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('maskDudeIdle', 'assets/Main Characters/Mask Dude/Idle (32x32).png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('maskDudeJump', 'assets/Main Characters/Mask Dude/Jump (32x32).png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('apple', 'assets/Items/Fruits/Apple.png', {frameWidth: 32, frameHeight: 32});
}

function create() {
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('test_platformer', 'tiles');
    const platforms = map.createStaticLayer('Platforms', tileset, 0, 0);

    platforms.setCollisionByExclusion(-1, true);

    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#fff'});

    this.apples = this.physics.add.group({
        allowGravity: false,
        immovable: true
    });

    this.points = this.physics.add.group({
        allowGravity: false,
        immovable: true
    });

    map.getObjectLayer('Apples').objects.forEach((apple) => {
        const appleSprite = this.apples.create(apple.x, apple.y - 32, 'apple').setOrigin(0);
    });

    // map.getObjectLayer('StartEnd').objects.Start.x, map.getObjectLayer('StartEnd').objects.Start.y

    map.getObjectLayer('StartEnd').objects.forEach((object) => {
        if (object.name == 'Start') {
            startX = object.x;
            startY = object.y;
        }
        if (object.name == 'End') {
            endX = object.x;
            endY = object.y;
        }
    })

    this.player = this.physics.add.sprite(startX, startY, 'maskDudeIdle');

    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('maskDudeRun', {start: 0, end: 11}),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('maskDudeIdle', {start: 0, end: 10}),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('maskDudeJump', {start: 0, end: 0}),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'applePlay',
        frames: this.anims.generateFrameNumbers('apple', {start: 0, end: 16}),
        frameRate: 20,
        repeat: -1
    });

    this.apples.children.iterate(apple => {
        apple.play('applePlay');
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.apples, collectApple, null, this);

}

function update() {

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
        if (this.player.body.onFloor) {
            this.player.play('run', true);
        }
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
        if (this.player.body.onFloor) {
            this.player.play('run', true);
        }
    } else {
        this.player.setVelocityX(0);
        if (this.player.body.onFloor) {
            this.player.play('idle', true);
        }
    }
    if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
        this.player.setVelocityY(-300);
        this.player.play('jump', true);
    }
    if (this.player.body.velocity.x > 0) {
        this.player.setFlipX(false);
    } else if (this.player.body.velocity.x < 0) {
        this.player.setFlipX(true);
    }
    // if ((endX == this.player.x) && (endY == this.player.y)) {
    //     scoreText.setText('game over');
    // }

    if ((((this.player.x + 16) > endX) && ((this.player.x - 16) < endX)) && (((this.player.y + 16) > endY) && ((this.player.y - 16) < endY))) {
        scoreText.setText('Game over.\nYou scored: ' + score);
    }

}

function collectApple(player, apple) {
    apple.disableBody(true, true);
    score += 10;
    scoreText.setText('score: ' + score);
}