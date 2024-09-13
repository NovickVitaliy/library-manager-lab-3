import { describe } from 'mocha';
import { Library } from '../src/services/library';
import { IBook } from '../src/models/IBook';
import { Book } from '../src/models/book';
import * as assert from 'assert';

describe('Add Item', () => {
  it('Should add item to the array', () => {
    const library = new Library<IBook, number>();
    const book = new Book();
    library.add(book);
    const addedBook = library.find(book.id);
    assert.notEqual(addedBook, undefined);
  });

  it('Should remove item from the array using id', () => {
    const library = new Library<IBook, number>();
    const book = new Book();
    library.add(book);
    library.removeById(book.id);
    const addedBook = library.find(book.id);
    assert.equal(addedBook, undefined);
  });

  it('Should remove item from the array using the item', () => {
    const library = new Library<IBook, number>();
    const book = new Book();
    library.add(book);
    library.remove(book);
    const addedBook = library.find(book.id);
    assert.equal(addedBook, undefined);
  });

  it('Should return the existing item', () => {
    const library = new Library<IBook, number>();
    const book = new Book();
    library.add(book);
    const addedBook = library.find(book.id);
    assert.equal(addedBook, book);
  });

  it('Should return undefined if item was not found', () => {
    const library = new Library<IBook, number>();
    const addedBook = library.find(new Date().getTime());
    assert.equal(addedBook, undefined);
  });

  it('Should return all items', () => {
    const library = new Library<IBook, number>();
    const books = [new Book(), new Book(), new Book(), new Book()];
    books.forEach((b) => library.add(b));
    const storedBooks = library.getAll();
    assert.deepEqual(storedBooks, books);
  });

  it('Should return paginated items', () => {
    const pageNumber = 1;
    const pageSize = 5;
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const library = new Library<IBook, number>();
    const books = [
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book()
    ];
    books.forEach((b) => library.add(b));
    const paginatedBooks = library.getPaginated(pageNumber, pageSize);
    const localPaginated = books.slice(start, end);
    assert.deepEqual(paginatedBooks, localPaginated);
  });

  it('Should return total count of items', () => {
    const library = new Library<IBook, number>();
    const books = [
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book(),
      new Book()
    ];
    books.forEach((b) => library.add(b));
    const totalCount = library.getTotalCount();
    assert.equal(totalCount, books.length);
  });

  it('Should create empty list', () => {
    const library = new Library<IBook, number>();
    const totalCount = library.getTotalCount();
    assert.equal(totalCount, 0);
  });
});
