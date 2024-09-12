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
addBookBtn.addEventListener("click", () => showDialog());
cancelBtn.addEventListener("click", () => hideDialog());
form.addEventListener("submit", (e) => handleSubmit(e));

// LOGICAL FUNCTION
function Book(title, author, page, isRead) {
  this.title = title;
  this.author = author;
  this.page = page;
  this.isRead = isRead;
  this.id = Date.now();

  //   CORE function
  /**
   * Toggles the read status of the book
   */
  this.toggleReadStatus = () => {
    this.isRead = !this.isRead;
    this.setReadStatus();
  };

  //   DOM related functions
  /**
   * Adds the book to the DOM
   */
  this.addBookToDOM = () => {
    const bookSection = document.createElement("section");
    bookSection.innerHTML = `
        <article class="book-card" data-book-id=${this.id}>
          <h3 class="book-title">${this.title}</h3>
          <p class="book-author">Author: <span>${this.author}</span></p>
          <p class="book-pages">Pages: <span>${this.page}</span></p>
          <p class="book-status">Status: <span></span></p>
          <div class="book-actions">
            <button class="delete-btn" aria-label="Delete book">Delete</button>
            <button class="toggle-read-btn" aria-label="Toggle read status"></button>
          </div>
        </article>
    `;
    bookContainer.appendChild(bookSection);
    this.setReadStatus();

    const toggleBtn = bookSection.querySelector(".toggle-read-btn");
    toggleBtn.addEventListener("click", () => this.toggleReadStatus());

    const deleteButton = bookSection.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => this.removeBook());
  };
  /**
   * Updates the read status in the DOM
   */
  this.setReadStatus = () => {
    const bookSection = document.querySelector(`[data-book-id="${this.id}"]`);

    const readMessage = this.isRead ? "Finished Reading" : "On progress";
    const buttonStatus = this.isRead ? "Mark as Unread" : "Mark as Read";

    if (bookSection) {
      const messageSpan = bookSection.querySelector(".book-status span");
      const toggleReadBtn = bookSection.querySelector(".toggle-read-btn");
      messageSpan.textContent = readMessage;
      toggleReadBtn.textContent = buttonStatus;
      if (this.isRead) {
        toggleReadBtn.classList.add("read");
      } else {
        toggleReadBtn.classList.remove("read");
      }
    }
  };
  /**
   * Removes the book from the DOM
   */
  this.removeBook = () => {
    const bookSection = document.querySelector(`[data-book-id="${this.id}"]`);
    if (bookSection) bookSection.parentElement.remove();
  };
}

/**
 * Creates a new Book object from form input
 * @returns { Book } A new Book instance
 */
function createBookFromForm() {
  const title = form.querySelector("#bookTitle").value;
  const author = form.querySelector("#bookAuthor").value;
  const pages = form.querySelector("#bookPages").value;
  const isRead = form.querySelector("#bookStatus").checked;
  return new Book(title, author, pages, isRead);
}

/**
 * Handles form submission: creates a new book, adds it to the library, and updates the DOM
 * @param {Event} e - The submit event
 */
function handleSubmit(e) {
  e.preventDefault();
  const newBook = createBookFromForm();
  myLibrary.push(newBook);

  newBook.addBookToDOM();

  clearFormInput();
  hideDialog();
}

// Clear Input Value after submitting form
function clearFormInput() {
  form.querySelector("#bookTitle").value = "";
  form.querySelector("#bookAuthor").value = "";
  form.querySelector("#bookPages").value = "";
  form.querySelector("#bookStatus").checked = false;
}

// Toggle Dialog
/**
 * Displays the book dialog and the mask
 */
function showDialog() {
  bookDialog.show();
  mask.style.display = "block";
}

/**
 * Hides the book dialog and the mask
 */
function hideDialog() {
  bookDialog.close();
  mask.style.display = "none";
}
