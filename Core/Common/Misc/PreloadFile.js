/**
 * @author Bruno Andrade <bruno.faria.andrade@gmail.com>
 */


/**
 * Preload any resource file
 */
class PreloadFile {

    /**
     * 
     * @param {array<object>} files 
     */
    constructor(files = []) {

        let _this = this;

        /**
         * @type {array<object>}
         */
        this.files = prepareFiles(files);

        /**
         * @type {array<object>}
         */
        let scripts = [];

        /**
         * @type {array<object>}
         */
        let lastFileLoaded = null;

        /**
         * Preload all files
         * 
         * @param {array<object>} files 
         * 
         * @return {array}
         */
        function prepareFiles(files) {

            let _files = [];

            let total = files.length;
            let loaded = 0;

            // audio object to preload audio files
            let AudioContext = window.AudioContext || window.webkitAudioContext;
            let audioLoader = new AudioContext();

            files.forEach((file) => {

                // each file to be loaded
                for (var key in file) {

                    let type = file[key].split('.').pop();
                    let name = file[key].split('/').pop();
                    let path = file[key];

                    let request = new XMLHttpRequest();

                    // if loading sound file
                    if (type == 'mp3') {
                        request.responseType = 'arraybuffer';
                    }

                    // open a request to the file
                    request.open('GET', path);

                    // file is loading
                    request.onprogress = (e) => {

                        let name = e.target.responseURL.split('/').pop();

                        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                        let i = parseInt(Math.floor(Math.log(e.loaded) / Math.log(1024)));
                        let loaded = (e.loaded / Math.pow(1024, i)).toFixed(1) + '' + sizes[i];
                        i = parseInt(Math.floor(Math.log(e.total) / Math.log(1024)));
                        let total = (e.total / Math.pow(1024, i)).toFixed(1) + '' + sizes[i];

                        let progressData = {
                            name: name,
                            bytesLoaded: loaded,
                            bytesTotal: total,
                            loaded: _this.files.length,
                            total: files.length,
                            percent: (((_this.files.length) * 100) / files.length).toFixed(1)
                        }

                        // dispatch onprogress
                        _this.onprogress(progressData);
                        // update last loaded file
                        lastFileLoaded = progressData;

                    }

                    // file was loaded
                    request.onload = (e) => {

                        // force preload for each file type
                        switch (type) {
                            case 'js':

                                let script = document.createElement('script');
                                script.src = path;
                                script.async = false;

                                // add to scripts array to be ordered and loaded
                                scripts[key] = script;
                                scripts.length++;

                                // add file to files array
                                _files[key] = script;
                                _files.length++;

                                loaded++;

                                // check if all files were loaded
                                checkCompletation(files, loaded, total);

                                break;

                            case 'ttf':

                                let font = new FontFace(key, `url(${path})`);

                                font.load().then((fontLoaded) => {

                                    document.fonts.add(fontLoaded);

                                    _files[key] = fontLoaded;
                                    _files.length++;

                                    loaded++;

                                    checkCompletation(files, loaded, total);

                                });

                                break;

                            case 'jpg': case 'png': case 'jpeg':

                                let img = document.createElement('img');
                                img.src = path;

                                // check if image was loaded
                                img.onload = (e) => {

                                    _files[key] = e.target;
                                    _files.length++;

                                    loaded++;

                                    // check if all files were loaded
                                    checkCompletation(files, loaded, total);
                                }
                                break;
                            case 'mp3': case 'wav':

                                let arrayBuffer = e.target.response;


                                // preload
                                audioLoader.decodeAudioData(arrayBuffer, (buffer) => {

                                    _files[key] = buffer;
                                    _files.length++;

                                    loaded++;

                                    checkCompletation(files, loaded, total);

                                });

                                break;
                            case 'txt': case 'json': case 'xml':
                                _files[key] = e.target.responseText;
                                _files.length++;
                                loaded++;
                                checkCompletation(files, loaded, total);
                                break;
                        }
                    }

                    // send request
                    request.send();

                }

            });

            return _files;
        }

        /**
         * Verify if all files were loaded and prepare some stuffs
         * 
         * @param {array}   files 
         * @param {integer} loaded 
         * @param {integer} total 
         * 
         * @callback oncomplete
         * 
         * @return {void}
         */
        function checkCompletation(files, loaded, total) {

            // loaded all files needed
            if (loaded === total) {

                // to order js files
                let tmpOrder = [];
                let appended = 0;
                let toAppend = scripts.length;

                // check include order
                files.forEach((file) => {

                    // for each files
                    for (let key in file) {

                        // get script file from scripts array
                        let script = scripts[key];

                        // if it's a script, add to order array
                        if (script)
                            tmpOrder.push(script);

                    }

                });

                // load and include scripts in right order
                if (tmpOrder.length) {
                    tmpOrder.forEach((script) => {

                        // append script to head tag
                        document.querySelector('head').appendChild(script);

                        // waits to load
                        script.onload = (e) => {

                            appended++;

                            // if all scripts were added, call the function
                            if (appended === toAppend) {
                                if (_this.oncomplete) {

                                    if (!lastFileLoaded) {
                                        throw ('some included file is empty');
                                    }

                                    // update last progress - 100%
                                    _this.onprogress({ name: lastFileLoaded.name, bytesLoaded: lastFileLoaded.bytesTotal, bytesTotal: lastFileLoaded.bytesTotal, loaded: lastFileLoaded.total, total: lastFileLoaded.total, percent: 100 });

                                    _this.oncomplete();

                                    // remove all included scripts from head
                                    let head = document.querySelector('head');
                                    let scripts = head.querySelectorAll('script');
                                    scripts.forEach((script) => script.remove())

                                }
                            }

                        }

                    });
                } else {

                    // loaded all files, but there is no script file
                    if (_this.oncomplete) {

                        // update last progress - 100%
                        _this.onprogress({ name: lastFileLoaded.name, bytesLoaded: lastFileLoaded.bytesTotal, bytesTotal: lastFileLoaded.bytesTotal, loaded: lastFileLoaded.total, total: lastFileLoaded.total, percent: 100 });

                        _this.oncomplete();

                    }
                }

            }

        }

    }

