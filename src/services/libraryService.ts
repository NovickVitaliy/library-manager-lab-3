import { Validation } from '../utils/validation';
import { Storage } from './storage';
import { Library } from './library';
import { IBook } from '../models/IBook';
import { Book } from '../models/book';
import { Paginatable } from './paginatable';
import { Representable } from '../models/representable';
import { UserService } from './user-service';

export class LibraryService implements Paginatable<Representable> {
  private readonly userService: UserService;
  private readonly validation: Validation;
  private readonly storageService: Storage;
  private readonly library: Library<IBook, number>;
  private readonly booksKey: string = 'libraryBooks';
  private readonly allBooks: IBook[];
  private queriedBooks: IBook[];
  constructor(userService: UserService) {
    this.userService = userService;
    this.validation = Validation.getInstance();
    this.library = new Library<IBook, number>();
    this.storageService = Storage.getInstance();
    this.loadFromStorage();
    this.allBooks = this.library.getAll();
    this.queriedBooks = this.allBooks;
  }

  addBook(bookName: string, author: string, releaseYear: number): void {
    if (
      !this.validation.validateCreateBookRequest(bookName, author, releaseYear)
    ) {
      throw new Error('Invalid data for book');
    }

    const book: Book = new Book(author, bookName, releaseYear);
    this.library.add(book);
    const books = this.library.getAll();
    this.storageService.save(this.booksKey, books);
  }

  removeBook(bookId: number): void {
    this.library.removeById(bookId);
    const books = this.library.getAll();
    this.storageService.save(this.booksKey, books);
  }

  getById(bookId: number): IBook | undefined {
    return this.library.find(bookId);
  }

  getPaginated(pageNumber: number, pageSize: number): Representable[] {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const books = this.queriedBooks.slice(start, end);
    console.log('Queried books:');
    console.log(books);
    return books;
    // return this.library.getPaginated(pageNumber, pageSize);
  }

  getTotalCount(): number {
    return this.queriedBooks.length;
  }

  borrowBook(userId: number, bookId: number) {
    const user = this.userService.getById(userId);
    console.log('user found');
    if (!user) {
      throw new Error('User not found');
    }

    console.log('Borrowed count:');
    console.log(user.borrowedBooks.length);
    if (user.borrowedBooks.length >= 3) {
      throw new Error('User already has 3 books');
    }

    let book = this.library.find(bookId);
    console.log('book found');
    if (!book || book.borrowed) {
      throw new Error('Book not found or it was already taken by someone');
    }

    book.borrowed = true;
    book.borrowedBy = user.email;
    user.borrowBook(book);
    this.storageService.save(this.booksKey, this.library.getAll());
  }

  returnBook(userId: number, bookId: number) {
    const user = this.userService.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let book = this.library.find(bookId);
    if (!book) {
      throw new Error('Book not found or it was already taken by someone');
    }

    user.takeBookBack(bookId);
    book.borrowedBy = undefined;
    book.borrowed = false;
    this.storageService.save(this.booksKey, this.library.getAll());
  }

  searchBook(searchQuery: string, searchOption: string): void {
    if (searchQuery === '') {
      this.queriedBooks = this.allBooks;
      return;
    }
    switch (searchOption) {
      case 'name':
        this.queriedBooks = this.allBooks.filter((x) =>
          x.bookName.includes(searchQuery)
        );
        break;
      case 'author':
        this.queriedBooks = this.allBooks.filter((x) =>
          x.author.includes(searchQuery)
        );
        break;
      default:
        this.queriedBooks = this.allBooks;
        break;
    }
  }

  private loadFromStorage() {
    const books = this.storageService.get(this.booksKey) ?? [];
    for (let book of books) {
      const newBook = new Book();
      newBook.id = book.id;
      newBook.author = book.author;
      newBook.bookName = book.bookName;
      newBook.releaseYear = book.releaseYear;
      newBook.borrowed = book.borrowed;
      newBook.borrowedBy = book.borrowedBy;
      this.library.add(newBook);
    }
    console.log(this.library.getAll());
  }
}
