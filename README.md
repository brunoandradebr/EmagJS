# EmagJS 
A game engine made from scratch (no engine, no lib) for the purpose of studying game development.
It's using canvas API with 2d context (Software rendering).

### examples
<a target="_blank" href="http://www.acobaia.com.br/framework/example">Hello world example</a> <br>
<a target="_blank" href="http://www.acobaia.com.br/framework/example2">Preload example</a> <br>
<a target="_blank" href="http://www.acobaia.com.br/framework/example3">Mask example</a> <br>
<a target="_blank" href="http://www.acobaia.com.br/prototipos/2/">Pong example</a> 

## Usage

**Create your project structure** : <br>
* **App/**
  * Index.html
  * Script.js
* **EmagJS/**
  
<br>

**App/index.html** :

```html
<!DOCTYPE html>

<html>

<head>

    <!-- viewport -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- EmagJS initializer script -->
    <script src="../EmagJS/initializer.js" initScript="Script.js"></script>

</head>

<body></body>

</html>
```
**initScript** indicates the very first script to execute after EmagJS lib is loaded. <br>

That's all you need to start using the engine :D
<br>

## Hello World!

**App/Script.js**
```js
// example movie
let example = new Movie('example')

// main scene
example.addScene('main', {

    // scene depth index
    index: 1,

    // scene background color
    backgroundColor: 'white',

    // scene FPS - default 60
    FPS: 60,

    // scene resolution - auto resize to best fit to device
    width: 256,
    height: 256,

    // on create scene - only once
    onCreate: (scene) => {
        // create your objects here
        scene.box = new Sprite(new Vector(scene.width * 0.5, scene.height * 0.5), 50, 50, 'orange', 2)
    },

    // ever you enter main scene
    onEnter: (scene) => {
        // when comming from another movie
        // add some logic here
    },

    // scene loop
    onLoop: (scene, dt) => {
        // update your objects here

        scene.box.position.x += 1 * dt

        if (scene.box.position.x > scene.width + scene.box.width * 0.5)
            scene.box.position.x = -scene.box.width

    },

    // scene draw
    onDraw: (scene) => {
        // draw your objects here

        scene.box.draw(scene.graphics)

    },

    // ever window resize or orientation change (mobile)
    onResize: (scene) => {
        // ...
        scene.box.fillColor = 'hsl(' + random(360, false /* signed */) + ', 100%, 50%)'

    }

})

// UI scene
example.addScene('UI', {

    index: 2,

    fullscreen: true,

    onCreate: (scene) => {

        scene.A = new Sprite(new Vector(60, 60), 50, 50, 'transparent', 2)
        scene.B = new Sprite(new Vector(scene.width - 60, 60), 50, 50, 'transparent', 2)
        scene.C = new Sprite(new Vector(scene.width - 60, scene.height - 60), 50, 50, 'transparent', 2)

    },

    onDraw: (scene) => {

        scene.A.draw(scene.graphics)
        scene.B.draw(scene.graphics)
        scene.C.draw(scene.graphics)

    },

    onResize: (scene) => {

        scene.B.position.x = scene.width - 60
        scene.C.position.update(scene.width - 60, scene.height - 60)

    }

})

// add movie to stage
stage.addMovie(example)

// start playing example movie
stage.play('example')
```

<br><br><br>

<hr>


## Project with preload

**Create your project structure** : <br>
* **App/**
  * **Assets/**
     * knight.png
  * Index.html
  * Preload.js
  * Game.js
* **EmagJS/**
  
<br>

**App/index.html** :

```html
<!DOCTYPE html>

<html>

<head>

    <!-- viewport -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- EmagJS initializer script -->
    <script src="../EmagJS/initializer.js" initScript="Preload.js"></script>

</head>

<body></body>

</html>
```
**initScript** indicates Preload.js as the first script to be executed. <br> <br>

## Preload

**App/Preload.js**
```js
// preload all assets here
// PreloadFile can preload png|jpg|mp3|wave|js|ttf|txt|json|xml
// preloaded files will be stored in global scope variable assets (or any other variable name)
// example : let knightImage = assets.images.knight
let assets = new PreloadFile([
    { knight: 'Assets/knight.png' }
])

