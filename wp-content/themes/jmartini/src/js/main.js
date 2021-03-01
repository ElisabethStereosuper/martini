// ⚠️ Do not remove the line below or your scss won't work anymore
import '../scss/main.scss';

// @babel/polyfill is necessary for async imports
import '@babel/polyfill';

// Imports
// To learn how to use Sac
// SEE: https://github.com/stereosuper/stereorepo/tree/master/packages/sac
import { useSacVanilla, useSuperLoad } from '@stereorepo/sac';

import loadContent from './components/loadContent';
import animHeader from './components/animHeader';

// Initialization functions
//const preloadCallback = () => { };

const loadCallback = () => {
    // All actions needed after page load (like click events for example)
    loadContent();
};

const animationsCallback = () => {
    // Animations shouldn't be render blocking... so they'll be called last
    animHeader();
};

// Init sac superComponents
useSacVanilla();
useSuperLoad();

// Access superComponents
window.$stereorepo.superLoad.initializeLoadingShit({
    //preloadCallback,
    loadCallback,
    animationsCallback,
    noTransElementsClass: '.elt-no-resize-transition'
});
