import { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import AddItem from './AddItem'
import SearchItem from './SearchItem'

export default function Content() {
	const [items, setItems] = useState(
		JSON.parse(localStorage.getItem('shoppingList')) || []
	)

	const [newItem, setNewItem] = useState('')

	const [search, setSearch] = useState('')

	useEffect(() => {
		localStorage.setItem('shoppingList', JSON.stringify(items))
	}, [items])

	// const setAndSaveItems = itemsData => {

	// 	setItems(newItems)
	// }

	const handleCheck = id => {
		const listItems = items.map(item =>
			item.id === id ? { ...item, checked: !item.checked } : item
		)
		setItems(listItems)
	}

	const handleDelete = id => {
		const filteredItems = items.filter(item => item.id !== id)
		setItems(filteredItems)
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (!newItem) return

		setItems([...items, { id: Date.now(), checked: false, item: newItem }])
		setNewItem('')
	}

	return (
		<main>
			<AddItem
				newItem={newItem}
				setNewItem={setNewItem}
				handleSubmit={handleSubmit}
			/>
			<SearchItem search={search} setSearch={setSearch} />

			{items.length === 0 && <p>No items on the list</p>}
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
