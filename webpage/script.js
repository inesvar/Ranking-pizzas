document.addEventListener('DOMContentLoaded', function () {
    // This function will run after the HTML document has been fully loaded

    // Get the draggable box element
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(function (draggableBox) {

        let offsetX, offsetY, isDragging = false;
        let anchorId = 4;

        // Event listener for mouse down event
        draggableBox.addEventListener('mousedown', (e) => {
            isDragging = true;

            // Calculate the offset between the mouse position and the box position
            offsetX = e.clientX - draggableBox.getBoundingClientRect().left - draggableBox.offsetWidth / 2;
            offsetY = e.clientY - draggableBox.getBoundingClientRect().top - draggableBox.offsetHeight / 2;

            // Print the offset values to the console
            console.log('OffsetX:', offsetX);
            console.log('OffsetY:', offsetY);
        });

        // Event listener for mouse move event
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                // Update the box position based on the mouse movement
                draggableBox.style.left = e.clientX - offsetX + 'px';
                draggableBox.style.top = e.clientY - offsetY + 'px';

                // Print the updated box position to the console
                console.log('Box Position - Left:', draggableBox.style.left, ', Top:', draggableBox.style.top);
            }
        });

        // Event listener for mouse up event
        document.addEventListener('mouseup', () => {
            isDragging = false;
            snapToAnchor(draggableBox);

            // Print a message when the dragging is stopped
            console.log('Dragging stopped');
        });

        const anchorPointsPercentage = [
            { x: 20, y: 35, id:0 },
            { x: 50, y: 35, id:1 },
            { x: 80, y: 35, id:2 },
            { x: 20, y: 70, id:3 },
            { x: 50, y: 70, id:4 },
            { x: 80, y: 70, id:5 }
        ];
        function snapToAnchor(box) {
    
            // Calculate viewport dimensions
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
            // Convert percentage values to absolute coordinates
            const anchorPoints = anchorPointsPercentage.map(({ x, y, id }) => ({
                x: (x / 100) * viewportWidth + box.offsetWidth / 2,
                y: (y / 100) * viewportHeight + box.offsetHeight / 2,
                id: id
            }));
    
            // Find the nearest anchor point
            const nearestAnchor = anchorPoints.reduce((nearest, anchor) => {
                const distance = Math.hypot(
                    box.offsetLeft + box.offsetWidth / 2 - anchor.x,
                    box.offsetTop + box.offsetHeight / 2 - anchor.y
                );
    
                if (distance < nearest.distance) {
                    return { anchor, distance };
                }
    
                return nearest;
            }, { anchor: null, distance: Infinity });
    
            // Snap to the nearest anchor point
            if (nearestAnchor.anchor) {
                box.style.left = nearestAnchor.anchor.x - box.offsetWidth / 2 + 'px';
                box.style.top = nearestAnchor.anchor.y - box.offsetHeight / 2 + 'px';
                anchorId = nearestAnchor.anchor.id;
            }

        // Add event listener for window resize
        window.addEventListener('resize', (window) => {
            const updatedWindowWidth = window.innerWidth || document.documentElement.clientWidth;
            const updatedWindowHeight = window.innerHeight || document.documentElement.clientHeight;
            console.log("resize to width ", updatedWindowWidth, " height ", updatedWindowHeight);
            console.log("box at ", draggableBox.style.left, draggableBox.style.top);
            console.log("anchor id is ", anchorId);
            draggableBox.style.left = anchorPointsPercentage[anchorId].x / 100 * updatedWindowWidth + 'px';
            draggableBox.style.top = anchorPointsPercentage[anchorId].y / 100 * updatedWindowHeight + 'px';
            console.log("moved to ", draggableBox.style.left, draggableBox.style.top);
        });
        }
    });
});
