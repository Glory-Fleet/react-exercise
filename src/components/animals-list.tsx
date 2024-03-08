import { useState, useEffect } from 'react'
import getAnimal from '../models/animals'

const AnimalsList = () => {
  const [list, setList] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const listTotalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = list.slice(startIndex, endIndex);
  const currentFilteredList = filteredList.slice(startIndex, endIndex);
  const filteredTotalPages = Math.ceil(filteredList.length / itemsPerPage);
  const totalPages = filteredList.length ? filteredTotalPages : listTotalPages;
  const listToBeRendered = filteredList.length ? currentFilteredList : currentList;

  useEffect(() => {
    setList(getAnimal());
  }, [])

  useEffect(() => {
    if (!userInput) {
      setUserInput(''); setFilteredList([]);
    }
  }, [userInput])

  const handleAddItem = () => {
    if (!userInput) return;
    if (list.includes(userInput)) {
      alert('Animal name is already present!');
    } else {
      setList([userInput, ...list]);
    }
    if (filteredList.length) {
      setFilteredList([]);
    }
    setCurrentPage(1);
    setUserInput('');
  }

  const handleSearch = () => {
    if (!userInput) return;
    const results = list.filter((item) =>
      item.toLowerCase().includes(userInput.toLowerCase())
    );
    if (results.length) {
      setFilteredList(results);
    } else {
      return alert('Animal name is not present!');
    }
    setCurrentPage(1);
  };

  const deleteListItem = (listItem: string) => {
    const newList = list.filter(existingItem => existingItem.toLowerCase() !== listItem.toLowerCase());
    setList(newList);
    if (filteredList.length) {
      const newFilteredList = filteredList.filter(existingItem => existingItem.toLowerCase() !== listItem.toLowerCase());
      if (!newFilteredList.length) {
        setUserInput('');
      }
      setFilteredList(newFilteredList)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='flex flex-col mx-auto'>
      <h1 className='flex mx-auto mt-4 text-4xl font-medium' tabIndex={0}>Animal dictionary</h1>
      <div className="flex flex-col items-center justify-center bg-gray-100 border rounded-md p-6 mt-12 w-fit mx-auto">
        <div className='flex flex-row space-x-3'>
          <label htmlFor="animalInput" className="sr-only">
            Enter animal name
          </label>
          <input
            type="search"
            id="animalInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter animal name"
            className="py-2 px-4 border border-gray-300 rounded-md focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-green-500 text-white py-2 px-4 rounded-md"
            aria-label={`Add ${userInput}`}
          >
            <span aria-hidden="true">
              <i className="fa-solid fa-plus"></i>
            </span>
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            aria-label={`Search ${userInput}`}
          >
            <span aria-hidden="true">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </button>
        </div>
        <div>
          <ul>
            {listToBeRendered.map((item, index) => (
              <div className='flex flex-row items-center space-x-10 py-2 justify-between capitalize' key={index}>
                <li>{item}</li>
                <button onClick={() => deleteListItem(item)} className="text-red-500" aria-label={`Delete ${item}`}>
                  <span aria-hidden="true">
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </button>
              </div>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-blue-500 text-white py-2 px-4 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:border-blue-700'}`}
          >
            Previous
          </button>
          <span className="text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`bg-blue-500 text-white py-2 px-4 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:border-blue-700'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimalsList
