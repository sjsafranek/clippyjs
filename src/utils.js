
export default class DOMUtils {

    static createElement(tagName, attributes, listeners) {
        attributes = attributes || {};
        listeners = listeners || {};
        let element = document.createElement(tagName);
        for (let name in attributes) {
            element.setAttribute(name, attributes[name]);
        }
        element.onload = listeners.onload;
        element.onerror = listeners.onerror;
        return element;
    }

    static createScript(src, listeners) {
        return DOMUtils.createElement('script', {
            'src': src,
            'async': 'async',
            'type': 'text/javascript'            
        }, listeners);
    }

    static loadScript (src, listeners) {
        let script = DOMUtils.createScript(src, listeners);   
        document.head.appendChild(script);
        return script;
    }

    static createImage(src, listeners) {
        let element = new Image();
        element.setAttribute('src', src);
        element.onload = listeners.onload;
        element.onerror = listeners.onerror;        
        return element;
    }

}
