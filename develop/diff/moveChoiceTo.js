

export default function moveChoiceTo(elem, direction) {

    const parent = elem.parentNode;

    if(direction < 0) {

        for(let i = direction; i < 0; i++) {

            if(!elem.previousSibling) break;

            parent.insertBefore(elem, elem.previousSibling);

        }

    } else if(direction > 0) {

        for(let i = 0; i < direction; i++) {

            if(!elem.nextSibling) break;

            parent.insertBefore(elem, elem.nextSibling.nextSibling);

        }

    }

}