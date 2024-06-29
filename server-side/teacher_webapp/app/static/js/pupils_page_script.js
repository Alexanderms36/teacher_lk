const class_label = document.getElementById('class-label')
const return_btn = document.getElementById('return-icon')
const wrapper_for_students = document.getElementsByClassName('students-list-wrapper')[0];


fetch('./get_classes/')
  .then(response => response.json())
  .then(data => {
    class_label.innerHTML = `Учащиеся ${data.name} класса`;
    if (data.students != "")
        addStudentsButtons(data.students, data.students_id);
  })
  .catch(error => {
    console.error(error);
  });

function addStudentsButtons(students_name, students_id) {
    const students = students_name.split('endofname');
    const stud_ids = students_id.split('/');
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
        student_button.textContent = students[i];
        student_button.name = `chosen_student`;
        student_button.value = stud_ids[i];
    }
}

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}
