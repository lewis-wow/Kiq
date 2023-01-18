import applyComponentUpdate from "../../update/applyComponentUpdate.js";
import updateComponent from "../../update/updateComponent.js";



export default function createComponentUpdate(component, newStateFromSetter) {

    const update = updateComponent(component, null, newStateFromSetter);
    //update component return patch which is function and snapshot that is given from getSnapshotBeforeUpdate

    applyComponentUpdate(update, (patch, snapshot) => {

        const componentInternals = component._internals;

        const patchedChild = patch(componentInternals.realDOM);

        Object.assign(componentInternals, {
            virtualNode: patchedChild.virtualNode,
            realDOM: patchedChild.realDOM
        });

        component.onComponentUpdate(snapshot);

    }, null);

    return component;

}