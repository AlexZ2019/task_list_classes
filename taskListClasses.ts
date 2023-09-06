const CLASS_TASK_LISTS = "task-lists";
const CLASS_TASK_LIST = "task-list";
const CLASS_LIST_ITEMS = "list-items";
const CLASS_ADD_TASK_BUTTON = "add-task-button";
const CLASS_ENTER_TASK = "enter-task";
const CLASS_DELETE_TASK_BUTTON = "delete-task-button";
const CLASS_CLEAR_LIST_BUTTON = "clear-list-button";
const CLASS_EMPTY_LIST = "empty-list";
const CLASS_MANAGE_TASK = "manage-task";
const CLASS_ADD_TASK = "add-task";
const CLASS_LIST_ITEM = "list-item";
const DATA_ID_ATTRIBUTE = "data-it"
const EMPTY_LIST_TEXT = "List is empty";

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
}
class TodoBase {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
  id: number;
  name: string;
}

class Todo extends TodoBase {
  status: 'pending' | 'solved' | 'plan' = 'plan';
}

class Store {
  constructor(name: string) {
    this.name = name;
  }

  name: string;

  save (data: Todo[]) {
    localStorage.setItem(this.name, JSON.stringify(data));
  }

  get() {
    if (localStorage.getItem(this.name)) {
      return JSON.parse(localStorage.getItem(this.name));
    }
    return null;
  }

  delete() {
    localStorage.removeItem(this.name);
  }
}

class TaskManager {
  constructor(className) {
    this.store = new Store(className);
    const savedTasks = this.store.get();
    this.tasks = savedTasks || [];
    this.taskId = this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 0;
  }

  tasks: Todo[];
  taskId: number;
  store: Store;

  changeTaskStatus(e: HTMLElementEvent<HTMLSelectElement>) {
    const taskId = Number(e.target.closest("." + CLASS_LIST_ITEM).getAttribute(DATA_ID_ATTRIBUTE));
    this.tasks = this.tasks.map((task): Todo => {
      if (task.id === taskId) {
        return { ...task, status: e.target.value } as Todo
      }
      return task;
    });
    this.store.save(this.tasks);
  }

  addTask(value: string) {
      this.taskId++;
      const newTodo = new Todo(this.taskId, value);
      this.tasks.push(newTodo);
      this.store.save(this.tasks);
    }

  deleteTask(e: HTMLElementEvent<HTMLButtonElement>) {
    const taskId = Number(e.target.closest("." + CLASS_LIST_ITEM).getAttribute(DATA_ID_ATTRIBUTE));
    this.tasks = this.tasks.filter((task: Todo) => task.id !== taskId);
    this.store.save(this.tasks);
  }
}
class TaskList extends TaskManager {
  constructor(className: string) {
    super(className);
    const taskLists = document.querySelector("." + CLASS_TASK_LISTS);
    this.taskListContainer = document.createElement('div');
    this.taskListContainer.className = className;
    taskLists.appendChild(this.taskListContainer);
  }
  taskListContainer: HTMLDivElement;
  input: HTMLInputElement;
  clearListBtn: HTMLButtonElement;
  taskList: HTMLDivElement;
  listItems: HTMLDivElement
  addTaskBtn: HTMLButtonElement;

  _addElement(tagName: string, parent: HTMLElement, className = "", innerText = "") {
    const newElement = document.createElement(tagName);
    newElement.className = className;
    newElement.innerText = innerText;
    parent.appendChild(newElement);
  }
  clearList() {
    if (this.tasks.length) {
      this.tasks = [];
      this.store.delete();
      this.listItems = this.taskListContainer.querySelector("." + CLASS_LIST_ITEMS);
      this.listItems.remove();
      const emptyList = this.taskListContainer.querySelector("." + CLASS_EMPTY_LIST);
      emptyList.innerHTML = EMPTY_LIST_TEXT;
    }
  }

