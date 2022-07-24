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

function preload() {

}

function create() {

}

function update() {
    
}