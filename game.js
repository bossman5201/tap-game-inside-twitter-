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
    // Create the Monad "M" logo using an SVG Data URL
    const monadLogoSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" stroke="white" stroke-width="4" fill="purple"/>
            <text x="50%" y="55%" font-size="40" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">M</text>
        </svg>
    `;
    const monadLogoDataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(monadLogoSVG);
    this.textures.addBase64('tapButton', monadLogoDataURL);
}

function create() {
    let tapButton = this.add.image(400, 300, 'tapButton').setInteractive();
    tapButton.setScale(2); // Make the logo bigger
    tapButton.on('pointerdown', () => {
        console.log('Tapped!');
    });
}

function update() {}const config = {
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