    /**
     * While loading a file
     * 
     * @param {object} progressData
     *                 name
     *                 bytesLoaded
     *                 bytesTotal
     *                 loaded (number of files loaded)
     *                 total (number of files)
     *                 percent (progress percent)
     */
    onprogress(progressData) {
        // implements in instance
    }

    /**
     * After all files loads
     */
    oncomplete() {
        // implements in instance
    }

    /**
     * get scripts - return all cached script files
     * 
     * @return {array}
     */
    get scripts() {

        let scripts = [];

        for (let i in this.files) {

            let file = this.files[i];

            if (file.constructor.name == 'HTMLScriptElement')
                scripts[i] = file;
        }

        return scripts;
    }

    /**
     * get images - return all cached image files
     * 
     * @return {array}
     */
    get images() {

        let images = [];

        for (let i in this.files) {

            let file = this.files[i];

            if (file.constructor.name == 'HTMLImageElement')
                images[i] = file;
        }

        return images;
    }

    /**
     * get fonts - return all cached font files
     * 
     * @return {array}
     */
    get fonts() {

        let fonts = [];

        for (let i in this.files) {

            let file = this.files[i];

            if (file.constructor.name == 'FontFace')
                fonts[i] = file;
        }

        return fonts;
    }

    /**
     * get sounds - return all cached sound files
     * 
     * @return {array}
     */
    get sounds() {

        let sounds = [];

        for (let i in this.files) {

            let file = this.files[i];

            if (file.constructor.name == 'AudioBuffer')
                sounds[i] = file;
        }

        return sounds;
    }

    /**
     * get texts - return all cached text files
     * 
     * @return {array}
     */
    get texts() {

        let texts = [];

        for (let i in this.files) {

            let file = this.files[i];

            if (file.constructor.name == 'String')
                texts[i] = file;
        }

        return texts;
    }
}