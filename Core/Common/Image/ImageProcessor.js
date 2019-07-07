/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Manipulates image
 */
class ImageProcessor {

    /**
     * Constructor
     * 
     * @param {HTMLImageElement} source 
     */
    constructor(source) {

        /**
         * @type {number}
         */
        this.width = source.width

        /**
         * @type {number}
         */
        this.height = source.height

        /**
         * The original image source
         * 
         * @type {HTMLImageElement}
         */
        this.source = source

        /**
         * Creates a canvas to modify source pixels
         * 
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height

        /**
         * Graphics context - local draw context to manipulate it's pixels
         * 
         * @type {CanvasRenderingContext2D}
         */
        this.context = this.canvas.getContext('2d')

        // draw to the canvas to get source data
        this.context.drawImage(this.source, 0, 0)

        /**
         * Source data to be manipulated
         * 
         * @type {ImageData}
         */
        this.imageData = this.context.getImageData(0, 0, this.width, this.height)

        /**
         * @type {Uint8ClampedArray}
         */
        this.imageArray = this.imageData.data

        /**
         * Temporary array to keep pixels index
         * 
         * @type {array<integer>}
         */
        this.tmpPixels = []

    }

    /**
     * Applies modifications to the current imageData
     * 
     * @return {EmagJS.Core.Common.Image.ImageProcessor} 
     */
    modifyPixels() {

        // draw modified pixels to local graphics context
        this.context.putImageData(this.imageData, 0, 0)

        // create a new image object with modified pixels
        let newImage = new Image()
        newImage.src = this.canvas.toDataURL('image/png')
        newImage.width = this.width
        newImage.height = this.height

        // updates original image source
        this.source = newImage

        return this
    }

    /**
     * Applies a tint to the image
     * 
     * @param {integer} r 
     * @param {integer} g 
     * @param {integer} b 
     * 
     * @return {EmagJS.Core.Common.Image.ImageProcessor}
     */
    tint(r, g, b) {

        // tint pixels
        for (let i = 0; i < this.imageArray.length; i += 4) {

            let _r = this.imageArray[i + 0]
            let _g = this.imageArray[i + 1]
            let _b = this.imageArray[i + 2]
            let _a = this.imageArray[i + 3]

            if (_a == 0) continue

            this.imageArray[i + 0] = r ? _r + r : _r
            this.imageArray[i + 1] = g ? _g + g : _g
            this.imageArray[i + 2] = b ? _b + b : _b

        }

        return this.modifyPixels()

    }

    /**
     * Replaces a target color to change color
     * factor will take neighbor colors in account
     * no factor will only take exact target color
     * 
     * @param {array<number>} target 
     * @param {array<number>} change 
     * @param {number} factor
     * 
     * @return {EmagJS.Core.Common.Image.ImageProcessor}
     */
    replaceColor(target = [], change = [], factor = 0) {

        let targetR = target[0]
        let targetG = target[1]
        let targetB = target[2]

        // tint pixels
        for (let i = 0; i < this.imageArray.length; i += 4) {

            let imageR = this.imageArray[i + 0]
            let imageG = this.imageArray[i + 1]
            let imageB = this.imageArray[i + 2]
            let imageA = this.imageArray[i + 3]

            if (imageA == 0)
                continue

            let redRange = imageR >= targetR - (255 * factor) && imageR <= targetR + (255 * factor)
            let greenRange = imageG >= targetG - (255 * factor) && imageG <= targetG + (255 * factor)
            let blueRange = imageB >= targetB - (255 * factor) && imageB <= targetB + (255 * factor)

            if (redRange && greenRange && blueRange) {
                this.imageArray[i + 0] = change[0]
                this.imageArray[i + 1] = change[1]
                this.imageArray[i + 2] = change[2]
            }

        }

        return this.modifyPixels()

    }

