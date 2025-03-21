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
    this.load.image('tapButton', 'monad-logo.png');
}

function create() {
    let tapButton = this.add.image(400, 300, 'tapButton').setInteractive();
    tapButton.on('pointerdown', () => {
        console.log('Tapped!');
    });
}

function update() {}

function buyTaps(amount) {
    console.log(`Buying ${amount} taps...`);
}

function activateAutoTapper() {
    console.log("Auto-Tapper Activated!");
}

function activateDoubleTap() {
    console.log("Double Tap Activated!");
}

function checkLuckyTap() {
    console.log("Lucky Tap Checked!");
}

function activateReferral() {
    console.log("Referral Bonus Activated!");
}
