const form = document.getElementById('input-task');

// Добавляем обработчик события submit
form.addEventListener('submit', function (event) {
    // Предотвращаем стандартное поведение отправки формы
    event.preventDefault();

    // Получаем значение из input
    const task = form.elements.task.value;

    if (task) {
        form.elements.task.value = '';

        // Выполняем какое-то действие, например, выводим значение в консоль
        console.log('Form submitted with username:', task);

        // Здесь можно добавить любую логику, которую вы хотите выполнить при отправке формы
        addTask(task)
        updateActiveTasks(getTasks())
    }
});

function addTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ name: task, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks
}

function updateTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateActiveTasks(tasks) {
    var activeTasks = document.getElementById('active-tasks');
    var completedTasks = document.getElementById('completed-tasks');
    activeTasks.innerHTML = ""
    completedTasks.innerHTML = ""

    tasks.forEach(task => {
        let body = document.querySelector('body')
        let wrapper = document.getElementById('wrapper')
        let card = document.createElement('div');
        card.className = 'card w-110 p-4 bg-base-200 card-md shadow-sm'
        let cardBody = document.createElement('div');
        cardBody.className = 'flex justify-between'
        let cardText = document.createElement('h2');
        cardText.className = 'card-title overflow-hidden'
        cardText.innerText = task['name']
        let cardActions = document.createElement('div');
        cardActions.className = 'card-actions flex flex-nowrap items-center'
        let editTask = document.createElement('button')
        editTask.className = 'btn btn-soft h-6'
        editTask.innerText = 'edit'
        let deleteTask = document.createElement('button')
        deleteTask.className = 'btn btn-secondary h-6'
        deleteTask.innerText = 'delete'
        let cardCheckbox = document.createElement('input');
        cardCheckbox.type = 'checkbox'
        cardCheckbox.className = 'checkbox checkbox-success'

        cardBody.append(cardText);
        cardBody.append(cardActions);
        card.append(cardBody);

        if (task['completed']) {
            cardCheckbox.checked = 'checked'

            cardActions.append(deleteTask);
            cardActions.append(cardCheckbox);
            completedTasks.append(card);
            cardCheckbox.addEventListener('click', function (event) {
                task['completed'] = false
                updateTasks(tasks);
                updateActiveTasks(getTasks());
            });
            deleteTask.addEventListener('click', function (event) {
                let tasksCopy = tasks.slice();
                let index = tasks.indexOf(task); // Найти индекс элемента, который нужно удалить
                if (index !== -1) {
                    tasksCopy.splice(index, 1); // Удалить один элемент по найденному индексу
                }
                updateTasks(tasksCopy);
                updateActiveTasks(getTasks());
            });
        } else {
            cardActions.append(editTask);
            cardActions.append(cardCheckbox);

            activeTasks.append(card);
            cardCheckbox.addEventListener('click', function (event) {
                task['completed'] = true
                updateTasks(tasks);
                updateActiveTasks(getTasks());
            });
            editTask.addEventListener('click', function (event) {
                let editTaskForm = document.createElement('form')
                editTaskForm.className = 'fixed w-100 max-w-md flex mt-70'
                let editTaskField = document.createElement('input')
                editTaskField.className = 'input input-bordered mr-2'
                editTaskField.placeholder = 'New text'
                editTaskField.type = 'text'
                editTaskField.name = 'task'
                editTaskField.value = task['name']
                let editTaskFieldSubmit = document.createElement('button')
                editTaskFieldSubmit.className = 'btn btn-primary'
                editTaskFieldSubmit.innerText = 'Submit'

                editTaskForm.append(editTaskField)
                editTaskForm.append(editTaskFieldSubmit)

                body.append(editTaskForm);
                wrapper.classList.add('blur-md')

                editTaskForm.addEventListener('submit', function (event) {
                    // Предотвращаем стандартное поведение отправки формы
                    event.preventDefault();

                    // Получаем значение из input
                    const new_task = editTaskForm.elements.task.value;

                    if (new_task) {
                        task['name'] = new_task
                        updateTasks(tasks);
                        updateActiveTasks(getTasks());
                        wrapper.classList.remove('blur-md')
                        editTaskForm.remove()
                    }
                });
            });
        }
    });
};
// localStorage.clear()

updateActiveTasks(getTasks());