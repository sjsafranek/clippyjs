import $ from 'jquery'
import Agent from './agent'
import DOMUtils from './utils';

export class loader {

    static load (name, base_path) {
        base_path = base_path || '../dist/assets/agents/';
        let path = base_path + name;
        return loader._loadAgent(name, path)
            .then(result => {
                let agent = new Agent(path, result.data, result.sounds);
                return agent;
            });
    }

    static _loadAgent(name, path) {
        return Promise.all([
            loader._loadImage(path),
            loader._loadData(name, path),
            loader._loadSounds(name, path)
        ])
        .then(results => {
            return {
                name: name,
                data: results[1],
                sounds: results[2]
            }
        });
    }

    static _loadImage (path) {
        let task = loader._maps[path];
        if (task) return task;

        // set task if not defined
        task = loader._maps[path] = $.Deferred();

        let src = path + '/map.png';
        DOMUtils.createImage(src, {onload: task.resolve, onerror: task.reject});

        return task.promise();
    }

    static _loadSounds (name, path) {
        let task = loader._sounds[name];
        if (task) return task;

        // set task if not defined
        task = loader._sounds[name] = $.Deferred();

        let audio = document.createElement('audio');
        let canPlayMp3 = !!audio.canPlayType && "" !== audio.canPlayType('audio/mpeg');
        let canPlayOgg = !!audio.canPlayType && "" !== audio.canPlayType('audio/ogg; codecs="vorbis"');

        if (!canPlayMp3 && !canPlayOgg) {
            task.resolve({});
        } else {
            let src = path + (canPlayMp3 ? '/sounds-mp3.js' : '/sounds-ogg.js');
            DOMUtils.loadScript(src, {onload: task.resolve, onerror: task.reject});
        }

        return task.promise()
    }

    static _loadData (name, path) {
        let task = loader._data[name];
        if (task) return task;

        task = loader._getDataTask(name);

        let src = path + '/agent.js';
        DOMUtils.loadScript(src, {onload: task.resolve, onerror: task.reject});

        return task.promise();
    }

    static _getDataTask (name) {
        let task = loader._data[name];
        if (!task) {
            task = loader._data[name] = $.Deferred();
        }
        return task;
    }

    static _getSoundTask (name) {
        let task = loader._sounds[name];
        if (!task) {
            task = loader._sounds[name] = $.Deferred();
        }
        return task;
    }
}

loader._maps = {};
loader._sounds = {};
loader._data = {};

export function ready (name, data) {
    let task = loader._getDataTask(name);
    task.resolve(data);
}

export function soundsReady (name, data) {
    let task = loader._getSoundTask(name);
    task.resolve(data);
}