    /**
     * Outlines the image
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {boolean} edge
     * 
     * @return {void} 
     */
    stroke(r = 0, g = 0, b = 0, edge = false) {

        // clear temporary index pixel array
        this.tmpPixels.length = 0

        for (let i = 0; i < this.imageArray.length; i += 4) {

            // current pixel alpha channel
            let currentPixelA = this.imageArray[i + 3];

            // get nearest pixels

            // top pixel
            let topPixel = i - 4 * this.width
            let topPixelA = this.imageArray[topPixel + 3]
            // left pixel
            let leftPixel = i - 4
            let leftPixelA = this.imageArray[leftPixel + 3]
            // right pixel
            let rightPixel = i + 4
            let rightPixelA = this.imageArray[rightPixel + 3]
            // bottom pixel
            let bottomPixel = i + (4 * this.width)
            let bottomPixelA = this.imageArray[bottomPixel + 3]

            // edge pixels 

            // top left pixel
            let topLeftPixel = (i - 4 * this.width) - 4
            let topLeftPixelA = this.imageArray[topLeftPixel + 3]
            // top right pixel
            let topRightPixel = (i - 4 * this.width) + 4
            let topRightPixelA = this.imageArray[topRightPixel + 3]
            // bottom left pixel
            let bottomLeftPixel = (i + 4 * this.width) - 4
            let bottomLeftPixelA = this.imageArray[bottomLeftPixel + 3]
            // bottom right pixel
            let bottomRightPixel = (i + 4 * this.width) + 4
            let bottomRightPixelA = this.imageArray[bottomRightPixel + 3]

            // if pixel is filled
            if (currentPixelA) {

                // get current pixel column index
                let currentPixelColumn = i / 4 % this.width

                // get top pixel index
                if (!topPixelA) {
                    this.tmpPixels[topPixel] = topPixel
                }

                // get left pixel index
                if (!leftPixelA && currentPixelColumn != 0) {
                    this.tmpPixels[leftPixel] = leftPixel
                }

                // get right pixel index
                if (!rightPixelA && currentPixelColumn < this.width - 1) {
                    this.tmpPixels[rightPixel] = rightPixel
                }

                // get bottom pixel index
                if (!bottomPixelA) {
                    this.tmpPixels[bottomPixel] = bottomPixel
                }

                if (edge) {

                    // get top right pixel index
                    if (!topRightPixelA && currentPixelColumn < this.width - 1) {
                        this.tmpPixels[topRightPixel] = topRightPixel
                    }

                    // get top left pixel index
                    if (!topLeftPixelA && currentPixelColumn != 0) {
                        this.tmpPixels[topLeftPixel] = topLeftPixel
                    }

                    // get bottom right pixel index
                    if (!bottomRightPixelA && currentPixelColumn < this.width - 1) {
                        this.tmpPixels[bottomRightPixel] = bottomRightPixel
                    }

                    // get bottom left pixel index
                    if (!bottomLeftPixelA && currentPixelColumn != 0) {
                        this.tmpPixels[bottomLeftPixel] = bottomLeftPixel
                    }

                }

            }

        }

        // fill all pixels found
        this.tmpPixels.map((pixel, i) => {
            this.imageArray[i + 0] = r
            this.imageArray[i + 1] = g
            this.imageArray[i + 2] = b
            this.imageArray[i + 3] = 255
        })

        return this.modifyPixels()

    }

    /**
     * Creates shades image based on colors array
     * 
     * Iterates over each pixel and replace it color by it's next darken color
     * 
     * @param {array<number>} colors 
     * @param {array<number>} orderType - order colors by l2d (light to dark) | d2l (dark to light)
     * 
     * @return {array<EmagJS.Core.Common.Image.ImageProcessor}
     */
    createShades(orderType = 'l2d', colors = null) {

        // if not set colors, use image colors
        if (!colors) colors = this.getColors(orderType)

        // array to hold modified images
        let images = []

        let originalImage = this.clone()

        // add original image to images array
        images.push(originalImage.clone())

        for (let k = 0; k < colors.length; k++) {

            // iterate each original image pixel
            for (let i = 0; i < originalImage.imageArray.length; i += 4) {

                // each pixel component (rgba)
                let imageR = originalImage.imageArray[i + 0]
                let imageG = originalImage.imageArray[i + 1]
                let imageB = originalImage.imageArray[i + 2]
                let imageA = originalImage.imageArray[i + 3]

                // transparent pixel
                if (imageA == 0) continue

                // each color
                for (let c = 0; c < colors.length; c++) {

                    // color to be replaced
                    let targetColor = colors[c]
                    // color to be set
                    let changeColor = colors[c + 1]

                    // if target color is found, change it
                    if (imageR == targetColor[0] && imageG == targetColor[1] && imageB == targetColor[2]) {
                        if (changeColor) {
                            originalImage.imageArray[i + 0] = changeColor[0]
                            originalImage.imageArray[i + 1] = changeColor[1]
                            originalImage.imageArray[i + 2] = changeColor[2]
                        }
                    }

                }
            }

            // modify image pixels
            originalImage.modifyPixels()

            // push modified image to array
            images.push(originalImage.clone())

        }

        return images

    }

