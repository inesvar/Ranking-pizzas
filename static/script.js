const anchorPointsPercentage = [
    { x: 20, y: 30, id: 0 },
    { x: 50, y: 30, id: 1 },
    { x: 80, y: 30, id: 2 },
    { x: 20, y: 65, id: 3 },
    { x: 50, y: 65, id: 4 },
    { x: 80, y: 65, id: 5 }
];

function getName(draggableTag) {
    return draggableTag.childNodes[1].childNodes[0].data;
}

function getNames(draggableTags) {
    let names = [];
    for (let tag of draggableTags) {
        names.push(getName(tag));
    }
    return names;
}

function debug() {
    console.log("anchorOf");
    draggables.forEach(draggable => {
        console.log(getName(draggable), ":", anchorOf.get(draggable))
    });
    console.log("anchorPointsTags");
    console.log("0 :", getNames(anchorPointsTags[0]));
    console.log("1 :", getNames(anchorPointsTags[1]));
    console.log("2 :", getNames(anchorPointsTags[2]));
    console.log("3 :", getNames(anchorPointsTags[3]));
    console.log("4 :", getNames(anchorPointsTags[4]));
    console.log("5 :", getNames(anchorPointsTags[5]));
}

const draggables = document.querySelectorAll('.draggable');

const anchorOf = new Map();

draggables.forEach(draggable => {
    anchorOf.set(draggable, 4);
});

let anchorPointsTags = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };

draggables.forEach((draggableTag) => {

    let offsetX, offsetY, isDragging = false;
    // TODO : this variable will become useless when
    // the tags will be correctly initialized (already in an anchor)
    // anchored can be replaced with !isDragging
    let anchored = false;

    // Event listener for mouse down event
    draggableTag.addEventListener('mousedown', (e) => {
        isDragging = true;
        unanchor(draggableTag);

        // Calculate the offset between the mouse position and the tag position
        offsetX = e.clientX - draggableTag.getBoundingClientRect().left - draggableTag.offsetWidth / 2;
        offsetY = e.clientY - draggableTag.getBoundingClientRect().top - draggableTag.offsetHeight / 2;

        // Print the offset values to the console
        console.log('OffsetX:', offsetX);
        console.log('OffsetY:', offsetY);
    });

    // Event listener for mouse move event
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Update the tag position based on the mouse movement
            draggableTag.style.left = e.clientX - offsetX + 'px';
            draggableTag.style.top = e.clientY - offsetY + 'px';

            // Print the updated tag position to the console
            // console.log('Tag Position - Left:', draggableTag.style.left, ', Top:', draggableTag.style.top);
        }
    });

    // Event listener for mouse up event
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            snapToAnchor(draggableTag);
            console.log('Dragging stopped');
        }
    });

    function unanchor(tag) {
        if (anchored) {
            console.log("unanchored");
            let anchorId = anchorOf.get(tag);
            console.log(anchorPointsTags, "anchorPointsTags");
            console.log(anchorId, "anchorId");
            anchorPointsTags[anchorId].splice(anchorPointsTags[anchorId].indexOf(tag), 1);
            anchorOf.set(tag, undefined);
        }
    }

    function anchorTo(tag, anchor) {
        anchorOf.set(tag, anchor.id);
        anchorPointsTags[anchor.id].push(tag);
        console.log("anchor:", anchorPointsTags[anchor.id].length, "tags");
        anchored = true;
        draggables.forEach((draggableTag) => {
            if (anchorOf.get(draggableTag) !== undefined) {
                if (anchorOf.get(draggableTag) !== 4) {
                    console.log("anchor of", getName(draggableTag), ":", anchorOf.get(draggableTag));
                }
                replaceInAnchors(draggableTag);
            }
        });
    }

    function snapToAnchor(tag) {

        // Calculate viewport dimensions
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        // Convert percentage values to absolute coordinates
        const anchorPoints = anchorPointsPercentage.map(({ x, y, id }) => ({
            x: (x / 100) * viewportWidth,
            y: (y / 100) * viewportHeight,
            id: id
        }));

        // Find the nearest anchor point
        const nearestAnchor = anchorPoints.reduce((nearest, anchor) => {
            const distance = Math.hypot(
                tag.offsetLeft - anchor.x,
                tag.offsetTop - anchor.y
            );

            if (distance < nearest.distance) {
                return { anchor, distance };
            }

            return nearest;
        }, { anchor: null, distance: Infinity });

        // Snap to the nearest anchor point
        if (nearestAnchor.anchor) {
            anchorTo(tag, nearestAnchor.anchor);
        }
    }

    // Add event listener for window resize
    window.addEventListener('resize', (window) => {
        let anchorId = anchorOf.get(draggableTag);
        if (anchorId !== undefined) {
            console.log("anchor of", getName(draggableTag), ":", anchorOf.get(draggableTag));
            replaceInAnchors(draggableTag);
        }
    });

    function replaceInAnchors(tag) {
        // Calculate viewport dimensions
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        const anchorPoints = anchorPointsPercentage.map(({ x, y, id }) => ({
            x: (x / 100) * viewportWidth + tag.offsetWidth / 2,
            y: (y / 100) * viewportHeight + tag.offsetHeight / 2,
            id: id
        }));
        let anchorId = anchorOf.get(tag);
        if (anchorId !== undefined) {
            // console.log("replacing tag", getName(tag));
            let place = anchorPointsTags[anchorId].indexOf(tag);
            tag.style.left = anchorPoints[anchorId].x - tag.offsetWidth / 2 + 'px';
            tag.style.top = anchorPoints[anchorId].y - 2.5 * tag.offsetHeight / 2 + place * tag.offsetHeight + 'px';
            // console.log("position corrected", tag.style.left, tag.style.top);
        }
    }

    // Calculate viewport dimensions
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Convert percentage values to absolute coordinates
    const anchorPoints = anchorPointsPercentage.map(({ x, y, id }) => ({
        x: (x / 100) * viewportWidth,
        y: (y / 100) * viewportHeight,
        id: id
    }));

    anchorTo(draggableTag, anchorPoints[Math.floor(Math.random() * 6)]);
});
