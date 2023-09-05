const fs = require('fs');
const path = require('path');
//const buble = require('rollup-plugin-buble');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const copy = require('rollup-plugin-copy-assets');
const { dependencies } = require('./package.json');

const name = 'clippy'
const dist = path.resolve(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
}

module.exports = {
    input: path.resolve(__dirname, 'src/index.js'),
    output: {
        file: 'dist/clippy.js',
        format: 'umd',       // node and browsers
        name: 'clippy'
    },
    plugins: [
        //buble(),
        resolve({ external: ['vue'] }),
        commonjs(),
        copy({
            assets: [
                'assets',
            ],
        }),    
    ],
};
