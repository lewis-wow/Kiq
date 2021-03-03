/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import createElement from './vnode/createElement.js';
import Component from './vnode/component/component.js';
import mount from './DOM/mount.js';
import render from './DOM/render.js';

/**
 * whole library is in container funciton for use library in node.js, js, as modules, ...
 * @param  { Object } global - window object
 * @param  { Function } factory - ReactiveHTML library
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global = global || self, global.Kiq = factory());
}(this, function () {

    "use strict";

    function renderToPage(virtualElement, container, callback) {

        //window.requestAnimationFrame(() => {

            if (!container || container.nodeType !== Node.ELEMENT_NODE) {

                throw TypeError(`render(...) container must be valid Element that is already rendered on page, try to use DOMContentLoaded event on window to wait for all Elements load`);

            }

            const newNodeDefinition = render(virtualElement);

            callback(newNodeDefinition);

        //});

    }

    return {

        Component,

        render: function (virtualElement, container) {

            renderToPage(virtualElement, container, newNodeDefinition => {

                mount(newNodeDefinition, container, () => container.appendChild(newNodeDefinition.realDOM));

            });

        },

        createElement,

        replace: function(virtualElement, container) {

            renderToPage(virtualElement, container, newNodeDefinition => {

                mount(newNodeDefinition, container, () => container.replaceWith(newNodeDefinition.realDOM));

            });
        }

    };

}));