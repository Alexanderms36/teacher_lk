const name_text = document.getElementById("name")
const name = "Иванов Иван Иванович"
// кол-во классов подтянем из бд:
let nums_of_classes = 6; 
const container = document.getElementById("buttons-container");
const switcher = document.getElementById("checkbox");

const user_data = JSON.parse(
    document.getElementById('user_data').textContent
  );
name_text.innerHTML = `${user_data.username} ${user_data.lastname}`;

let doc = document.documentElement;
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