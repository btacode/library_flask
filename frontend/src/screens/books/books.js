import React, { useEffect, useState } from "react";
import "./books.css";
import api from "../../config/APIs";
import { useDispatch, useSelector } from "react-redux";
import authActions from "../../redux/Actions/authActions";

export default function Books() {
  const { booksList, userData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setTitle("");
    setAuthor("");
    setYear("");
  };

  const updateBookFunc = (book) => {
    setIsEditing(true);
    setSelectedBookId(book.book_id);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.publishing_year);
    openModal();
  };

  useEffect(() => {
    listBooks();
  }, []);

  const listBooks = async () => {
    try {
      const response = await api.getBooks();
      dispatch(authActions.setBooksList(response));
    } catch (error) {
      console.log("🚀 ~ listBooks ~ error:", error);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addBook(title, author, year);
      console.log("🚀 ~ addBook ~ response:", response);
      if (response) {
        listBooks();
        closeModal();
      }
    } catch (error) {
      console.error("There was an error adding the book!", error);
    }
  };

  const updateBook = async () => {
    try {
      const response = await api.updateBook(
        selectedBookId,
        title,
        author,
        year
      );
      console.log("🚀 ~ updateBook ~ response:", response);
      if (response) {
        listBooks();
        closeModal();
      }
    } catch (error) {
      console.error("There was an error updating the book!", error);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const response = await api.deleteBook(bookId);
      console.log("🚀 ~ deleteBook ~ response:", response);
      if (response) {
        listBooks();
      }
    } catch (error) {
      console.error("There was an error deleting the book!", error);
    }
  };

  const borrowBook = async (bookId) => {
    try {
      const response = await api.borrowBook(bookId);
      if (response?.message) {
        alert(response?.message);
      }
      listBooks();
    } catch (error) {
      console.error("There was an error borrowing the book!", error);
    }
  };

  const returnBook = async (bookId) => {
    try {
      const response = await api.returnBook(bookId);
      if (response?.message) {
        alert(response?.message);
      }
      listBooks();
    } catch (error) {
      console.error("There was an error returning the book!", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="header">
          <p className="lead">Books</p>
          {userData?.role === "admin" && (
            <button className="add-button" onClick={openModal}>
              Add Book
            </button>
          )}
        </div>

        <table className="book-table">
          <thead>
            <tr className="table-header">
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publishing year</th>
              {userData?.role === "admin" && <th>Borrowed by</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {booksList?.map((book) => (
              <tr key={book.book_id}>
                <td>{book.book_id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publishing_year}</td>
                {userData?.role === "admin" && <td>{book.borrowed_user}</td>}
                <td>
                  {userData?.role === "admin" && (
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        console.log(
                          "book.borrowed_id",
                          book.borrowed_id,
                          userData
                        );
                        updateBookFunc(book);
                      }}
                    >
                      Update
                    </button>
                  )}
                  {userData?.role === "admin" && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this book?"
                          )
                        ) {
                          deleteBook(book.book_id);
                        }
                      }}
                      disabled={book.borrowed_id !== null}
                      title={
                        book.borrowed_id !== null
                          ? "Cannot delete a borrowed book"
                          : ""
                      }
                    >
                      Delete
                    </button>
                  )}

                  {book.borrowed_id === userData?.user_id ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => returnBook(book.book_id)}
                    >
                      Return
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => borrowBook(book.book_id)}
                      title={
                        book.borrowed_id !== null
                          ? "Book is already borrowed"
                          : ""
                      }
                    >
                      Borrow
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalIsOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "10000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "400px",
              maxWidth: "90vw",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ padding: "20px" }}>
              <h2>Add New Book</h2>

              <div>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    id="title"
                    name="title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Author:</label>
                  <input
                    type="author"
                    id="author"
                    name="author"
                    required
                    placeholder="Enter author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Publishing year:</label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    required
                    placeholder="Select year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={isEditing ? updateBook : addBook}
                  >
                    {isEditing ? "update" : "Add"}
                  </button>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
