document.addEventListener('DOMContentLoaded', function () {
    // This function will run after the HTML document has been fully loaded

    // Get the draggable box element
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(function (draggableBox)  {

        let offsetX, offsetY, isDragging = false;

        // Event listener for mouse down event
        draggableBox.addEventListener('mousedown', (e) => {
            isDragging = true;

            // Calculate the offset between the mouse position and the box position
            offsetX = e.clientX - draggableBox.getBoundingClientRect().left;
            offsetY = e.clientY - draggableBox.getBoundingClientRect().top;

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

            // Print a message when the dragging is stopped
            console.log('Dragging stopped');
        });
    });
});
