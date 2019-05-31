const canvas = document.getElementById("myCanvas");
const changeSpritesBtn= document.getElementById('change-sprites')
const timerX = document.getElementById('gig')
var ctx = canvas.getContext("2d");
let p1Sprite = new Image();
let p2Sprite = new Image();
const score = document.getElementById('scoreCont')
const homeBtn = document.getElementById('reloadBtn')
const winScreen = document.getElementById('victory')
const vicDiv = document.getElementById("vicScreen")
const PLAYERS_URL = 'http://localhost:3000/api/v1/players'
const GAMES_URL = 'http://localhost:3000/api/v1/games'

//helper functions
const posOrNeg = function(){
  if (Math.random() < 0.5){
    return -1
  }else{
    return 1}
}

const distance = function(x, g,y, h){
  return Math.sqrt((x-g)**2 +(y-h)**2)
}

const randomLocX = function(){
  return (canvas.width/2 + Math.random()*(circRad-20)*posOrNeg())
}

const randomLocY = function(){
  return (canvas.height/2 + Math.random()*(circRad-20)*posOrNeg())
}

//player 1 variables
var x = canvas.width/2 - 50 ;
var y = canvas.height-250;
var dx = 0;
var dy = 0;
var acc1 = .99
var p1multi = 1.5
var p1Rad = 20;

//player 2 variables
var g = canvas.width/2 + 50 ;
var h = canvas.height-250;
var dg = 0;
var dh = 0;
var acc2 = .99
var p2multi = 1.5
var p2Rad = 20;

// outer circle params
var cx = canvas.width/2 ;
var cy = canvas.height/2 ;
var circRad = 300

//powerup locations
var powerX = canvas.width/2 + Math.random()*200*posOrNeg()
var powerY = canvas.height/2 + Math.random()*200*posOrNeg()

//in game points and timers
var p1Points = 0
const p1Score = document.getElementById('p1-score')

var p2Points = 0
const p2Score = document.getElementById('p2-score')

var roundtimer = 4500

