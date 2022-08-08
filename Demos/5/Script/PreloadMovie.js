let assets = new PreloadFile([
    // font
    { font_fb: 'Assets/font/FB.woff' },
    // sprite
    { bird: 'Assets/image/bird.png' },
    { pipe: 'Assets/image/pipe.png' },
    { background: 'Assets/image/background.png' },
    { ground: 'Assets/image/ground.png' },
    // sound
    { sfx_wing: 'Assets/sound/sfx_wing.wav' },
    { sfx_hit: 'Assets/sound/sfx_hit.wav' },
    { sfx_die: 'Assets/sound/sfx_die.wav' },
    { sfx_point: 'Assets/sound/sfx_point.wav' },
])

assets.oncomplete = () => {

    new PreloadFile([{ mainMovie: 'Script/MainMovie.js' }])

    setTimeout(() => {

        stage.removeMovie('preload')

    }, 11);

}

let preload = new Movie('preload')

preload.addScene('main', {

    fullscreen: true,

    backgroundColor: 'white',

    onCreate: (scene) => {

        assets.onprogress = (data) => {
            scene.percent = data.percent / 100
            scene.loaded = data.loaded
            scene.total = data.total
        }

        scene.loadingBarWidth = 200

        scene.loadingBar = new Sprite(new Vector(DEVICE_CENTER_X - scene.loadingBarWidth * 0.5, DEVICE_CENTER_Y), 0, 2, 'black', 0)
        scene.loadingBar.anchor.x = 0
        scene.loadingBarBack = new Sprite(new Vector(DEVICE_CENTER_X - scene.loadingBarWidth * 0.5, DEVICE_CENTER_Y), scene.loadingBarWidth, 2, 'rgba(0, 0, 0, 0.1)', 0)
        scene.loadingBarBack.anchor.x = 0

        scene.loadingLabel = new Text('loading')
        scene.loadingLabel.position = new Vector(scene.loadingBarBack.position.x + scene.loadingBarWidth * 0.5 - 30, scene.loadingBarBack.position.y - 8)
        scene.loadingLabel.font = 'Unknown'
        scene.loadingLabel.color = 'black'
        scene.loadingLabel.size = 16

    },

    onLoop: (scene, dt) => {

        if (scene.percent != undefined) {

            if (scene.loadingBar.width < scene.loadingBarWidth)
                scene.loadingBar.width = scene.percent * scene.loadingBarWidth

        }

    },

    onDraw: (scene) => {

        scene.loadingBarBack.draw(scene.graphics)
        scene.loadingBar.draw(scene.graphics)
        scene.loadingLabel.draw(scene.graphics)

    },

    onResize: (scene) => {
        scene.loadingBar.position.update(DEVICE_CENTER_X - scene.loadingBarWidth * 0.5, DEVICE_CENTER_Y)
        scene.loadingBarBack.position.update(DEVICE_CENTER_X - scene.loadingBarWidth * 0.5, DEVICE_CENTER_Y)
        scene.loadingLabel.position.update(scene.loadingBarBack.position.x + scene.loadingBarWidth * 0.5 - 30, scene.loadingBarBack.position.y - 8)
    }

})

stage.addMovie(preload)

stage.play('preload')