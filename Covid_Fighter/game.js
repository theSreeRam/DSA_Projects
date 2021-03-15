function loadImages(){
    //player, virus, gem
    enemy_image = new Image;
    enemy_image.src = "Assets/v1.png"

    player_image = new Image;
    player_image.src = "Assets/superhero.png"

    gem_image = new Image;
    gem_image.src = "Assets/gemm.png"
}




function init(){
    //define the objects that we will have in the game
    canvas = document.getElementById("mycanvas");
    // console.log(canvas);
    W = 700;
    H = 400;
    canvas.width = W;
    canvas.height = H;
    gameover = false;
    //pen to draw objects on canvas
    pen = canvas.getContext('2d');
    won = false;
    e1 = {
        x : 150,
        y : 50,
        w : 60,
        h : 60,
        speed : 20
    };

    e2 = {
        x : 300,
        y : 150,
        w : 60,
        h : 60,
        speed : 30
    };

    e3 = {
        x : 450,
        y : 20,
        w : 60,
        h : 60,
        speed : 40
    };

    enemy = [e1, e2, e3];

    player = {
        x : 20,
        y : H/2,
        w : 60,
        h : 60, 
        speed : 20,
        moving : false,
        health : 100,
    };

    gem = {
        x : W-100,
        y : H/2,
        w : 60, 
        h : 60,
    };

    //listen to events on the canvas
    canvas.addEventListener('mousedown', function(){
        player.moving = true;
    });

    canvas.addEventListener('mouseup', function(){
        player.moving = false;
    })
}

function isOverlap(rect1,rect2){
    if (rect1.x < rect2.x + rect2.w &&
   rect1.x + rect1.w > rect2.x &&
   rect1.y < rect2.y + rect2.h &&
   rect1.y + rect1.h > rect2.y) {
    return true
    }
    
    return false;
    
}


function draw(){

    pen.clearRect(0,0,W,H);
    pen.fillStyle = "red";
    //pen.drawImage(enemy_image, box.x, box.y, box.w, box.h);
    

    //draw player
    pen.drawImage(player_image, player.x, player.y, player.w, player.h);

    pen.drawImage(gem_image, gem.x, gem.y, gem.w, gem.h);
    

    //draw gem

    for(let i=0; i< enemy.length; i++){
        pen.drawImage(enemy_image, enemy[i].x, enemy[i].y, enemy[i].w, enemy[i].h);

    }   

    pen.fillStyle = "white";
	pen.font = "20px Roboto"

    pen.fillText("Health: " + player.health, 20, 20);
}

function update(){

    //move the box vertically


    // if(box.y >= H-box.h || box.y<=0){
    //     box.speed *= -1;
    // }
    // box.y += box.speed;

    //if player is moving
    if(player.moving){
        player.x += player.speed;
        player.health += 20;
    }

    for(let i=0; i<enemy.length; i++){
        if(isOverlap(player, enemy[i])){
            player.health -= 50;
            if(player.health <0 ){
                console.log(player.health);
                gameover = true;
            }
        }
    }

    //overlap between player and gem
    if(isOverlap(player, gem)){
        draw();
        gameover = true;
        won = true;
        return;
    }

    for(let i=0; i<enemy.length; i++){
        enemy[i].y += enemy[i].speed;
        if(enemy[i].y > (H-enemy[i].h) || enemy[i].y < 0 ){
            enemy[i].speed *= -1;
        }
    }

}

function gameloop(){
    
    draw();
    update();
    if(gameover){
        clearInterval(f);
        if(won)
            alert("You won the game")
        else 
            alert("GAME OVER, your health is " + player.health)
    }
    //console.log("In game loop");
}

loadImages();
init();

var f = setInterval(gameloop, 100);