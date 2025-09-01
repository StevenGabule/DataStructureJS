// 'this' in regular functions
const obj = {
	name: 'Component',
	regularFunction: function () {
		console.log(this.name);
	},
	arrowFunction: () => {
		console.log(this.name);
	}
}

// Why functional components are preferred
function FunctionComponent() {
	const [count, setCount] = useState(0)

	const handleClick = () => {
		setCount(count + 1)
	}

	return <button onClick={handleClick}>Count: {count}</button>
}