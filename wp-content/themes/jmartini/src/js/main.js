// ⚠️ Do not remove the line below or your scss won't work anymore
import '../scss/main.scss';

// @babel/polyfill is necessary for async imports
import '@babel/polyfill';

// Imports
// To learn how to use Sac
// SEE: https://github.com/stereosuper/stereorepo/tree/master/packages/sac
import { bodyRouter, useSacVanilla, useSuperLoad } from '@stereorepo/sac';

// ⚠️ DO NOT REMOVE ⚠️
// This function allow you to use dynamic imports with webpack
const dynamicLoading = ({ name }) => async () => {
    // Do not use multiple variables for the import path, otherwise the chunck name will be composed of all the variables (and not the last one)
    const { default: defaultFunction } = await import(/* webpackChunkName: "[request]" */ `./components/${name}`);
    defaultFunction();
};
// ⚠️ DO NOT REMOVE ⚠️

import loadContent from './components/loadContent';

// Initialization functions
const preloadCallback = () => {
    // All actions needed at page load
    loadContent();
};

const loadCallback = () => {
    // All actions needed after page load (like click events for example)
};

const animationsCallback = () => {
    // Animations shouldn't be render blocking... so they'll be called last
};

// Init sac superComponents
useSacVanilla();
useSuperLoad();

// Access superComponents
window.$stereorepo.superLoad.initializeLoadingShit({
    preloadCallback,
    loadCallback,
    animationsCallback,
    noTransElementsClass: '.elt-no-resize-transition'
});
