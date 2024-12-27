// source of drag and drop code:
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#the_basics

function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    ev.currentTarget.appendChild(document.getElementById(data));
}

window.addEventListener("DOMContentLoaded", () => {
    const tags = document.getElementsByClassName("tag");
    for (let i = 0; i < tags.length; i++) {
        tags[i].addEventListener("dragstart", dragstartHandler);
    }

    const ingredientBoxes = document.getElementsByClassName("ingredient-box");
    for (let i = 0; i < ingredientBoxes.length; i++) {
        ingredientBoxes[i].addEventListener("dragover", dragoverHandler);
        ingredientBoxes[i].addEventListener("drop", dropHandler);
    }
});

function computeBestPizza() {
    // dict [0, 4] -> array of strings
    const anchorPointsTagsNames = {};

    for (let anchorId in anchorPointsTags) {
        anchorPointsTagsNames[anchorId] = getNames(anchorPointsTags[anchorId]);
    }

    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(anchorPointsTagsNames),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle the response from the server as needed
            const pizzaContainer = document.getElementById("pizza-container");

            pizzaContainer.innerHTML = '';

            for (let i = 0; i < data["message"].length; i++) {
                const pizzaBlock = document.createElement("div");
                pizzaBlock.className = "pizza-block";

                const pizzaNameElement = document.createElement("p");
                pizzaNameElement.className = "pizza-name";

                const pizzaDescriptionElement = document.createElement("p");
                pizzaDescriptionElement.className = "pizza-description";

                pizzaNameElement.innerText = `#${i + 1} ${data["message"][i][0]}`;
                pizzaDescriptionElement.innerText = data["message"][i][1];

                pizzaBlock.appendChild(pizzaNameElement);
                pizzaBlock.appendChild(pizzaDescriptionElement);

                pizzaContainer.appendChild(pizzaBlock);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