//defining players and objects
function player1() {
  ctx.beginPath();
  ctx.arc(x, y, p1Rad, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  ctx.drawImage(p1Sprite, x - p1Rad, y - p1Rad, 2 * p1Rad, 2 * p1Rad);
}

function player2() {
  ctx.beginPath();
  ctx.arc(g, h, p2Rad, 0, Math.PI*2);
  ctx.fillStyle = "#9995DD";
  ctx.fill();
  ctx.closePath();
  ctx.drawImage(p2Sprite, g - p2Rad, h - p2Rad, 2 * p2Rad, 2 * p2Rad);
}

function deathCircle() {
  ctx.beginPath();
  ctx.arc(cx, cy, circRad, 0, Math.PI *2);
  ctx.stroke();
  ctx.closePath();
}

// power up
let shroomsprite = new Image()
shroomsprite.src = "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/0/00/3a083df05201781d56433d893565e39edca3e161_large.jpg?width=640"

function bubba(){
  ctx.beginPath();
  ctx.arc(powerX, powerY, 20, 0, Math.PI *2);
  ctx.closePath();
  ctx.drawImage(shroomsprite, powerX - 25, powerY -25, 50, 50)
}

var powerup = true

//redrawing each frame
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(powerup){
    bubba();
  }else{
    if((roundtimer % 200) === 0){
      powerup = true
      console.log("spawning")
      powerX = randomLocX()
      powerY = randomLocY()
      bubba()
    }
  }
  // redraws all locations
  player1();
  player2();
  deathCircle();
  //brings player to complete stop
  if( Math.abs(dx) < .2){dx = 0}
  if (Math.abs(dy) <.2){dy = 0}
  if( Math.abs(dg) < .2){dg = 0}
  if (Math.abs(dh) <.2){dh = 0}

  // collision of players
  if(distance(x, g, y, h) <= p1Rad + p2Rad){
    if(dx=== 0 && dy=== 0){ /*static collision*/
      dx = -dg
      dy = -dh
    }else if (dg=== 0 && dh=== 0){ /*static collision*/
      dg = -dx
      dh = -dy
    }else{
    dx = -dx * p1multi
    dy = -dy  * p1multi
    dg = -dg * p2multi
    dh = -dh * p2multi
    //new location of player 1
    x += dx
    y += dy
    //new location of player 2
    g += dg;
    h += dh;
    }

  //collision with circle
}else if (distance(x, cx ,y, cy) >= circRad){ /*points to player 2 */
    p2Points++
    p2Score.innerHTML = `<h3 class="score-alignment" style='color: purple;'>score: ${p2Points}</h3>`
    x = randomLocX()
    y = randomLocY()
    dx = 0
    dy = 0

  }else if (distance(g, cx ,h, cy) >= circRad){ /*points to player 1 */
    p1Points++
    p1Score.innerHTML = `<h3 class="score-alignment" style='color: blue;'>score: ${p1Points}</h3>`
    g = randomLocX()
    h = randomLocY()
    dg = 0
    dh = 0

  //collision with powerup
}else if (distance(x,powerX,y,powerY)<= p1Rad + 20){
    p1Rad += 3
    powerup = false
    p1multi = p1multi*.93
    powerX = 0
    powerY = 0
  }else if (distance(g,powerX,h,powerY)<= p2Rad + 20){
    p2Rad += 3
    powerup = false
    p2multi = p2multi*.93
    powerX = 0
    powerY = 0
  }else{
    //new location of player 1
    dx = dx * acc1
    dy = dy * acc1
    x += dx;
    y += dy;
    //new location of player 2
    dg = dg * acc2
    dh = dh * acc2
    g += dg;
    h += dh;
  }

  if(enterplayers){

    roundtimer--
    let seconds = Math.round(roundtimer / 100)

    if(seconds === 0){ /*ends the game*/
      if (p1Points > p2Points){
        canvas.style.display = 'none'
        sprite.style.display = 'none'
        timerX.style.display = 'none'
        score.style.display = 'none'
        winScreen.innerHTML = `
        <h1 align="center" style="color:blue; font-size: 60px;">${name1.value}</h1>
        <h1 align="center" style="font-size: 60px;">has Won!</h1>
        `
        // console.log(p1Points)
        postToPlayer(name1.value, p1Points)
        const homeBtn = document.getElementById('reloadBtn')
        vicDiv.style.display = 'block'
      }else{
        canvas.style.display = 'none'
        sprite.style.display = 'none'
        timerX.style.display = 'none'
        score.style.display = 'none'
        winScreen.innerHTML = `
        <h1 align="center" style="color:purple; font-size: 60px;">${name2.value}</h1>
        <h1 align="center" style="font-size: 60px;">has Won!</h1>
        `
       // console.log(p2Points)
        postToPlayer(name2.value, p2Points)
        const homeBtn = document.getElementById('reloadBtn')
        vicDiv.style.display = 'block'}
    }//if seconds
    if(seconds <= 10){timerX.innerHTML = `<h3 class="rTimer" style='color:red' id="gig">${seconds}</h3>`
    }else{
      timerX.innerText = seconds
    }

    if (circRad < 170){
      //minimum circle size
    }else {
      //cirlce shrinks when games begins
      circRad -= .05
    }
  }
  //end of enterpalyers
} // end of draw

changeSpritesBtn.addEventListener('click', e=>{
  let spritesGroup = ['./assets/popeye.png', './assets/evans.png','./assets/ralph.png', './assets/snorlax.png', './assets/seb.png', './assets/pikachu.png'];
  let index = Math.floor((Math.random() * spritesGroup.length))
  // group sprite
  if(index == 0){
    return p1Sprite.src = spritesGroup[index],
          p2Sprite.src = spritesGroup[index+1];
  }else if(index > 0 && index <5){
    return p1Sprite.src = spritesGroup[index],
          p2Sprite.src = spritesGroup[index+1];
  }else{
    return p1Sprite.src = spritesGroup[index],
          p2Sprite.src = spritesGroup[index-1];
  }
})
// API FETCH FUNCTIONS
function postToPlayer(name, score){
   fetch(PLAYERS_URL, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
       body: JSON.stringify({
         ign_name: name,
         player_score: score
       })
   })
   .then(res => res.json())
  .then(playerObj => {
    console.log(playerObj);

  })
}

setInterval(draw, 10);
