import {Identifiable} from "./identifiable";
import {Representable} from "./representable";
import {IBook} from "./IBook";

export interface IUser extends Identifiable<number>, Representable {
    borrowedBooks: IBook[];
    username: string;
    email: string;

    getUsername(): string;
    getEmail(): string;
    borrowBook(book: IBook): void;
    takeBookBack(bookId: number): void;
}