import getChildIndex from './getChildIndex.js';
import moveChoiceTo from './moveChoiceTo.js';


export default function reorderChildren(oldVChildren, newVChildren, keyedOld, keyedNew) {

    const reorderPatches = [];

    for(const key in keyedOld) {

        if(key in keyedNew) {

            const inOldVChildrenIndex = keyedOld[key];
            const inNewVChildrenIndex = keyedNew[key];
            const node = oldVChildren[inOldVChildrenIndex].realDOM;

            reorderPatches.push(function(parent) {

                const currIndex = getChildIndex(node, parent);

                if(currIndex === inNewVChildrenIndex) return;

                moveChoiceTo(node, inNewVChildrenIndex - currIndex)(parent);

            });

        }

    }

    return reorderPatches;

}
