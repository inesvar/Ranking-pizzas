// source of drag and drop code:
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#the_basics

function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragstartHandlerForPizzaIngredients(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.querySelector(".tag-text").innerText);
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
        const tags = Array.from(document.querySelectorAll(`.tag-box .tag.${element.getAttribute("data-foodtype")}`));
        for (let i = 0; i < tags.length; i++) {
            ev.currentTarget.appendChild(tags[i]);
        }
    } else if (element.classList.contains("tag-box")) {
        const boxTags = Array.from(element.getElementsByClassName("tag"));
        for (const tag of boxTags) {
            ev.currentTarget.appendChild(tag);
        }
    }
    sortIngredientTags();
    computeBestPizza();
}

function loadPreferencesFromJson(jsonFilename = "default") {
    fetch("/static/dumps/" + jsonFilename + ".json")
        .then(response => response.json())
        .then(data => {
            // empty qualifiers
            const ingredientBox = document.getElementById("ingredients");
            for (const qualifier of ["without", "bad", "good", "with"]) {
                const box = document.getElementById(qualifier);
                // using `Array.from` because we'll remove elements
                const boxTags = Array.from(box.getElementsByClassName("tag"));
                for (const tag of boxTags) {
                    ingredientBox.appendChild(tag);
                }
            }
            // add data from json
            for (const [ingredient, qualifier] of Object.entries(data)) {
                const element = document.getElementById(ingredient);
                const box = document.getElementById(qualifier);
                if (element.classList.contains("tag")) {
                    box.appendChild(element);
                } else if (element.classList.contains("mastertag")) {
                    const tags = Array.from(document.getElementsByClassName(element.getAttribute("data-foodtype").concat(" tag")));
                    for (let i = 0; i < tags.length; i++) {
                        box.appendChild(tags[i]);
                    }
                }
            }
            sortIngredientTags();
            computeBestPizza();
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function savePreferencesToJson(jsonFilename = "default") {
    const criteria = {};
    const ingredientBoxes = document.querySelectorAll("#qualifier-container .tag-box"); // descendant
    for (const qualifier of ingredientBoxes) {
        const ingredients = qualifier.getElementsByClassName("tag");
        for (const ingredient of ingredients) {
            criteria[ingredient.id] = qualifier.id;
        }
    }

    fetch('/save_file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "filename": jsonFilename + ".json", "content": criteria }),
    })
        .catch((error) => {
            console.error('Error:', error);
        });
}

window.addEventListener("DOMContentLoaded", () => {
    loadPreferencesFromJson();

    const tags = document.querySelectorAll(".tag, .mastertag, .tag-box"); // OR
    for (let i = 0; i < tags.length; i++) {
        tags[i].addEventListener("dragstart", dragstartHandler);
    }

    const ingredientBoxes = document.getElementsByClassName("tag-box");
    for (let i = 0; i < ingredientBoxes.length; i++) {
        ingredientBoxes[i].addEventListener("dragover", dragoverHandler);
        ingredientBoxes[i].addEventListener("drop", dropHandler);
    }

    const loadButton = document.getElementById("loadButton");
    loadButton.addEventListener("click", (_event) => {
        let params = new URLSearchParams(document.location.search);
        let name = prompt("filename:");
        if (name != null) {
            loadPreferencesFromJson(name);
        }
    });

    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", (_event) => {
        let params = new URLSearchParams(document.location.search);
        let name = prompt("filename:");
        if (name != null) {
            savePreferencesToJson(name);
        }
    });
});

function sortIngredientTags(tagClass = "tag") {
    const box = document.getElementById("ingredients");
    const tags = Array.from(box.getElementsByClassName(tagClass));

    tags.sort((a, b) => { return ingredientSort(a, b); });

    tags.forEach(tag => box.appendChild(tag));
}

function sortIngredientTagsIn(element, tagClass = "tag") {
    const tags = Array.from(element.getElementsByClassName(tagClass));

    tags.sort((a, b) => { return ingredientSort(a, b); });

    tags.forEach(tag => element.appendChild(tag));
}

function ingredientSort(a, b) {
    const firstSort = a.getAttribute("data-foodtype").localeCompare(b.getAttribute("data-foodtype"));
    if (firstSort !== 0) {
        return -firstSort;
    }
    const secondSort = a.id.localeCompare(b.id);
    return secondSort;
}

function computeBestPizza() {
    const criteria = {};
    const ingredientBoxes = document.getElementsByClassName("tag-box");
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

                const pizzaNameElement = document.createElement("div");
                pizzaNameElement.className = "pizza-name";
                pizzaNameElement.innerText = `${data["message"][i][2]} ${data["message"][i][0]}`;

                const pizzaIngredientBox = document.createElement("div");
                pizzaIngredientBox.className = "static-tag-box";

                for (const ingredientName of data["message"][i][1]) {
                    const originalIngredient = document.getElementById(ingredientName);
                    const originalType = originalIngredient.getAttribute("data-foodtype");
                    const ingredientElement = document.createElement("div");

                    ingredientElement.setAttribute("data-foodtype", originalType);
                    ingredientElement.setAttribute("draggable", true);
                    ingredientElement.className = originalType;
                    ingredientElement.classList.add("tag");
                    ingredientElement.addEventListener("dragstart", dragstartHandlerForPizzaIngredients);

                    const child = document.createElement("p");
                    child.className = "tag-text";
                    child.innerText = ingredientName;

                    ingredientElement.appendChild(child);
                    pizzaIngredientBox.appendChild(ingredientElement);
                }
                sortIngredientTagsIn(pizzaIngredientBox, "tag");

                pizzaBlock.appendChild(pizzaNameElement);
                pizzaBlock.append(pizzaIngredientBox);
                pizzaContainer.appendChild(pizzaBlock);
            }

            document.getElementsByTagName("body")[0].style.visibility = "visible";
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
