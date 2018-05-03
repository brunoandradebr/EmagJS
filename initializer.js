/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */



// framework root and initializer script
let EmagScriptInitializer = document.querySelector('script');
let file = EmagScriptInitializer.src.split('/').pop();
let root = EmagScriptInitializer.src.replace(file, '');
let initScript = EmagScriptInitializer.getAttribute('initScript') || '';

// add style.css
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = root + 'style.css';
document.head.appendChild(style);

// load the essential class that preload all files
let preloadFileClassScript = document.createElement('script');
preloadFileClassScript.src = root + 'Core/Common/Misc/PreloadFile.js';
document.head.appendChild(preloadFileClassScript);

// global stage object - manager framework movies
let stage;

preloadFileClassScript.onload = (e) => {

    // preload framework classes
    let core = new PreloadFile([
        { utils: root + 'Utils/Utils.js' },
        // COMMON/ANIMATION
        { tween: root + 'Core/Common/Animation/Tween.js' },
        // COMMON/IMAGE
        { imageProcessor: root + 'Core/Common/Image/ImageProcessor.js' },
        { spriteSheet: root + 'Core/Common/Image/SpriteSheet.js' },
        // COMMOMN/MISC
        { spatialSpace: root + 'Core/Common/Misc/SpatialSpace.js' },
        { timer: root + 'Core/Common/Misc/Timer.js' },
        { eventEmmiter: root + 'Core/Common/Misc/EventEmitter.js' },
        // MATH
        { vector: root + 'Core/Math/Vector.js' },
        { matrix: root + 'Core/Math/Matrix.js' },
        // GEOM
        { polygon: root + 'Core/Geom/Polygon.js' },
        { randomPolygon: root + 'Core/Geom/RandomPolygon.js' },
        { square: root + 'Core/Geom/Square.js' },
        { rectangle: root + 'Core/Geom/Rectangle.js' },
        { triangle: root + 'Core/Geom/Triangle.js' },
        // SOUND
        { soundFx: root + 'Core/Sound/SoundFx.js' },
        // DISPLAY
        { stage: root + 'Core/Display/Stage.js' },
        { movie: root + 'Core/Display/Movie.js' },
        { scene: root + 'Core/Display/Scene.js' },
        // RENDER
        { text: root + 'Core/Render/Text.js' },
        { sprite: root + 'Core/Render/Sprite.js' },
        { line: root + 'Core/Render/Line.js' },
        { circle: root + 'Core/Render/Circle.js' },
        { shape: root + 'Core/Render/Shape.js' },
        // INPUT
        { gamepad: root + 'Core/Input/Gamepad.js' },
        { keyboard: root + 'Core/Input/Keyboard.js' },
        { touch: root + 'Core/Input/Touch.js' },
        { button: root + 'Core/Input/Button.js' },
        // COLLISION
        { collisionHandler: root + 'Core/Collision/CollisionHandler.js' },
        // PHYSICS
        { body: root + 'Core/Physics/Body.js' },
        // RESOURCE/IMAGE
        { background: root + 'Resource/Image/Background.png' },
        // RESOURCE/FONT
        { Commodore: root + 'Resource/Font/Commodore.ttf' },
        { Alagard: root + 'Resource/Font/Alagard.ttf' },
        { Unknown: root + 'Resource/Font/Unknown.ttf' },
    ]);

    core.oncomplete = () => {

        stage = new Stage();

        new PreloadFile([{ initScript: initScript }]);
    }

    preloadFileClassScript.remove();
}