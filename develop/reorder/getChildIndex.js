

export default function getChildIndex(node, parent) {

    return Array.prototype.indexOf.call(parent.childNodes, node);
    
}