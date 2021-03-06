
import moveChoiceTo from './moveChoiceTo.js';

export default function reorderChildren(oldVChildren, newVChildren, keyedOld, keyedNew) {

    const reorderPatches = [];
    //const reorderedArrayOfElements = [];

    for(const key in keyedOld) {

        const inOldVChildrenIndex = keyedOld[key];

        if(key in keyedNew) {

            const inNewVChildrenIndex = keyedNew[key];

            reorderPatches.push(() => { 

                moveChoiceTo(oldVChildren[inOldVChildrenIndex].realDOM, inNewVChildrenIndex - inOldVChildrenIndex);

            });
            /*reorderedArrayOfElements.push({
                realDOM: oldVChildren[inOldVChildrenIndex].realDOM,
                jump: inNewVChildrenIndex - inOldVChildrenIndex
            });*/

        }

    }

    /*reorderedArrayOfElements.forEach((reorderAction, i) => {

        moveChoiceTo(reorderAction.realDOM, reorderAction.jump);

    });*/

    return reorderPatches;

}