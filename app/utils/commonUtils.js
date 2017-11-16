function findPositionOfObjectInArray(id, arrayList) {

    let positionInArray;
    let arrayOfObjects = arrayList;
    let arrLength = arrayOfObjects.length;
    let queryId = parseInt(id);


    for (let i = 0; i < arrLength; i++) {
        if (parseInt(arrayOfObjects[i].id) === queryId) {
            positionInArray = i;
        }
    }

    return positionInArray;
}

module.exports.findPositionOfObjectInArray = findPositionOfObjectInArray;