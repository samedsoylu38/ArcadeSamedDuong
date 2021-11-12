import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom({
 background: [ 0, 0, 0 ] // The RGB code
 
})

document.write("test"),

// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("bag", "sprites/bag.png");
loadSprite("sun", "sprites/sun.png");
loadSprite("moon", "sprites/moon.png");
loadSprite("bobo", "sprites/bobo.png");
loadSprite("RetroFeeling", "sprites/RetroFeeling.png");
loadSprite("home", "sprites/home.png");

scene("homescreen", () =>{
  //onMouseDown()
  add([
    sprite("RetroFeeling"),
    pos(140, 50),
    scale(1)
  ])

  add([
        // list of components
        sprite("sun"),
        //pos (x-Achse, y-Achse)
        pos(200, 200),
        scale(2),
        area(),
        "button1",
        onClick("button1", () => 
        {go('game')})
        /*
         {
        clickAction: () => go('game'),
         },*/
    ]);
    add([
        // list of components
        sprite("moon"),
        pos(450, 200),
        scale(2),
        area(),
        "button2",
        onClick("button2", () => 
        {go('game2')})
    ]);

})
scene("game", () => {

    // define gravity
    gravity(2400);

    // add a game object to screen
    const player = add([
        // list of components
        sprite("bean"),
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
        onClick("button3", () => 
        {go('lose')})
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
        //go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

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

scene("lose", (score) => {

    add([
        sprite("bean"),
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
        pos(200, 50),
        scale(0.1),
        origin("center"),
        "button4",
        onClick("button4", () => 
        {go('lose')})
    ]);


    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

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
        onClick("button3", () => 
        {go('homescreen')})
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
        // go to "lose" scene and pass the score
        //go("lose", score);
        //burp();
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

scene("lose", (score) => {

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
        onClick("button3", () => 
        {go('homescreen')})
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});

//go("game");
go("homescreen");


