const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// draws black rectangle rectangle
context.fillRect(0, 0, 1024, 576);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imgSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imgSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
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
    },
    imgSrc: './img/samuraiMack/Idle.png',
    scale: 2.75,
    framesMax: 8,
    offset: {
        x: 215,
        y: 188
    }
})

const enemy = new Fighter({
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
    },
    imgSrc: './img/kenji/Idle.png',
    scale: 2.75,
    framesMax: 4,
    offset: {
        x: -300,
        y: 200
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

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);

    // stops sprite bleeding
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // update background
    background.update();
    shop.update();

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
            player.isAttacking = false;
            enemy.health -= 20;
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectangularCollision(enemy, player) && enemy.isAttacking) {
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