
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global = global || self, global.Kiq = factory());
}(this, function () {

    "use strict";

    function isArray(array) {

        return Array.isArray(array);
    
    }

    function isComponent(type) {

        if(isFunction(type) && type.prototype.isKiqComponent) return true;
        return false;
    
    }

    function isFunction(func) {

        return typeof func === 'function';
    
    }

    function isNullOrUndef(value) {

        return (value === null || value === undefined);
    
    }

    function isObject(object) {

        return (typeof object === 'object' && object !== null);
    
    }

    function createElement(type, props = null, ...children) {

        props = props || {};
    
        let _key = null;
        let _ref = null;
    
        if("_key" in props) {
    
            _key = props._key.toString();
    
        }
    
        if("_ref" in props) {
    
            _ref = props._ref;
    
        }
    
        if(children.length || !isComponent(type)) {
    
            props = {
                children,
                ...props
            };
    
        }
    
        return {
            type,
            props,
            _key,
            _ref
        };
    
    }

    function assignNewPropsAndStates(oldComponent, nextProps, nextState) {

        if(isObject(nextProps)) {
    
            Object.assign(oldComponent.props, nextProps);
    
        }
    
        if(isObject(nextState)) {
    
    
            Object.assign(oldComponent.state, nextState);
    
        }
    
        return oldComponent;
    
    }

    function Component(props) {

        this.props = props;
        this.state = {};
    
        this._internals = {
    
            realDOM: null,
            virtualNode: null
    
        };
    
        return this;
    
    }
    
    /**
     * Element method is the only one method that is required to be in component
     */
    
    Component.prototype.Element = function () {
    
        //not overrided Element method throws error cause Element must be defined in component
        throw Error(`You have to specify Element method in your Component, Element must return virtual element`);
    
    }
    
    /**
     * setState method for set new state of component and update it
     * real dom will react on state changes
     * @param { Object || Function } setter - set the new state of component
     */
    
    Component.prototype.setState = function() {
    
        throw Error(`setState(...) can be called only if component is rendered, will be mounted or is mounted`);
    
    }
    
    Component.prototype.onComponentRender =
    
        Component.prototype.onComponentWillUpdate =
        Component.prototype.onComponentUpdate =
    
        Component.prototype.onComponentWillMount =
        Component.prototype.onComponentMount =
    
        Component.prototype.onComponentCancelUpdate =
    
        Component.prototype.getSnapshotBeforeUpdate =
    
        Component.prototype.componentWillGetProps =
    
        Component.prototype.onComponentWillUnMount = function () {};
    
    /**
     * shouldComponentUpdate is used when component is going to udpate, this method is for better optimalization
     */
    
    Component.prototype.shouldComponentUpdate = function () {
        return true;
    };
    
    /**
     * for recognize ReactiveHTML component
     */
    
    Component.prototype.isKiqComponent = true;
    
    /**
     * this function will trigger the update of component
     */

    function createComponentInstance(component) {
    
        const instance = new component.type(component.props);
    
        instance._internals.virtualNode = instance.Element(instance.props, instance.state);
    
        instance.type = component.type;
    
        return instance;
    
    }

    function createComponentUpdate(component, newStateFromSetter) {

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

    function setState(component, setter) {

        //setter can be object or function that returns object
    
        let newStateFromSetter;
    
        if(isObject(setter)) {
    
            newStateFromSetter = setter;
    
        } else if(isFunction(setter)) {
    
            newStateFromSetter = setter.bind(component)(component.props, component.state);
    
        } else {
    
            throw TypeError(`setState(...) expecting 1 parameter as Function or Object, you give ${ typeof setter }`);
    
        }
    
        if (Object.keys(newStateFromSetter).length) {
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
    
        throw Error(`setState(...) must be Object or Function that returns Object, if Object is empty or doesn't return nothing, update can be redundant`);
    
    }

    function getSnapshotBeforeUpdateLifecycle(component) {

        return component.getSnapshotBeforeUpdate() || null;
    
    }

    function willGetPropsLifecycle(component, nextProps) {

        return component.componentWillGetProps(nextProps) || null;
    
    }

    function treeWillUnMount(virtualNode) {

        if (isObject(virtualNode)) {
    
            if (isComponent(virtualNode.type)) {
    
                componentWillUnMount(virtualNode);
    
                treeWillUnMount(virtualNode._internals.virtualNode);
    
            } else {
    
                const children = isArray(virtualNode) ? virtualNode : virtualNode.props.children;
    
                for (let i = 0; i < children.length; i++) {
    
                    treeWillUnMount(children[i].virtualNode);
    
                }
    
            }
    
        }
    
    }

    function componentWillUnMount(component) {

        component.onComponentWillUnMount(component._internals.realDOM);
    
        component.setState = function () {
    
            component.setState = function () {};
    
            const nameOfComponent = component.constructor.name;
    
            throw Error(`Remove all asynchronnous functions that causes setState(...) of ${ nameOfComponent } in onComponentWillUnMount, else it causes memory leak`);
    
        };
    
    }

    function applyComponentUpdate(updateObject, resolve, reject) {

        if (!updateObject) return reject;
    
        const [patch, snapshot] = updateObject;
    
        if (!patch) return reject;
    
        return resolve(patch, snapshot);
    
    }

    function updateComponent(oldComponent, nextProps, nextState) {

        /**
         * newComponent is plain javascript object { type, props, _key }
         * we use the new props that we can get updated from parent component
         */
    
        /**
         * should component update, if return false, component will be never updated
         */
    
        if(!oldComponent.shouldComponentUpdate(nextProps, nextState)) {
    
            oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextState);
    
            oldComponent.onComponentCancelUpdate();
    
            return false;
    
        }
    
        /**
         * if you want get the snapshot of component before update
         */
    
        const snapshot = getSnapshotBeforeUpdateLifecycle(oldComponent);
        /**
         * if should component update return true, component will be updated as normally
         */
    
        assignNewPropsAndStates(oldComponent, nextProps, nextState);
    
        /**
         * instead of creating new instance of component, create only new virual element of component and diff it with old one
         */
    
        oldComponent.onComponentWillUpdate(snapshot);
    
        const newVNode = oldComponent.Element(oldComponent.props, oldComponent.state);
    
        /**
         * using diffChildren we can manipulate with appendChild and insertBefore
         */
        
         return [diff(oldComponent._internals.virtualNode, newVNode), snapshot];
    
    }

    function createDomElement(virtualNode) {

        /**
         * create element
         */
    
        const el = document.createElement(virtualNode.type);
    
        /**
         * add attributes, but like element properties for easy manipulation
         */
        const props = virtualNode.props;
        const newProps = {};
    
        Object.keys(props)
            .filter(isProperty)
            .forEach(key => {
    
                newProps[key] = props[key];
    
                if (isEvent(key)) {
    
                    return el.addEventListener(getEventName(key), props[key]);
    
                }
    
                if (isObject(props[key])) {
    
                    return Object.assign(el[key], props[key]);
    
                }
    
                return el[key] = props[key];
    
            });
    
    
        const children = props.children;
        const resChildren = [];
    
        if (children) {
    
            for (let i = 0; i < children.length; i++) {
    
                const elementDefinition = render(children[i]);
    
                if (isArray(elementDefinition)) {
    
                    mountArrays(elementDefinition, el);
    
                } else {
    
                    mount(elementDefinition, el, () => el.appendChild(elementDefinition.realDOM));
                    
                }
    
                resChildren.push(elementDefinition);
    
            }
    
        }
    
        const key = virtualNode._key;
    
        return {
            virtualNode: {
                type: virtualNode.type,
                props: {
                    children: resChildren,
                    ...newProps
                }
            },
            realDOM: el,
            _key: key,
            _ref: virtualNode._ref
        };
    }
    
    function mountArrays(elementDefinition, el) {
    
        for (let j = 0; j < elementDefinition.length; j++) {
            const singleElementDefinition = elementDefinition[j];
    
            mount(singleElementDefinition, el, () => el.appendChild(singleElementDefinition.realDOM));
                
        }
    
    }

    function mount(newNodeDefinition, container, mounterFunction) {

        const virtualNode = newNodeDefinition.virtualNode;
    
        if (isObject(virtualNode) && isComponent(virtualNode.type)) {
    
            const componentIntarnals = virtualNode._internals;
            virtualNode.onComponentWillMount(componentIntarnals.realDOM, container);
    
            mounterFunction();
    
            virtualNode.onComponentMount(componentIntarnals.realDOM, container);
    
        } else {
    
            mounterFunction();
        }
    
    }

    function render(virtualNode) {

        /**
         * if virtual dom is undefined return no dom object
         */
        if (isNullOrUndef(virtualNode)) {
    
            throw Error(`virtual node cannot be null or undefined`);
    
        };
    
        /**
         * return mapped array of dom object created from virtual elements
         */
        
    
        /**
         * create text nodes 
         */
    
        if (!isObject(virtualNode)) {
    
            //text node
            return {
                realDOM: document.createTextNode(virtualNode),
                virtualNode
            };
    
        }
    
        if (isArray(virtualNode)) {
    
            const res = [];
    
            for(let i = 0; i < virtualNode.length; i++) {
    
                res.push(render(virtualNode[i]));
    
            }
    
            return res;
        
        }
    
        /**
         * create components and assign ref specifications
         */
    
        if (isComponent(virtualNode.type)) {
    
            const component = createComponentInstance(virtualNode);
            const componentInternals = component._internals;
            //component 
            const newNodeDefinition = render(componentInternals.virtualNode);
            Object.assign(componentInternals, newNodeDefinition);
    
            /**
             * means if virtual is not element but component, it become Class.Component from {type, props, _key}
             * we must overwrite the virtal beacause of this
             */
            component.onComponentRender(newNodeDefinition.realDOM);
    
            component.setState = (setter) => setState(component, setter);
    
            return {
                virtualNode: component,
                realDOM: newNodeDefinition.realDOM,
                _key: virtualNode._key
            };
    
        }
    
        /**
         * creates basic elements
         */
    
        const newNodeDefinition = createDomElement(virtualNode);
    
        if (newNodeDefinition._ref) {
    
            newNodeDefinition._ref(newNodeDefinition.realDOM);
    
        }
    
        //virtualNode
        return newNodeDefinition;
    
    }

    function getEventName(key) {

        return key.replace('on', '');
    
    }

    function isEvent(key) {

        return key.startsWith('on');
    
    }

    function isProperty(key) {

        return key !== 'children';
    
    }

    function diff(vOldNode, vNewNode) {

        /*
         *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
         */
    
        if (vNewNode === undefined) {
    
            return function (node) {
    
                treeWillUnMount(vOldNode.virtualNode);
    
                node.remove();
    
                return undefined;
    
            }
    
        }
    
        /**
         * cache all statements
         */
    
        const isVOldNodeObject = isObject(vOldNode), isVNewNodeObject = isObject(vNewNode);
    
        if (!isVOldNodeObject || !isVNewNodeObject) {
    
            return diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject);
    
        }
    
        const isVOldNodeComponent = isComponent(vOldNode.type), isVNewNodeComponent = isComponent(vNewNode.type);
    
        if (isVOldNodeComponent || isVNewNodeComponent) {
    
            return diffComponents(vOldNode, vNewNode, isVOldNodeComponent, isVNewNodeComponent);
    
        }
    
    
    
        /*
         *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
         */
    
        if (vOldNode.type !== vNewNode.type) {
    
            return function (node) {
    
                const newNodeDefinition = render(vNewNode);
    
                mount(newNodeDefinition, 
                    node.parentNode, 
                    () => { 
                        node.replaceWith(newNodeDefinition.realDOM);
                    });
    
                return newNodeDefinition;
    
            }
    
        }
        
        const propsPatches = diffProps(vOldNode.props, vNewNode.props);
    
        if(!propsPatches) {
    
            return null;
    
        }
    
        return function (node) {
    
            vOldNode.props = propsPatches(node);
    
            return { virtualNode: vOldNode, realDOM: node, _key: vNewNode._key };
    
        }
    };

    function diffComponents(oldComponent, newComponent, isVOldNodeComponent, isVNewNodeComponent) {

        /**
         * both new and old virutal nodes are components
         */
    
        if (isVOldNodeComponent && isVNewNodeComponent) {
    
            /**
             * if new and old components has the same type, update the old component
             */
    
            if (oldComponent.type === newComponent.type) {
    
                const nextState = willGetPropsLifecycle(oldComponent, newComponent.props);
    
                const update = updateComponent(oldComponent, newComponent.props, nextState);
    
                return applyComponentUpdate(update, (patch, snapshot) => function (node) {
    
                    const patchedChild = patch(node);
    
                    Object.assign(oldComponent._internals, {
                        virtualNode: patchedChild.virtualNode,
                        realDOM: patchedChild.realDOM
                    });
    
                    oldComponent.onComponentUpdate(snapshot);
    
                    return {
                        virtualNode: oldComponent,
                        realDOM: node,
                        _key: newComponent._key
                    };
    
                }, null);
    
            }
    
            /**
             * if new component has another type than old component unmount old component and create new component
             */
            
            const vNewNodeInstance = createComponentInstance(newComponent);
    
            const vNewNodeInstanceInternals = vNewNodeInstance._internals;
            const vOldNodeInstanceInternals = oldComponent._internals;
    
            const diffPatch = diff(vOldNodeInstanceInternals.virtualNode, vNewNodeInstance._internals.virtualNode);
    
            componentWillUnMount(oldComponent);
    
            return function (node) {
    
                vNewNodeInstance.onComponentWillMount(node, node.parentNode);
    
                const patchedChild = diffPatch ? diffPatch(node) : vOldNodeInstanceInternals;
    
                Object.assign(vNewNodeInstanceInternals, {
                    virtualNode: patchedChild.virtualNode,
                    realDOM: patchedChild.realDOM
                });
    
                const realDOMofNewComponent = vNewNodeInstanceInternals.realDOM;
                vNewNodeInstance.onComponentMount(realDOMofNewComponent, realDOMofNewComponent.parentNode);
    
                return {
                    virtualNode: vNewNodeInstance,
                    realDOM: realDOMofNewComponent,
                    _key: newComponent._key
                };
            }
    
        }
    
        /**
         * if old is component and new is not, unmount old component and return only virtual node (not component)
         */
    
        if (isVOldNodeComponent && !isVNewNodeComponent) {
            
            const vOldNodeInstanceInternals = oldComponent._internals;
    
            const diffPatch = diff(vOldNodeInstanceInternals.virtualNode, newComponent);
    
            componentWillUnMount(oldComponent);
    
            if(diffPatch) {
    
                return node => diffPatch(node);
    
            } else {
    
                return node => ({
                    virtualNode: vOldNodeInstanceInternals.virtualNode,
                    realDOM: node,
                    _key: newComponent._key
                });
    
            }
    
        }
    
        /**
         * if old virtual node is not component and new is, create instance of new component and replace it with the virtual node
         */
    
    
        const vNewNodeInstance = createComponentInstance(newComponent);
        const vNewNodeInstanceInternals = vNewNodeInstance._internals;
    
        const diffPatch = diff(oldComponent, vNewNodeInstanceInternals.virtualNode);
    
        return function (node) {
    
            vNewNodeInstance.onComponentWillMount(node, node.parentNode);
    
            const patchedChild = diffPatch ? diffPatch(node) : { virtualNode: oldComponent, realDOM: node };
    
            Object.assign(vNewNodeInstanceInternals, {
                virtualNode: patchedChild.virtualNode,
                realDOM: patchedChild.realDOM
            });
    
            const realDOMofComponent = vNewNodeInstanceInternals.realDOM;
            vNewNodeInstance.onComponentMount(realDOMofComponent, realDOMofComponent.parentNode);
    
            return {
                virtualNode: vNewNodeInstance,
                realDOM: realDOMofComponent,
                _key: newComponent._key
            };
    
        }
    
    }

    function diffChildren(oldVChildren, newVChildren) {

        const updatedVChildren = [];
        const childPatches = [];
    
        const additionalPatches = [];
    
        const [keyedOld, freeOld] = keyToIndex(oldVChildren);
        const [keyedNew, freeNew] = keyToIndex(newVChildren);
    
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
    
                    mount(newNodeDefinition,
                        parent,
                        () => {
                            parent.appendChild(newNodeDefinition.realDOM);
                        });
    
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
    
        for (const key in keyedOld) {
    
            const inOldVChildrenIndex = keyedOld[key];
            const inNewVChildrenIndex = keyedNew[key];
            const vOldNode = oldVChildren[inOldVChildrenIndex];
    
            const childPatch = diff(vOldNode.virtualNode, newVChildren[inNewVChildrenIndex]);
    
            if (childPatch) {
    
                vOldNode.patch = function (node) {
    
                    const childAfterPatch = childPatch(node);
    
                    if (childAfterPatch !== undefined) {
    
                        updatedVChildren[inNewVChildrenIndex] = childAfterPatch;
    
                    }
    
                };
    
                childPatches.push(inOldVChildrenIndex);
    
            } else {
    
                updatedVChildren[inNewVChildrenIndex] = vOldNode;
    
            }
    
            delete keyedNew[key];
    
        }
    
        for(const key in keyedNew) {
    
            const inNewVChildrenIndex = keyedNew[key];
    
            const newNodeDefinition = render(newVChildren[inNewVChildrenIndex]);
            updatedVChildren[inNewVChildrenIndex] = newNodeDefinition;
    
            additionalPatches.push(function (parent) {
    
                mount(newNodeDefinition, 
                    parent, 
                    () => { 
                        parent.insertBefore(newNodeDefinition.realDOM, parent.childNodes[inNewVChildrenIndex]);
                    });
    
            });
    
        }
    
        if (additionalPatches.length + childPatches.length === 0) {
    
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
    
            return updatedVChildren;
    
        }
    
    }

    function diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject) {

        /*
         *   if both are not a virtual node, it is text node, so replace its value 
         */ 
    
         if (!isVOldNodeObject && !isVNewNodeObject) {
    
            if (vOldNode !== vNewNode) {
    
                return function (node) {
    
                    node.nodeValue = vNewNode;
                    return { virtualNode: vNewNode, realDOM: node };
    
                }
    
            } else {
    
                return null;
    
            }
    
        }
    
        /*
         *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
         */
        
        return function (node) {
    
            const newNodeDefinition = render(vNewNode);
    
            mount(newNodeDefinition, 
                node.parentNode, 
                () => { 
                    node.replaceWith(newNodeDefinition.realDOM);
                });
    
            return newNodeDefinition;
    
        }
    
    }

    function diffProps(oldProps, newProps) {

        const propsPatches = [];
        const updatedProps = {};
    
        Object.keys(newProps)
            .filter(isProperty)
            .forEach(key => {
    
                let propChange = false;
    
                if (isEvent(key)) {
    
                    if (!(key in oldProps) || oldProps[key] !== newProps[key]) {
    
                        propsPatches.push(function (node) {
    
                            node.addEventListener(getEventName(key), newProps[key]);
    
                        });
    
                        propChange = true;
    
                    }
    
                } else if (isObject(newProps[key])) { // if is object set property by object assign
    
                    propsPatches.push(function (node) {
    
                        Object.assign(node[key], newProps[key]);
    
                    });
    
                    propChange = true;
    
                } else if (newProps[key] !== oldProps[key] || !(key in oldProps)) {
    
                    propsPatches.push(function (node) {
    
                        node[key] = newProps[key];
    
                    });
    
                    propChange = true;
    
                }
    
                if (propChange) {
    
                    updatedProps[key] = newProps[key];
    
                } else {
    
                    updatedProps[key] = oldProps[key];
    
                }
    
            });
    
    
        if ((oldProps.children.length + newProps.children.length) === 0) {
    
            updatedProps.children = oldProps.children;
    
        } else {
    
            const childrenPatches = diffChildren(oldProps.children, newProps.children);
            if (childrenPatches) {
    
                propsPatches.push(function (parent) {
    
                    updatedProps.children = childrenPatches(parent);
    
                });
    
            } else {
    
                updatedProps.children = oldProps.children;
    
            }
    
        }
    
        Object.keys(oldProps)
            .filter(isProperty)
            .forEach(key => {
                if (isEvent(key)) {
    
                    if (!(key in newProps) || oldProps[key] !== newProps[key]) { // is event, remove event listener
    
                        propsPatches.push(function (node) {
    
                            node.removeEventListener(getEventName(key), oldProps[key]);
    
                        });
    
                    }
                } else if (!(key in newProps)) { // else remove attribute from element
    
                    propsPatches.push(function (node) {
    
                        node[key] = null;
    
                    });
    
                }
            });
    
        if (!propsPatches.length) return null;
    
        return function (node) {
    
            for (let i = 0; i < propsPatches.length; i++) {
    
                propsPatches[i](node);
    
            }
    
            return updatedProps;
    
        };
    
    }

    function keyToIndex(arr) {

        const keyed = {};
        const free = [];
    
        for(let i = 0; i < arr.length; i++) {
    
            const arrItem = arr[i];
            const key = arrItem._key;
    
            if(key) {
    
                if(!(key in keyed)) {
                    
                    keyed[key] = i;
    
                }
    
            } else {
    
                free.push(i);
    
            }
    
        }
    
        return [
            keyed,
            free
        ];
    
    }
    
    function renderToPage(virtualElement, container, callback) {

        window.requestAnimationFrame(() => {

            if (!container || container.nodeType !== Node.ELEMENT_NODE) {

                throw TypeError(`render(...) container must be valid Element that is already rendered on page, try to use DOMContentLoaded event on window to wait for all Elements load`);

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

                    callback();

                }
                
            });

        },

        createElement,

        replace: function(virtualElement, container) {

            renderToPage(virtualElement, container, newNodeDefinition => {

                mount(newNodeDefinition, container, () => container.replaceWith(newNodeDefinition.realDOM));

                if(callback) {

                    callback();

                }

            });
        }

    };

}));