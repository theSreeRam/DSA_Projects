let config = {
    type: Phaser.AUTO,
    scale:{
        // parent: 'body',
        mode: Phaser.Scale.FIT,
        width: 800,
        height: 600,
    },

    backgroundColor : 0xffff11,


    //Adding a physics engine to the game

    physics : {
        default:'arcade',
        arcade : {
            gravity : {
                y: 1000,
            },
            debug: false,
        },

    },

    scene : {
        preload : preload,
        create : create,
        update : update,
    }
};

let game = new Phaser.Game(config);

let player_config = {
    player_speed: 150,
    player_jump_speed: -700,
}

function preload(){
    this.load.image("ground", "Assets/topground.png")
    this.load.image("sky", "Assets/background.png")
    this.load.spritesheet("dude", "Assets/dude.png", {frameWidth:32, frameHeight: 48});
    this.load.image("apple", "Assets/apple.png")
    this.load.image("ray", "Assets/ray.png")
}

function create(){
    W = game.config.width;
    H = game.config.height;
    
    

    let ground = this.add.tileSprite(0, H-128, W, 128, 'ground')
    ground.setOrigin(0,0);


    let background = this.add.sprite(0, 0, 'sky')
    background.setOrigin(0,0);
    background.displayWidth = W;
    background.displayHeight = H;
    background.depth = -2;
    
    //Adding ray
    let rays = [];
    for(let i=-10 ; i<=10; i++){
        let ray = this.add.sprite(W/2, H-128, "ray")
        ray.displayHeight = 1.5*H;
        ray.setOrigin(0.5,1)
        ray.alpha = 0.2
        ray.angle = i*10
        ray.depth = -1;
        rays.push(ray);
    }

    //tween for array rotation
    this.tweens.add({
        targets:rays,
        props : {
            angle :{
                value:"+=20",
            },
        },
        duration: 8000,
        repeat : -1,
    }); 

    //add a group of apple = physical objects
    let fruits = this.physics.add.group({
        key: "apple",
        repeat: 8,
        setScale : {x:0.2, y:0.2},
        setXY : {x:10,y:0, stepX:100}
    })

    //add bounce to all apples
    fruits.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.2,0.7))
    })


    //Add more platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(500,370,'ground').setScale(2,0.5).refreshBody();
    platforms.create(700,200,'ground').setScale(2,0.5).refreshBody();
    platforms.create(100,200,'ground').setScale(2,0.5).refreshBody();
    platforms.add(ground);

    this.player = this.physics.add.sprite(100,100,'dude',4);
    //set the bounce of the player
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);
    this.physics.add.existing(ground);
    ground.body.allowGravity = false;
    ground.body.immovable = true;


    //inbuilt collision detection between the player and the ground
    //add a collision detection between the plyaer and the ground
    this.physics.add.collider(platforms, this.player);
    //this.physics.add.collider(fruits, ground);
    this.physics.add.collider(platforms, fruits)


    //Player animations and player movements
    //Here we created the event listener, and we'll actually check in update
    this.cursors = this.input.keyboard.createCursorKeys();


    //player animationss
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude',{start:0, end:3}),
        frameRate : 10,
        repeat : -1
    });

    this.anims.create({
        key: 'center',
        // frames: this.anims.generateFrameNumbers('dude',{start:4, end:4}),
        //Alternate Syntax
        frames: [{key:'dude', frame:4}],
        frameRate : 10,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude',{start:5, end:8}),
        frameRate : 10,
        repeat : -1
    });

    this.physics.add.overlap(this.player, fruits, eatFruits, null);


    //create cameras
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);

    this.cameras.main.startFollow(this.player, true, true);
    this.cameras.main.setZoom(1.3)


    
    
    
}


function update(){
    //left right movement
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left', true)
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('right', true)

    }
    else {
        this.player.setVelocityX(0);
        this.player.anims.play('center', true)
    }

    //add jumping ability, stop the player when in air
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(player_config.player_jump_speed)
    }
}

function eatFruits(player, fruit){
    fruit.disableBody(true, true)
}