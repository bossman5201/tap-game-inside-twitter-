// Animate tap button when clicked
document.getElementById("tap-button").addEventListener("click", function() {
    this.style.transform = "translate(-50%, -50%) scale(0.9)";
    setTimeout(() => {
        this.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);
    console.log("Tapped!");
});

// Placeholder functions for power-ups & buy taps
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
