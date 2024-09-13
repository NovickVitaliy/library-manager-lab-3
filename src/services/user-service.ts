import { IUser } from '../models/IUser';
import { User } from '../models/user';
import { Validation } from '../utils/validation';
import { Storage } from './storage';
import { Paginatable } from './paginatable';
import { Book } from '../models/book';
import { IBook } from '../models/IBook';

export class UserService implements Paginatable<IUser> {
  private readonly usersKey = 'library-users';
  private readonly storage: Storage;
  private users: Array<IUser>;
  private readonly validation: Validation;
  constructor() {
    this.storage = Storage.getInstance();
    this.validation = Validation.getInstance();
    this.users = [];
    this.loadFromStorage();
  }

  add(username: string, email: string): void {
    if (!this.validation.validateCreateUserRequest(username, email)) {
      throw new Error('Invalid data for user');
    }

    const user = new User(email, username);
    this.users.push(user);
    this.storage.save(this.usersKey, this.users);
  }

  remove(user: IUser): void {
    this.users = this.users.filter((x) => x !== user);
    this.storage.save(this.usersKey, this.users);
  }

  removeById(userId: number): void {
    this.users = this.users.filter((x) => x.id !== userId);
    this.storage.save(this.usersKey, this.users);
  }

  getById(userId: number): IUser | undefined {
    return this.users.filter((x) => x.id === userId)[0];
  }

  getPaginated(pageNumber: number, pageSize: number): IUser[] {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    return this.users.slice(start, end);
  }

  getTotalCount(): number {
    return this.users.length;
  }

  private loadFromStorage() {
    const users = this.storage.get(this.usersKey);

    for (let user of users) {
      const newUser = new User();
      newUser.email = user.email;
      newUser.id = user.id;
      newUser.username = user.username;
      const newBooks: IBook[] = [];
      const books = user.borrowedBooks;
      for (let book of books) {
        const newBook = new Book();
        newBook.id = book.id;
        newBook.author = book.author;
        newBook.bookName = book.bookName;
        newBook.releaseYear = book.releaseYear;
        newBook.borrowed = book.borrowed;
        newBook.borrowedBy = book.borrowedBy;
        newBooks.push(newBook);
      }
      newUser.borrowedBooks = newBooks;
      this.users.push(newUser);
    }
  }
}
