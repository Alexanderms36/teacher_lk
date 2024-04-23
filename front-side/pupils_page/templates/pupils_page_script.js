const class_label = document.getElementById('class-label')
//здесь подтянем выбранный класс из бд и положим в переменную
let chosen_class = 9;

class_label.innerHTML = `Учащиеся ${chosen_class} класса`;