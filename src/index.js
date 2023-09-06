import Agent from './agent'
import Animator from './animator'
import Queue from './queue'
import Balloon from './balloon'
import { loader, ready, soundsReady } from './load'

const clippy = {
    Agent,
    Animator,
    Queue,
    Balloon,
    ready,
    soundsReady
}

// List of available agents
clippy.agents = ['Bonzi', 'Clippy', 'F1', 'Genie', 'Genius', 'Links', 'Merlin', 'Peedy', 'Rocky', 'Rover'];

// Load Agent
clippy.load = function(name) {
    return loader.load(name);
}

export default clippy;

if (typeof window !== 'undefined') {
    window.clippy = clippy;
}


