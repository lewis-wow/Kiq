import getChildIndex from './getChildIndex.js';
import moveChoiceTo from './moveChoiceTo.js';


export default function reorderChildren(oldVChildren, newVChildren, keyedOld, keyedNew) {

    const reorderPatches = [];

    for(const key in keyedOld) {

        if(key in keyedNew) {

            const inOldVChildrenIndex = keyedOld[key];
            const inNewVChildrenIndex = keyedNew[key];

            reorderPatches.push(function(parent) {
                
                const node = oldVChildren[inOldVChildrenIndex].realDOM;

                const currIndex = getChildIndex(node, parent); //hydration process

                if(currIndex === inNewVChildrenIndex) return; //O(m) Mem & Time, hydrated

                moveChoiceTo(node, inNewVChildrenIndex - currIndex, currIndex)(parent); //O(Max(m)) hydrated, reordered

            });

        }

    }

    return reorderPatches;

}