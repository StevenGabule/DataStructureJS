// Closure Basics
function outerFunction(x) {
	return function innerFunction(y) {
		return x + y;
	}
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8

function useCounter(initialValue = 0) {
	const [count, setCount] = useState(initialValue);
	const increment = () => setCount(prev => prev + 1);
	const decrement = () => setCount(prev => prev - 1);
	const reset = () => setCount(initialValue)
	return { increment, decrement, reset }
}

// Event handler closures (common react patterns)
function TodoList() {
	const [todos, setTodos] = useState([])
	const createDeleteHandler = (todoId) => {
		return () => {
			setTodos(prev => prev.filter(todo => todo.id !== todoId))
		}
	}

	return (
		<ul>
			{todos.map(todo => (
				<li key={todo.id}>
					{todo.text}
					<button onClick={createDeleteHandler(todo.id)}>Delete</button>
				</li>
			))}
		</ul>
	)
}