/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */



/**
 * @type {AudioContext}
 */
let audioContext = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext();

/**
 * @type {GainNode}
 */
let master = audioContext.createGain();

// connect master gain node to global audio context
master.connect(audioContext.destination);




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
    play(buffer, volume = 1, loop = false) {

        let bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.loop = loop;

        let gainNode = audioContext.createGain();
        gainNode.gain.value = volume;

        //let delay = audioContext.createDelay();
        //delay.delayTime.value = 0.3;

        //let delayGain = audioContext.createGain();
        //delayGain.gain.value = 0.5;

        //let filter = audioContext.createBiquadFilter();
        //filter.frequency.value = 600;
        //filter.type = 'highpass';

        bufferSource.connect(gainNode);
        //bufferSource.connect(delay);

        //delay.connect(delayGain);
        //delayGain.connect(filter);
        //filter.connect(delay);

        //delayGain.connect(gainNode);

        gainNode.connect(master);

        bufferSource.start();

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
    playOscillator(frequency = 450, type = 'sine', volume = 1, duration = 0.4) {

        let oscillator = audioContext.createOscillator();
        let gainNode = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        oscillator.connect(gainNode);
        gainNode.connect(master);

        // + 0.000001 - ios fix 
        oscillator.start(audioContext.currentTime + 0.000001);
        gainNode.gain.value = volume;

        oscillator.stop(audioContext.currentTime + duration);

    }

    playRandomOscillator(frequency = 200, duration = 0.2) {
        this.playOscillator(100 + ((Math.random() * frequency) | 0), 'sine', 1, duration)
    }

}