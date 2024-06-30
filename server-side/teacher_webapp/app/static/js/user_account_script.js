const name_text = document.getElementById("name")
let doc = document.documentElement;
const container = document.getElementById("buttons-container");
const switcher = document.getElementById("checkbox");

fetch('')
  .then(response => response.json())
  .then(data => {
    name_text.textContent = `${data.first_name} ${data.last_name} ${data.patronymic}`;
    addGroupButtons(data.classes);
  })
  .catch(error => {
    console.error(error);
  });

function addGroupButtons(classes) {
    for (let i = 0; i < classes.length; i++) {
        if (i % 3 == 0) {
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            container.appendChild(newRow);
        }
        const newButton = document.createElement('button');
        newButton.id = 'class-button';
        newButton.textContent = `${classes[i].name}`;
        newButton.name = `chosen_button`;
        newButton.value = `${classes[i].id}`;
        newButton.classList = "btn btn-outline-secondary btn-lg center-button";
        container.lastElementChild.appendChild(newButton);
    }
}

switcher.addEventListener("click", async event => {
    if (doc.hasAttribute('data-theme')) {
        doc.removeAttribute('data-theme');
        localStorage.removeItem('theme');
    } else {
        doc.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
})

if (localStorage.getItem('theme') !== null) {
    doc.setAttribute('data-theme', 'dark');
}

if (doc.hasAttribute('data-theme')) {
    switcher.checked = true;
}
