const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

// draws black rectangle rectangle
context.fillRect(0, 0, 1024, 576);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imgSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  colour: "red",
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imgSrc: "./img/Meow Knight/Meow_Knight-Idle.png",
  scale: 0.5,
  framesMax: 6,
  offset: {
    x: 170,
    y: 170,
  },
  sprites: {
    idle: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Idle.png",
      framesMax: 6,
    },
    run: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Sheet-Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Shee-Jump.png",
      framesMax: 5,
    },
    fall: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Sheet-Fall.png",
      framesMax: 7,
    },
    attack1: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Sheet-Attack1.png",
      framesMax: 10,
    },
    takeHit: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Sheet-Damage.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Sheet-Death.png",
      framesMax: 5,
    },
  },
  attackBox: {
    offset: {
      x: 50,
      y: 80,
    },
    width: 100,
    height: 50,
  },
});

const enemy = new Fighter({
  colour: "blue",
  position: {
    x: 850,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imgSrc: "./img/kenji/Idle.png",
  scale: 2.75,
  framesMax: 4,
  offset: {
    x: 215,
    y: 200,
  },
  sprites: {
    idle: {
      imgSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

// animate sprites

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowUp: { pressed: false },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);

  // stops sprite bleeding
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // update background
  background.update();
  shop.update();

  // fade out background slightly
  context.fillStyle = "rgba(255,255,255,0.10)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // update player movement
  player.update();
  enemy.update();

  // default velocity = 0;
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // player jumping/in air
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // check if player is on the ground
  if (player.velocity.y === 0) {
    player.jumping = 0;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // check if enemy is on the ground
  if (enemy.velocity.y === 0) {
    enemy.jumping = 0;
  }

  // player attacks, enemy hit
  if (
    rectangularCollision(player, enemy) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // enemy attacks, player hit
  if (
    rectangularCollision(enemy, player) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // detect attack miss
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner(player, enemy, timerId);
  }
}

animate();

// keyboard movements
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      // Player
      case "d":
        // move right
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        // move left
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        // double jump
        keys.w.pressed = true;

        if (player.jumping < 2) {
          player.velocity.y = -15;
          player.jumping++;
        }

        break;
      case " ":
        // attack
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    // Enemy
    switch (event.key) {
      case "ArrowRight":
        // move right
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        // move left
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        // double jump
        keys.ArrowUp.pressed = true;

        if (enemy.jumping < 2) {
          enemy.velocity.y = -15;
          enemy.jumping++;
        }

        break;
      case "ArrowDown":
        // attack
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // Player
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    // Enemy
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
