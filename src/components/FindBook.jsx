import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FindBook = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [foundBooks, setFoundBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const modalItemsPerPage = 1; // Items per page in the modal

  // Fetch all books from the backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://unique-healing-production.up.railway.app/api/library/getBook/allBook"
        );
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search type change
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (searchType === "title") {
        response = await axios.get(
          `https://unique-healing-production.up.railway.app/api/library/getBook/title/${searchQuery}`
        );
      } else if (searchType === "author") {
        response = await axios.get(
          `https://unique-healing-production.up.railway.app/api/library/getBook/author/${searchQuery}`
        );
      } else if (searchType === "isbn") {
        response = await axios.get(
          `https://unique-healing-production.up.railway.app/api/library/getBook/isbn/${searchQuery}`
        );
      }

      if (response.data.length > 0) {
        setFoundBooks(response.data);
        setModalMessage(`${response.data.length} Book/s found successfully!`);
      } else {
        setFoundBooks([]);
        setModalMessage("No book/s found!");
      }
    } catch (error) {
      setFoundBooks([]);
      setModalMessage("Error searching books!");
    }
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setModalCurrentPage(1); // Reset modal page to 1 when closing
  };

  // Calculate the current items to display in the main table
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = books.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the current items to display in the modal
  const modalIndexOfLastItem = modalCurrentPage * modalItemsPerPage;
  const modalIndexOfFirstItem = modalIndexOfLastItem - modalItemsPerPage;
  const currentModalItems = foundBooks.slice(
    modalIndexOfFirstItem,
    modalIndexOfLastItem
  );

  // Handle page change for main table
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle page change for modal
  const handleModalPageChange = (pageNumber) => {
    setModalCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const totalModalPages = Math.ceil(foundBooks.length / modalItemsPerPage);

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 border-ternary hover:bg-ternary hover:text-white  rounded ${
            currentPage === i
              ? "bg-primary text-white border-4"
              : "bg-white text-primary"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center my-6">
        <button
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 mx-1 hover:text-primary font-semibold rounded-md bg-white hover:bg-ternary text-primary ease-in-out duration-300"
          disabled={currentPage === 1}
        >
          &laquo; First Page
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 mx-1 hover:text-primary font-semibold rounded-md bg-white hover:bg-ternary text-primary ease-in-out duration-300"
          disabled={currentPage === 1}
        >
          &laquo; Back
        </button>
        {pageNumbers}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 mx-1 hover:text-primary font-semibold rounded-md bg-white hover:bg-ternary text-primary ease-in-out duration-300"
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 mx-1 hover:text-primary font-semibold rounded-md bg-white hover:bg-ternary text-primary ease-in-out duration-300"
          disabled={currentPage === totalPages}
        >
          Last Page &raquo;
        </button>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex items-center justify-center  mt-[3%] ">
          <div>
            <Link
              to="/homePageAdmin"
              className="px-4 lg:ml-[-340%] py-2 mx-1 hover:text-primary font-semibold rounded-md bg-white hover:bg-ternary text-primary ease-in-out duration-300"
            >
              Go Back
            </Link>
          </div>
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="mr-2 p-2 border"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder={`Search by ${searchType}`}
            className="p-2 border"
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-ternary text-primary font-medium hover:text-white  ease-in-out duration-300 rounded"
          >
            Search
          </button>
        </div>
      </form>
      <table className=" w-[90%] my-[3%] mx-auto mdivide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
              ISBN
            </th>
            <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
              Publisher
            </th>
            <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
              Location
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((book, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                {indexOfFirstItem + index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {book.bookTitle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {book.bookISBN}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {book.bookAuthor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {book.bookYearPublished}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {book.bookPublisher}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {book.bookPublicationPlace}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPaginationButtons()}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-white text-lg p-8 rounded shadow-lg space-y-4 border-2 border-dashed border-primary">
            <p>{modalMessage}</p>
            {currentModalItems.map((book, index) => (
              <div key={index} className="mt-4">
                <p>
                  <strong>Title:</strong> {book.bookTitle}
                </p>
                <p>
                  <strong>ISBN:</strong> {book.bookISBN}
                </p>
                <p>
                  <strong>Author:</strong> {book.bookAuthor}
                </p>
                <p>
                  <strong>Year:</strong> {book.bookYearPublished}
                </p>
                <p>
                  <strong>Publisher:</strong> {book.bookPublisher}
                </p>
                <p>
                  <strong>Location:</strong> {book.bookPublicationPlace}
                </p>
              </div>
            ))}
            {foundBooks.length > 1 && (
              <div className="flex justify-between mt-4 gap-4 ">
                <button
                  onClick={() => handleModalPageChange(modalCurrentPage - 1)}
                  className="mt-4 px-4  w-full  bg-primary font-medium text-ternary py-2 rounded hover:bg-ternary hover:text-primary  ease-in-out duration-300 "
                  disabled={modalCurrentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => handleModalPageChange(modalCurrentPage + 1)}
                  className="mt-4 px-4  w-full  bg-primary font-medium text-ternary py-2 rounded hover:bg-ternary hover:text-primary  ease-in-out duration-300 "
                  disabled={modalCurrentPage === totalModalPages}
                >
                  Next
                </button>
              </div>
            )}
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4  w-full  bg-primary font-medium text-ternary py-2 rounded hover:bg-ternary hover:text-primary  ease-in-out duration-300 "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindBook;
