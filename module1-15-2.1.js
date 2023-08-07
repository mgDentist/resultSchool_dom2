let tasks = [
    {
        id: '1138465078061',
        completed: false,
        text: 'Посмотреть новый урок по JavaScript',
    },
    {
        id: '1138465078062',
        completed: false,
        text: 'Выполнить тест после урока',
    },
    {
        id: '1138465078063',
        completed: false,
        text: 'Выполнить ДЗ после урока',
    },
];

const body = document.querySelector('body');
const createTaskForm = document.querySelector('.create-task-block');

const tasksList = document.createElement('div');
//создаю спан для ошибки заранее
const errorTextContainer = document.createElement('span');
errorTextContainer.className = 'error-message-block';

tasksList.className = 'tasks-list';
body.append(tasksList);

//создаю DOM
const renderTasks = () => {
    tasksList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.dataset.taskId = task.id;
        tasksList.append(taskItem);

        const mainContainer = document.createElement('div');
        mainContainer.className = 'task-item__main-container';
        taskItem.append(mainContainer);

        const mainContent = document.createElement('div');
        mainContent.className = 'task-item__main-content';
        mainContainer.append(mainContent);

        const checkboxForm = document.createElement('form');
        checkboxForm.className = 'checkbox-form';
        mainContent.append(checkboxForm);

        const inputCheckbox = document.createElement('input');
        inputCheckbox.className = 'checkbox-form__checkbox';
        inputCheckbox.type = 'checkbox';
        inputCheckbox.setAttribute('id', `task-${task.id}`);
        checkboxForm.append(inputCheckbox);

        const label = document.createElement('label');
        label.setAttribute('for', `task-${task.id}`);
        checkboxForm.append(label);

        const spanItemText = document.createElement('span');
        spanItemText.className = 'task-item__text';
        spanItemText.textContent = task.text;
        mainContent.append(spanItemText);

        const formButton = document.createElement('button');
        formButton.className = 'task-item__delete-button default-button delete-button';
        formButton.dataset.deleteTaskId = task.id;
        formButton.textContent = 'Удалить';
        mainContainer.append(formButton);
    });
};

renderTasks();

//вешаю EventListener
const makeNewTask = createTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTask = event.target.elements.taskName.value.trim();

    if (!newTask) {
        showError('Название задачи не должно быть пустым');
        return;
    }

    const duplicateTask = tasks.find(task => task.text.toLowerCase() === newTask.toLowerCase());
    if (duplicateTask) {
        showError('Задача с таким названием уже существует.');
        return;
    }

    const newId = String(Date.now());
    const newTaskObject = {
        id: newId,
        completed: false,
        text: newTask,
    };

    tasks.push(newTaskObject);

    renderTasks();

    event.target.elements.taskName.value = '';
});

function showError(message) {
    errorTextContainer.textContent = message;
    createTaskForm.prepend(errorTextContainer);
}

//модальное окно
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay modal-overlay_hidden';

const deleteModal = document.createElement('div');
deleteModal.className = 'delete-modal';
modalOverlay.append(deleteModal);

const deleteModalQuestion = document.createElement('h3');
deleteModalQuestion.className = 'delete-modal__question';
deleteModalQuestion.textContent = 'Вы действительно хотите удалить эту задачу?';
deleteModal.append(deleteModalQuestion);

const deleteModalButtons = document.createElement('div');
deleteModalButtons.className = 'delete-modal__buttons';
deleteModal.append(deleteModalButtons);

const cancelButton = document.createElement('button');
cancelButton.className = 'delete-modal__button delete-modal__cancel-button';
cancelButton.textContent = 'Отмена';
deleteModalButtons.append(cancelButton);

const confirmButton = document.createElement('button');
confirmButton.className = 'delete-modal__button delete-modal__confirm-button';
confirmButton.textContent = 'Удалить';
deleteModalButtons.append(confirmButton);

body.append(modalOverlay);

//показывает и не показывает модальное окно
function closeOverlay() {
    modalOverlay.classList.toggle('modal-overlay_hidden');
}

//обработчик события по клику на кнопку
tasksList.addEventListener('click', (event) => {
    const button = event.target.closest('.task-item__delete-button');

    if(button) {
        const taskIdToDelete = button.dataset.deleteTaskId;
        closeOverlay();
        confirmButton.dataset.taskId = taskIdToDelete;
    }
});

cancelButton.addEventListener('click', () => {
    closeOverlay();
});

confirmButton.addEventListener('click', (event) => {
    const taskIdToDelete = event.target.closest('.delete-modal__confirm-button').dataset.taskId;
    tasks = tasks.filter(task => task.id !== taskIdToDelete);
    renderTasks();
    closeOverlay();
});