  renderTasks() {
    this.listItems = this.taskListContainer.querySelector("." + CLASS_LIST_ITEMS);
    if (this.listItems) {
      this.listItems.remove();
    }
    const emptyList = this.taskListContainer.querySelector("." + CLASS_EMPTY_LIST);
    if (this.tasks.length) {
      if (emptyList.innerHTML) {
        emptyList.innerHTML = "";
      }
      this._addElement("div", this.taskListContainer, CLASS_LIST_ITEMS);
      this.listItems = this.taskListContainer.querySelector("." + CLASS_LIST_ITEMS);
      this.tasks.forEach((task => {
        this.listItems.appendChild(this.initItemList(task));
      }));
    } else {
      emptyList.innerHTML = EMPTY_LIST_TEXT;
    }
  }
  init() {
    this._addElement("div", this.taskListContainer, CLASS_TASK_LIST);
    this._addElement("p", this.taskListContainer, CLASS_EMPTY_LIST);
    this._addElement("div", this.taskListContainer, CLASS_ADD_TASK);
    const addTask: HTMLElement = document.querySelector("." + CLASS_ADD_TASK);
    this._addElement("input", addTask, CLASS_ENTER_TASK, "");
    this._addElement("button", addTask, CLASS_ADD_TASK_BUTTON, "Add task");
    this._addElement("button", this.taskListContainer, CLASS_CLEAR_LIST_BUTTON, "Clear list");
    this._addElement("div", this.taskListContainer, CLASS_LIST_ITEMS);
    this.clearListBtn = this.taskListContainer.querySelector("." + CLASS_CLEAR_LIST_BUTTON);
    this.taskList = this.taskListContainer.querySelector("." + CLASS_TASK_LIST);
    this.input = this.taskListContainer.querySelector("." + CLASS_ENTER_TASK);
    this.addTaskBtn = this.taskListContainer.querySelector("." + CLASS_ADD_TASK_BUTTON);
    this.addTaskBtn.addEventListener("click", this.addTaskAndRerender.bind(this));
    this.clearListBtn.addEventListener("click", this.clearList.bind(this));
    this.renderTasks();
  }

  addTaskAndRerender() {
    if (this.input.value.length) {
      this.addTask(this.input.value);
      this.input.value = "";
      this.renderTasks();
    }
  }

  deleteTaskAndRerender(e: HTMLElementEvent<HTMLButtonElement>) {
    this.deleteTask(e);
    this.renderTasks();
  }
  initItemList(task: Todo) {
    const taskItem = document.createElement("div");
    this._addElement("div", taskItem, "task-text", task.name);
    taskItem.classList.add("list-item");
    taskItem.setAttribute(DATA_ID_ATTRIBUTE, String(task.id));
    const manageTask = document.createElement('div');
    manageTask.className = CLASS_MANAGE_TASK;
    taskItem.appendChild(manageTask);
    const statusSelector = document.createElement('select');
    manageTask.appendChild(statusSelector);
    const optionStatusPlan = document.createElement('option');
    optionStatusPlan.value = "plan";
    optionStatusPlan.text = "plan";
    statusSelector.appendChild(optionStatusPlan);
    const optionStatusPending = document.createElement('option');
    optionStatusPending.value = "pending";
    optionStatusPending.text = "pending";
    statusSelector.appendChild(optionStatusPending);
    const optionStatusSolved = document.createElement('option');
    optionStatusSolved.value = "solved";
    optionStatusSolved.text = "solved";
    statusSelector.appendChild(optionStatusSolved);
    statusSelector.addEventListener("change", this.changeTaskStatus.bind(this));
    statusSelector.value = task.status;
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(CLASS_DELETE_TASK_BUTTON);
    deleteBtn.addEventListener("click", this.deleteTaskAndRerender.bind(this));
    deleteBtn.innerText = "Delete"
    manageTask.appendChild(deleteBtn);
    return taskItem;
  }
}

const createTaskList = new TaskList("task-list-wrapper");
createTaskList.init();
