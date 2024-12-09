import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderAdmin from "./HeaderAdmin"; // Ensure this import is correct
import "flowbite";
import Library from "../assets/library2.png";
const HomePageAdmin = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [newBook, setNewBook] = useState({
    bookTitle: "",
    bookAuthor: "",
    bookPublisher: "",
    bookYearPublished: "",
    bookISBN: "",
    bookPublicationPlace: "",
    bookShelfSection: "",
  });

  const [editingBookId, setEditingBookId] = useState(null);
  const [editingBook, setEditingBook] = useState({
    bookTitle: "",
    bookAuthor: "",
    bookPublisher: "",
    bookYearPublished: "",
    bookISBN: "",
    bookPublicationPlace: "",
    bookShelfSection: "",
  });

  // Fetch books from the backend API
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

  // Handle form input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "bookISBN") {
      if (/^\d{0,13}$/.test(value)) {
        setNewBook((prevBook) => ({
          ...prevBook,
          [id]: value,
        }));
      }
    } else {
      setNewBook((prevBook) => ({
        ...prevBook,
        [id]: value,
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newBook.bookISBN.length !== 10 && newBook.bookISBN.length !== 13) {
      setModalMessage("ISBN must be 10 or 13 digits only");
      setShowModal(true);
      return;
    }
    try {
      const response = await axios.post(
        "https://unique-healing-production.up.railway.app/api/library/addBook",
        newBook
      );
      setBooks((prevBooks) => [...prevBooks, response.data]);
      setNewBook({
        bookTitle: "",
        bookAuthor: "",
        bookPublisher: "",
        bookYearPublished: "",
        bookISBN: "",
        bookPublicationPlace: "",
        bookShelfSection: "",
      });
      setModalMessage("Book added successfully");
      setShowModal(true);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // Handle edit input change
  const handleEditInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "bookISBN") {
      if (/^\d{0,13}$/.test(value)) {
        setEditingBook((prevBook) => ({
          ...prevBook,
          [id]: value,
        }));
      }
    } else {
      setEditingBook((prevBook) => ({
        ...prevBook,
        [id]: value,
      }));
    }
  };

  // Handle edit button click
  const handleEditClick = (book) => {
    setEditingBookId(book.id);
    setEditingBook(book);
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setEditingBookId(null);
    setEditingBook({
      bookTitle: "",
      bookAuthor: "",
      bookPublisher: "",
      bookYearPublished: "",
      bookISBN: "",
      bookPublicationPlace: "",
      bookShelfSection: "",
    });
  };

  // Handle update button click
  const handleUpdateClick = async (id) => {
    if (
      editingBook.bookISBN.length !== 10 &&
      editingBook.bookISBN.length !== 13
    ) {
      setModalMessage("ISBN must be 10 or 13 digits only");
      setShowModal(true);
      return;
    }
    try {
      const response = await axios.put(
        `https://unique-healing-production.up.railway.app/api/library/updateBook/${id}`,
        editingBook
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? response.data : book))
      );
      setEditingBookId(null);
      setEditingBook({
        bookTitle: "",
        bookAuthor: "",
        bookPublisher: "",
        bookYearPublished: "",
        bookISBN: "",
        bookPublicationPlace: "",
        bookShelfSection: "",
      });
      setModalMessage("Book updated successfully");
      setShowModal(true);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Handle delete button click
  // const handleDeleteClick = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:8080/api/library/deleteBook/${id}`);
  //     setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  //     setModalMessage("Book deleted successfully");
  //     setShowModal(true);
  //   } catch (error) {
  //     console.error("Error deleting book:", error);
  //   }
  // };

  // Handle delete button click
  const handleDeleteClick = (book) => {
    setShowDeleteModal(true);
    setBookToDelete(book);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://unique-healing-production.up.railway.app/api/library/deleteBook/${bookToDelete.id}`
      );
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookToDelete.id)
      );
      setModalMessage("Book deleted successfully");
      setShowModal(true);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookToDelete(null);
  };

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = books.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(books.length / itemsPerPage);

  // Generate pagination buttons
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
      <div>
        <HeaderAdmin />
      </div>
      <div className="w-[95%] flex items-center justify-center mt-[2%] rounded-lg mx-auto ">
        <div className="border-2   flex flex-row w-[100%]  mx-auto items-center justify-center gap-10 rounded-lg bg-primary">
          <div>
            <img
              src={Library}
              alt="Library"
              className="w-[90%] h-[100%] mx-auto items-center justify-center flex bg-primary"
            />
          </div>
          <div className="w-[55%] flex items-center  justify-center flex-col bg-white rounded-lg ">
            <span className="text-lg font-bold text-primary mt-3">
              {" "}
              Register Book Here!
            </span>

            <form
              onSubmit={handleFormSubmit}
              className="w-[100%] my-[3%] mx-auto"
            >
              <div className="flex flex-row gap-10">
                <div className="flex flex-col w-[90%] mx-auto gap-y-8">
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="bookTitle"
                      value={newBook.bookTitle}
                      onChange={handleInputChange}
                      className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="bookTitle"
                      className="absolute text-sm text-primary dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Title of the Book
                    </label>
                  </div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="bookAuthor"
                      value={newBook.bookAuthor}
                      onChange={handleInputChange}
                      className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="bookAuthor"
                      className="absolute text-sm text-primary dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Author of the Book
                    </label>
                  </div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="bookPublisher"
                      value={newBook.bookPublisher}
                      onChange={handleInputChange}
                      className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="bookPublisher"
                      className="absolute text-sm text-primary dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Name of the Publisher
                    </label>
                  </div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="bookYearPublished"
                      value={newBook.bookYearPublished}
                      onChange={handleInputChange}
                      className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="bookYearPublished"
                      className="absolute text-sm text-primary dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Year Published
                    </label>
                  </div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="bookISBN"
                      value={newBook.bookISBN}
                      onChange={handleInputChange}
                      className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="bookISBN"
                      className="absolute text-sm text-primary dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      ISBN of the Book
                    </label>
                  </div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="bookPublicationPlace"
                      value={newBook.bookPublicationPlace}
                      onChange={handleInputChange}
                      className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="bookPublicationPlace"
                      className="absolute text-sm text-primary dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Publication Place
                    </label>
                  </div>
                  <div className="relative z-0">
                    <input
                      type="text"
                      id="bookShelfSection"
                      value={newBook.bookShelfSection}
                      onChange={handleInputChange}
                      className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="bookShelfSection"
                      className="absolute text-sm text-primary dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Shelf Section
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-[20%] ml-[5%] bg-primary font-medium mt-5 text-ternary py-2 rounded-lg hover:bg-ternary hover:text-primary  ease-in-out duration-500"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="w-[95%] mx-auto mt-8">
        <table className="min-w-full divide-y divide-gray-200">
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
                Publication Place
              </th>
              <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
                Shelf Section
              </th>
              <th className="px-6 py-3 text-left text-base font-bold text-primary uppercase tracking-wider">
                Actions
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
                {editingBookId === book.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      <input
                        type="text"
                        id="bookTitle"
                        value={editingBook.bookTitle}
                        onChange={handleEditInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="Title"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <input
                        type="text"
                        id="bookISBN"
                        value={editingBook.bookISBN}
                        onChange={handleEditInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="ISBN"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <input
                        type="text"
                        id="bookAuthor"
                        value={editingBook.bookAuthor}
                        onChange={handleEditInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="Author"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <input
                        type="text"
                        id="bookYearPublished"
                        value={editingBook.bookYearPublished}
                        onChange={handleEditInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="Year Published"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <input
                        type="text"
                        id="bookPublisher"
                        value={editingBook.bookPublisher}
                        onChange={handleEditInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="Publisher"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <input
                        type="text"
                        id="bookPublicationPlace"
                        value={editingBook.bookPublicationPlace}
                        onChange={handleEditInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="Publication Place"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <input
                        type="text"
                        id="bookShelfSection"
                        value={editingBook.bookShelfSection}
                        onChange={handleEditInputChange}
                        className="block py-2.5 px-0 w-full text-sm text-primary bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder="Shelf Section"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <button
                        onClick={() => handleUpdateClick(book.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Done
                      </button>
                      <span
                        onClick={handleCancelClick}
                        className="ml-2 text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        Cancel
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      {book.bookShelfSection}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Update
                      </button>
                      <span
                        onClick={() => handleDeleteClick(book)}
                        className="ml-2 text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        Delete
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>

          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <p>Are you sure you want to delete this row?</p>
                <div className="flex justify-center mt-4 gap-5">
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded mr-2 "
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-300 text-black rounded"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </table>
        {renderPaginationButtons()}
        {/* <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 border rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div> */}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white text-lg p-8 rounded shadow-lg">
            <p>{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4  w-full  bg-primary font-medium text-ternary py-2 rounded hover:bg-ternary hover:text-primary  ease-in-out duration-300 "
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePageAdmin;
