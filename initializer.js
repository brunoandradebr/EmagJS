/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */



// framework root and initializer script
let EmagScriptInitializer = document.querySelector('script[initscript]');
let file = EmagScriptInitializer.src.split('/').pop();
let root = EmagScriptInitializer.src.replace(file, '');
let target = EmagScriptInitializer.getAttribute('target')
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

// global resources
let core

preloadFileClassScript.onload = (e) => {

    // preload framework classes
    core = new PreloadFile([
        { utils: root + 'Utils/Utils.js' },
        // COMMON/ANIMATION
        { tween: root + 'Core/Common/Animation/Tween.js' },
        // COMMON/IMAGE
        { imageProcessor: root + 'Core/Common/Image/ImageProcessor.js' },
        { Pattern: root + 'Core/Common/Image/Pattern.js' },
        { spriteSheet: root + 'Core/Common/Image/SpriteSheet.js' },
        // MATH
        { vector: root + 'Core/Math/Vector.js' },
        { matrix: root + 'Core/Math/Matrix.js' },
        // GEOM
        { polygon: root + 'Core/Geom/Polygon.js' },
        { randomPolygon: root + 'Core/Geom/RandomPolygon.js' },
        { square: root + 'Core/Geom/Square.js' },
        { rectangle: root + 'Core/Geom/Rectangle.js' },
        { triangle: root + 'Core/Geom/Triangle.js' },
        // DISPLAY
        { stage: root + 'Core/Display/Stage.js' },
        { movie: root + 'Core/Display/Movie.js' },
        { scene: root + 'Core/Display/Scene.js' },
        { camera: root + 'Core/Display/Camera.js' },
        // RENDER
        { text: root + 'Core/Render/Text.js' },
        { sprite: root + 'Core/Render/Sprite.js' },
        { spriteFont: root + 'Core/Render/SpriteFont.js' },
        { spriteText: root + 'Core/Render/SpriteText.js' },
        { line: root + 'Core/Render/Line.js' },
        { circle: root + 'Core/Render/Circle.js' },
        { shape: root + 'Core/Render/Shape.js' },
        { visibilityPolygon: root + 'Core/Render/VisibilityPolygon.js' },
        { fieldView: root + 'Core/Render/FieldView.js' },
        // COMMOMN/MISC
        { frameRate: root + 'Core/Common/Misc/FrameRate.js' },
        { objectPool: root + 'Core/Common/Misc/ObjectPool.js' },
        { spatialSpace: root + 'Core/Common/Misc/SpatialSpace.js' },
        { chaikin: root + 'Core/Common/Misc/Chaikin.js' },
        { graph: root + 'Core/Common/Misc/Graph.js' },
        { pathfinding: root + 'Core/Common/Misc/Pathfinding.js' },
        { timer: root + 'Core/Common/Misc/Timer.js' },
        { eventEmmiter: root + 'Core/Common/Misc/EventEmitter.js' },
        { dialogSystem: root + 'Core/Common/Misc/DialogSystem.js' },
        { particleSystem: root + 'Core/Common/Misc/ParticleSystem.js' },
        // SOUND
        { soundFx: root + 'Core/Sound/SoundFx.js' },
        // INPUT
        { gamepad: root + 'Core/Input/Gamepad.js' },
        { keyboard: root + 'Core/Input/Keyboard.js' },
        { touch: root + 'Core/Input/Touch.js' },
        { stick: root + 'Core/Input/Stick.js' },
        { button: root + 'Core/Input/Button.js' },
        { input: root + 'Core/Input/Input.js' },
        // COLLISION
        { collisionHandler: root + 'Core/Collision/CollisionHandler.js' },
        // PHYSICS
        { body: root + 'Core/Physics/Body.js' },
        { IK: root + 'Core/Physics/IK.js' },
        // RESOURCE/IMAGE
        { background: root + 'Resource/Image/Background.png' },
        // RESOURCE/IMAGE FONT
        { alagard_font: root + 'Resource/Image/Font/alagard.png' },
        { joy_font: root + 'Resource/Image/Font/joy.png' },
        { joy_font_border: root + 'Resource/Image/Font/joy_border.png' },
        { joy_font_border2: root + 'Resource/Image/Font/joy_border2.png' },
        // RESOURCE/DIALOG IMAGES
        { dialog_top_left: root + 'Resource/Image/Dialog/dialog_top_left.png' },
        { dialog_top: root + 'Resource/Image/Dialog/dialog_top.png' },
        { dialog_top_right: root + 'Resource/Image/Dialog/dialog_top_right.png' },
        { dialog_right: root + 'Resource/Image/Dialog/dialog_right.png' },
        { dialog_bottom_right: root + 'Resource/Image/Dialog/dialog_bottom_right.png' },
        { dialog_bottom: root + 'Resource/Image/Dialog/dialog_bottom.png' },
        { dialog_bottom_left: root + 'Resource/Image/Dialog/dialog_bottom_left.png' },
        { dialog_left: root + 'Resource/Image/Dialog/dialog_left.png' },
        { dialog_box: root + 'Resource/Image/Dialog/dialog_box.png' },
        { dialog_arrow: root + 'Resource/Image/Dialog/dialog_arrow.png' },
        // RESOURCE/FONT
        { Commodore: root + 'Resource/Font/Commodore.ttf' },
        { Alagard: root + 'Resource/Font/Alagard.ttf' },
        { Unknown: root + 'Resource/Font/Unknown.ttf' },
        // PLATFORMER
        { platformerWaterPool: root + 'Platformer/WaterPool.js' },
        { platformerEntity: root + 'Platformer/Entity.js' },
        { platformerEntity2: root + 'Platformer/Entity2.js' },
        { platformerPlatform: root + 'Platformer/Platform.js' },
    ]);

    core.oncomplete = () => {

        stage = new Stage(target);

        new PreloadFile([{ initScript: initScript }]);
    }

    preloadFileClassScript.remove();
}