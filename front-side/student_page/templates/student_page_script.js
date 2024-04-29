const student_image = document.getElementById('student-image');
const health_group = document.querySelectorAll('.profile-wrapper a')[0];
//всё это из бд с учениками подтянем
student_image.src = "./templates/src/avatar_placeholder.jpg";
health_group.innerHTML = "Группа здоровья";