/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */



/**
 * @type {AudioContext}
 */
let audioContext = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext()

/**
 * @type {GainNode}
 */
let master = audioContext.createGain()

/**
 * @type {GainNode}
 */
let music = audioContext.createGain()

/**
 * @type {GainNode}
 */
let sound = audioContext.createGain()

// connect master gain node to speaker
master.connect(audioContext.destination)
// connect music gain node to master
music.connect(master)
// connect sound gain node to master
sound.connect(master)


/**
 * SoundFx
 */
class SoundFx {

    constructor() { }

    /**
     * Plays a sound
     * 
     * @param {AudioBuffer} buffer 
     * @param {number}      volume 
     * @param {bool}        loop
     * 
     * @return {void}
     */
    play(buffer, volume = 1, output = 'music', loop = false, delayFx = false) {

        let bufferSource = audioContext.createBufferSource()
        bufferSource.buffer = buffer;
        bufferSource.loop = loop;

        let gainNode = audioContext.createGain()
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.3);

        bufferSource.connect(gainNode)

        if (delayFx) {

            let delay = audioContext.createDelay()
            delay.delayTime.value = .25;

            let delayGain = audioContext.createGain()
            delayGain.gain.value = 0.2;

            let filter = audioContext.createBiquadFilter()
            filter.frequency.value = 300;
            filter.type = 'highpass';

            bufferSource.connect(delay)

            delay.connect(delayGain)
            delayGain.connect(filter)
            filter.connect(delay)

            delayGain.connect(gainNode)

        }

        if (output == 'music') {
            gainNode.connect(music)
        } else if (output == 'sound') {
            gainNode.connect(sound)
        } else {
            gainNode.connect(master)
        }

        bufferSource.start()

    }

    /**
     * Creates a oscillator
     * 
     * @param {number} frequency 
     * @param {string} type 
     * @param {number} volume 
     * @param {number} duration 
     * 
     * @return {void} 
     */
    playOscillator(frequency = 450, type = 'sine', volume = 1, duration = 0.5) {

        let oscillator = audioContext.createOscillator()
        let gainNode = audioContext.createGain()

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        oscillator.connect(gainNode)
        gainNode.connect(master)

        // + 0.000001 - ios fix 
        oscillator.start(audioContext.currentTime + 0.000001)
        gainNode.gain.value = volume;

        oscillator.stop(audioContext.currentTime + duration)

    }

    playRandomOscillator(frequency = 200, duration = 0.2) {
        this.playOscillator(100 + ((Math.random() * frequency) | 0), 'sine', 1, duration)
    }

}

// registers an touchstart event to initialize web audio api - ios
window.addEventListener('touchstart', autoDestroyFunction = () => {
    new SoundFx().play()
    window.removeEventListener('touchstart', autoDestroyFunction)
})