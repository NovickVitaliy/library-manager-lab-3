import {Book} from "./models/book";
import {User} from "./models/user";
import {UserService} from "./services/user-service";
import {LibraryService} from "./services/libraryService";
import {Pagination} from "./utils/pagination";

class App {
    private readonly libraryService: LibraryService;
    private readonly userService: UserService;
    private libraryPagination: Pagination;
    private usersPagination: Pagination;
    private readonly messageModalButton: HTMLButtonElement;
    private readonly messageModalBody: HTMLElement;
    private readonly messageModalLabel: HTMLHeadingElement;

    constructor() {
        this.userService = new UserService();
        this.libraryService = new LibraryService(this.userService);
        this.setupUserForm();
        this.setupBookForm();
        this.setupBorrowBookForm();
        this.setupReturnBookForm();
        this.setupDeleteBookForm();
        this.setupDeleteUserForm();
        this.setupSearchForm();
        this.libraryPagination = new Pagination("books-navigation", "books-list", this.libraryService);
        this.usersPagination = new Pagination("users-navigation", "users-list", this.userService);
        this.messageModalButton = document.getElementById('message-modal-button') as HTMLButtonElement;
        this.messageModalBody = <HTMLElement>document.getElementById('message-modal-body');
        this.messageModalLabel = <HTMLHeadingElement>document.getElementById('messageModalLabel');
        this.libraryPagination.goToPage(1);
        this.usersPagination.goToPage(1);
    }

    private setupUserForm() {
        const userCreationForm = <HTMLFormElement>document.getElementById("create-user-form")
        if (!userCreationForm) return;

        userCreationForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const handleUserCreation = () => {
                const usernameInput = document.getElementById("username") as HTMLInputElement;
                const emailInput = document.getElementById("email") as HTMLInputElement;

                const username = usernameInput.value;
                const email = emailInput.value;

                this.userService.add(username, email);
            };

            try {
                handleUserCreation();
                userCreationForm.reset();
                this.usersPagination.goToPage(1);
            } catch (err) {
                console.log(err);
            }
        })
    }

    private setupBookForm() {
        const bookCreationForm = <HTMLFormElement>document.getElementById("create-book-form");
        if (!bookCreationForm) return;
        bookCreationForm.addEventListener("submit", event => {
            event.preventDefault();
            const handleBookCreation = () => {
                const bookName = (document.getElementById("bookName") as HTMLInputElement).value;
                const author = (document.getElementById("author") as HTMLInputElement).value;
                const releaseYear = parseInt((document.getElementById("releaseYear") as HTMLInputElement).value);
                this.libraryService.addBook(bookName, author, releaseYear);
            };

            try {
                handleBookCreation();
                bookCreationForm.reset();
                this.libraryPagination.goToPage(1);
            } catch (err) {
                console.log(err);
            }
        });
    }

    private setupBorrowBookForm() {
        const borrowBookForm = (document.getElementById('borrow-book-form') as HTMLFormElement);

        borrowBookForm.addEventListener('submit', event => {
            event.preventDefault();

            const handleBorrowBookProcess = () => {
                const userId = parseInt((document.getElementById('borrow-user-id') as HTMLInputElement).value);
                const bookId = parseInt((document.getElementById('borrow-book-id') as HTMLInputElement).value);
                this.libraryService.borrowBook(userId, bookId);

                const book = this.libraryService.getById(bookId);
                if(!book) throw new Error("Error");
                const user = this.userService.getById(userId);
                if(!user) throw new Error("Error");
                this.notifyUser('Book borrowed',`${book.getFullName()} has been borrowed by ${user.represent()}`);
            }

            try {
                handleBorrowBookProcess();
                borrowBookForm.reset();
                this.libraryPagination.goToPage(1);
            } catch (err) {
                alert(err)
            }
        });
    }

    private setupReturnBookForm() {
        const returnBookForm = (document.getElementById('return-book-form') as HTMLFormElement);

        returnBookForm.addEventListener('submit', event => {
            event.preventDefault();

            const handleReturnBookProcess = () => {
                const userId = parseInt((document.getElementById('return-user-id') as HTMLInputElement).value);
                const bookId = parseInt((document.getElementById('return-book-id') as HTMLInputElement).value);

                this.libraryService.returnBook(userId, bookId);
                const book = this.libraryService.getById(bookId);
                if(!book) throw new Error("Error");
                this.notifyUser('Book returned',`${book.getFullName()} has been returned.`);
            };

            try {
                handleReturnBookProcess();
                returnBookForm.reset();
                this.libraryPagination.goToPage(1);
            } catch (err) {
                alert(err);
            }
        })
    }

    private notifyUser(label: string, body: string) {
        this.messageModalLabel.innerText = label;
        this.messageModalBody.innerText = body;
        this.messageModalButton.click();
    }

    private setupSearchForm() {
        const searchForm = <HTMLFormElement>document.getElementById('search-form');

        searchForm.addEventListener('reset', event => {
           event.preventDefault();

           searchForm.reset();

           this.libraryService.searchBook('', '');
           this.libraryPagination.goToPage(1);
        });

        searchForm.addEventListener('submit', event => {
            event.preventDefault();

            const handleSearchBookProcess = () => {
                const searchQuery = (document.getElementById('search-book') as HTMLInputElement).value;
                const optionsSelect = document.getElementById('search-book-option') as HTMLSelectElement;
                const searchOption = optionsSelect.value;

                console.log("Search options");
                console.log(searchOption);
                console.log("Search query")
                console.log(searchQuery)
                this.libraryService.searchBook(searchQuery, searchOption);
                // this.libraryPagination.setNewPagination(books);
                this.libraryPagination.goToPage(1);
            };

            try{
                handleSearchBookProcess();
            } catch (err){
                alert(err);
            }
        })
    }
    private setupDeleteBookForm() {
        const deleteBookForm = <HTMLFormElement>document.getElementById('delete-book-form');

        deleteBookForm.addEventListener('submit', event => {
            event.preventDefault();
            const handleDeleteBookProcess = () => {
                const bookId = parseInt((<HTMLInputElement>document.getElementById('delete-book-id')).value);

                this.libraryService.removeBook(bookId);
            };
            try{
                handleDeleteBookProcess();
                deleteBookForm.reset();
                this.libraryPagination.goToPage(1);
                this.notifyUser("Book deleted", "Book was successfully deleted");
            } catch (err){
                this.notifyUser("Error occurred", <string>err);
            }
        })
    }

    private setupDeleteUserForm() {
        const deleteUserForm = <HTMLFormElement>document.getElementById('delete-user-form');

        deleteUserForm.addEventListener('submit', event => {
            event.preventDefault();

            const handleDeleteUserProcess = () => {
                const userId = parseInt((<HTMLInputElement>document.getElementById('delete-user-id')).value);

                this.userService.removeById(userId);
            };
            try{
                handleDeleteUserProcess();
                deleteUserForm.reset();
                this.usersPagination.goToPage(1);
                this.notifyUser("User deleted", "User was successfully deleted");
            } catch (err){
                this.notifyUser("Error occurred", <string>err);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
