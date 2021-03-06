import diff from './diff.js';
import isArray from '../isArray.js';
import mount from '../DOM/mount.js';
import render from '../DOM/render.js';
import keyToIndex from './keyToIndex.js';
import reorderChildren from './reorderChildren.js';


/**
 * check differences between old virtualNode childNodes and new one
 * apply changes to realNode
 * @param { Array } oldVChildren - old virtual node children
 * @param { Array } newVChildren - new virtual node children
 */


export default function diffChildren(oldVChildren, newVChildren) {

    const updatedVChildren = [];
    const childPatches = [];

    const additionalPatches = [];

    const [keyedOld, freeOld] = keyToIndex(oldVChildren);
    const [keyedNew, freeNew] = keyToIndex(newVChildren);

    const reorderPatches = reorderChildren(oldVChildren, newVChildren, keyedOld, keyedNew);

    const maxFreeLen = Math.max(freeNew.length, freeOld.length);

    for (let i = 0; i < maxFreeLen; i++) {

        const vOldNode = oldVChildren[i];

        if (isArray(vOldNode)) {

            const recursionPatch = diffChildren(vOldNode, newVChildren[i]);

            if (recursionPatch) {

                additionalPatches.push(function (parent) {

                    updatedVChildren[i] = recursionPatch(parent);

                });

            } else {

                updatedVChildren[i] = vOldNode;

            }

        } else if (vOldNode === undefined) {

            const newNodeDefinition = render(newVChildren[i]);
            updatedVChildren[i] = newNodeDefinition;

            additionalPatches.push(function (parent) {

                mount(newNodeDefinition, parent, () => parent.appendChild(newNodeDefinition.realDOM));

            });

        } else {

            const childPatch = diff(vOldNode.virtualNode, newVChildren[i]);

            if (childPatch) {

                vOldNode.patch = function (node) {

                    const childAfterPatch = childPatch(node);

                    if (childAfterPatch !== undefined) {

                        updatedVChildren[i] = childAfterPatch;

                    }

                };

                childPatches.push(i);

            } else {

                updatedVChildren[i] = vOldNode;

            }

        }

    }

    for (const key in keyedNew) {

        const inNewVChildrenIndex = keyedNew[key];
        const vNewNode = newVChildren[inNewVChildrenIndex];

        if (!(key in keyedOld)) {

            const newNodeDefinition = render(vNewNode);
            updatedVChildren[inNewVChildrenIndex] = newNodeDefinition;

            additionalPatches.push(function (parent) {

                mount(newNodeDefinition, parent, () => parent.insertBefore(newNodeDefinition.realDOM, parent.childNodes[inNewVChildrenIndex]));

            });

        } else {

            const inOldVChildrenIndex = keyedOld[key];
            const vOldNode = oldVChildren[inOldVChildrenIndex];

            let childPatch;
            let keyToDel = key;

            childPatch = diff(vOldNode.virtualNode, vNewNode);

            if (childPatch) {

                const patchFunction = function (node) {

                    const childAfterPatch = childPatch(node);

                    if (childAfterPatch !== undefined) {

                        updatedVChildren[inNewVChildrenIndex] = childAfterPatch;

                    }

                };

                vOldNode.patch = patchFunction;
                childPatches.push(inOldVChildrenIndex);

            } else {

                updatedVChildren[inNewVChildrenIndex] = vOldNode;

            }

            delete keyedOld[keyToDel];

        }

    }

    for (const key in keyedOld) {

        const inOldVChildrenIndex = keyedOld[key];
        const vOldNode = oldVChildren[inOldVChildrenIndex];

        vOldNode.patch = diff(vOldNode.virtualNode, undefined);

        childPatches.push(inOldVChildrenIndex);

    }

    if (additionalPatches.length + childPatches.length + reorderPatches.length === 0) {

        return null;

    }

    return function (parent) {

        for (let i = 0; i < childPatches.length; i++) {

            const oldVChild = oldVChildren[childPatches[i]];

            oldVChild.patch(oldVChild.realDOM);

        }

        for (let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        for (let i = 0; i < reorderPatches.length; i++) {

            reorderPatches[i]();

        }

        return updatedVChildren;

    }

}