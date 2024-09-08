import {IUser} from "./IUser";
import {IBook} from "./IBook";

export class User implements IUser {
    email: string;
    id: number;
    username: string;
    borrowedBooks: IBook[];

    constructor(email?: string, username?: string) {
        this.email = email || '';
        this.username = username || '';
        this.id = new Date().getTime();
        this.borrowedBooks = [];
    }

    getEmail(): string {
        return this.email;
    }

    getId(): number {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    represent(): string {
        return `ID: ${this.id} - ${this.username} (${this.email})`;
    }

    borrowBook(book: IBook): void {
        this.borrowedBooks.push(book);
    }

    takeBookBack(bookId: number): void {
        const book = this.borrowedBooks.filter(x => x.id === bookId)[0];
        if (!book) {
            throw new Error("User does not have this book");
        }

        this.borrowedBooks = this.borrowedBooks.filter(x => x.id !== bookId);
    }

}