// after all assets are loaded
assets.oncomplete = () => {
    // preload Game.js - our main script
    new PreloadFile([{ game: 'Game.js' }])
}
```

## Game

**App/Game.js**
```js
// example2 movie
let example2 = new Movie('example2')

// main scene
example2.addScene('main', {

    width: 400,
    height: 400,

    onCreate: (scene) => {

        // vector with scene center
        let center = new Vector(scene.width * 0.5, scene.height * 0.5)

        // create a sprite
        scene.knight = new Sprite(new Vector(center.x, center.y + 50), 16, 16, 'transparent', 0)

        // set sprite image
        scene.knight.image = new SpriteSheet(assets.images.knight, 16, 16)
        // create some animations
        scene.knight.addAnimation('idle', [0, 1, 2, 3, 4, 5, 6, 7], Infinity /* repeat count */, 12 /* FPS */)
        scene.knight.addAnimation('run', [8, 9, 10, 11, 12, 13, 14, 15], 3, 18)
        // set current animation
        scene.knight.setAnimation('idle')

        // sprite sheet from assets/knight.png
        scene.spriteSheetView = new Sprite(new Vector(center.x, center.y - 20), 128, 96, 'transparent', 2)
        scene.spriteSheetView.image = new ImageProcessor(assets.images.knight)

    },

    // scene loop
    onLoop: (scene, dt) => {
        // update your objects here

        // some logic to change animation
        if (mousedown || touches.length) {
            scene.knight.setAnimation('run')
        } else {
            scene.knight.setAnimation('idle')
        }

    },

    // scene draw
    onDraw: (scene) => {
        // draw your objects here

        // draw knight
        scene.knight.draw(scene.graphics)

        // draw sprite sheet view
        scene.spriteSheetView.draw(scene.graphics)

    }

})

// add movie to stage
stage.addMovie(example2)

// start playing example2 movie
stage.play('example2')

```

<hr>


## Mask effect example

```js
let movie1 = new Movie('movie1')

