
  /**
   * Ludvík Prokopec
   * License: MIT
   */

  (function (global, factory) {
    function _typeof(obj) {
      "@babel/helpers - typeof";
  
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj &&
            typeof Symbol === "function" &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? "symbol"
            : typeof obj;
        };
      }
  
      return _typeof(obj);
    }
  
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ===
      "object" && typeof module !== "undefined"
      ? (module.exports = factory(_typeof))
      : typeof define === "function" && define.amd
      ? define(function () {
          return factory(_typeof);
        })
      : ((global = global || self), (global.Kiq = factory(_typeof)));
  })(this, function (_typeof) {
    "use strict";
    
    function _extends() {
        _extends =
          Object.assign ||
          function (target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }
            return target;
          };
        return _extends.apply(this, arguments);
      }

    function _slicedToArray(arr, i) {
      return (
        _arrayWithHoles(arr) ||
        _iterableToArrayLimit(arr, i) ||
        _unsupportedIterableToArray(arr, i) ||
        _nonIterableRest()
      );
    }
  
    function _nonIterableRest() {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    }
  
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
  
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
  
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
  
      return arr2;
    }
  
    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
        return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;
  
      try {
        for (
          var _i = arr[Symbol.iterator](), _s;
          !(_n = (_s = _i.next()).done);
          _n = true
        ) {
          _arr.push(_s.value);
  
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
  
      return _arr;
    }
  
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
  
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
  
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
          symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        keys.push.apply(keys, symbols);
      }
  
      return keys;
    }
  
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
  
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(
            target,
            Object.getOwnPropertyDescriptors(source)
          );
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(
              target,
              key,
              Object.getOwnPropertyDescriptor(source, key)
            );
          });
        }
      }
  
      return target;
    }
  
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
  
      return obj;
    }
  
    function isArray(array) {
      return Array.isArray(array);
    }
  
    function isComponent(__t) {
      if (isFunction(__t) && __t.prototype.isKiqComponent) return true;
      return false;
    }
  
    function isFunction(func) {
      return typeof func === "function";
    }
  
    function isNullOrUndef(value) {
      return value === null || value === undefined;
    }
  
    function isObject(object) {
      return _typeof(object) === "object" && object !== null;
    }
  
    function createElement(__t) {
      var props =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      props = props || {};
      var _key = null;
      var _ref = null;
  
      if ("_key" in props) {
        _key = props._key.toString();
      }
  
      if ("_ref" in props) {
        _ref = props._ref;
      }
  
      for (
        var _len = arguments.length,
          children = new Array(_len > 2 ? _len - 2 : 0),
          _key2 = 2;
        _key2 < _len;
        _key2++
      ) {
        children[_key2 - 2] = arguments[_key2];
      }
  
      if (children.length || !isComponent(__t)) {
        props = _objectSpread(
          {
            children: children
          },
          props
        );
      }
  
      return {
        __t: __t,
        props: props,
        _key: _key,
        _ref: _ref
      };
    }
  
    function setState(component, setter) {
      //setter can be object or function that returns object
      var newStateFromSetter;
  
      if (isObject(setter)) {
        newStateFromSetter = setter;
      } else if (isFunction(setter)) {
        newStateFromSetter = setter.bind(component)(
          component.props,
          component.state
        );
      } else {
        throw TypeError(
          "setState(...) expecting 1 parameter as Function or Object, you give ".concat(
            _typeof(setter)
          )
        );
      }
  
      if (Object.keys(newStateFromSetter).length) {
        var update = updateComponent(component, null, newStateFromSetter); //update component return patch which is function and snapshot that is given from getSnapshotBeforeUpdate
  
        applyComponentUpdate(
          update,
          function (patch, snapshot) {
            var componentInternals = component.__i;
            var patchedChild = patch(componentInternals.__r);
  
            _extends(componentInternals, {
              __v: patchedChild.__v,
              __r: patchedChild.__r
            });
  
            component.onComponentUpdate(snapshot);
          },
          null
        );
        return component;
      }
  
      throw Error(
        "setState(...) must be Object or Function that returns Object, if Object is empty or doesn't return nothing, update can be redundant"
      );
    }
  
    function createComponentInstance(component) {
      var instance = new component.__t(component.props);
      instance.__i.__v = instance.Element(instance.props, instance.state);
      instance.__t = component.__t;
      return instance;
    }
  
    function Component(props) {
      this.props = props;
      this.state = {};
      this.__i = {
        __r: null,
        __v: null
      };
      return this;
    }
    /**
     * Element method is the only one method that is required to be in component
     */
  
    Component.prototype.Element = function () {
      //not overrided Element method throws error cause Element must be defined in component
      throw Error(
        "You have to specify Element method in your Component, Element must return virtual element"
      );
    };
    /**
     * setState method for set new state of component and update it
     * real dom will react on state changes
     * @param { Object || Function } setter - set the new state of component
     */
  
    Component.prototype.setState = function () {
      throw Error(
        "setState(...) can be called only if component is rendered, will be mounted or is mounted"
      );
    };
  
    Component.prototype.onComponentRender = Component.prototype.onComponentWillUpdate = Component.prototype.onComponentUpdate = Component.prototype.onComponentWillMount = Component.prototype.onComponentMount = Component.prototype.onComponentCancelUpdate = Component.prototype.getSnapshotBeforeUpdate = Component.prototype.componentWillGetProps = Component.prototype.onComponentWillUnMount = function () {};
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
  
    function assignNewPropsAndStates(oldComponent, nextProps, nextState) {
      if (isObject(nextProps)) {
        _extends(oldComponent.props, nextProps);
      }
  
      if (isObject(nextState)) {
        _extends(oldComponent.state, nextState);
      }
  
      return oldComponent;
    }
  
    function getSnapshotBeforeUpdateLifecycle(component) {
      return component.getSnapshotBeforeUpdate() || null;
    }
  
    function willGetPropsLifecycle(component, nextProps) {
      return component.componentWillGetProps(nextProps) || null;
    }
  
    function treeWillUnMount(__v) {
      if (isObject(__v)) {
        if (isComponent(__v.__t)) {
          componentWillUnMount(__v);
          treeWillUnMount(__v.__i.__v);
        } else {
          var children = isArray(__v) ? __v : __v.props.children;
  
          for (var i = 0; i < children.length; i++) {
            treeWillUnMount(children[i].__v);
          }
        }
      }
    }
  
    function componentWillUnMount(component) {
      component.onComponentWillUnMount(component.__i.__r);
  
      component.setState = function () {
        component.setState = function () {};
  
        var nameOfComponent = component.constructor.name;
        throw Error(
          "Remove all asynchronnous functions that causes setState(...) of ".concat(
            nameOfComponent,
            " in onComponentWillUnMount, else it causes memory leak"
          )
        );
      };
    }
  
    function applyComponentUpdate(updateObject, resolve, reject) {
      if (!updateObject) return reject;
  
      var _updateObject = _slicedToArray(updateObject, 2),
        patch = _updateObject[0],
        snapshot = _updateObject[1];
  
      if (!patch) return reject;
      return resolve(patch, snapshot);
    }
  
    function updateComponent(oldComponent, nextProps, nextState) {
      /**
       * newComponent is plain javascript object { __t, props, _key }
       * we use the new props that we can get updated from parent component
       */
  
      /**
       * should component update, if return false, component will be never updated
       */
      if (!oldComponent.shouldComponentUpdate(nextProps, nextState)) {
        oldComponent = assignNewPropsAndStates(
          oldComponent,
          nextProps,
          nextState
        );
        oldComponent.onComponentCancelUpdate();
        return false;
      }
      /**
       * if you want get the snapshot of component before update
       */
  
      var snapshot = getSnapshotBeforeUpdateLifecycle(oldComponent);
      /**
       * if should component update return true, component will be updated as normally
       */
  
      assignNewPropsAndStates(oldComponent, nextProps, nextState);
      /**
       * instead of creating new instance of component, create only new virual element of component and diff it with old one
       */
  
      oldComponent.onComponentWillUpdate(snapshot);
      var newVNode = oldComponent.Element(oldComponent.props, oldComponent.state);
      /**
       * using diffChildren we can manipulate with appendChild and insertBefore
       */
  
      return [diff(oldComponent.__i.__v, newVNode), snapshot];
    }
  
    function _render(__v) {
      /**
       * if virtual dom is undefined return no dom object
       */
      if (isNullOrUndef(__v)) {
        throw Error("virtual node cannot be null or undefined");
      }
      /**
       * return mapped array of dom object created from virtual elements
       */
  
      /**
       * create text nodes
       */
  
      if (!isObject(__v)) {
        //text node
        return {
          __r: document.createTextNode(__v),
          __v: __v
        };
      }
  
      if (isArray(__v)) {
        var res = [];
  
        for (var i = 0; i < __v.length; i++) {
          res.push(_render(__v[i]));
        }
  
        return res;
      }
      /**
       * create components and assign ref specifications
       */
  
      if (isComponent(__v.__t)) {
        var component = createComponentInstance(__v);
        var componentInternals = component.__i; //component
  
        var _newNodeDefinition = _render(componentInternals.__v);
  
        _extends(componentInternals, _newNodeDefinition);
        /**
         * means if virtual is not element but component, it become Class.Component from {__t, props, _key}
         * we must overwrite the virtal beacause of this
         */
  
        component.onComponentRender(_newNodeDefinition.__r);
  
        component.setState = function (setter) {
          return setState(component, setter);
        };
  
        return {
          __v: component,
          __r: _newNodeDefinition.__r,
          _key: __v._key
        };
      }
      /**
       * creates basic elements
       */
  
      var newNodeDefinition = createDomElement(__v);
  
      if (newNodeDefinition._ref) {
        newNodeDefinition._ref(newNodeDefinition.__r);
      } //__v
  
      return newNodeDefinition;
    }
  
    function mount(newNodeDefinition, container, mounterFunction) {
      var __v = newNodeDefinition.__v;
  
      if (isObject(__v) && isComponent(__v.__t)) {
        var componentIntarnals = __v.__i;
  
        __v.onComponentWillMount(componentIntarnals.__r, container);
  
        mounterFunction();
  
        __v.onComponentMount(componentIntarnals.__r, container);
      } else {
        mounterFunction();
      }
    }
  
    function createDomElement(__v) {
      /**
       * create element
       */
      var el = document.createElement(__v.__t);
      /**
       * add attributes, but like element properties for easy manipulation
       */
  
      var props = __v.props;
      var newProps = {};
      Object.keys(props)
        .filter(isProperty)
        .forEach(function (key) {
          newProps[key] = props[key];
  
          if (isEvent(key)) {
            return el.addEventListener(getEventName(key), props[key]);
          }
  
          if (isObject(props[key])) {
            return _extends(el[key], props[key]);
          }
  
          return (el[key] = props[key]);
        });
      var children = props.children;
      var resChildren = [];
  
      if (children) {
        var _loop = function _loop(i) {
          var elementDefinition = _render(children[i]);
  
          if (isArray(elementDefinition)) {
            mountArrays(elementDefinition, el);
          } else {
            mount(elementDefinition, el, function () {
              el.appendChild(elementDefinition.__r);
            });
          }
  
          resChildren.push(elementDefinition);
        };
  
        for (var i = 0; i < children.length; i++) {
          _loop(i);
        }
      }
  
      var key = __v._key;
      return {
        __v: {
          __t: __v.__t,
          props: _objectSpread(
            {
              children: resChildren
            },
            newProps
          )
        },
        __r: el,
        _key: key,
        _ref: __v._ref
      };
    }
  
    function mountArrays(elementDefinition, el) {
      var _loop2 = function _loop2(j) {
        var singleElementDefinition = elementDefinition[j];
        mount(singleElementDefinition, el, function () {
          el.appendChild(singleElementDefinition.__r);
        });
      };
  
      for (var j = 0; j < elementDefinition.length; j++) {
        _loop2(j);
      }
    }
  
    function getEventName(key) {
      return key.replace("on", "");
    }
  
    function isEvent(key) {
      return key.indexOf("on") === 0;
    }
  
    function isProperty(key) {
      return key !== "children";
    }
  
    function diff(vOldNode, vNewNode) {
      /*
       *   if new __v is undefined (doesn't exists) and old __v exists, remove the realNode
       */
      if (vNewNode === undefined) {
        return function (node) {
          treeWillUnMount(vOldNode.__v);
          node.remove();
          return undefined;
        };
      }
      /**
       * cache all statements
       */
  
      var isVOldNodeObject = isObject(vOldNode),
        isVNewNodeObject = isObject(vNewNode);
  
      if (!isVOldNodeObject || !isVNewNodeObject) {
        return diffNonObjects(
          vOldNode,
          vNewNode,
          isVOldNodeObject,
          isVNewNodeObject
        );
      }
  
      var isVOldNodeComponent = isComponent(vOldNode.__t),
        isVNewNodeComponent = isComponent(vNewNode.__t);
  
      if (isVOldNodeComponent || isVNewNodeComponent) {
        return diffComponents(
          vOldNode,
          vNewNode,
          isVOldNodeComponent,
          isVNewNodeComponent
        );
      }
      /*
       *   if tagNames of virtualNodes doesn't match replace it with new rendered __v
       */
  
      if (vOldNode.__t !== vNewNode.__t) {
        return function (node) {
          var newNodeDefinition = _render(vNewNode);
  
          mount(newNodeDefinition, node.parentNode, function () {
            node.replaceWith(newNodeDefinition.__r);
          });
          return newNodeDefinition;
        };
      }
  
      var propsPatches = diffProps(vOldNode.props, vNewNode.props);
  
      if (!propsPatches) {
        return null;
      }
  
      return function (node) {
        vOldNode.props = propsPatches(node);
        return {
          __v: vOldNode,
          __r: node,
          _key: vNewNode._key
        };
      };
    }
  
    function diffComponents(
      oldComponent,
      newComponent,
      isVOldNodeComponent,
      isVNewNodeComponent
    ) {
      /**
       * both new and old virutal nodes are components
       */
      if (isVOldNodeComponent && isVNewNodeComponent) {
        /**
         * if new and old components has the same __t, update the old component
         */
        if (oldComponent.__t === newComponent.__t) {
          var nextState = willGetPropsLifecycle(oldComponent, newComponent.props);
          var update = updateComponent(
            oldComponent,
            newComponent.props,
            nextState
          );
          return applyComponentUpdate(
            update,
            function (patch, snapshot) {
              return function (node) {
                var patchedChild = patch(node);
  
                _extends(oldComponent.__i, {
                  __v: patchedChild.__v,
                  __r: patchedChild.__r
                });
  
                oldComponent.onComponentUpdate(snapshot);
                return {
                  __v: oldComponent,
                  __r: node,
                  _key: newComponent._key
                };
              };
            },
            null
          );
        }
        /**
         * if new component has another __t than old component unmount old component and create new component
         */
  
        var _vNewNodeInstance = createComponentInstance(newComponent);
  
        var _vNewNodeInstanceInternals = _vNewNodeInstance.__i;
        var vOldNodeInstanceInternals = oldComponent.__i;
  
        var _diffPatch = diff(
          vOldNodeInstanceInternals.__v,
          _vNewNodeInstance.__i.__v
        );
  
        componentWillUnMount(oldComponent);
        return function (node) {
          _vNewNodeInstance.onComponentWillMount(node, node.parentNode);
  
          var patchedChild = _diffPatch
            ? _diffPatch(node)
            : vOldNodeInstanceInternals;
  
          _extends(_vNewNodeInstanceInternals, {
            __v: patchedChild.__v,
            __r: patchedChild.__r
          });
  
          var realDOMofNewComponent = _vNewNodeInstanceInternals.__r;
  
          _vNewNodeInstance.onComponentMount(
            realDOMofNewComponent,
            realDOMofNewComponent.parentNode
          );
  
          return {
            __v: _vNewNodeInstance,
            __r: realDOMofNewComponent,
            _key: newComponent._key
          };
        };
      }
      /**
       * if old is component and new is not, unmount old component and return only virtual node (not component)
       */
  
      if (isVOldNodeComponent && !isVNewNodeComponent) {
        var _vOldNodeInstanceInternals = oldComponent.__i;
  
        var _diffPatch2 = diff(_vOldNodeInstanceInternals.__v, newComponent);
  
        componentWillUnMount(oldComponent);
  
        if (_diffPatch2) {
          return function (node) {
            return _diffPatch2(node);
          };
        } else {
          return function (node) {
            return {
              __v: _vOldNodeInstanceInternals.__v,
              __r: node,
              _key: newComponent._key
            };
          };
        }
      }
      /**
       * if old virtual node is not component and new is, create instance of new component and replace it with the virtual node
       */
  
      var vNewNodeInstance = createComponentInstance(newComponent);
      var vNewNodeInstanceInternals = vNewNodeInstance.__i;
      var diffPatch = diff(oldComponent, vNewNodeInstanceInternals.__v);
      return function (node) {
        vNewNodeInstance.onComponentWillMount(node, node.parentNode);
        var patchedChild = diffPatch
          ? diffPatch(node)
          : {
              __v: oldComponent,
              __r: node
            };
  
        _extends(vNewNodeInstanceInternals, {
          __v: patchedChild.__v,
          __r: patchedChild.__r
        });
  
        var realDOMofComponent = vNewNodeInstanceInternals.__r;
        vNewNodeInstance.onComponentMount(
          realDOMofComponent,
          realDOMofComponent.parentNode
        );
        return {
          __v: vNewNodeInstance,
          __r: realDOMofComponent,
          _key: newComponent._key
        };
      };
    }
  
    function diffChildren(oldVChildren, newVChildren) {
      var updatedVChildren = [];
      var childPatches = [];
      var additionalPatches = [];
  
      var _keyToIndex = keyToIndex(oldVChildren),
        _keyToIndex2 = _slicedToArray(_keyToIndex, 2),
        keyedOld = _keyToIndex2[0],
        freeOld = _keyToIndex2[1];
  
      var _keyToIndex3 = keyToIndex(newVChildren),
        _keyToIndex4 = _slicedToArray(_keyToIndex3, 2),
        keyedNew = _keyToIndex4[0],
        freeNew = _keyToIndex4[1];
  
      var maxFreeLen = Math.max(freeNew.length, freeOld.length);
  
      var _loop3 = function _loop3(i) {
        var vOldNode = oldVChildren[i];
  
        if (isArray(vOldNode)) {
          var recursionPatch = diffChildren(vOldNode, newVChildren[i]);
  
          if (recursionPatch) {
            additionalPatches.push(function (parent) {
              updatedVChildren[i] = recursionPatch(parent);
            });
          } else {
            updatedVChildren[i] = vOldNode;
          }
        } else if (vOldNode === undefined) {
          var newNodeDefinition = _render(newVChildren[i]);
  
          updatedVChildren[i] = newNodeDefinition;
          additionalPatches.push(function (parent) {
            mount(newNodeDefinition, parent, function () {
              parent.appendChild(newNodeDefinition.__r);
            });
          });
        } else {
          var childPatch = diff(vOldNode.__v, newVChildren[i]);
  
          if (childPatch) {
            vOldNode.patch = function (node) {
              var childAfterPatch = childPatch(node);
  
              if (childAfterPatch !== undefined) {
                updatedVChildren[i] = childAfterPatch;
              }
            };
  
            childPatches.push(i);
          } else {
            updatedVChildren[i] = vOldNode;
          }
        }
      };
  
      for (var i = 0; i < maxFreeLen; i++) {
        _loop3(i);
      }
  
      var _loop4 = function _loop4(key) {
        var inOldVChildrenIndex = keyedOld[key];
        var inNewVChildrenIndex = keyedNew[key];
        var vOldNode = oldVChildren[inOldVChildrenIndex];
        var childPatch = diff(vOldNode.__v, newVChildren[inNewVChildrenIndex]);
  
        if (childPatch) {
          vOldNode.patch = function (node) {
            var childAfterPatch = childPatch(node);
  
            if (childAfterPatch !== undefined) {
              updatedVChildren[inNewVChildrenIndex] = childAfterPatch;
            }
          };
  
          childPatches.push(inOldVChildrenIndex);
        } else {
          updatedVChildren[inNewVChildrenIndex] = vOldNode;
        }
  
        delete keyedNew[key];
      };
  
      for (var key in keyedOld) {
        _loop4(key);
      }
  
      var _loop5 = function _loop5(_key3) {
        var inNewVChildrenIndex = keyedNew[_key3];
  
        var newNodeDefinition = _render(newVChildren[inNewVChildrenIndex]);
  
        updatedVChildren[inNewVChildrenIndex] = newNodeDefinition;
        additionalPatches.push(function (parent) {
          mount(newNodeDefinition, parent, function () {
            parent.insertBefore(
              newNodeDefinition.__r,
              parent.childNodes[inNewVChildrenIndex]
            );
          });
        });
      };
  
      for (var _key3 in keyedNew) {
        _loop5(_key3);
      }
  
      if (additionalPatches.length + childPatches.length === 0) {
        return null;
      }
  
      return function (parent) {
        for (var _i2 = 0; _i2 < childPatches.length; _i2++) {
          var oldVChild = oldVChildren[childPatches[_i2]];
          oldVChild.patch(oldVChild.__r);
        }
  
        for (var _i3 = 0; _i3 < additionalPatches.length; _i3++) {
          additionalPatches[_i3](parent);
        }
  
        return updatedVChildren;
      };
    }
  
    function diffNonObjects(
      vOldNode,
      vNewNode,
      isVOldNodeObject,
      isVNewNodeObject
    ) {
      /*
       *   if both are not a virtual node, it is text node, so replace its value
       */
      if (!isVOldNodeObject && !isVNewNodeObject) {
        if (vOldNode !== vNewNode) {
          return function (node) {
            node.nodeValue = vNewNode;
            return {
              __v: vNewNode,
              __r: node
            };
          };
        } else {
          return null;
        }
      }
      /*
       *   if one of virtualNodes is not __v (means Number or String) replace it as textNode
       */
  
      return function (node) {
        var newNodeDefinition = _render(vNewNode);
  
        mount(newNodeDefinition, node.parentNode, function () {
          node.replaceWith(newNodeDefinition.__r);
        });
        return newNodeDefinition;
      };
    }
  
    function diffProps(oldProps, newProps) {
      var propsPatches = [];
      var updatedProps = {};
      Object.keys(newProps)
        .filter(isProperty)
        .forEach(function (key) {
          var propChange = false;
  
          if (isEvent(key)) {
            if (!(key in oldProps)) {
              propsPatches.push(function (node) {
                node.addEventListener(getEventName(key), newProps[key]);
              });
              propChange = true;
            }
          } else if (isObject(newProps[key])) {
            // if is object set property by object assign
            propsPatches.push(function (node) {
              _extends(node[key], newProps[key]);
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
  
      if (oldProps.children.length + newProps.children.length === 0) {
        updatedProps.children = oldProps.children;
      } else {
        var childrenPatches = diffChildren(oldProps.children, newProps.children);
  
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
        .forEach(function (key) {
          if (!(key in newProps)) {
            if (isEvent(key)) {
              // is event, remove event listener
              propsPatches.push(function (node) {
                node.removeEventListener(getEventName(key), oldProps[key]);
              });
            } else {
              // else remove attribute from element
              propsPatches.push(function (node) {
                node[key] = null;
                node.removeAttribute(key);
              });
            }
          }
        });
      if (!propsPatches.length) return null;
      return function (node) {
        for (var i = 0; i < propsPatches.length; i++) {
          propsPatches[i](node);
        }
  
        return updatedProps;
      };
    }
  
    function keyToIndex(arr) {
      var keyed = {};
      var free = [];
  
      for (var i = 0; i < arr.length; i++) {
        var arrItem = arr[i];
        var key = arrItem._key;
  
        if (key) {
          if (!(key in keyed)) {
            keyed[key] = i;
          }
        } else {
          free.push(i);
        }
      }
  
      return [keyed, free];
    }
  
    return {
      Component: Component,
      render: function render(virtualElement, container, callback) {
        window.requestAnimationFrame(function () {
          if (!container || container.nodeType !== Node.ELEMENT_NODE) {
            throw TypeError(
              "render(...) container must be valid Element that is already rendered on page, try to use DOMContentLoaded event on window to wait for all Elements load"
            );
          }
  
          var newNodeDefinition = _render(virtualElement);
  
          mount(newNodeDefinition.__v, container, function () {
            container.appendChild(newNodeDefinition.__r);
          });
  
          if (callback) {
            callback();
          }
        });
      },
      createElement: createElement
    };
  });
  