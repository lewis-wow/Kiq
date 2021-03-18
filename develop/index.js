/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import createElement from './vnode/createElement.js';
import Component from './vnode/component/component.js';
import mount from './DOM/mount.js';
import render from './DOM/render.js';
import errorReport from './errorReporting.js';

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

        window.requestAnimationFrame(() => {

            if (!container || container.nodeType !== Node.ELEMENT_NODE) {

                throw errorReport('render(...)', `container must be valid Element that is already rendered on page`);

            }

            const newNodeDefinition = render(virtualElement);

            callback(newNodeDefinition);

        });

    }

    return {

        Component,

        render: function (virtualElement, container, callback) {

            renderToPage(virtualElement, container, newNodeDefinition => {

                mount(newNodeDefinition, container, () => container.appendChild(newNodeDefinition.realDOM));

                if(callback) {

                    callback(newNodeDefinition);

                }

            });

        },

        createElement,

        replace: function(virtualElement, container, callback) {

            renderToPage(virtualElement, container, newNodeDefinition => {

                mount(newNodeDefinition, container, () => container.replaceWith(newNodeDefinition.realDOM));

                if(callback) {

                    callback(newNodeDefinition);

                }

            });

        }

    };

}));