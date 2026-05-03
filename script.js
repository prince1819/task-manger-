// GET ELEMENTS
const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("search");
const filter = document.getElementById("filterCategory");

// STORE TASKS
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

// SAVE TO LOCAL STORAGE
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD / UPDATE TASK
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value;

    if (title === "") {
        alert("Title is required");
        return;
    }

    if (editId) {
        // UPDATE
        const task = tasks.find(t => t.id === editId);
        task.title = title;
        task.desc = desc;
        task.priority = priority;
        task.category = category;

        editId = null;
    } else {
        // ADD
        const task = {
            id: Date.now(),
            title,
            desc,
            priority,
            category,
            completed: false
        };

        tasks.push(task);

        if (priority === "high") {
            showNotification("🔥 High priority task added!");
        }
    }

    saveTasks();
    renderTasks(tasks);
    form.reset();
});

// RENDER TASKS
function renderTasks(taskArray) {
    list.innerHTML = "";

    taskArray.forEach(task => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = `${task.title} - ${task.desc} (${task.priority}) [${task.category}]`;

        if (task.completed) {
            span.classList.add("completed");
        }

        // COMPLETE
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.onclick = () => {
            task.completed = !task.completed;

            if (task.priority === "high") {
                showNotification("High priority task completed!");
            }

            saveTasks();
            renderTasks(tasks);
        };

        // DELETE
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            tasks = tasks.filter(t => t.id !== task.id);

            // ✅ FIX: reset edit mode if needed
            if (editId === task.id) {
                editId = null;
            }

            saveTasks();
            renderTasks(tasks);
        };

        // EDIT
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            document.getElementById("title").value = task.title;
            document.getElementById("description").value = task.desc;
            document.getElementById("priority").value = task.priority;
            document.getElementById("category").value = task.category;

            editId = task.id;
        };

        li.appendChild(span);
        li.appendChild(completeBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}

// SEARCH
searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(keyword) ||
        t.desc.toLowerCase().includes(keyword)
    );

    renderTasks(filtered);
});

// FILTER
filter.addEventListener("change", function () {
    const value = this.value;

    if (value === "all") {
        renderTasks(tasks);
    } else {
        const filtered = tasks.filter(t => t.category === value);
        renderTasks(filtered);
    }
});

// NOTIFICATION
function showNotification(msg) {
    const note = document.getElementById("notification");
    note.textContent = msg;
    note.style.display = "block";

    setTimeout(() => {
        note.style.display = "none";
    }, 3000);
}

// THEME TOGGLE
// ✅ SAFE THEME TOGGLE (runs after page loads)
document.addEventListener("DOMContentLoaded", function () {

    const themeBtn = document.getElementById("themeToggle");

    if (!themeBtn) {
        console.log("❌ Button not found");
        return;
    }

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    themeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });

});
// INITIAL LOAD
renderTasks(tasks);
