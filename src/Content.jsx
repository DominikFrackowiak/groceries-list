import { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import AddItem from './AddItem'
import SearchItem from './SearchItem'
import apiRequest from './apiRequest'

export default function Content() {
	const API_URL = 'http://localhost:3000/items'

	const [items, setItems] = useState([])
	const [newItem, setNewItem] = useState('')
	const [search, setSearch] = useState('')
	const [fetchError, setFetchError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(API_URL)
				if (!response.ok) throw Error('could not fetch the data')
				const data = await response.json()
				console.log(data)
				setItems(data)
				setFetchError(null)
			} catch (err) {
				setFetchError(err.message)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	const handleCheck = async id => {
		const listItems = items.map(item =>
			item.id === id ? { ...item, checked: !item.checked } : item
		)
		setItems(listItems)

		const myItem = listItems.filter(item => item.id === id)

		const updateOptions = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ checked: myItem[0].checked }),
		}

		const reqUrl = `${API_URL}/${id}`
		const result = await apiRequest(reqUrl, updateOptions)
		if (result) setFetchError(result)
	}

	const handleDelete = async id => {
		const filteredItems = items.filter(item => item.id !== id)
		setItems(filteredItems)

		const deleteOptions = {
			method: 'DELETE',
		}
		const reqUrl = `${API_URL}/${id}`
		const result = await apiRequest(reqUrl, deleteOptions)
		if (result) setFetchError(result)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (!newItem) return

		const myNewItem = { id: Date.now(), checked: false, item: newItem }
		setItems([...items, myNewItem])

		const postOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(myNewItem),
		}

		const result = await apiRequest(API_URL, postOptions)
		if (result) setFetchError(result)

		setNewItem('')
	}

	return (
		<main>
			{isLoading && (
				<p style={{ color: 'red', marginTop: '10px' }}>Loading...</p>
			)}
			{fetchError && (
				<p style={{ color: 'red', marginTop: '10px' }}>{fetchError}</p>
			)}
			<AddItem
				newItem={newItem}
				setNewItem={setNewItem}
				handleSubmit={handleSubmit}
			/>
			<SearchItem search={search} setSearch={setSearch} />

			{!fetchError && items.length === 0 && <p>No items on the list</p>}

			<ul>
				{items
					.filter(item =>
						item.item.toLowerCase().includes(search.toLowerCase())
					)
					.map(item => (
						<li key={item.id} className='item'>
							<input
								type='checkbox'
								checked={item.checked}
								onChange={() => handleCheck(item.id)}
							/>
							<label
								style={item.checked ? { textDecoration: 'line-through' } : null}
								onDoubleClick={() => handleCheck(item.id)}
							>
								{item.item}
							</label>
							<FaTrashAlt
								role='button'
								tabIndex='0'
								onClick={() => handleDelete(item.id)}
							/>
						</li>
					))}
			</ul>
		</main>
	)
}
