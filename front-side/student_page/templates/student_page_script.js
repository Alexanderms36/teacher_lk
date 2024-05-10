const student_image = document.getElementById('student-image');
const health_group = document.querySelectorAll('.profile-wrapper a')[0];
//всё это из бд с учениками подтянем
student_image.src = "./templates/src/avatar_placeholder.jpg";
health_group.innerHTML = "(Группа здоровья)";
const labels = [["вышивание крестиком", "хоббихорсинг", "хоккей"],
        ["Репетитор Лёха", "репетитор по арифметике", "квантовая физика"],
        ["физика", "математика", "s", "sd", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa",
         "sddfa", "sddfa", "sddfa", "sddfa", "sddfa", "sddfa"]
                ];
const activities_wrapper = document.querySelectorAll('.activities-wrapper')[0];

const button_labels = ["КРУЖКИ", "РЕПЕТИТОРЫ", "ОЛИМПИАДЫ", "ЛИЧНЫЙ КАБИНЕТ УЧЕНИКА"];


function addButtons(labels, additional_buttons) {
    for (let j = 0; j < labels.length + 1; j++) {
        
        const additional_button = document.createElement('button');
        additional_buttons.appendChild(additional_button);
        additional_button.classList.add('additional-button');
        if (labels.length - j != 0)
            additional_button.textContent = labels[j];
        else { 
            additional_button.textContent = "+";
            additional_button.classList.add('plus-button');
        }
    }
}

for (let i = 0; i < button_labels.length; i++) {
    const main_button = document.createElement('button');
    main_button.textContent = button_labels[i];
    activities_wrapper.appendChild(main_button);
    main_button.classList.add('main-button');

    if (i != button_labels.length - 1) {
        const additional_buttons = document.createElement('div');
        activities_wrapper.appendChild(additional_buttons);
        additional_buttons.classList.add('additional-buttons');
        addButtons(labels[i], additional_buttons);
    }
    
}

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}