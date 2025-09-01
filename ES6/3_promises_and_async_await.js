
// Promise Basics
const fetchUserData = (userId) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (userId > 0) {
				resolve({ id: userId, name: 'John Doe' })
			} else {
				reject(new Error('Invalid user ID'))
			}
		}, 1000);
	})
}

// Promise Chaining
fetchUserData(1).then(user => {
	console.log('User: ', user);
	return fetchUserPosts(user.id)
}).then(posts => console.log('Posts:', posts))
	.catch(error => console.error('Error:', error));

// Async/Await (Modern approach - Essential for react)
async function getUserWithPosts(userId) {
	try {
		const user = await fetchUserData(userId)
		const posts = await fetchUserPosts(user.id)
		return { user, posts }
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		throw error;
	}
}

// React useEffect with Async
useEffect(() => {
	const loadData = async () => {
		try {
			const data = await getUserWithPosts(1)
			setUserData(data)
		} catch (error) {
			setError(error.message)
		}
	}
	loadData();
}, [])

