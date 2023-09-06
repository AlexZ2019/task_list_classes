var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var CLASS_TASK_LISTS = "task-lists";
var CLASS_TASK_LIST = "task-list";
var CLASS_LIST_ITEMS = "list-items";
var CLASS_ADD_TASK_BUTTON = "add-task-button";
var CLASS_ENTER_TASK = "enter-task";
var CLASS_DELETE_TASK_BUTTON = "delete-task-button";
var CLASS_CLEAR_LIST_BUTTON = "clear-list-button";
var CLASS_EMPTY_LIST = "empty-list";
var CLASS_MANAGE_TASK = "manage-task";
var CLASS_ADD_TASK = "add-task";
var CLASS_LIST_ITEM = "list-item";
var DATA_ID_ATTRIBUTE = "data-it";
var EMPTY_LIST_TEXT = "List is empty";
var TodoBase = /** @class */ (function () {
    function TodoBase(id, name) {
        this.id = id;
        this.name = name;
    }
    return TodoBase;
}());
var Todo = /** @class */ (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.status = 'plan';
        return _this;
    }
    return Todo;
}(TodoBase));
var Store = /** @class */ (function () {
    function Store(name) {
        this.name = name;
    }
    Store.prototype.save = function (data) {
        localStorage.setItem(this.name, JSON.stringify(data));
    };
    Store.prototype.get = function () {
        if (localStorage.getItem(this.name)) {
            return JSON.parse(localStorage.getItem(this.name));
        }
        return null;
    };
    Store.prototype.delete = function () {
        localStorage.removeItem(this.name);
    };
    return Store;
}());
var TaskManager = /** @class */ (function () {
    function TaskManager(className) {
        this.store = new Store(className);
        var savedTasks = this.store.get();
        this.tasks = savedTasks || [];
        this.taskId = this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 0;
    }
    TaskManager.prototype.changeTaskStatus = function (e) {
        var taskId = Number(e.target.closest("." + CLASS_LIST_ITEM).getAttribute(DATA_ID_ATTRIBUTE));
        this.tasks = this.tasks.map(function (task) {
            if (task.id === taskId) {
                return __assign(__assign({}, task), { status: e.target.value });
            }
            return task;
        });
        this.store.save(this.tasks);
    };
    TaskManager.prototype.addTask = function (value) {
        this.taskId++;
        var newTodo = new Todo(this.taskId, value);
        this.tasks.push(newTodo);
        this.store.save(this.tasks);
    };
    TaskManager.prototype.deleteTask = function (e) {
        var taskId = Number(e.target.closest("." + CLASS_LIST_ITEM).getAttribute(DATA_ID_ATTRIBUTE));
        this.tasks = this.tasks.filter(function (task) { return task.id !== taskId; });
        this.store.save(this.tasks);
    };
    return TaskManager;
}());
var TaskList = /** @class */ (function (_super) {
    __extends(TaskList, _super);
    function TaskList(className) {
        var _this = _super.call(this, className) || this;
        var taskLists = document.querySelector("." + CLASS_TASK_LISTS);
        _this.taskListContainer = document.createElement('div');
        _this.taskListContainer.className = className;
        taskLists.appendChild(_this.taskListContainer);
        return _this;
    }
    TaskList.prototype._addElement = function (tagName, parent, className, innerText) {
        if (className === void 0) { className = ""; }
        if (innerText === void 0) { innerText = ""; }
        var newElement = document.createElement(tagName);
        newElement.className = className;
        newElement.innerText = innerText;
        parent.appendChild(newElement);
    };
    TaskList.prototype.clearList = function () {
        if (this.tasks.length) {
            this.tasks = [];
            this.store.delete();
            this.listItems = this.taskListContainer.querySelector("." + CLASS_LIST_ITEMS);
            this.listItems.remove();
            var emptyList = this.taskListContainer.querySelector("." + CLASS_EMPTY_LIST);
            emptyList.innerHTML = EMPTY_LIST_TEXT;
        }
    };
    TaskList.prototype.renderTasks = function () {
        var _this = this;
        this.listItems = this.taskListContainer.querySelector("." + CLASS_LIST_ITEMS);
        if (this.listItems) {
            this.listItems.remove();
        }
        var emptyList = this.taskListContainer.querySelector("." + CLASS_EMPTY_LIST);
        if (this.tasks.length) {
            if (emptyList.innerHTML) {
                emptyList.innerHTML = "";
            }
            this._addElement("div", this.taskListContainer, CLASS_LIST_ITEMS);
            this.listItems = this.taskListContainer.querySelector("." + CLASS_LIST_ITEMS);
            this.tasks.forEach((function (task) {
                _this.listItems.appendChild(_this.initItemList(task));
            }));
        }
        else {
            emptyList.innerHTML = EMPTY_LIST_TEXT;
        }
    };
    TaskList.prototype.init = function () {
        this._addElement("div", this.taskListContainer, CLASS_TASK_LIST);
        this._addElement("p", this.taskListContainer, CLASS_EMPTY_LIST);
        this._addElement("div", this.taskListContainer, CLASS_ADD_TASK);
        var addTask = document.querySelector("." + CLASS_ADD_TASK);
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
    };
    TaskList.prototype.addTaskAndRerender = function () {
        if (this.input.value.length) {
            this.addTask(this.input.value);
            this.input.value = "";
            this.renderTasks();
        }
    };
    TaskList.prototype.deleteTaskAndRerender = function (e) {
        this.deleteTask(e);
        this.renderTasks();
    };
    TaskList.prototype.initItemList = function (task) {
        var taskItem = document.createElement("div");
        this._addElement("div", taskItem, "task-text", task.name);
        taskItem.classList.add("list-item");
        taskItem.setAttribute(DATA_ID_ATTRIBUTE, String(task.id));
        var manageTask = document.createElement('div');
        manageTask.className = CLASS_MANAGE_TASK;
        taskItem.appendChild(manageTask);
        var statusSelector = document.createElement('select');
        manageTask.appendChild(statusSelector);
        var optionStatusPlan = document.createElement('option');
        optionStatusPlan.value = "plan";
        optionStatusPlan.text = "plan";
        statusSelector.appendChild(optionStatusPlan);
        var optionStatusPending = document.createElement('option');
        optionStatusPending.value = "pending";
        optionStatusPending.text = "pending";
        statusSelector.appendChild(optionStatusPending);
        var optionStatusSolved = document.createElement('option');
        optionStatusSolved.value = "solved";
        optionStatusSolved.text = "solved";
        statusSelector.appendChild(optionStatusSolved);
        statusSelector.addEventListener("change", this.changeTaskStatus.bind(this));
        statusSelector.value = task.status;
        var deleteBtn = document.createElement("button");
        deleteBtn.classList.add(CLASS_DELETE_TASK_BUTTON);
        deleteBtn.addEventListener("click", this.deleteTaskAndRerender.bind(this));
        deleteBtn.innerText = "Delete";
        manageTask.appendChild(deleteBtn);
        return taskItem;
    };
    return TaskList;
}(TaskManager));
var createTaskList = new TaskList("task-list-wrapper");
createTaskList.init();