    /**
     * get image colors
     * 
     * @param {array<number>} orderType - order colors by l2d (light to dark) | d2l (dark to light)
     * 
     * @return {array<number>}
     */
    getColors(orderType = 'l2d') {

        // array with all colors found
        let colors = []

        // current color - null
        let currentColor = [-1, -1, -1]

        // iterate each image pixel
        for (let i = 0; i < this.imageArray.length; i += 4) {

            // each pixel component (rgba)
            let imageR = this.imageArray[i + 0]
            let imageG = this.imageArray[i + 1]
            let imageB = this.imageArray[i + 2]
            let imageA = this.imageArray[i + 3]

            // transparent pixel
            if (imageA == 0) continue

            // if current color is the same, skip
            if (imageR == currentColor[0] && imageG == currentColor[1] && imageB == currentColor[2])
                continue

            // if current image pixel is different from current color
            if (imageR != currentColor[0] && imageG != currentColor[1] && imageB != currentColor[2]) {

                // save color on it's index colors[rgb] = [r, g, b]
                colors[imageR + '' + imageG + '' + imageB] = [imageR, imageG, imageB]

                // update current color to current image pixel to next check
                currentColor = [imageR, imageG, imageB]

            }

        }

        // clear repeated colors
        colors = Object.values(colors)

        // order colors
        if (orderType == 'l2d') {
            colors.sort((a, b) => ((b[0] + b[1] + b[2]) / 3) - ((a[0] + a[1] + a[2]) / 3))
        } else if (orderType == 'd2l') {
            colors.sort((a, b) => ((a[0] + a[1] + a[2]) / 3) - ((b[0] + b[1] + b[2]) / 3))
        }

        return colors

    }

    /**
     * Get image main color
     * 
     * @return {array<integer>}
     */
    getMainColor() {

        let r = 0
        let g = 0
        let b = 0

        // iterate each image pixel
        for (let i = 0; i < this.imageArray.length; i += 4) {

            // each pixel component (rgba)
            let imageR = this.imageArray[i + 0]
            let imageG = this.imageArray[i + 1]
            let imageB = this.imageArray[i + 2]

            r += imageR
            g += imageG
            b += imageB

        }

        let m = r + g + b / 3
        r = (r / m) * 255
        g = (g / m) * 255
        b = (b / m) * 255

        return [r | 0, g | 0, b | 0]

    }

    /**
     * Removes a target color
     * factor will take neighbor colors in account
     * no factor will only take exact target color
     * 
     * @param {array<number>} target 
     * @param {number} factor
     * 
     * @return {EmagJS.Core.Common.Image.ImageProcessor}
     */
    removeColor(target = [], factor = 0) {

        let targetR = target[0]
        let targetG = target[1]
        let targetB = target[2]

        // tint pixels
        for (let i = 0; i < this.imageArray.length; i += 4) {

            let imageR = this.imageArray[i + 0]
            let imageG = this.imageArray[i + 1]
            let imageB = this.imageArray[i + 2]
            let imageA = this.imageArray[i + 3]

            if (imageA == 0) continue

            let redRange = imageR >= targetR - (255 * factor) && imageR <= targetR + (255 * factor)
            let greenRange = imageG >= targetG - (255 * factor) && imageG <= targetG + (255 * factor)
            let blueRange = imageB >= targetB - (255 * factor) && imageB <= targetB + (255 * factor)

            if (redRange && greenRange && blueRange) {
                this.imageArray[i + 3] = 0
            }

        }

        return this.modifyPixels()

    }

    /**
     * Applies grayscale effect
     * 
     * @return {EmagJS.Core.Common.Image.ImageProcessor}
     */
    grayscale(factor = 1) {

        for (let i = 0; i < this.imageArray.length; i += 4) {

            let _r = this.imageArray[i + 0]
            let _g = this.imageArray[i + 1]
            let _b = this.imageArray[i + 2]
            let _a = this.imageArray[i + 2]

            if (_a == 0) continue

            let middle = (_r + _b + _g) / (3 * factor)

            this.imageArray[i + 0] = middle
            this.imageArray[i + 1] = middle
            this.imageArray[i + 2] = middle

        }

        return this.modifyPixels()

    }

    /**
     * Applies invert effect
     * 
     * @return {EmagJS.Core.Common.Image.ImageProcessor}
     */
    invert() {

        for (var i = 0; i < this.imageArray.length; i += 4) {

            var _r = this.imageArray[i + 0]
            var _g = this.imageArray[i + 1]
            var _b = this.imageArray[i + 2]
            var _a = this.imageArray[i + 3]

            if (_a == 0) continue

            this.imageArray[i + 0] = 255 - _r
            this.imageArray[i + 1] = 255 - _g
            this.imageArray[i + 2] = 255 - _b

        }

        return this.modifyPixels()

    }

    /**
     * Crop image
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height
     * 
     *  @return {EmagJS.Core.Common.Image.ImageProcessor}
     */
    crop(x, y, width, height) {

        // draw to the temp canvas, only desired piece
        this.context.clearRect(0, 0, this.width, this.height)
        this.context.drawImage(this.source, x, y, width, height, 0, 0, width, height)

        // set size
        this.width = width
        this.height = height

        // get croped pixels
        this.imageData = this.context.getImageData(0, 0, width, height)
        this.imageArray = this.imageData.data

        // modify current pixels
        return this.modifyPixels()

    }

    /**
     * Clone itself
     * 
     * @return {EmagJS.Core.Common.Image.ImageProcessor}
     */
    clone() {
        return new ImageProcessor(this.source)
    }

}