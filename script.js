document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();

        // Check if the input is not empty
        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        // 1. Create the new list item element
        const listItem = document.createElement('li');

        // 2. Add the task text
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        listItem.appendChild(taskSpan);

        // 3. Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        // 4. Attach event listener to delete the task
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
        });

        // 5. Attach event listener to toggle 'completed' status
        listItem.addEventListener('click', (e) => {
            // Check if the click was not on the delete button
            if (e.target !== deleteButton) {
                listItem.classList.toggle('completed');
            }
        });

        // Append the delete button to the list item
        listItem.appendChild(deleteButton);

        // Append the new list item to the main task list
        taskList.appendChild(listItem);

        // Clear the input field
        taskInput.value = '';
    }

    // Event listener for the "Add Task" button
    addTaskButton.addEventListener('click', addTask);

    // Event listener to allow adding task with the Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