movie1.addScene('main', {

    width: 768,
    height: 144,

    backgroundColor: 'white',

    onCreate: (scene) => {

        // creates an image processor object loading image from assets
        let imageProcessor = new ImageProcessor(assets.images.bg)

        // creates an image shade (array of images) with original image colors (4 colors - shades of green)
        scene.shadeImages = imageProcessor.createShades('l2d' /* light to dark */)

        // you can get image colors as well
        // imageProcessor.getColors('d2l')
        // output : [
        //              [40, 66, 41]    <- darken
        //              [83, 121, 60]
        //              [168, 186, 74]   
        //              [210, 226, 155] <- lighter
        //          ]

        // creates a background sprite - to be revealed
        scene.background1 = new Sprite(new Vector(0, 0), 768, 144, 'transparent', 0)
        scene.background1.anchor.x = scene.background1.anchor.y = 0
        scene.background1.image = scene.shadeImages[0]

        // creates a second background using a different shade - surface
        scene.background2 = new Sprite(new Vector(0, 0), 768, 144, 'transparent', 0)
        scene.background2.anchor.x = scene.background2.anchor.y = 0
        scene.background2.image = scene.shadeImages[2]
        scene.background2.compositeOperation = 'destination-atop'

        // creates a mask
        scene.mask = new Circle(new Vector(140, 70), 30, 'black', 0)
        // composite operation to show what comes before it
        scene.mask.compositeOperation = 'destination-in'

        // other random object
        scene.otherObject = new Sprite(new Vector(scene.width * 0.5, 70), 50, 50, 'royalblue', 0)

        // shaded images preview
        scene.shades = []
        // shade 1
        let shade1 = new Sprite(new Vector(80, 10), 60, 60, 'transparent', 2)
        shade1.anchor.x = shade1.anchor.y = 0
        shade1.image = scene.shadeImages[0].clone().crop(100, 50, 60, 60)
        // shade 2
        let shade2 = new Sprite(new Vector(145, 10), 60, 60, 'transparent', 2)
        shade2.anchor.x = shade2.anchor.y = 0
        shade2.image = scene.shadeImages[1].clone().crop(100, 50, 60, 60)
        // shade 3
        let shade3 = new Sprite(new Vector(210, 10), 60, 60, 'transparent', 2)
        shade3.anchor.x = shade3.anchor.y = 0
        shade3.image = scene.shadeImages[2].clone().crop(100, 50, 60, 60)
        // shade 4
        let shade4 = new Sprite(new Vector(275, 10), 60, 60, 'transparent', 2)
        shade4.anchor.x = shade4.anchor.y = 0
        shade4.image = scene.shadeImages[3].clone().crop(100, 50, 60, 60)

        scene.shades.push(shade1, shade2, shade3, shade4)

        // pulse
        scene.pulse = 0

    },

    onLoop: (scene, dt) => {

        // convert global coordinate to viewport coordinate
        let mouseViewPort = globalToViewport(mouse, scene)
        // circle follows mouse
        scene.mask.position.update(mouseViewPort.x, mouseViewPort.y)

        // pulse effect
        scene.pulse++
        scene.mask.radius = 30 + ((Math.cos(scene.pulse * 0.08) * 2) * dt)

    },

    onDraw: (scene) => {

        // render background 1
        scene.background1.draw(scene.graphics)
        // render other object
        scene.otherObject.draw(scene.graphics)
        // render mask
        scene.mask.draw(scene.graphics)
        // render background 2
        scene.background2.draw(scene.graphics)

        // draw shades preview
        scene.shades.map((shade) => shade.draw(scene.graphics))

    }

})

stage.addMovie(movie1)

stage.play('movie1')
```

<hr>


## Pong example

In real world it would be better to separate ball and paddles in classes. 

```js
let warning = new Movie('warning')
let cyberPong = new Movie('cyberPong')

warning.addScene('main', {

    backgroundColor: 'black',

    fullscreen: true,

    onCreate: (scene) => {

        // create warning text 
        scene.message = new Text('rotate your device!', new Vector, 'unknown', 'white', 14)

    },

    onEnter: (scene) => {

        // center message
        scene.message.position.update(scene.width * 0.5 - 80, scene.height * 0.5 - 10)

    },

    onLoop: (scene) => {

        // back to game
        if (LANDSCAPE)
            stage.bringToFront('cyberPong')

    },

    onDraw: (scene) => {

        // draw message
        scene.message.draw(scene.graphics)

    }

})

cyberPong.addScene('overlay', {

    index: 1,

    blend: 'soft-light',
    
    onLoop: (scene) => {
        scene.canvas.style.backgroundColor = 'hsl(' + (140 + random(140, 0)) + ', 100%, 50%)'
    }

})

