const class_label = document.getElementById('class-label')
const wrapper_for_students = document.getElementsByClassName('students-list-wrapper')[0];
const label = document.querySelector('.students-list-wrapper h1');
const send_report_button = document.querySelector('.send-report-button');


fetch('')
  .then(response => response.json())
  .then(data => {
    const user_data = data.data[0];
    class_label.innerHTML = `Учащиеся ${user_data.name} класса`;
    console.log(data);
    addStudentsButtons(user_data.students);
  })
  .catch(error => {
    console.error(error);
  });

function addStudentsButtons(students) {
  if (students.length != 0) {
    for (let i = 0; i < students.length; i++) {
        const new_wrapper_for_button = document.createElement('div');
        const new_circle_with_num = document.createElement('div');
        const student_button = document.createElement('button');
        
        new_wrapper_for_button.classList.add("student-button-wrapper");
        new_circle_with_num.classList.add('circle');
        student_button.classList.add('student-button');
            
        new_wrapper_for_button.appendChild(new_circle_with_num);
        wrapper_for_students.appendChild(new_wrapper_for_button);
        new_wrapper_for_button.appendChild(student_button);
    
        new_circle_with_num.innerHTML = i + 1;
        student_button.textContent = `${students[i].surname} ${students[i].name} ${students[i].patronymic}`;
        student_button.name = `chosen_student`;
        student_button.value = students[i].id;
    }
  } else {
    label.style = "display: block"
    label.textContent = "В данный класс ученики ещё не добавлены.";
  }
}

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

send_report_button.addEventListener('click', () => {
  console.log('clicked!');
  const modal_overlay = document.createElement('div');
  const modal_window = document.createElement('div');

  modal_overlay.classList.add('modal-overlay');
  modal_window.classList.add('modal-dialog', 'modal-dialog-centered');

  modal_window.innerHTML = `
    <div class="modal-content" data-backdrop="static" style="box-sizing: border-box;">
        <div class="modal-header">
            <h5 class="modal-title" style="margin: 1vw;">Отправьте отчёт</h5>
        </div>
        <div>
            <h6 class="modal-title" style="margin: 1vw;">Выберите нужные пункты</h6>
        </div>
        <div class="modal-body" style="padding: 1vw;margin-bottom: 1vw;">
            <div>
              <span>Олимпиады</span>
              <input type="checkbox" checked>
            </div>
            <div>
              <span>Репетиторы</span>
              <input type="checkbox" checked>
            </div>
            <div>
              <span>Кружки</span>
              <input type="checkbox" checked>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;">Отмена</button>
            <button type="button" class="btn btn-danger send-report" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;">Отправить</button>
        </div>
    </div>
  `;

  modal_overlay.appendChild(modal_window);
  document.body.appendChild(modal_overlay);
  document.body.style.overflow = 'hidden';

  const cancel_button = modal_window.querySelector('.btn-secondary');
  const submit_button = modal_window.querySelector('.send-report');
  const closeModal = () => {
      modal_window.remove();
      modal_overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('click', outsideClickListener);
  };

  cancel_button.addEventListener('click', closeModal);
  submit_button.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          wha: {
            name: '1',
            subinfo: '2',
            info: '3',
            type: '4' 
        }
        })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
    });
  });

  document.addEventListener('click', (e) => {
    if (!modal_window.contains(e.target) && !send_report_button.contains(e.target)) {
        closeModal();
    }
  });
});

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
