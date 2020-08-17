'use strict'

var book = require('../models/bookModel');
var category = require('../models/categoryModel');

module.exports = function(router) {
  router.get('/', function(req,res) {
    res.render('manage/index');
  });

  router.get('/books', function(req,res) {
    book.find({}, function(err, books) {
      if (err) {
        console.log(err);
      };
      var model = {
        books: books
      };
      res.render('manage/books/index', model)
  });
 });

  router.get('/books/add',function(req,res) {
    category.find({},function(err,categories) {
       if (err) {
         console.log(err);
       }

       var model ={
         categories: categories
       };
       res.render('manage/books/add', model)
    });
  });

//Add Book
  router.post('/books',function (req,res) {
    var title = req.body.title && req.body.title.trim();
    var category = req.body.category && req.body.category.trim();
    var author = req.body.author && req.body.author.trim();
    var publisher = req.body.publisher && req.body.publisher.trim();
    var price = req.body.price && req.body.price.trim();
    var description = req.body.description && req.body.description.trim();
    var cover = req.body.cover && req.body.cover.trim();

    //Validation
    if (title == '' || price == '') {
      req.flash('error', "Please fill out required fields");
      res.location('/manage/books/add');
      res.redirect('/manage/books/add');
    }
    if (isNaN(price)) {
      req.flash('error', "Price must be a number");
      res.location('/manage/books/add');
      res.redirect('/manage/books/add');
    }

    //DB insert

  var newBook = new book({
    title: title,
    category: category,
    description: description,
    author: author,
    publisher: publisher,
    cover: cover,
    price: price
  });

  //Write to DB
  newBook.save(function(err) {
    if (err) {
      console.log('Save error', err);
    }

    res.location('/manage/books');
    res.redirect('/manage/books');
  })
});

//Edit Books
router.get('/books/edit/:id', function (req,res) {
  category.find({}, function (err,categories) {
    book.findOne({_id:req.params.id}, function (err,book) {
      if (err) {
        console.log(err);
      }
      var model ={
        book: book,
        categories: categories
      };
      res.render('manage/books/edit', model);
    })
  })
})

//Edit Books Post
router.post('/books/edit/:id', function (req,res) {
  var title = req.body.title && req.body.title.trim();
  var category = req.body.category && req.body.category.trim();
  var author = req.body.author && req.body.author.trim();
  var publisher = req.body.publisher && req.body.publisher.trim();
  var price = req.body.price && req.body.price.trim();
  var description = req.body.description && req.body.description.trim();
  var cover = req.body.cover && req.body.cover.trim();

  book.update({
    title: title,
    category: category,
    author: author,
    publisher: publisher,
    price: price,
    description: description,
    cover: cover
  }, function (err) {
    if (err) {
      console.log('Update error', err);
    }

    res.location('/manage/books');
    res.redirect('/manage/books');
  });
});

//delete book
router.post('/books/delete/:id', function (req,res) {
  book.remove({_id: req.params.id}, function(err) {
    if (err) {
      console.log(err);
    }

    res.location('/manage/books');
    res.redirect('/manage/books');
  });
});

//Categories home page
  router.get('/categories', function(req,res) {
    category.find({}, function (err, categories) {
      if (err) {
        console.log(err);
      }
      var model = {
        categories: categories
      };
      res.render('manage/categories/index', model);
    });
  });

//Add Category page
  router.get('/categories/add', function (req,res) {
    res.render('manage/categories/add');
  });

//Add Category DB
  router.post('/categories', function (req,res) {
    var name = req.body.name && req.body.name.trim();

    if (name == '') {
      res.location('/manage/categories/add');
      res.redirect('/manage/categories/add');
    }

    var newCategory = new category({
      name: name
    });

    newCategory.save(function (err) {
      if (err) {
        console.log('save error', err);
      }
      res.location('/manage/categories');
      res.redirect('/manage/categories');
    });
  });

//Edit Category Display
  router.get('/categories/edit/:id', function (req,res) {
    category.findOne({_id:req.params.id}, function (err,category) {
      if (err) {
        console.log(err);
      }
      var model = {
        category: category
      };
      res.render('manage/categories/edit', model);
    });
  });

//Edit Category DB
  router.post('/categories/edit/:id', function(req,res) {
    var name = req.body.name && req.body.name.trim();

    category.update({_id: req.params.id}, {
      name: name
    }, function (err) {
      if (err) {
        console.log('Update Error', err);
      }
      res.location('/manage/categories');
      res.redirect('/manage/categories');
    });
  });

//Delete category
router.post('/categories/delete/:id', function (req,res) {
  category.remove({_id: req.params.id}, function (err) {
    if (err) {
      console.log(err);
    }
    res.location('/manage/categories');
    res.redirect('/manage/categories');
  });
});

};
