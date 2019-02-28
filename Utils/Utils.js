/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */





/**
 * Actionscript legacy ♥
 * 
 * @global
 * 
 * @return {void}
 */
const trace = function () {

    let typeStyle = (background = '', color = 'rgba(255,255,255, .8)') => `
                    background-color:${background};
                    color: ${color};
                    border-radius:10px;
                    margin:3px 0px 3px -10px;
                    text-shadow:1px 1px 2px rgba(0, 0, 0, 0.5);
                    padding: 4px;`

    Object.values(arguments).map((content) => {

        switch (content.constructor.name) {
            case 'Array':
                console.log('%c ' + content.constructor.name + ' ' + content.length + ' ', typeStyle('#4834d4'), content)
                break;
            case 'Object':
                console.log('%c ' + content.constructor.name + ' ', typeStyle('#ff9f43'), content)
                break;
            case 'Function':
                let returnType = content() ? content().constructor.name : content() !== false ? 'Void' : content().constructor.name
                console.log('%c ' + content.constructor.name + ' <' + returnType + '> ', typeStyle('#1B9CFC'), content)
                break;
            case 'String':
                console.log('%c ' + content.constructor.name + ' ' + content.length + ' %c' + content, typeStyle('#f46'), 'color:#666; background-color:white; border:1px solid #999; padding:5px; border-radius:5px; margin:5px 5px;')
                break;
            case 'Boolean':
                console.log('%c ' + content.constructor.name + ' ', typeStyle('#1dd1a1'), content)
                break;
            case 'Number':
                let binary = content % 1 === 0 ? (content >>> 0).toString(2) : 'float'
                console.log('%c ' + content.constructor.name + ' ' + binary + ' ', typeStyle('#999'), content)
                break;
            default:

                // recursive - get object parent
                const getProto = (obj) => {

                    arguments.callee.protos = arguments.callee.protos || []

                    if (obj.__proto__) {
                        getProto(obj.__proto__)
                    }

                    arguments.callee.protos[obj.constructor.name] = obj.constructor

                    return Object.keys(arguments.callee.protos)

                }

                console.log('%c ' + getProto(content).join(' > ') + ' ', typeStyle('#9b59b6'), content);

                // clear protos from arguments
                arguments.callee.protos = []

                break;
        }

    })

}











/**
 * Cache PI number
 * 
 * @type {number}
 * @global
 */
const PI = Math.PI;


/**
 * Degree to radians conversion
 * ex : 45 * toRad
 * 
 * @type {number}
 * @global
 */
let toRad = PI / 180;


/**
 * Rad to degrees conversion
 * ex : .3 * toDegree
 * 
 * @type {number}
 * @global
 */
let toDegree = 180 / PI;




/**
 * Generates a random number in the range - signed as default
 * 
 * @type {number}
 * @global
 */
const random = (range, signed = true) => {

    let random = signed ? (Math.random() * 2 - 1) * range : Math.random() * range

    return Math.round(random)

}


/**
 * Converts global coordinates to viewport canvas coordinates
 * 
 * @param {EmagJS.Core.Math.Vector} 
 * @param {EmagJS.Core.Display.Scene}
 * 
 * @return {void}
 */
let _tmp_mouse = { x: 0, y: 0 }
const globalToViewport = (vector, scene) => {
    _tmp_mouse.x = (vector.x / scene.scale - scene.offsetX / scene.scale)
    _tmp_mouse.y = (vector.y / scene.scale - scene.offsetY / scene.scale)
    return _tmp_mouse
}






/**
 * Device information
 * 
 * @global
 */
let DEVICE_WIDTH = window.innerWidth;
let DEVICE_HEIGHT = window.innerHeight;
let DEVICE_CENTER_X = DEVICE_WIDTH * 0.5;
let DEVICE_CENTER_Y = DEVICE_HEIGHT * 0.5;
let LANDSCAPE = DEVICE_WIDTH > DEVICE_HEIGHT ? true : false
let PORTRAIT = DEVICE_HEIGHT > DEVICE_WIDTH ? true : false
let MOBILE = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Windows Phone/i);





/**
 * Updates some constants on screen resize or orientation change
 * 
 * @global
 */
window.addEventListener('resize', (e) => {
    setTimeout(() => {
        DEVICE_WIDTH = window.innerWidth;
        DEVICE_HEIGHT = window.innerHeight;
        DEVICE_CENTER_X = DEVICE_WIDTH * 0.5;
        DEVICE_CENTER_Y = DEVICE_HEIGHT * 0.5;
        LANDSCAPE = DEVICE_WIDTH > DEVICE_HEIGHT ? true : false
        PORTRAIT = DEVICE_HEIGHT > DEVICE_WIDTH ? true : false
        MOBILE = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Windows Phone/i);
    }, 50)
})



/**
 * Finds the scale factor of a resolution (width and height) needed to fit DEVICE SIZE.
 * 
 * For example : Your game original resolution is 256x144 and your device
 * running the game is 1920x1080, the scale factor is 8. Then you can use this scale factor
 * to scale all your assets. Also keeps pixel perfect for pixel art style. 
 * 
 * @global
 * 
 * @param {number} width 
 * @param {number} height
 * @return {number}
 */
function keepAspectRatio(width, height) {

    let aspectWidth = DEVICE_WIDTH / width
    let aspectHeight = DEVICE_HEIGHT / height

    return DEVICE_WIDTH > DEVICE_HEIGHT ? Math.round(aspectWidth) : Math.round(aspectHeight)

}




