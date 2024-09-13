import { IBook } from './IBook';

export class Book implements IBook {
  id: number;
  author: string;
  bookName: string;
  releaseYear: number;
  borrowed: boolean;
  borrowedBy?: string;

  constructor(author?: string, bookName?: string, releaseYear?: number) {
    this.author = author || '';
    this.bookName = bookName || '';
    this.releaseYear = releaseYear || 0;
    this.borrowed = false;
    this.id = new Date().getTime();
    this.borrowedBy = undefined;
  }

  getAuthor(): string {
    return this.author;
  }

  getBookName(): string {
    return this.bookName;
  }

  getReleaseYear(): number {
    return this.releaseYear;
  }

  getId(): number {
    return this.id;
  }

  represent(): string {
    const str = `ID: ${this.id} - ${this.bookName} by ${this.author} (${this.releaseYear}). ${this.borrowedBy ? ` Borrowed By: ${this.borrowedBy}` : ''}`;
    console.log(str);
    return str;
  }

  getFullName(): string {
    return `ID: ${this.id} - ${this.bookName} by ${this.author} (${this.releaseYear}).`;
  }
}
