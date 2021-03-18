

export default function keyToIndex(arr) {

    const keyed = {};
    const free = [];
    let keysAreUsed = false;

    for(let i = 0; i < arr.length; i++) {

        const arrItem = arr[i];
        const key = arrItem === undefined || arrItem._key === undefined ? null : arrItem._key;

        if(key !== null) {
            keysAreUsed = true;
            //if(!(key in keyed)) {
                
                keyed[key] = i;

            //}

        } else {

            free.push(i);

        }

    }

    return [
        keyed,
        free,
        keysAreUsed
    ];

}