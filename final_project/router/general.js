const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login."});
        } else {
            return res.status(404).json({message: "User already exists."});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Username or password missing. Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = ((req.params.author).toLowerCase()).replaceAll(" ", "");
    let filteredBooks = {};

    // Get array of keys
    keys = Object.keys(books);
    keyInts = [];
    keys.forEach((key) => {
        keyInts.push(parseInt(key));
    });

    // Check if the author searched for matches any of the authors in books
    keyInts.forEach((key) => {
        let currentAuthor = (books[key].author).toLowerCase().replaceAll(" ", "");
        if (currentAuthor === author) {
            Object.assign(filteredBooks, {[key]: books[key]});
        }
    });

    if (Object.keys(filteredBooks).length > 0) {
        res.send(filteredBooks);
    } else {
        res.send("Author not found");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = ((req.params.title).toLowerCase()).replaceAll(" ", "");
    let filteredBooks = {};

    // Get array of keys
    keys = Object.keys(books);
    keyInts = [];
    keys.forEach((key) => {
        keyInts.push(parseInt(key));
    });

    // Check if the searched title matches any of the title in books object
    keyInts.forEach((key) => {
        let currentTitle = (books[key].title).toLowerCase().replaceAll(" ", "");
        if (currentTitle === title) {
            Object.assign(filteredBooks, {[key]: books[key]});
        }
    });

    if (Object.keys(filteredBooks).length > 0) {
        res.send(filteredBooks);
    } else {
        res.send("Title not found.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
