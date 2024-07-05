const name_text = document.getElementById("name")
const container = document.getElementById("buttons-container");
const switcher = document.getElementById("checkbox");
const upload_photo = document.querySelector(".upload-photo");

let doc = document.documentElement;


fetch('')
  .then(response => response.json())
  .then(data => {
    name_text.textContent = `${data.last_name} ${data.first_name} ${data.patronymic}`;
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

// upload_photo.addEventListener("change", event => {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             preview.src = e.target.result;
//         }
//         reader.readAsDataURL(file);

//         const formData = new FormData();
//         formData.append('image', file);

//         fetch('/upload/', {
//             method: 'POST',
//             headers: {
//                 'X-CSRFToken': getCookie('csrftoken')
//             },
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Success:', data);
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//         });
//     }

// })

switcher.addEventListener("click", async event => {
    if (doc.hasAttribute('data-theme')) {
        doc.removeAttribute('data-theme');
        localStorage.removeItem('theme');
    } else {
        doc.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

if (localStorage.getItem('theme') !== null) {
    doc.setAttribute('data-theme', 'dark');
}

if (doc.hasAttribute('data-theme')) {
    switcher.checked = true;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
