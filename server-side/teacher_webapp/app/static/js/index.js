const submit_button = document.getElementById('login_button');
const error_label = document.querySelector('.error-message');

submit_button.addEventListener('click', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ 
            'username': username, 
            'password': password
        })
    });
    if (response.status === 401) {
        error_label.textContent = "Неправильный логин или пароль";
    } else if (response.status === 200) {
        const location = response.headers.get('Location');
        if (location) {
            window.location.href = location;
        }
    }
});

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
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