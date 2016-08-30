var grpc = require('grpc');

var booksProto = grpc.load('books.proto');

var client = new booksProto.books.BookService('127.0.0.1:50051',
    grpc.credentials.createInsecure());

// Function to print response
function printResponse(error, response) {
    if (error)
        console.log('Error: ', error);
    else
        console.log(response);
}

// Function to list books
function listBooks(){
    client.list({}, function(error, books) {
        printResponse(error, books);
    });
}

// Function to get a Book
function getABook(id){

    client.get({id: parseInt(id)}, function(error, books){
        printResponse(error, books);
    });
}

// Function to insert a book
function insertABook(id, title, author){
    var book = {id: parseInt(id), title:title, author:author};
    client.insert(book, function(error, empty){
        printResponse(error, empty);
    });
}

// Function to delete a book
function deleteABook(id){
    client.delete({id: parseInt(id)}, function(error, empty){
        printResponse(error, empty);
    });
}

// Function to Modify a book
function modifyABook(id, title, author){
    var book = {id: parseInt(id), title:title, author:author};
    client.update(book, function(error, empty){
        printResponse(error, empty);
    });
}

//Function to Watch a stream of data
function watchBooks(){
    var call =  client.watch({});
    call.on('data', function(book){
        console.log(book);
    })
}

var processName = process.argv.shift();
var scriptName =  process.argv.shift();
var command = process.argv.shift();

console.log('Process Name - ' + processName);
console.log('Script Name - ' + scriptName);

if (command == 'list')
    listBooks();
else if (command == 'insert')
    insertABook(process.argv[0], process.argv[1], process.argv[2]);
else if (command == 'get')
    getABook(process.argv[0]);
else if (command == 'delete')
    deleteABook(process.argv[0]);
else if (command == 'update')
    modifyABook(process.argv[0]);
else if (command == 'watch')
    watchBooks();
