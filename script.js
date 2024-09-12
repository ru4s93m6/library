// Fetch DOM Elements
const mask = document.querySelector(".mask");
const bookContainer = document.querySelector(".book-container");
const addBookBtn = document.querySelector("#addBookBtn");
const submitBtn = document.querySelector("#submitBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const bookDialog = document.querySelector("#book-dialog");
const form = document.querySelector("form");

// Declare global variables
const myLibrary = [];

// Add eventlistener to DOM Elements
mask.addEventListener("click", () => hideDialog());
addBookBtn.addEventListener("click", () => modal.showDialog());
cancelBtn.addEventListener("click", () => modal.hideDialog());
form.addEventListener("submit", (e) => handleSubmit(e));

// Fetch LocalStorage data initially
document.addEventListener("DOMContentLoaded", () => {
  const books = store.getBooks();
  if (books.length) {
    books.forEach((book) => {
      const { title, author, page, isRead, id } = book;
      const newBook = new Book(title, author, page, isRead, id);
      uiDOM.addBookToLibrary(newBook);
    });
  }
});

// Book Class
class Book {
  constructor(title, author, page, isRead, id) {
    this.title = title;
    this.author = author;
    this.page = page;
    this.isRead = isRead;
    this.id = id || Date.now();
  }

  toggleReadStatus() {
    this.isRead = !this.isRead;
  }
}

// LocalStorage Class
class store {
  static getBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    return books;
  }

  static setBooks(book) {
    const books = store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static updateBookStatus(bookId, status) {
    const books = store.getBooks();
    books.forEach((book) => {
      if (book.id !== bookId) return;
      book.status = status;
    });

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(bookId) {
    let books = store.getBooks();
    books = books.filter((book) => book.id != bookId);
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Library UI class : handle UI related functions
class uiDOM {
  /**
   * Creates a new Book object from form input
   * @returns { Book } A new Book instance
   */
  static createBookFromForm() {
    const title = form.querySelector("#bookTitle").value;
    const author = form.querySelector("#bookAuthor").value;
    const pages = form.querySelector("#bookPages").value;
    const isRead = form.querySelector("#bookStatus").checked;
    return new Book(title, author, pages, isRead);
  }

  /**
   * Render book card by given book instance
   * @param { Book } book
   */
  static addBookToLibrary(book) {
    const bookSection = document.createElement("section");
    bookSection.innerHTML = `
        <article class="book-card" data-book-id=${book.id}>
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">Author: <span>${book.author}</span></p>
          <p class="book-pages">Pages: <span>${book.page}</span></p>
          <p class="book-status">Status: <span></span></p>
          <div class="book-actions">
            <button class="delete-btn" aria-label="Delete book">Delete</button>
            <button class="toggle-read-btn" aria-label="Toggle read status"></button>
          </div>
        </article>
    `;
    bookContainer.appendChild(bookSection);
    uiDOM.setBookStatus(book);

    const toggleBtn = bookSection.querySelector(".toggle-read-btn");
    toggleBtn.addEventListener("click", () => uiDOM.updateBookStatus(book));

    const deleteButton = bookSection.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => uiDOM.removeBook(book));
  }

  /**
   * Update the book status and re-render card status
   * @param { Book } book
   */
  static updateBookStatus(book) {
    book.toggleReadStatus();
    uiDOM.setBookStatus(book);
  }

  /**
   * Set status text by given book status
   * @param { Book } book
   */
  static setBookStatus(book) {
    const bookArticle = document.querySelector(
      `article[data-book-id='${book.id}']`
    );
    if (bookArticle) {
      const statusSpan = bookArticle.querySelector(".book-status span");
      const statusBtn = bookArticle.querySelector(".toggle-read-btn");

      let statusSpanText = book.isRead ? "Finished Reading" : "On progress";
      let statusBtnText = book.isRead ? "Mark as Unread" : "Mark as Read";

      statusSpan.textContent = statusSpanText;
      statusBtn.textContent = statusBtnText;

      if (book.isRead) {
        statusBtn.classList.add("read");
      } else {
        statusBtn.classList.remove("read");
      }
    }
  }

  /**
   * Remove UI Element and delete item in LocalStorage
   * @param { Book } book
   */
  static removeBook(book) {
    const bookArticle = document.querySelector(
      `article[data-book-id='${book.id}']`
    );

    if (bookArticle) bookArticle.parentElement.remove();
    store.removeBook(book.id);
  }

  /**
   * Clear Input Value after submitting form
   */
  static clearFormInput() {
    form.querySelector("#bookTitle").value = "";
    form.querySelector("#bookAuthor").value = "";
    form.querySelector("#bookPages").value = "";
    form.querySelector("#bookStatus").checked = false;
  }
}

// modal class : handle dialog action
class modal {
  /**
   * Displays the book dialog and the mask
   */
  static showDialog() {
    bookDialog.show();
    mask.style.display = "block";
  }
  /**
   * Hides the book dialog and the mask
   */
  static hideDialog() {
    bookDialog.close();
    mask.style.display = "none";
  }
}

/**
 * Handles form submission: creates a new book, adds it to the library, and updates the DOM
 * @param {Event} e - The submit event
 */
function handleSubmit(e) {
  e.preventDefault();
  const newBook = uiDOM.createBookFromForm();
  uiDOM.addBookToLibrary(newBook);
  store.setBooks(newBook);

  uiDOM.clearFormInput();
  modal.hideDialog();
}
