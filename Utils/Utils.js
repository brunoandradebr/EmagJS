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
function trace(content) {
    console.log(content);
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




