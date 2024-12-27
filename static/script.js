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
    const id = ev.dataTransfer.getData("text/plain");
    const element = document.getElementById(id);
    if (element.classList.contains("tag")) {
        ev.currentTarget.appendChild(element);
    } else if (element.classList.contains("mastertag")) {
        const tags = Array.from(document.getElementsByClassName(element.getAttribute("data-qualifier").concat(" tag")));
        for (let i = 0; i < tags.length; i++) {
            ev.currentTarget.appendChild(tags[i]);
        }
    }
    sortIngredientTags();
    computeBestPizza();
}

window.addEventListener("DOMContentLoaded", () => {
    sortIngredientTags();
    computeBestPizza();

    const tags = document.querySelectorAll(".tag, .mastertag");
    for (let i = 0; i < tags.length; i++) {
        tags[i].addEventListener("dragstart", dragstartHandler);
    }

    const ingredientBoxes = document.getElementsByClassName("ingredient-box");
    for (let i = 0; i < ingredientBoxes.length; i++) {
        ingredientBoxes[i].addEventListener("dragover", dragoverHandler);
        ingredientBoxes[i].addEventListener("drop", dropHandler);
    }
});

function sortIngredientTags() {
    const box = document.getElementById("ingredients");
    const tags = Array.from(box.getElementsByClassName("tag"));

    tags.sort((a, b) => { return ingredientSort(a, b); });

    tags.forEach(tag => box.appendChild(tag));
}

function ingredientSort(a, b) {
    const firstSort = a.getAttribute("data-qualifier").localeCompare(b.getAttribute("data-qualifier"));
    if (firstSort !== 0) {
        return -firstSort;
    }
    const secondSort = a.id.localeCompare(b.id);
    return secondSort;
}

function computeBestPizza() {
    const criteria = {};
    const ingredientBoxes = document.getElementsByClassName("ingredient-box");
    for (let i = 0; i < ingredientBoxes.length; i++) {
        const tags = ingredientBoxes[i].getElementsByClassName("tag");
        criteria[i] = Array.from(tags, tag => tag.id);
    }

    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
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
                pizzaNameElement.innerText = `#${i + 1} ${data["message"][i][0]}`;

                const pizzaDescriptionElement = document.createElement("p");
                pizzaDescriptionElement.className = "pizza-description";
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
