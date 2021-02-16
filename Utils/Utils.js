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

        if (content == undefined) {
            console.log('%c ' + 'undefined' + ' ', typeStyle('#a9a9a9'), '')
            return
        }

        switch (content.constructor.name) {
            case 'Array':

                // check if it's a 2d array
                let is2dArray = true
                content.map((item) => {
                    if (item && item.constructor.name != 'Array')
                        is2dArray = false
                })

                if (!content[0]) is2dArray = false

                if (is2dArray) {
                    const total = content.length * content[0].length
                    console.log('%c ' + (is2dArray ? '2D ' : '') + content.constructor.name + ' ' + content.length + 'x' + content[0].length + ' (' + (total >= 1000 ? total / 1000 : total) + ')', typeStyle('#4834d4'), content)
                } else {
                    console.log('%c ' + (is2dArray ? '2D ' : '') + content.constructor.name + ' ' + content.length + ' ', typeStyle('#4834d4'), content)
                }

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
 * Performance tests
 * 
 * Ex : 
 * 
 *      performance(
 *          ()=>{
 *              for(let i = 0; i < 1000; i++){
 *                  new Array(1000)
 *              } 
 *          },
 *          ()=>{
 *              for(let i = 0; i < 100000; i++){
 *                  new Array(1000)
 *              } 
 *          }
 *      )
 * 
 * Result : 
 *      test 1: 0.071044921875ms
 *      test 2: 2.34814453125ms
 * 
 * @return {void}
 */
const performance = function () {

    Object.values(arguments).map((test, i) => {
        console.time('test ' + (i + 1))
        test()
        console.timeEnd('test ' + (i + 1))
    })

}

/**
 * Creates a 2D array
 * 
 * ex : array2D(5, 5)
 *      [0, 0, 0, 0, 0]
 *      [0, 0, 0, 0, 0]
 *      [0, 0, 0, 0, 0]
 *      [0, 0, 0, 0, 0]
 *      [0, 0, 0, 0, 0]
 * 
 * @param {number} columns 
 * @param {number} rows 
 * @param {number} initialValue 
 * 
 * @return {array<array>}
 */
const array2D = (columns = 0, rows = 0, initialValue = 0) => {
    let arr = []
    for (let i = 0; i < columns; i++) {
        arr.push(new Array(rows).fill(initialValue))
    }
    return arr
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
 * @global
 * 
 * @param {number} range
 * @param {bool} signed
 * 
 * @return {number}
 */
const random = (range, signed = true) => {

    let random = signed ? (Math.random() * 2 - 1) * range : Math.random() * range

    return Math.round(random)

}

/**
 * Pick a random value from parameters values
 * 
 * @global
 * 
 * @param  {...any} possibleValues 
 * 
 * @return {any}
 */
const randomPick = (...possibleValues) => {
    let pick = Math.random() * possibleValues.length | 0
    return possibleValues[pick]
}

/**
 * Creates a random array inside an area
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * 
 * @return {EmagJS.Core.Math.Vector}
 */
const randomInArea = (x, y, width, height = width) => {

    let pointInArea = new Vector

    pointInArea.x = x + random(width, 0)
    pointInArea.y = y + random(height, 0)

    return pointInArea

}

const lerp = (min, max, t) => {

    if (min.constructor.name === 'Array' && max.constructor.name === 'Array') {
        const newArray = []

        min.map((minArr, i) => {
            newArray[i] = min[i] + ((max[i] - min[i]) * t)
        })

        return newArray
    }

    return min + ((max - min) * t)
}

/**
 * Converts hex color to rgb
 * 
 * @global
 * 
 * @param {string} hex
 * 
 * @return {array<number>}
 */
const hex2rgb = (hex = '#ffffff') => {

    if (hex.length == 4)
        hex = '#' + hex[1] + '' + hex[1] + '' + hex[2] + '' + hex[2] + '' + hex[3] + '' + hex[3] + ''

    hex = hex.replace('#', '0x')

    return [hex >> 16, hex >> 8 & 0xff, hex >> 0 & 0xff]
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




