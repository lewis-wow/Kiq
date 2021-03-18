

export default function moveChoiceTo(elem, direction, currIndex) {

    const shilfLayout = direction < 0 ? direction + currIndex : direction - currIndex;

    return function(parent) {

        parent.insertBefore(elem, parent.childNodes[shilfLayout]);

    };

    if(direction < 0) {

        return function(parent) {

            let i = 0;

            while(i > direction && elem.previousSibling) {

                parent.insertBefore(elem, elem.previousSibling);
                i--;

            }

        }

    } else if(direction > 0) {

        return function(parent) {

            let i = 0;

            while(i < direction && elem.nextSibling) {

                parent.insertBefore(elem, elem.nextSibling.nextSibling);
                i++;

            }

        }

    }

}