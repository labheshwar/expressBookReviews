const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.includes(username);
};

const authenticatedUser = (username, password) => {
  return users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send('Username or password missing');
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username: username },
      'fingerprint_customer',
      {
        expiresIn: '1h',
      }
    );
    req.session.authorization = { accessToken: accessToken };
    return res.status(200).send('User successfully logged in');
  } else {
    return res.status(400).send('Invalid credentials');
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.user.username;
  const review = req.query.review;

  if (!username) {
    return res.status(400).send('Please login to add a review');
  }

  if (!review) {
    return res.status(400).send('Please provide a review');
  }

  const book = books[isbn];
  if (!book) {
    return res.status(400).send('Book not found');
  }

  book.reviews[username] = review;
  return res
    .status(200)
    .send('The review for the book with ISBN ' + isbn + ' has been updated');
});

// Delete a book review

regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!username) {
    return res.status(400).send('Please login to delete a review');
  }

  const book = books[isbn];
  if (!book) {
    return res.status(400).send('Book not found');
  }

  if (!book.reviews[username]) {
    return res.status(400).send('Review not found');
  }

  delete book.reviews[username];
  return res
    .status(200)
    .send(
      'Reviews for the ISBN ' +
        isbn +
        ' posted by the user ' +
        username +
        ' has been deleted'
    );
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
