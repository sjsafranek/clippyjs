import Agent from './agent'
import Animator from './animator'
import Queue from './queue'
import Balloon from './balloon'
import { load, ready, soundsReady } from './load'

const clippy = {
    Agent,
    Animator,
    Queue,
    Balloon,
    load,
    ready,
    soundsReady
}

// List of available agents
clippy.agents = ['Bonzi', 'Clippy', 'F1', 'Genie', 'Genius', 'Links', 'Merlin', 'Peedy', 'Rocky', 'Rover'];

export default clippy;

if (typeof window !== 'undefined') {
    window.clippy = clippy;
}


