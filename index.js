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
    attack2: {
      imgSrc: "./img/Meow Knight/Meow_Knight-Sheet-Attack2.png",
      framesMax: 4,
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
      x: 40,
      y: 80,
    },
    width: 100,
    height: 50,
  },
});

const enemy = new Fighter({
  colour: "blue",
  position: {
    x: 800,
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
  imgSrc: "./img/blueWitch/B_witch-Sheet-idle.png",
  scale: 0.4,
  framesMax: 6,
  offset: {
    x: 315,
    y: 17,
  },
  sprites: {
    idle: {
      imgSrc: "./img/blueWitch/B_witch-Sheet-idle.png",
      framesMax: 6,
    },
    run: {
      imgSrc: "./img/blueWitch/B_witch-Sheet-run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/blueWitch/B_witch-Sheet-idle.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/blueWitch/B_witch-Sheet-attack.png",
      framesMax: 9,
    },
    attack2: {
      imgSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./img/blueWitch/B_witch-Sheet-damage.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./img/blueWitch/B_witch-Sheet-death.png",
      framesMax: 12,
    },
  },
  attackBox: {
    offset: {
      x: -300,
      y: 50,
    },
    width: 275,
    height: 80,
  },
});

// animate sprites

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
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

  // check if player is within boundary
  if (player.position.x < 0) {
    player.position.x = 0;
  }

  if (player.position.x > 965) {
    player.position.x = 965;
  }

  // check if enemy is within boundary
  if (enemy.position.x < -15) {
    enemy.position.x = -15;
  }

  if (enemy.position.x > 945) {
    enemy.position.x = 945;
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
    ((player.attackType === "attack1" && player.framesCurrent === 4) ||
      (player.attackType === "attack2" && player.framesCurrent === 2))
  ) {
    enemy.takeHit(player.attackType, "enemy");
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // enemy attacks, player hit
  if (
    rectangularCollision(enemy, player) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 6
  ) {
    player.takeHit(enemy.attackType, "player");
    console.log(player.health);
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // detect attack miss
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (enemy.isAttacking && enemy.framesCurrent === 6) {
    enemy.isAttacking = false;
  }

  // enemy AI movements
  if (!enemy.dead && !player.dead) {
    enemyAIMove();
  }

  // player dies
  if (player.dead) {
    enemy.switchSprite("idle");
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner(player, enemy, timerId);
    enemy.velocity.x = 0;
    enemy.velocity.y = 0; // stupid fix -> look at this again and fix the actual bug lol
  }
}

animate();

// keyboard movements
window.addEventListener("keydown", (event) => {
  // stop key hold repeating
  if (event.repeat) return;

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

      case "g":
        // attack1
        player.attack("attack1");
        player.attackType = "attack1";
        break;

      case "h":
        // attack2
        player.attack("attack2");
        player.attackType = "attack2";
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
  }
});

function enemyAIMove() {
  let attackBoxXLeft = enemy.position.x + enemy.attackBox.offset.x;
  let attackBoxXRight =
    enemy.position.x + enemy.attackBox.offset.x + enemy.attackBox.width;

  if (
    player.position.x >= attackBoxXLeft &&
    player.position.x + player.width < attackBoxXRight
  ) {
    enemy.attack("attack1");
  } else if (player.position.x + player.width < attackBoxXRight) {
    //setTimeout(function() {
    //   enemy.velocity.x = -2; 
    //   enemy.switchSprite("run");
    // }, 1000);
    enemy.velocity.x = -2;
    enemy.switchSprite("run");
  } else if (player.position.x >= attackBoxXLeft) {
    enemy.velocity.x = 2;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
}
