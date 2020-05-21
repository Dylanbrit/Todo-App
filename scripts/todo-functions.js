// Strict mode is important to use because it prevents our code from having random errors that we might not catch until it makes its way to production and can cause data deletion errors or bugs that will be difficult to detect. It helps prevent leaked global variables that can make our code confusing, and it also makes sure we don't try to declare a variable using a keyword that JS is planning on using for the future, in the same sort of way where we cannot declare a variable with the name "let" or "const"
'use strict'

// Read todos from localStorage
// The following function checks to see if we have anything already saved, and returns it if we do
// We start by creating a variable to hold the value returned from reading our saved 'todos'
// The part below checks to see if a value was returned from checking 'todos'
// If there is a value there (as opposed to no value which returns null), we return the parsed version of our data, giving us an object to work with
// If there is no data already saved- null- then we return an empty bracket, allowing us to have a blank canvas to submit data into!
// A new feature we added to this function is the try-catch conditional to allow us to still run our program if the data in localStorage is invalid. If everything goes smoothly, we either parse the data in todosJSON (our data in localStorage) or return an empty bracket. If we do have an error, we want to return an empty bracket anyway, so it can allow us to start with fresh data even if there is an error in localStorage
const getSavedTodos = () => {
    const todosJSON = localStorage.getItem('todos')
    try {
        return todosJSON ? JSON.parse(todosJSON) : []
    } catch {
        return []
    }
}

// Save todos to localStorage
// This is a function that uses localStorage to save the "todos"
// The first argument for setItem is the key, which is "todos", and the second is the value, which is the stringified version of our todos
const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

// Remove a todo from the list by its id
// This function will find the index of the todos (its position in our list starting with 0). Once found, we return when the id passed in matches and existing id
// If the index is greater than -1 (all indexes are, so if we have a match then it will be), we splice it out using its index number
const removeTodo = (id) => {
    const todoIndex = todos.findIndex((todo) => todo.id === id)

    if (todoIndex > -1) {
        todos.splice(todoIndex, 1)
    }
}

// Toggle the completed value for a given todo
// Here we are creating our toggleTodo function. The purpose of this is to respond to changes in the checkbox, so that we can change the completed status of a selected todo
// First, we need to find a match to make sure we our working with the correct individual todo. To do this, we use the .find method, which lets us set up our function, going over each todo (use as the argument) and we return when we have a match. When do we have a match? When the id for an individual todo matches the id passed through. The id passed throuh is todo.id, coming from our todo array.
// Now, there is a chance that we do not return a match, so we need to specify. If we return a match, we want to toggle the completed status. We check to see if the match variable stored under 'todo' is not undefined (meaning a value was returned), and if it is defined (meaning it is a match), then we turn it from completed to incomplete
const toggleTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id)

    if (todo) {
        todo.completed = !todo.completed
    }
}

// Render filtered todos
// We are setting up filteredTodos to filter our searches
// When the todo text includes the text typed into the search text area, we store that match in searchTextMatch
// For the variable hideCompletedMatch, we are setting it up to make our checkbox remove all completed todos when it is checked
// By returning !filters.hideCompleted, we will see ALL todos when the checkbox is unchecked and none when it is checked, which is not quite what we want, so we also check !todo.completed to see if a todo is not completed. This will always return false for todos that have been completed and true for todos that have not been completed, always keeping our incomplete todos using the "or" logical operator
const renderTodos = (todos, filters) => {
    const todoEl = document.querySelector('#todos')
    let filteredTodos = todos.filter((todo) => {
        const searchTextMatch = todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
        const hideCompletedMatch = !filters.hideCompleted || !todo.completed

        return searchTextMatch && hideCompletedMatch
        })
    
    const incompleteTodos = filteredTodos.filter((todo) => !todo.completed)
    // innerHTML makes it so that the todos list clears when filtered, so that we aren't seeing our filtered list tacked on to the end of the full, unfiltered list
    todoEl.innerHTML = ''
    todoEl.appendChild(generateSummaryDOM(incompleteTodos))
    // Below we are making sure that for each todo on the list, we are appending the function that generates our individual todos to the list
    if (filteredTodos.length > 0) {
        filteredTodos.forEach((todo) => {
            todoEl.appendChild(generateTodoDOM(todo))
    })} else {
        const messageEl = document.createElement('p')
        messageEl.classList.add('empty-message')
        messageEl.textContent = 'There are no todos to show'
        todoEl.appendChild(messageEl)
    }
}

// Get the DOM elements for an individual todo
// This creates a function that creates a paragraph and establishes its text as whatever is in "todo", then it returns it
// p is created as a variable that holds the value of the created element, which is a paragraph. textContent is used to make the text content of the paragraph equivalent to the value of the "text" of a "todo", then we return it
// To make it easier to attach our checkbox and button to each text element, we create a div to contain everything in one package- checkbox, text, and button all under one div
// setAttribute is a specific way to set up a checkbox that was given to me by the instructor
// todoEl is our div that contains everything- text, button, and checkbox
// We use span to make it so the text is on the same line as everything else
// We set up our checkbox as an input first, and update it later with setAttribute
// Then we just append everything to our container div and return it and voila!
const generateTodoDOM = (todo) => {
    const todoEl = document.createElement('label')
    const containerEl = document.createElement('div')
    const checkbox = document.createElement('input')
    const todoText = document.createElement('span')
    const removeButton = document.createElement('button')
    // Setup todo checkbox
    // When the checkbox is checked, the todo status is changed to completed
    // We set up an event listener to make our checkbox work, so that when we check it our toggleTodo function runs its code
    checkbox.setAttribute('type', 'checkbox')
    checkbox.checked = todo.completed
    containerEl.appendChild(checkbox)
    checkbox.addEventListener('change', (e) => {
        toggleTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters)
    })

    // Setup todo text
    todoText.textContent = todo.text
    containerEl.appendChild(todoText)

    // Setup container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

    // Setup button
    removeButton.textContent = 'Remove'
    removeButton.classList.add('button', 'button--text')
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', (e) => {
        removeTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters)
    })

    return todoEl
}

// Get the DOM element for the list summary
// This creates a function that utilizes "incompleteTodos" to create and return a summary describing how many incomplete todos are left to do
// summary is created as a variable that holds the value of the created element, which is an h2. textContent is used to make the text content of the heading a sentence that relays the length of todos that have not been completed, then we return it
const generateSummaryDOM = (incompleteTodos) => {
    const summary = document.createElement('h2')
    summary.classList.add('list-title')
    if (incompleteTodos.length === 1) {
        summary.textContent = `You have ${incompleteTodos.length} todo left`
    } else {
        summary.textContent = `You have ${incompleteTodos.length} todos left`
    }
    return summary
}



// CRUD- create, read, update, delete
// setItem takes two arguments, the key and the value
// getItem reads the stored data, taking just one argument- the key. The value is what comes back from this as the return value
// setItem also updates, using the same arguments with a new value
// removeItem deletes data using the key for the data to be removed as a single argument
// clear deletes all data in localStorage

// JSON (java script object notation) is used to convert strings into objects and vice versa
// JSON.stringify takes in an object or array and returns a string
// JSON.parse takes in a string and converts it into an object
// Third-party libraries is JS code someone else wrote
// github uuid- uuid stands for Universally Unique Identifier