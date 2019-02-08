# EmagJS 
A game engine made from scratch (no engine, no lib) for the purpose of studying game development.
It's using canvas API with 2d context (Software rendering).

### examples
<a target="_blank" href="http://www.acobaia.com.br/framework/example">Hello world example</a> <br>
<a target="_blank" href="http://www.acobaia.com.br/framework/example2">Preload example</a>

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
