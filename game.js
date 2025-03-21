const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#2D2A4A",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('tapButton', 'monad-logo.png'); // Make sure the file exists in the repo
}

function create() {
    let tapButton = this.add.image(400, 300, 'tapButton').setInteractive();
    tapButton.setScale(0.5); // Adjust the size if needed
    tapButton.on('pointerdown', () => {
        console.log('Tapped!');
    });
}

function update() {}
