const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send('Username or password missing');
  }

  if (isValid(username)) {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .send('User successfully registered. Now you can login');
  } else {
    return res.status(400).send('Username already exists');
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).send(`Books: ${JSON.stringify(books)}`);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(`Book: ${JSON.stringify(books[isbn])}`);
  } else {
    return res.status(404).send(`Book with ISBN ${isbn} not found`);
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = [];
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).send(`Books: ${JSON.stringify(booksByAuthor)}`);
  }
  return res.status(404).send(`Books by author ${author} not found`);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = [];
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).send(`Books: ${JSON.stringify(booksByTitle)}`);
  }
  return res.status(404).send(`Books with title ${title} not found`);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
