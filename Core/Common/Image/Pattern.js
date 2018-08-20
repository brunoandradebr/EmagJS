class Pattern extends ImageProcessor {

    /**
     * Constructor
     * 
     * @param {HTMLImageElement} source 
     * @param {string} repeat - repeat | repeat-x | repeat-y | no-repeat
     */
    constructor(source, repeat = 'repeat') {

        super(source)

        this.repeat = repeat

        this.fillStyle = this.context.createPattern(this.source, this.repeat)

    }

    /**
     * Applies modifications to the current imageData
     * 
     * @return {EmagJS.Core.Common.Image.Pattern} 
     */
    modifyPixels() {
        super.modifyPixels()

        this.fillStyle = this.context.createPattern(this.source, this.repeat)

        return this
    }

    /**
     * Clone itself
     * 
     * @return {EmagJS.Core.Common.Image.Pattern} 
     */
    clone() {
        return new Pattern(this.source, this.repeat)
    }

}