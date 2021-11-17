import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom({
  background: [0, 0, 0] // The RGB code

})

//sprites
loadSprite("bean", "sprites/bean.png");
loadSprite("moon", "sprites/moon.png");
loadSprite("RetroFeeling", "sprites/RetroFeeling.png");
loadSprite("home", "sprites/home.png");
loadSprite("hintergrund", "sprites/hintergrund.jpg");
loadSprite("RetroFeelingsklein", "sprites/RetroFeelingsklein.png");
loadSprite("vogel", "sprites/vogel.gif");
loadSprite("plane2", "sprites/plane2.png");
loadSprite("windkraftanlage2", "sprites/windkraftanlage2.png");
loadSprite("bag", "sprites/bag.png");

//sounds
loadSound("score", "sounds/score.mp3");
loadSound("losesound", "sounds/losesound.mp3");

scene("homescreen", () => {

  add([
    sprite("RetroFeeling"),
    pos(width() / 2, height() / 2 + 50),
    //scale(2),
    origin("center"),
  ]);

  // display score
  add([
    sprite("vogel"),
    pos(width() / 2 - 160, height() / 2 + 80),
    //scale(2),
    origin("center"),
    area(),
    "button1",
    onClick("button1", () => { go('SaveTheBird') })
  ]);

  add([
    sprite("moon"),
    pos(width() / 2 + 160, height() / 2 + 80),
    scale(1.5),
    origin("center"),
    area(),
    "button2",
    onClick("button2", () => { go('game2') })
  ]);
})

let highScore = 0;

scene("SaveTheBird", () => {
  const PIPE_GAP = 120;
  let score = 0;

  add([
    sprite("hintergrund", { width: width(), height: height() })
  ]);

  add([
    sprite("RetroFeelingsklein"),
    pos(5, 5),
    scale(0.5)
  ]);

  const scoreText = add([
    text("Punkte: " + score, { size: 50 }),
    pos(825, 20),
  ]);

  const player = add([
    // list of components
    sprite("vogel"),
    scale(0.5),
    pos(80, 40),
    area(),
    body(),
  ]);

  function producePipes() {
    const offset = rand(0, 50);

    add([
      sprite("windkraftanlage2"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      "windkraftanlage2",
      scale(0.75),
      area(),
      { passed: false }
    ]);
  }

  function producePipes2() {
    const offset = rand(-50, 50);

    add([
      sprite("plane2"),
      pos(width(), height() / 3 + offset - PIPE_GAP / 3),
      origin("botleft"),
      scale(0.55),
      "plane2",
      area()
    ]);
  }

  loop(1.5, () => {
    producePipes();
  });

  loop(1.5, () => {
    producePipes2();
  });

  action("plane2", (pipe2) => {
    pipe2.move(-160, 0);

    if (pipe2.passed === false && pipe2.pos.x < player.pos.x) {
      pipe2.passed = true;
      score += 1;
      scoreText.text = "Punkte: " + score;
    }

    player.collides("plane2", () => {
      go("lose", score);
      "losesound"
    })
  });

  action("windkraftanlage2", (pipe) => {
    pipe.move(-160, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = "Punkte: " + score;
    }

    player.collides("windkraftanlage2", () => {
      go("lose", score);
      "losesound"
    })

    player.action(() => {
      if (player.pos.y > height() + 30 || player.pos.y < -30) {
        go("lose", score);
      }
    });

    keyPress("space", () => {
      play("score");
      player.jump(400);
    });
  });

  add([
    // list of components
    sprite("home"),
    pos(1850, 20),
    scale(0.5),
    area(),
    "button3",
    onClick("button3", () => { go('homescreen') })
  ]);
});

scene("lose", (score) => {
  if (score > highScore) {
    highScore = score;
  }

  add([
    sprite("vogel"),
    pos(width() / 2, height() / 2 - 80),
    rotate(180),
    origin("center"),
  ]);

  // display score
  add([
    text("Punkte: "+score),
    pos(width() / 2, height() / 2 + 80),
    origin("center"),
  ]);
  

  onKeyPress("space", () => go("SaveTheBird"));
  onClick(() => go("SaveTheBird"));

});

scene("game2", () => {

  // define gravity
  gravity(2400);

  // add a game object to screen
  const player = add([
    // list of components
    sprite("bag"),
    pos(80, 40),
    area(),
    body(),
  ]);

  // floor
  add([
    rect(width(), FLOOR_HEIGHT),
    outline(4),
    pos(0, height()),
    origin("botleft"),
    area(),
    solid(),
    color(127, 200, 255),
  ]);

  add([
    // list of components
    sprite("home"),
    pos(600, 50),
    scale(0.5),
    area(),
    "button3",
    onClick("button3", () => { go('homescreen') })
  ]);

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
    }
  }

  // jump when user press space
  onKeyPress("space", jump);
  onClick(jump);

  function spawnTree() {

    // add tree obj
    add([
      rect(48, rand(32, 96)),
      area(),
      outline(4),
      pos(width(), height() - FLOOR_HEIGHT),
      origin("botleft"),
      color(255, 180, 255),
      move(LEFT, SPEED),
      "tree",
    ]);

    // wait a random amount of time to spawn next tree
    wait(rand(0.5, 1.5), spawnTree);

  }

  // start spawning trees
  spawnTree();

  // lose if player collides with any game obj with tag "tree"
  player.onCollide("tree", () => {
    //go to "lose2" scene and pass the score
    go("lose2", score);
    burp();
    addKaboom(player.pos);
  });
  //commebnghccc
  // keep track of score
  let score = 0;

  const scoreLabel = add([
    text(score),
    pos(24, 24),
  ]);

  // increment score every frame
  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });

});

scene("lose2", (score) => {

  add([
    sprite("bag"),
    pos(width() / 2, height() / 2 - 80),
    scale(2),
    origin("center"),
  ]);

  // display score
  add([
    text(score),
    pos(width() / 2, height() / 2 + 80),
    scale(2),
    origin("center"),
  ]);

  add([
    // list of components
    sprite("home"),
    pos(600, 50),
    scale(0.5),
    area(),
    "button3",
    onClick("button3", () => { go('homescreen') })
  ]);

  // go back to game with space is pressed
  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));

});

//go("game");
go("homescreen");


