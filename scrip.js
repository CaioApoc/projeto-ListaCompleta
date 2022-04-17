const inputElement = document.querySelector(".new_task_input");
const addTaskButton = document.querySelector(".new_task_button");

const tasksContainer = document.querySelector(".tasks_container");

const validateInput = () => inputElement.value.trim().length > 0;
//trim serve para desconsiderar os espacos quando estiver tudo em branco

function inputLength() {
  return inputElement.value.length;
}

const handleAddTask = () => {
  const inputIsValid = validateInput();
  console.log(inputIsValid);
  if (!inputIsValid) {
    return inputElement.classList.add("error"); //caso o input esteja vazio add a classe error pra ficar vermelho
  }

  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task_item");

  const taskContent = document.createElement("p");
  taskContent.innerText = inputElement.value;

  taskContent.addEventListener("click", () => handleClick(taskContent));

  const deleteItem = document.createElement("i");
  deleteItem.classList.add("far");
  deleteItem.classList.add("fa-trash-alt");

  deleteItem.addEventListener("click", () =>
    handleDeleteClick(taskItemContainer, taskContent)
  );

  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(deleteItem);

  tasksContainer.appendChild(taskItemContainer);

  inputElement.value = ""; //limpar o input quando add uma tarefa

  upDateLocalStorage();
};
const handleClick = (taskContent) => {
  const tasks = tasksContainer.childNodes; //ele pega todos os filhos (task item) / tasks vai ser a div criada com os elementos <p> e <i> no html pelo JS
  for (const task of tasks) {
    //o for é pra gente achar qual item estamos clicando dentro da lista de tarefa
    if (task.firstChild.isSameNode(taskContent)) {
      task.firstChild.classList.toggle("completed"); //toggle vai colocar ou tirar a classe de completed que serve pra marcar a tarefa pronta ou nao
    }
  }
  upDateLocalStorage();
};

const handleDeleteClick = (taskItemContainer, taskContent) => {
  const tasks = tasksContainer.childNodes;

  for (const task of tasks) {
    const currentTaskIsBeingClicked = task.firstChild.isSameNode(taskContent); //criei uma const nova para facilitar a leitura, poderia fazer isso tb no if do handleClick
    if (currentTaskIsBeingClicked) {
      taskItemContainer.remove();
    }
  }
  upDateLocalStorage();
};

const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};

const upDateLocalStorage = () => {
  const tasks = tasksContainer.childNodes; //pegar todas as tarefas

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild; //pegando o <p>
    const isCompleted = content.classList.contains("completed"); //vai conferir se tem a classe completed

    return { description: content.innerText, isCompleted: isCompleted };
  });

  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
  console.log({ localStorageTasks });
};

const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    const taskItemContainer = document.createElement("div");
    taskItemContainer.classList.add("task_item");

    const taskContent = document.createElement("p");
    taskContent.innerText = task.description;

    if (task.isCompleted) {
      taskContent.classList.add("completed");
    }

    taskContent.addEventListener("click", () => handleClick(taskContent));

    const deleteItem = document.createElement("i");
    deleteItem.classList.add("far");
    deleteItem.classList.add("fa-trash-alt");

    deleteItem.addEventListener("click", () =>
      handleDeleteClick(taskItemContainer, taskContent)
    );

    taskItemContainer.appendChild(taskContent);
    taskItemContainer.appendChild(deleteItem);

    tasksContainer.appendChild(taskItemContainer);
  }
};

function addListAfterKeypress(event) {
  console.log("ssss");
  if (inputLength() > 0 && event.which === 13) {
    handleAddTask();
  }
}

refreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());
inputElement.addEventListener("keypress", addListAfterKeypress);
inputElement.addEventListener("change", () => handleInputChange());
