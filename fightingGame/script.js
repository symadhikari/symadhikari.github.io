const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height) //to draw canvas
const gravity = 0.7

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/op.jpg'
})

const grass = new Sprite({
    position: {
        x:0,
        y:473
    },
    imageSrc: './img/ground.png'
})

const player = new Fighter({
    position: {
        x:100,
        y:0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/zoro/zidle.png',
    framesMax: 1,
    scale: 0.8,
    offset:{
        x:100,
        y:10
    },
    sprites:{
        idle:{
            imageSrc: './img/zoro/zidle.png',
            scale: 0.8,
            framesMax: 1,
            offset:{
                x:0,
                y:10
            }
        },
        run:{
            imageSrc: './img/zoro/zrun.png',
            framesMax: 4,
            scale: 0.8
            
        },
        jump:{
            imageSrc: './img/zoro/zjump.png',
            framesMax: 1
        },
        fall:{
            imageSrc: './img/zoro/fall.png',
            framesMax: 1
        },
        attack1:{
            imageSrc: './img/zoro/zattack1.png',
            framesMax: 4,
            scale:0.6
        },
        takeHit:{
            imageSrc: './img/zoro/ztakeHit.png',
            framesMax: 1,
            scale: 0.8
        },
        death:{
            imageSrc: './img/zoro/ztakeHit.png',
            framesMax: 1,
            scale: 0.8
        }
    },
    attackBox:{
        offset:{
            x:-100,
            y:70
        },
        width:150,
        height:50
    }
})
const enemy = new Fighter({
   position: {
        x:600,
        y:100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset:{
        x:-50,
        y:-20
    },
    imageSrc: './img/luffy/idle.png',
    scale: 0.9,
    sprites:{
        idle:{
            imageSrc: './img/luffy/idle.png',
            framesMax: 1,
            scale: 0.9
        },
        run:{
            imageSrc: './img/luffy/run.png',
            framesMax: 1,
            scale: 0.9
        },
        jump:{
            imageSrc: './img/zoro/jump.png',
            framesMax: 1,
            scale: 0.9
        },
        fall:{
            imageSrc: './img/zoro/fall.png',
            framesMax: 1
        },
        attack1:{
            imageSrc: './img/luffy/attack1.png',
            framesMax: 4,
            scale: 0.9
        },
        takeHit:{
            imageSrc: './img/luffy/takehit.png',
            framesMax: 3,
            scale: 0.9
        },
        death:{
            imageSrc: './img/luffy/done.png',
            framesMax: 1,
            scale: 0.9
        }
    },
    attackBox:{
        offset:{
            x:50,
            y:70
        },
        width: 120,
        height: 50
    }
})

const keys ={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    w:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArrowRight:{
        pressed:false
    }
    
}

decreaseTimer()
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    grass.update()
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0
    enemy.velocity.x = 0

    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }
    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }

    //detect collision
   // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 2
  ) {
    debugger
    enemy.takeHit()
    player.isAttacking = false
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    // gsap.to('#playerHealth', {
    // gsap.to('#enemyHealth', {
    //   width: enemy.health + '%'
    // })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    debugger
    player.takeHit()
    enemy.isAttacking = false
    document.querySelector('#playerHealth').style.width = player.health + '%'
    // gsap.to('#playerHealth', {
    //   width: player.health + '%'
    // })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -15
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})