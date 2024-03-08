import { useState, useEffect } from 'react'
import getAnimal from '../models/animals'

const AnimalsList = () => {
  const [list, setList] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const [addedListItems, setAddedListItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentAddedListPage, setCurrentAddedListPage] = useState<number>(1);
  const itemsPerPage = 10;
  const listTotalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = list.slice(startIndex, endIndex);
  const currentFilteredList = filteredList.slice(startIndex, endIndex);
  const filteredTotalPages = Math.ceil(filteredList.length / itemsPerPage);
  const totalPages = filteredList.length ? filteredTotalPages : listTotalPages;
  const listToBeRendered = filteredList.length ? currentFilteredList : currentList;
  const addedListStartIndex = (currentAddedListPage - 1) * itemsPerPage;
  const addedListEndIndex = addedListStartIndex + itemsPerPage;
  const currentAddedList = addedListItems.slice(addedListStartIndex, addedListEndIndex);
  const addedListTotalPages = Math.ceil(addedListItems.length / itemsPerPage);

  useEffect(() => {
    // Since we dont have any api to get the animal names, loading it all together
    setList(getAnimal());
  }, [])

  useEffect(() => {
    if (!userInput) {
      setUserInput(''); setFilteredList([]);
    }
  }, [userInput])

  const handleAddItem = (item: string) => {
    // On add item, updating the list with the new item and deleting it from the OG list
    setAddedListItems([item, ...addedListItems]);
    deleteListItem(item);
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
    // deleting the item from list and if the search is on, deleting it from the filtered list as well
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

  const deleteAddedListItem = (listItem: string) => {
    const newList = addedListItems.filter(existingItem => existingItem.toLowerCase() !== listItem.toLowerCase());
    setAddedListItems(newList);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddedListPageChange = (page: number) => {
    setCurrentAddedListPage(page);
  };

  return (
    <div className='flex flex-col mx-auto'>
      <h1 className='flex mx-auto mt-4 text-4xl font-medium' tabIndex={0}>Animal dictionary</h1>
      <div className='flex flex-row space-x-5 mx-auto'>
        <div className="flex flex-col items-center justify-between bg-gray-100 border rounded-md p-6 mt-12 w-fit">
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
              onClick={handleSearch}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              aria-label={`Search ${userInput}`}
            >
              <span aria-hidden="true">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </button>
          </div>
          <div className='w-full px-8 pt-4'>
            <ul>
              {listToBeRendered.map((item, index) => (
                <div className='flex flex-row items-center py-2 justify-between capitalize'key={`${item}-${index}`}>
                  <li>{item}</li>
                  <button onClick={() => handleAddItem(item)} className="text-red-500" aria-label={`Delete ${item}`}>
                    <span aria-hidden="true">
                      <i className="fa-solid fa-plus"></i>
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
        {/* Only on adding items this block will be made visible */}
        <div className="flex flex-col items-center justify-between bg-gray-100 border rounded-md p-6 mt-12 w-fit">
          {!addedListItems.length && <p className='w-full text-2xl pt-12 text-left'>Onclick of plus icon, <br></br>items will be added here</p>}
          <div className={`w-full px-8 pt-12 ${addedListItems.length ? 'visible' : 'invisible'}`}>
            <ul>
              {currentAddedList.map((item, index) => (
                <li className='flex flex-row items-center space-x-10 py-2 justify-between capitalize' key={`${item}-${index}`}>
                  <span>{item}</span>
                  <button onClick={() => deleteAddedListItem(item)} className="text-red-500" aria-label={`Delete ${item}`}>
                    <span aria-hidden="true">
                      <i className="fa-solid fa-trash"></i>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={`flex items-center space-x-4 mt-4 ${addedListItems.length > 10 ? 'visible' : 'invisible'}`}>
            <button
              type="button"
              onClick={() => handleAddedListPageChange(currentAddedListPage - 1)}
              disabled={currentAddedListPage === 1}
              className={`bg-blue-500 text-white py-2 px-4 rounded-md ${currentAddedListPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:border-blue-700'}`}
            >
              Previous
            </button>
            <span className="text-gray-700">{`Page ${currentAddedListPage} of ${addedListTotalPages}`}</span>
            <button
              type="button"
              onClick={() => handleAddedListPageChange(currentAddedListPage + 1)}
              disabled={currentAddedListPage === addedListTotalPages}
              className={`bg-blue-500 text-white py-2 px-4 rounded-md ${currentAddedListPage === addedListTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:border-blue-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimalsList;
