const startForm = document.querySelector("#startForm")

let enterplayers = false
let controlsView = false

const controlPanel = document.querySelector("#control-panel")

const name1 = document.querySelector("#name-1")
const name2 = document.querySelector("#name-2")

const p1 = document.getElementById('p1-tag')
const p2 = document.getElementById('p2-tag')

const sprite = document.getElementById('change-sprites')


document.addEventListener("DOMContentLoaded",function(){


  document.addEventListener("click",function(e){
    // console.log(e.target.name)
    const target = e.target.name
    if(target === "start"){
      if (name1.value && name2.value ){

        enterplayers = true
        myCanvas.style.display = 'block';
        startForm.style.display = 'none'
        sprite.style.display = 'block'
        controlPanel.style.display = 'none'
        timerX.style.display = 'block'

        p1.innerHTML = `<h3 class="name-alignment" style='color: blue;'>${name1.value}</h3>`
        p2.innerHTML = `<h3 class="name-alignment" style='color: purple;'>${name2.value}</h3>`

        p1Score.innerHTML = `<h3 class="score-alignment" style='color: blue;'>score: 0</h3>`
        p2Score.innerHTML = `<h3 class="score-alignment" style='color: purple;'>score: 0</h3>`

      }else{
        alert("Please add player names")
    }}else if(e.target.id === "reloadBtn"){
      window.location.reload()
    }
    if(target === "controls"){
      controlsView = !controlsView
      if (controlsView){
        controlPanel.style.display = 'block'
      }else {
        controlPanel.style.display = 'none'
      }
    }
  })

  document.addEventListener("keypress",function(e){

    // const prevKey1 = pressKey
  pressKey = e.key

    if (enterplayers){
    switch(pressKey){
      //player 1 listener
      case 'w':
        dy += -2
        break;
      case 's':
        dy += 2
        break;
      case 'a':
        dx += -2
        break;
      case 'd':
        dx += 2
        break;
        // player 1 listener end
        //reset locations if stuck
      case 'e':
        dx = 0
        dy = 0
        break;
      case ' ':
        x = canvas.width/2 - 50
        y = canvas.height-250

        x = canvas.width/2 + 50
        y = canvas.height-250
        break;
      //player 2 listener
      case 'i':
        dh += -2
        break;
      case 'k':
        dh += 2
        break;
      case 'j':
        dg += -2
        break;
      case 'l':
        dg += 2
        break;
      case 'u':
        dg = 0
        dh = 0
      break;
        //player 2 listener end
    }//switch end
  }
  })

})
