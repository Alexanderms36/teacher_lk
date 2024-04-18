const name_text = document.getElementById("name")
const name = "Иванов Иван Иванович"
name_text.innerHTML = name;

let nums_of_classes = 9;
const container = document.getElementById("buttons-container");

for (let i = 0; i < nums_of_classes; i++) {
    if (i % 3 == 0) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        container.appendChild(newRow);
    }

    const newButton = document.createElement('button');
    newButton.id = 'class-button';
    newButton.textContent = `${i + 1}`;
    newButton.classList = "btn btn-outline-secondary btn-lg center-button";
    container.lastElementChild.appendChild(newButton);
}