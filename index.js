const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// draws black rectangle rectangle
context.fillRect(0, 0, 1024, 576);

const gravity = 0.7;

class Sprite {
    // single argument for position and velocity for cleaner (can't get position before velocity vice versa)
    constructor({position, velocity}) {
        this.position = position; 
        this.velocity = velocity;
        this.height = 150;
        this.lastKey;
    }
    
    // draw sprite
    draw() {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }

    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
})

// animate sprites

const keys = {
    a: {pressed: false},
    d: {pressed: false},
    w: {pressed: false}, 
    ArrowRight: {pressed: false},
    ArrowLeft: {pressed: false},
    ArrowUp: {pressed: false}
}

// let lastKey;

function animate() {
    window.requestAnimationFrame(animate);

    // stops sprite bleeding
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // update player movement 
    player.update();
    enemy.update();

    // default velocity = 0;
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    } 

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    } 
}

animate();

// keyboard movements
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player
        case 'd':
            // move right
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            // move left
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            // jump
            keys.w.pressed= true;
            player.velocity.y = -15;
            break;

        // Enemy
        case 'ArrowRight':
            // move right
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            // move left
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            // jump
            keys.ArrowUp.pressed = true;
            enemy.velocity.y = -15;
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // Player
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
        
        // Enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
})