cyberPong.addScene('main', {

    fullscreen: true,

    backgroundColor: 'black',

    onCreate: (scene) => {

        // collision handler
        scene.collision = new CollisionHandler()

        // sound
        scene.sound = new SoundFx()

        // play theme music
        scene.sound.play(assets.sounds.music, .3, 'music', true)

    },

    onEnter: (scene) => {

        // create ball shape
        scene.ball = new Shape(new Square, new Vector(scene.width * 0.5, scene.height * 0.5), (scene.width * 0.025) | 0, (scene.width * 0.025) | 0, 'white', 0)
        // create ball physic body
        scene.ball.body = new Body(scene.ball)
        // ball start velocity
        scene.ball.body.velocity.x = scene.width * 0.020

        // ball trail container
        scene.ball.trails = []
        // ball trail spawn timer
        scene.ball.trailTimer = new Timer(10)
        // create trail pool
        scene.ball.trailPool = new ObjectPool(() => {
            // create new trail object
            let trail = new Sprite(new Vector, scene.ball.width, scene.ball.height, 'white', 0)
            return trail
        }, (trail) => {
            // reset trail object
            trail.position.update(scene.ball.body.position.clone())
            trail.width = trail.height = scene.ball.width + random(scene.ball.width * 0.2, 0)
            trail.alpha = 1
            trail.fillColor = 'hsl(' + random(360, 0) + ', 100%, 70%)'
            trail.compositeOperation = 'lighter'
            trail.shadowBlur = trail.width
            trail.shadowColor = 'cyan'
            return trail
        })

        // bounce particle container
        scene.particles = []
        // create particle pool
        scene.particlePool = new ObjectPool(() => {
            // create new particle object
            let particle = new Sprite(new Vector, 5, 5, 'white', 0)
            // particle physic body
            particle.body = new Body(particle)
            // particle gravity
            particle.body.gravity = new Vector(0, .3)
            return particle
        }, (particle) => {
            // reset particle object
            particle.body.position.update(scene.ball.body.position.clone())
            particle.body.velocity.update(random(8), -random(8, 0))
            particle.body.mass = random(2, 0)
            particle.width = particle.height = random(scene.ball.width * 0.3, 0)
            particle.fillColor = 'hsl(' + random(360, 0) + ', 100%, 70%)'
            particle.alpha = 1
            particle.compositeOperation = 'lighter'
            particle.shadowBlur = 5
            particle.shadowColor = 'cyan'
            return particle
        })

        // create walls shape
        scene.walls = [
            new Shape(new Square, new Vector(scene.width * 0.5, (((scene.height * 0.05) | 0) * 0.5)), scene.width, (scene.height * 0.05) | 0, 'white', 0),
            new Shape(new Square, new Vector(scene.width * 0.5, scene.height - (((scene.height * 0.05) | 0) * 0.5)), scene.width, (scene.height * 0.05) | 0, 'white', 0),
        ]

        // create paddles
        scene.leftPaddle = new Shape(new Square, new Vector((scene.width * 0.02) | 0 + 50, scene.height * 0.5), (scene.width * 0.02) | 0, (scene.height * 0.25) | 0, 'white', 0)
        scene.rightPaddle = new Shape(new Square, new Vector(scene.width - 50 - ((scene.width * 0.02) | 0), scene.height * 0.5), (scene.width * 0.02) | 0, (scene.height * 0.25) | 0, 'white', 0)
        scene.paddles = [scene.leftPaddle, scene.rightPaddle]

        // paddle trail container
        scene.paddleTrail = []
        // paddle trail spawn timer
        scene.paddleTrailTimer = new Timer(10)
        // create paddle trail pool
        scene.paddlePool = new ObjectPool(() => {
            // create new paddle trail object
            let trail = new Sprite(new Vector, scene.leftPaddle.width, scene.leftPaddle.height, 'white', 0)
            return trail
        }, (trail) => {
            // reset paddle trail object
            trail.alpha = 1.4
            trail.width = scene.leftPaddle.width
            trail.height = scene.leftPaddle.height
            trail.fillColor = 'hsl(' + random(360, 0) + ', 100%, 10%)'
            trail.compositeOperation = 'lighter'
            return trail
        })

        // score font size
        let fontSize = scene.width * 0.10 | 0
        // create left score
        scene.leftScore = new Text('0', new Vector, 'unknown', 'rgba(255,255,255,0.2)', fontSize)
        scene.leftScore.position.x = (scene.width * 0.5) - ((scene.width * 0.10) | 0) - scene.leftScore.width * 0.5
        scene.leftScore.position.y = scene.height * 0.5
        // create right score
        scene.rightScore = new Text('0', new Vector, 'unknown', 'rgba(255,255,255,0.2)', fontSize)
        scene.rightScore.position.x = (scene.width * 0.5) + ((scene.width * 0.10) | 0) - scene.rightScore.width * 0.5
        scene.rightScore.position.y = scene.height * 0.5
        // score container
        scene.scores = [scene.leftScore, scene.rightScore]

        // vertical dash line
        let dashHeight = scene.height * 0.05
        // vertical space between dash
        let dashSpace = 1
        // number of dash needed to fill scene height
        let nDash = Math.round(((scene.height - (scene.walls[0].height + scene.walls[1].height)) / (dashHeight * dashSpace)))
        // dash container
        scene.dashLine = []
        // create dash
        for (let i = 0; i < nDash; i++) {
            let dash = new Sprite(new Vector(scene.width * 0.5, (scene.walls[0].position.y + scene.walls[0].height * 0.5 + dashHeight * 0.5 * dashSpace) + i * (dashHeight * dashSpace)), scene.width * 0.008 | 0, dashHeight * 0.5, 'rgba(255, 255, 255, 0.1)', 0)
            scene.dashLine.push(dash)
        }

        // create light
        scene.light = new VisibilityPolygon(scene.ball.body.position, 'rgba(255, 255, 255, 0.1)')
        // light radius
        scene.light.colorRadius1 = scene.width * 0.3
        // add paddles to cast shadows
        scene.light.addPolygon(scene.paddles)

        // score timer to blink screen
        scene.scoreTimer = new Timer(200)

    },

    onLoop: (scene, dt) => {

        // if not landscape
        if (!LANDSCAPE)
            stage.bringToFront('warning')

        // cast rays
        scene.light.castRays()

        // update ball physic body
        scene.ball.body.update(dt)

        // move left paddle
        scene.leftPaddle.position.y = mouse.y

        // right paddle follows ball
        let distanceFromBall = scene.rightPaddle.position.y - scene.ball.body.position.y
        scene.rightPaddle.position.y -= distanceFromBall * 0.1

        // check collision with paddles
        scene.paddles.map((paddle) => {

            // if colliding
            if (scene.collision.check(scene.ball, paddle)) {

                // calculate y bounce
                let y = scene.ball.body.position.y - paddle.position.y

                // if colliding with right paddle
                if (scene.ball.body.position.x > scene.width * 0.5) {
                    // if ball velocity x is "facing" right paddle
                    if (scene.ball.body.velocity.x > 0) {
                        // bounce x and y
                        scene.ball.body.velocity.x *= -1
                        scene.ball.body.velocity.y = y * .2
                    }
                } else { // colliding with left paddle

                    // if ball velocity x is "facing" left paddle
                    if (scene.ball.body.velocity.x < 0) {
                        // bounce x and y
                        scene.ball.body.velocity.x *= -1
                        scene.ball.body.velocity.y = y * .2
                    }
                }

                // create some particles
                for (let i = 0; i < 10; i++) {
                    scene.particles.push(scene.particlePool.create())
                }

                // shake scene
                stage.shake(300)

                // play bounce sound

                scene.sound.play(assets.sounds.bounce, 3)

            }

        })

        // check collision with walls
        scene.walls.map((wall) => {

            // if colliding
            if (scene.collision.check(scene.ball, wall)) {

                // colliding with bottom wall
                if (scene.ball.body.position.y > scene.height * 0.5) {
                    // if ball velocity y is "facing" bottom wall
                    if (scene.ball.body.velocity.y > 0) {
                        // bounce y velocity
                        scene.ball.body.velocity.y *= -1
                    }
                } else { // colliding with top wall
                    // if ball velocity y is "facing" top wall
                    if (scene.ball.body.velocity.y < 0) {
                        // bounce y velocity
                        scene.ball.body.velocity.y *= -1
                    }
                }

                // avoid stick to the wall
                if (scene.ball.body.velocity.y == 0)
                    scene.ball.body.velocity.y = -1

                // create some particles
                for (let i = 0; i < 10; i++) {
                    scene.particles.push(scene.particlePool.create())
                }

                // play bounce sound

                scene.sound.play(assets.sounds.bounce)

            }
        })

        // start score timer
        scene.scoreTimer.start

        // scores point
        if (scene.ball.body.position.x < scene.ball.width || scene.ball.body.position.x > scene.width - scene.ball.width) {

            // left paddle scores
            if (scene.ball.body.velocity.x > 0) {
                scene.leftScore.text = parseInt(scene.leftScore.text) + 1
                scene.leftScore.position.x = (scene.width * 0.5) - ((scene.width * 0.10) | 0) - scene.leftScore.width * 0.5
            } else { // right paddle scores
                scene.rightScore.text = parseInt(scene.rightScore.text) + 1
                scene.rightScore.position.x = (scene.width * 0.5) + ((scene.width * 0.10) | 0) - scene.rightScore.width * 0.5
            }

            // reset ball position
            scene.ball.body.position.update(scene.width * 0.5, scene.height * 0.5)
            // reset ball x velocity
            scene.ball.body.velocity.x = Math.abs(scene.ball.body.velocity.x)
            // reset ball y velocity
            scene.ball.body.velocity.y = 0

            // create some particles
            for (let i = 0; i < 50; i++) {
                scene.particles.push(scene.particlePool.create())
            }

            // shake scene
            stage.shake()

            // play score sound
            scene.sound.play(assets.sounds.pling2)
            scene.sound.play(assets.sounds.fanfare)

            // change light shadow color
            scene.light.shadowColor = 'rgba(255, 0, 200, 0.3)'

            // reset score timer
            scene.scoreTimer.reset

        }

        // reset light shadow
        if (scene.scoreTimer.count > 3)
            scene.light.shadowColor = 'rgba(0, 0, 0, 1)'

        // start trail timer
        scene.ball.trailTimer.start
        // start paddle trail timer
        scene.paddleTrailTimer.start

        // create trail particle
        if (scene.ball.trailTimer.tick)
            scene.ball.trails.push(scene.ball.trailPool.create())

        // create paddle trail
        if (scene.paddleTrailTimer.tick) {

            // left paddle trail
            let leftTrail = scene.paddlePool.create()
            leftTrail.position.update(scene.leftPaddle.position.clone())
            // right paddle trail
            let rightTrail = scene.paddlePool.create()
            rightTrail.position.update(scene.rightPaddle.position.clone())

            scene.paddleTrail.push(leftTrail, rightTrail)

        }

        // fade out ball trails
        scene.ball.trails.map((trail, i) => {

            trail.alpha -= .12 * dt

            if (trail.alpha < 0) {
                scene.ball.trailPool.destroy(trail)
                scene.ball.trails.splice(i, 1)
            }

        })

        // fade out paddle trails
        scene.paddleTrail.map((trail, i) => {

            trail.alpha -= .12 * dt

            if (trail.alpha < 0) {
                scene.paddlePool.destroy(trail)
                scene.paddleTrail.splice(i, 1)
            }

        })

        // fade out particles
        scene.particles.map((particle, i) => {

            // update particle physic body
            particle.body.update(dt)
            // apply gravity
            particle.body.applyForce(particle.body.gravity)

            particle.alpha -= .02 * dt

            if (particle.alpha < 0) {
                scene.particlePool.destroy(particle)
                scene.particles.splice(i, 1)
            }

        })

    },

    onDraw: (scene) => {

        // draw light
        scene.light.draw(scene.graphics)

        // draw scores
        scene.scores.map((score) => score.draw(scene.graphics))

        // draw dash line
        scene.dashLine.map((dash) => dash.draw(scene.graphics))

        // draw ball trail
        scene.ball.trails.map((trail) => trail.draw(scene.graphics))

        // draw paddle trail
        scene.paddleTrail.map((trail) => trail.draw(scene.graphics))

        // draw particle
        scene.particles.map((particle) => particle.draw(scene.graphics))

        // draw paddles
        scene.paddles.map((paddle) => paddle.draw(scene.graphics))

        // draw walls
        scene.walls.map((wall) => wall.draw(scene.graphics))

        // draw ball
        scene.ball.draw(scene.graphics)

    }

})

stage.addMovie(warning)
stage.addMovie(cyberPong)

stage.play('cyberPong')
```
