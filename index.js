const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// draws black rectangle rectangle
context.fillRect(0, 0, 1024, 576);

const gravity = 0.7;

class Sprite {
    // single argument for position and velocity for cleaner (can't get position before velocity vice versa)
    constructor({position, velocity, colour, offset}) {
        this.health = 100;
        this.position = position; 
        this.velocity = velocity;
        this.colour = colour;
        this.lastKey;
        this.isAttacking = false;
        this.width = 50;
        this.height = 150;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset, // offset: offset
            width: 100, 
            height: 50
        }
    }
    
    // draw sprite
    draw() {
        // player/enemy body
        context.fillStyle = this.colour;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attack box
        if (this.isAttacking) {
            context.fillStyle = 'green'
            context.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )       
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }

    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    colour: 'red',
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    colour: 'blue',
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
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

function rectangularCollision(player, enemy) {
    return (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height
    );
}

function determineWinner(player, enemy, timerId) {
    clearTimeoutsdf(timerId)
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerId;
function decreaseTimer(){
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML= timer;
    }

    if (timer == 0) {
        determineWinner(player, enemy);
    }
}

decreaseTimer();

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

    // detect attack box collisions
    if (rectangularCollision(player, enemy) && player.isAttacking) {
            console.log("player attack!!");
            player.isAttacking = false;
            enemy.health -= 20;
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectangularCollision(enemy, player) && enemy.isAttacking) {
        console.log("enemy attack!!");
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner(player, enemy, timerId);
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
        case ' ':
            // attack
            player.attack();
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
        case 'ArrowDown':
            // attack
            enemy.attack();
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