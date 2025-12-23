

const API_URL='/api/task/';
const todoList=document.getElementById('todo-list');
const todoForm=document.getElementById('todo-form');

// 1. Read (Initial load)

async function fetchAndRenderTasks(){
    try{
        const response= await fetch(API_URL)
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const tasks=await response.json();
        todoList.innerHTML='';

        tasks.forEach(task => {
            renderTask(task);
        });
    }
    catch(error){
        console.error('Error fetching tasks:', error);
    }

}


function renderTask(task){
    const listItem=document.createElement('li');

    listItem.setAttribute('data-id', task.id);

    if(task.completed){
        listItem.classList.add('completed');
    }

    listItem.innerHTML=`
    <span class=task-title>${task.title}</span>
    <div class="actions">
        <button class="toggle-btn" data-action="toggle">
        ${task.completed ? 'Undo':'Complete'}
        </button>
        <button class="delete-btn" data-action="delete">Delete</button>
    
    </div>
    `
    todoList.appendChild(listItem);
}


document.addEventListener('DOMContentLoaded', fetchAndRenderTasks)



todoForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    
    const input=document.getElementById('task-input');
    const title=input.value.trim();

    if(!title) return;

    try{
        const response= await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title:title}),
        })

        if (!response.ok) throw new Error('Failed to add task');

        const newTask = await response.json();
        renderTask(newTask);
        input.value='';
    }

    catch (error) {
        console.error('Error creating task:', error);
    }

});




todoList.addEventListener('click', async (e) => {
    const target = e.target;
    // Find the closest list item (the parent of the button)
    const listItem = target.closest('li[data-id]'); 
    if (!listItem) return;

    const taskId = listItem.getAttribute('data-id');
    const DETAIL_URL = `${API_URL}${taskId}/`;

    if (target.dataset.action === 'toggle') {
        // --- PATCH REQUEST (Toggle completed status) ---
        const isCompleted = listItem.classList.contains('completed');
        const newCompletedStatus = !isCompleted;
        
        try {
            const response = await fetch(DETAIL_URL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: newCompletedStatus }),
            });

            if (!response.ok) throw new Error('Failed to update task');

            // Update the frontend state
            listItem.classList.toggle('completed', newCompletedStatus);
            target.textContent = newCompletedStatus ? 'Undo' : 'Complete';

        } catch (error) {
            console.error('Error toggling task:', error);
        }

    } else if (target.dataset.action === 'delete') {
        // --- DELETE REQUEST ---
        try {
            const response = await fetch(DETAIL_URL, {
                method: 'DELETE',
            });
            
            // Django DRF returns 204 No Content on successful deletion
            if (response.status === 204) {
                listItem.remove(); // Remove the element from the DOM
            } else {
                throw new Error('Failed to delete task');
            }

        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
});