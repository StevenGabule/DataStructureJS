import { nanoid } from 'nanoid';
import React from 'react';

const INITIAL_DATA = {
  title: '',
  label: 'do-now',
  priorityLevel: 'high',
  dueDate: '',
}

export default function App() {
  const [todos, setTodos] = React.useState([]);
  const [prevTodos, setPrevTodos] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false)
  const [addTodo, setAddTodo] = React.useState(INITIAL_DATA)
  const [showModal, setShowModal] = React.useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addTodo.id) {
      const updatedTodo = todos.map(todo => {
        if (todo.id == addTodo.id) {
          return {
            ...todo,
            title: addTodo.title,
            label: addTodo.label,
            dueDate: addTodo.dueDate,
            priorityLevel: addTodo.priorityLevel,
          }
        }
        return todo;
      })
      setTodos(updatedTodo)
      setPrevTodos(updatedTodo)
    } else {
      const newTodo = { ...addTodo, id: nanoid(), dateCreated: new Date().toISOString() }
      setTodos([...todos, newTodo])
      setPrevTodos([...todos, newTodo])
    }

    setAddTodo(INITIAL_DATA);
    setIsEditing(false)
    setShowModal(false)
  }

  const handleChange = (e) => {
    const { value, name } = e.target;
    setAddTodo(prev => ({ ...prev, [name]: value }))
  }

  const handleCloseModal = () => {
    setIsEditing(false)
    setShowModal(false)
    setAddTodo(INITIAL_DATA);
  }

  const handleDelete = (id) => {
    if (id) {
      const filterTodos = todos.filter(todo => todo.id !== id);
      setTodos(filterTodos)
    }
  }

  const handleTitleSearch = (e) => {
    const { value } = e.target;
    if (todos.length > 0 && value.length > 3) {
      const searchTodos = prevTodos.filter(todo => todo.title.toLowerCase().includes(value.toLowerCase()));
      setTodos(searchTodos)
    }

    if (value === '') {
      setTodos(prevTodos)
    }
  }

  const handleLabelChangeFilter = (e) => {
    const { value } = e.target;
    console.log({ value })
    if (todos.length > 0 && value.length > 3) {
      const labelTodos = prevTodos.filter(todo => todo.label.toLowerCase().includes(value.toLowerCase()));
      setTodos(labelTodos)
    }

    if (value === 'all') {
      setTodos(prevTodos)
    }
  }

  console.log(prevTodos);


  return (
    <>
      <div className='py-6 max-w-3/5 mx-auto'>
        <h3 className='text-2xl text-center mb-5'>Advanced Todo App</h3>
        <div className="grid grid-cols-3 gap-4 items-end mb-5">
          <div className='flex flex-col'>
            <label htmlFor="search" className='font-semibold text-xs mb-3'>Search:</label>
            <input type="search" onChange={handleTitleSearch} placeholder='Search' className='border-2 border-gray-300 p-3 rounded-2xl text-xs' />
          </div>

          <div className='flex flex-col'>
            <label htmlFor="search-label" className='font-semibold text-xs mb-3'>Label:</label>
            <select name="search-label" onChange={handleLabelChangeFilter} id="search-label" className='border-2 p-3 rounded-2xl border-gray-300  text-xs' >
              <option value="all">All</option>
              <option value="do-now">Do Now</option>
              <option value="schedule">Schedule</option>
              <option value="delegate">Delegate</option>
              <option value="eliminate">Eliminate</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor="search-filter" className='font-semibold text-xs mb-3'>Priority Level:</label>
            <select name="search-filter" id="search-filter" className='border-2 p-3 rounded-2xl border-gray-300  text-xs' >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className='col-span-2 grid grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <label htmlFor="dateFrom" className='font-semibold text-xs mb-3'>Date From:</label>
              <input type="date" id="dateFrom" className='border-2 p-3 rounded-2xl border-gray-300  text-xs' />
            </div>

            <div className='flex flex-col'>
              <label htmlFor="dateTo" className='font-semibold text-xs mb-3'>Date To:</label>
              <input type="date" id="dateTo" className='border-2 p-3 rounded-2xl border-gray-300  text-xs' />
            </div>
          </div>

        </div>

        <div className='max-w-full'>
          <div className='mb-5'>
            <button
              onClick={() => setShowModal(true)}
              type='button'
              data-modal='addNewTodoModal'
              className='bg-gray-950 block px-10 py-2 text-xs text-white rounded-2xl cursor-pointer hover:bg-blue-500 modal-trigger'
            >
              New
            </button>
          </div>
          <table className="w-full border-collapse border border-gray-400 bg-white text-xs ">
            <thead>
              <tr>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">ID</th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">Title</th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">Priority Level</th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">Label</th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">Due Date</th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">Date Created</th>
                <th className="border border-gray-300 p-4 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id}>
                  <td className="border border-gray-300 p-4 text-gray-600 ">#{todo.id}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 ">{todo.title}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 ">{todo.priorityLevel}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 ">{todo.label}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 ">{new Date(todo.dueDate).toDateString()}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 ">{new Date(todo.dateCreated).toDateString()}</td>
                  <td className="border border-gray-300 p-4 text-gray-500 flex gap-1">
                    <button type='button' onClick={() => {
                      setShowModal(true);
                      setIsEditing(true);
                      setAddTodo(todo)
                    }} className='bg-blue-500 text-white px-2 py-1 rounded-2xl cursor-pointer'>Edit</button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      type='button' className='bg-red-500 text-white px-2 py-1 rounded-2xl cursor-pointer'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

      {showModal && <div className='modal-overlay' role='dialog' aria-labelledby='modalTitle' aria-hidden="true">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{isEditing ? `Edit Todo` : 'New Todo'}</h3>
            <button className='modal-close' onClick={handleCloseModal} data-close aria-label='Close'>&times;</button>
          </div>
          <div className="modal-body">

            <form onSubmit={handleSubmit}>
              <div className='flex flex-col mb-3'>
                <label htmlFor="search" className='font-semibold text-xs mb-3'>Title:</label>
                <input onChange={handleChange} name='title' value={addTodo.title} type="search" placeholder='Search' className='border-2 border-gray-300 p-3 rounded-2xl text-xs' />
              </div>

              <div className='flex flex-col mb-3'>
                <label htmlFor="search-label" className='font-semibold text-xs mb-3'>Label:</label>
                <select onChange={handleChange} defaultValue={addTodo.label} name="label" id="search-label" className='border-2 p-3 rounded-2xl border-gray-300  text-xs' >
                  <option value="do-now" >Do Now</option>
                  <option value="schedule">Schedule</option>
                  <option value="delegate">Delegate</option>
                  <option value="eliminate">Eliminate</option>
                </select>
              </div>

              <div className='flex flex-col mb-3'>
                <label htmlFor="priorityLevel" className='font-semibold text-xs mb-3'>Priority Level:</label>
                <select onChange={handleChange} defaultValue={addTodo.priorityLevel} name="priorityLevel" id="priorityLevel" className='border-2 p-3 rounded-2xl border-gray-300  text-xs' >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className='flex flex-col mb-3'>
                <label htmlFor="dateTo" className='font-semibold text-xs mb-3'>Due Date:</label>
                <input onChange={handleChange} value={addTodo.dueDate} name='dueDate' type="datetime-local" id="dateTo" className='border-2 p-3 rounded-2xl border-gray-300  text-xs' />
              </div>

              <button
                type='submit'
                data-modal='addNewTodoModal'
                className='bg-gray-950 block px-10 py-2 text-xs text-white rounded-2xl cursor-pointer hover:bg-blue-500 modal-trigger'
              >
                {isEditing ? 'Save Changes' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>}
    </>
  )
}

