var grpc = require('grpc');
var booksProto = grpc.load('books.proto');

// In-memory array of book objects
var books = [
    { id: 123, title: 'A Tale of Two Cities', author: 'Charles Dickens' }
];


var server = new grpc.Server();

var bookStream;

server.addProtoService(booksProto.books.BookService.service,{

    //List of all Book IDs
    list: function(call, callback){
        callback(null, books);
    },

    //Add the insert function
    insert: function(call, callback){
        var book =  call.request;
        books.push(book);

        //Add for streaming to the clients
        if (bookStream)
            bookStream.write(book);

        callback(null,{});
    },

    //Get a Book by id
    get: function(call,callback){
        for (var i=0; i < books.length; i++)
            if(books[i].id == call.request.id)
                return callback(null, books[i]);

        callback({
            code:grpc.status.NOT_FOUND,
            details: 'Not Found'
        });
    },

    // Modify the Book details given an id
    update: function(call, callback){
        var book = call.request;
        for (var i=0; i < books.length; i++)
            if(books[i].id == book.id){
                books.update({id: i}, book);
                //books[i].title = book.title;
                //books[i].author = book.author;
                return callback(null, {});
            }
        callback({
            code:grpc.status.NOTFOUND,
            details: 'Not Found'
        })
    },

    //Delete the book details given an id
    delete: function(call, callback){
        for(var i =0; i < books.length; i++)
            if(books[i].id == call.request.id)
                books.splice(i,1);
                return callback(null, {});

        callback({
            code:grpc.status.NOTFOUND,
            details: 'Not Found'
        })
    },

    //Stream added books
    watch: function(stream){
        bookStream = stream;
    }


}); //didn't understand this

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

server.start();