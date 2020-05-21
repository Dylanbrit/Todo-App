// Strict mode is important to use because it prevents our code from having random errors that we might not catch until it makes its way to production and can cause data deletion errors or bugs that will be difficult to detect. It helps prevent leaked global variables that can make our code confusing, and it also makes sure we don't try to declare a variable using a keyword that JS is planning on using for the future, in the same sort of way where we cannot declare a variable with the name "let" or "const"
'use strict'

// Establishing the todos variable to equal the product of the getSavedTodos function
// If there is already existing data saved, then todos will have that in object form
// If there is not anything saved, todos will be blank
let todos = getSavedTodos()

// For any application where we filter data, we set up a filters object where we can store our latest filters
// searchText is left blank, so that the data that users enter is submitted in as the value for that property
const filters = {
    searchText: '',
    hideCompleted: false
}

// We always call a function once outside of anything else so that it fires, then we call it again in every event handler so that the data refreshes with the new changes and filters
renderTodos(todos, filters)

document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value
    renderTodos(todos, filters)
})

// Below we are adding some functionality to our button, starting our function with e.preventDefault() to prevent the normal stuff it will try to do and allow us to make up our own ideas for what needs to happen
// We use the 'push' method on "todos" to add an object. This object contains the todo title and its completion status
// We set the text equal to the value of our input so that the todo that is pushed into the array is what the user types in, and we set the completed value to false, since nobody will be adding a completed todo to a list of todos
// We then call our saveTodos function (see todo-functions.js) to save our new todo to localStorage as a string (don't worry, once we check localStorage for the data we will parse this data into an object)
// We add e.target.elements.addTodo.value = '' into this function so that the text field for our input bar is cleared after the button is clicked
// And, as we do with all of our functions for this app, we re-render todos by calling our renderTodos function with our arguments of todos and filters, so that it reprocesses and shows us the new information
document.querySelector('#new-todo').addEventListener('submit', (e) => {
    const trimmedText = e.target.elements.text.value.trim()
    e.preventDefault()

    if (trimmedText.length > 0) {
        todos.push({
            id: uuidv4(),
            text: trimmedText,
            completed: false
        })
        saveTodos(todos)
        e.target.elements.text.value = ''
        renderTodos(todos, filters)
    }
})

// In progress...
document.querySelector('#hide-completed').addEventListener('change', (e) => {
    filters.hideCompleted = e.target.checked
    renderTodos(todos, filters)
})