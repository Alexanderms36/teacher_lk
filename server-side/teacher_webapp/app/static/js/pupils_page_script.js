const class_label = document.getElementById('class-label')
const return_btn = document.getElementById('return-icon')
const wrapper_for_students = document.getElementsByClassName('students-list-wrapper')[0];


fetch('./get_classes/')
  .then(response => response.json())
  .then(data => {
    class_label.innerHTML = `Учащиеся ${data.name} класса`;
    if (data.students != "")
        addStudentsButtons(data.students);
  })
  .catch(error => {
    console.error(error);
  });

function addStudentsButtons(students_name) {
    const students = students_name.split('endofname');
    for (let i = 0; i < students.length; i++) {
        const new_wrapper_for_button = document.createElement('div');
        const new_circle_with_num = document.createElement('div');
        const student_button = document.createElement('input');
        student_button.type = 'button';
    
        new_wrapper_for_button.classList.add("student-button-wrapper");
        new_circle_with_num.classList.add('circle');
        student_button.classList.add('student-button');
    
        new_wrapper_for_button.appendChild(new_circle_with_num);
        wrapper_for_students.appendChild(new_wrapper_for_button);
        new_wrapper_for_button.appendChild(student_button);
    
    
        new_circle_with_num.innerHTML = i + 1;
        student_button.value = students[i];
    }
}



if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}
