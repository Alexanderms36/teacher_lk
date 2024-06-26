const name_text = document.getElementById("name")
let doc = document.documentElement;
const container = document.getElementById("buttons-container");
const switcher = document.getElementById("checkbox");

fetch('/user_json')
  .then(response => response.json())
  .then(data => {
    name_text.textContent = `${data.firstname} ${data.lastname} ${data.patronymic}`;
    addGroupButtons(data.classes);
  })
  .catch(error => {
    console.error(error);
  });

function addGroupButtons(classes) {
    let groups = classes.split(' ');
    for (let i = 0; i < groups.length; i++) {
        if (i % 3 == 0) {
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            container.appendChild(newRow);
        }
        const newButton = document.createElement('button');
        newButton.id = 'class-button';
        newButton.textContent = `${groups[i]}`;
        newButton.name = `${groups[i]}`;
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
