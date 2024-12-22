const class_label = document.getElementById('class-label')
const wrapper_for_students = document.getElementsByClassName('students-list-wrapper')[0];
const label = document.querySelector('.students-list-wrapper h1');
const send_report_button = document.querySelector('.send-report-button');
const students_list = [];

fetch('')
  .then(response => response.json())
  .then(data => {
    const user_data = data.data[0];
    class_label.innerHTML = `Учащиеся ${user_data.name} класса`;
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

        students_list.push(students[i]);
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
  const modal_overlay = document.createElement('div');
  const modal_window = document.createElement('div');

  modal_overlay.classList.add('modal-overlay');
  modal_window.classList.add('modal-dialog', 'modal-dialog-centered');

  modal_window.innerHTML = `
  <div class="modal-content" data-backdrop="static" style="box-sizing: border-box; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);">
      <div class="modal-header" style="background-color: #f8f9fa; padding: 1rem; border-bottom: 1px solid #dee2e6;">
          <h5 class="modal-title" style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #343a40;">Отправьте отчёт</h5>
      </div>
      <div style="padding: 1rem; border-bottom: 1px solid #dee2e6;">
          <h6 class="modal-title" style="margin: 0; font-size: 1rem; color: #495057;">Выберите нужные пункты</h6>
      </div>
      <div class="modal-body" style="padding: 1rem;">
          <div class="input-group" style="align-items: center;margin-bottom:1vw">
              <div class="input-group-prepend">
                <span class="input-group-text">Кого отправить</span>
              </div>
              <select class="form-select activity-select">
                <option selected value="all">Всех</option>
              </select>
            </div>
          <div style="margin-bottom: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #495057;">
                  <input type="checkbox" checked style="width: 16px; height: 16px; cursor: pointer;">Олимпиады
              </label>
          </div>
          <div style="margin-bottom: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #495057;">
                  <input type="checkbox" checked style="width: 16px; height: 16px; cursor: pointer;">Репетиторы
              </label>
          </div>
          <div>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #495057;">
                  <input type="checkbox" checked style="width: 16px; height: 16px; cursor: pointer;">Кружки
              </label>
          </div>
      </div>
      <div class="modal-footer" style="background-color: #f8f9fa; padding: 1rem; border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end; gap: 1rem;">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="padding: 0.5rem 1rem; border-radius: 5px;">Отмена</button>
          <button type="button" class="btn send-report" style="padding: 0.5rem 1rem; border-radius: 5px;">Отправить</button>
      </div>
  </div>
  `;
  const select_window = modal_window.querySelector('.form-select');
  for (let i = 0; i < students_list.length; i++) {
    select_window.innerHTML += `
        <option value="${students_list[i].id}">${students_list[i].surname} ${students_list[i].name} ${students_list[i].patronymic}</option>
    `;
  }

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
    const selectElement = document.querySelector('.activity-select');
    // для "Всех" значение = all, для выбранного - studentId
    const selectedValue = selectElement.value;
    const selectedActivities = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox, index) => {
      const labelText = checkbox.parentElement.textContent.trim();
      if (checkbox.checked) {
        switch (labelText) {
          case "Олимпиады":
            selectedActivities.push("olympiads");
            break;

          case "Репетиторы":
            selectedActivities.push("tutors");
            break;

          case "Кружки":
            selectedActivities.push("afterschools");
            break;
            
          default:
            break;
        }
      }
    });
    if (selectedActivities.length == 0) throw new Error('No activities selected');
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          document_config: {
            persons: selectedValue,
            activities: selectedActivities
          }
        })
    })
    .then(response => {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
          return response.json();
      } else if (contentType && 
        contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          return response.blob();
      } else {
          throw new Error('Неизвестный формат ответа');
      }
    })
    .then(dataOrBlob => {
      if (dataOrBlob instanceof Blob) {
          const url = window.URL.createObjectURL(dataOrBlob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'Отчёт.docx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
      } else if (dataOrBlob.success) {
          closeModal();
      } else {
          switch (dataOrBlob.message?.schema_text[0]) {
              case "Invalid value.":
                  error_label.style = "display: flex";
                  error_label.textContent = "Пожалуйста, введите корректные названия";
                  break;
          }
      }
    })
    .catch(error => {
        console.error('Ошибка:', error);
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
