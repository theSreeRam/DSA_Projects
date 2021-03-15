//hello world for phase = Basic game

let prizes_config = {
    count:12,
    prize_names : ["3000 Credits","35% Off","Hard Luck","70% OFF","Swagpack","100% OFF","Netflix","50% Off","Amazon Voucher","2 Extra Spin", "CB Tshirt","CB Book"]
}


let config = {
    type : Phaser.CANVAS,
    width : 800,
    height : 500,
    backgroundColor : 0xffcc00,

    scene : {
        preload : preload,
        create : create, 
        update : update
    }

};


let game = new Phaser.Game(config);


function preload(){             //called only once when it is getting started
    console.log("Preload");
    

    //load object , load some images
    this.load.image('background', '../Assets/back.jpg');
    this.load.image('wheel', '../Assets/wheel.png');
    this.load.image('pin', '../Assets/pin.png');
    this.load.image('stand', '../Assets/stand.png');


}

function create(){
    console.log("create");      //only once after preload, to create the objects
    //create the background image
    let W = game.config.width;
    let H = game.config.height;

    
    let background = this.add.sprite(0,0,'background');
    background.setPosition(W/2, H/2);
    background.setScale(0.2);

    let stand = this.add.sprite(W/2, H/2 + 210, 'stand');
    stand.setScale(0.25);

    this.wheel = this.add.sprite(W/2,H/2,'wheel')
    this.wheel.setScale(0.2);
    //this.wheel.alpha = 0.5;

    let pin = this.add.sprite(W/2, H/2 - 210, 'pin');
    pin.setScale(0.25);

    //event listener for mouse click
    this.input.on("pointerdown", spinwheel, this);

    //lets create a text object
    font_style = {
        font: "bold 30px Roboto",
        align: "center",
        color: "red"
    }

    this.game_text = this.add.text(10,10, "Welcome to Spin & Win", font_style)
}



function update(){          //GAME LOOP - called repeatedly
    console.log("Inside Update");
    // this.wheel.angle += 1;
    // this.wheel.scaleX += 0.01;
}


function spinwheel(){
    console.log("ROLLING!!!!!!");
    console.log("Start spinning")
    this.game_text.setText("ROLLING!!!!!")

    let rounds = Phaser.Math.Between(2,5);
    let degrees = Phaser.Math.Between(0,11)*30;

    let total_angle = rounds*360 + degrees;
    console.log(total_angle)

    let idx = prizes_config.count - 1 - Math.floor(degrees/(360/prizes_config.count));

    tween = this.tweens.add({
        targets: this.wheel,
        angle: total_angle, // Needs to be rnadomly generated
        ease : "Cubic.easeOut",
        duration: 4000,
        callbackScope: this,
        onComplete: function(){
            this.game_text.setText("You won "+ prizes_config.prize_names[idx]);
        }
    });
}