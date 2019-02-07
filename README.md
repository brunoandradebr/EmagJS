# EmagJS 
A game engine made from scratch for the purpose of studying game development. example <a target="_blank" href="http://www.acobaia.com.br/framework/example">here</a>


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
