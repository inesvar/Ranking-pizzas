document.addEventListener('DOMContentLoaded', function () {
    // This function will run after the HTML document has been fully loaded

    // Get the draggable tag element
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(function (draggableTag) {

        let offsetX, offsetY, isDragging = false;
        let anchorId = 4;

        // Event listener for mouse down event
        draggableTag.addEventListener('mousedown', (e) => {
            isDragging = true;

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
                console.log('Tag Position - Left:', draggableTag.style.left, ', Top:', draggableTag.style.top);
            }
        });

        // Event listener for mouse up event
        document.addEventListener('mouseup', () => {
            isDragging = false;
            snapToAnchor(draggableTag);

            // Print a message when the dragging is stopped
            console.log('Dragging stopped');
        });

        const anchorPointsPercentage = [
            { x: 20, y: 35, id: 0 },
            { x: 50, y: 35, id: 1 },
            { x: 80, y: 35, id: 2 },
            { x: 20, y: 70, id: 3 },
            { x: 50, y: 70, id: 4 },
            { x: 80, y: 70, id: 5 }
        ];
        function snapToAnchor(tag) {

            // Calculate viewport dimensions
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // Convert percentage values to absolute coordinates
            const anchorPoints = anchorPointsPercentage.map(({ x, y, id }) => ({
                x: (x / 100) * viewportWidth + tag.offsetWidth / 2,
                y: (y / 100) * viewportHeight + tag.offsetHeight / 2,
                id: id
            }));

            // Find the nearest anchor point
            const nearestAnchor = anchorPoints.reduce((nearest, anchor) => {
                const distance = Math.hypot(
                    tag.offsetLeft + tag.offsetWidth / 2 - anchor.x,
                    tag.offsetTop + tag.offsetHeight / 2 - anchor.y
                );

                if (distance < nearest.distance) {
                    return { anchor, distance };
                }

                return nearest;
            }, { anchor: null, distance: Infinity });

            // Snap to the nearest anchor point
            if (nearestAnchor.anchor) {
                tag.style.left = nearestAnchor.anchor.x - tag.offsetWidth / 2 + 'px';
                tag.style.top = nearestAnchor.anchor.y - tag.offsetHeight / 2 + 'px';
                anchorId = nearestAnchor.anchor.id;
            }

            // Add event listener for window resize
            window.addEventListener('resize', (window) => {
                const updatedWindowWidth = window.innerWidth || document.documentElement.clientWidth;
                const updatedWindowHeight = window.innerHeight || document.documentElement.clientHeight;
                console.log("resize to width ", updatedWindowWidth, " height ", updatedWindowHeight);
                console.log("tag at ", draggableTag.style.left, draggableTag.style.top);
                console.log("anchor id is ", anchorId);
                draggableTag.style.left = anchorPointsPercentage[anchorId].x / 100 * updatedWindowWidth + 'px';
                draggableTag.style.top = anchorPointsPercentage[anchorId].y / 100 * updatedWindowHeight + 'px';
                console.log("moved to ", draggableTag.style.left, draggableTag.style.top);
            });
        }
    });
});
