(()=>{"use strict";var e=function(){function e(e,t){this.email=e||"",this.username=t||"",this.id=(new Date).getTime(),this.borrowedBooks=[]}return e.prototype.getEmail=function(){return this.email},e.prototype.getId=function(){return this.id},e.prototype.getUsername=function(){return this.username},e.prototype.represent=function(){return"ID: ".concat(this.id," - ").concat(this.username," (").concat(this.email,")")},e.prototype.borrowBook=function(e){this.borrowedBooks.push(e)},e.prototype.takeBookBack=function(e){if(!this.borrowedBooks.filter((function(t){return t.id===e}))[0])throw new Error("User does not have this book");this.borrowedBooks=this.borrowedBooks.filter((function(t){return t.id!==e}))},e}(),t=function(){function e(){this.validaEmailRegExp=new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"),this.validReleaseYearRegExp=new RegExp("^(0|[1-9][0-9]{0,3})$")}return e.prototype.validateCreateBookRequest=function(e,t,o){return!!(e&&t&&o&&this.validReleaseYearRegExp.test(o.toString()))},e.prototype.validateCreateUserRequest=function(e,t){return!!e&&!!t&&!!this.validaEmailRegExp.test(t)},e.getInstance=function(){return e.instance||(e.instance=new e),e.instance},e}(),o=function(){function e(){}return e.prototype.save=function(e,t){localStorage.setItem(e,JSON.stringify(t))},e.prototype.get=function(e){return JSON.parse(localStorage.getItem(e)||"[]")},e.prototype.clear=function(){localStorage.clear()},e.getInstance=function(){return e.instance||(e.instance=new e),e.instance},e}(),r=function(){function e(e,t,o){this.author=e||"",this.bookName=t||"",this.releaseYear=o||0,this.borrowed=!1,this.id=(new Date).getTime(),this.borrowedBy=void 0}return e.prototype.getAuthor=function(){return this.author},e.prototype.getBookName=function(){return this.bookName},e.prototype.getReleaseYear=function(){return this.releaseYear},e.prototype.getId=function(){return this.id},e.prototype.represent=function(){var e="ID: ".concat(this.id," - ").concat(this.bookName," by ").concat(this.author," (").concat(this.releaseYear,"). ").concat(this.borrowedBy?" Borrowed By: ".concat(this.borrowedBy):"");return console.log(e),e},e.prototype.getFullName=function(){return"ID: ".concat(this.id," - ").concat(this.bookName," by ").concat(this.author," (").concat(this.releaseYear,").")},e}(),n=function(){function n(){this.usersKey="library-users",this.storage=o.getInstance(),this.validation=t.getInstance(),this.users=[],this.loadFromStorage()}return n.prototype.add=function(t,o){if(!this.validation.validateCreateUserRequest(t,o))throw new Error("Invalid data for user");var r=new e(o,t);this.users.push(r),this.storage.save(this.usersKey,this.users)},n.prototype.remove=function(e){this.users=this.users.filter((function(t){return t!==e})),this.storage.save(this.usersKey,this.users)},n.prototype.removeById=function(e){this.users=this.users.filter((function(t){return t.id!==e})),this.storage.save(this.usersKey,this.users)},n.prototype.getById=function(e){return this.users.filter((function(t){return t.id===e}))[0]},n.prototype.getPaginated=function(e,t){var o=(e-1)*t,r=o+t;return this.users.slice(o,r)},n.prototype.getTotalCount=function(){return this.users.length},n.prototype.loadFromStorage=function(){for(var t=0,o=this.storage.get(this.usersKey);t<o.length;t++){var n=o[t],i=new e;i.email=n.email,i.id=n.id,i.username=n.username;for(var s=[],a=0,u=n.borrowedBooks;a<u.length;a++){var l=u[a],c=new r;c.id=l.id,c.author=l.author,c.bookName=l.bookName,c.releaseYear=l.releaseYear,c.borrowed=l.borrowed,c.borrowedBy=l.borrowedBy,s.push(c)}i.borrowedBooks=s,this.users.push(i)}},n}(),i=function(){function e(){this.items=[]}return e.prototype.add=function(e){this.items.push(e)},e.prototype.remove=function(e){this.items=this.items.filter((function(t){return t!==e}))},e.prototype.removeById=function(e){if(!this.items.filter((function(t){return t.id===e}))[0])throw new Error("Item was not found");this.items=this.items.filter((function(t){return t.id!==e}))},e.prototype.find=function(e){return this.items.filter((function(t){return t.id===e}))[0]},e.prototype.getAll=function(){return this.items},e.prototype.getPaginated=function(e,t){var o=(e-1)*t,r=o+t;return this.items.slice(o,r)},e.prototype.getTotalCount=function(){return this.items.length},e}(),s=function(){function e(e){this.booksKey="libraryBooks",this.userService=e,this.validation=t.getInstance(),this.library=new i,this.storageService=o.getInstance(),this.loadFromStorage(),this.allBooks=this.library.getAll(),this.queriedBooks=this.allBooks}return e.prototype.addBook=function(e,t,o){if(!this.validation.validateCreateBookRequest(e,t,o))throw new Error("Invalid data for book");var n=new r(t,e,o);this.library.add(n);var i=this.library.getAll();this.storageService.save(this.booksKey,i)},e.prototype.removeBook=function(e){this.library.removeById(e);var t=this.library.getAll();this.storageService.save(this.booksKey,t)},e.prototype.getById=function(e){return this.library.find(e)},e.prototype.getPaginated=function(e,t){var o=(e-1)*t,r=o+t,n=this.queriedBooks.slice(o,r);return console.log("Queried books:"),console.log(n),n},e.prototype.getTotalCount=function(){return this.queriedBooks.length},e.prototype.borrowBook=function(e,t){var o=this.userService.getById(e);if(console.log("user found"),!o)throw new Error("User not found");if(console.log("Borrowed count:"),console.log(o.borrowedBooks.length),o.borrowedBooks.length>=3)throw new Error("User already has 3 books");var r=this.library.find(t);if(console.log("book found"),!r||r.borrowed)throw new Error("Book not found or it was already taken by someone");r.borrowed=!0,r.borrowedBy=o.email,o.borrowBook(r),this.storageService.save(this.booksKey,this.library.getAll())},e.prototype.returnBook=function(e,t){var o=this.userService.getById(e);if(!o)throw new Error("User not found");var r=this.library.find(t);if(!r)throw new Error("Book not found or it was already taken by someone");o.takeBookBack(t),r.borrowedBy=void 0,r.borrowed=!1,this.storageService.save(this.booksKey,this.library.getAll())},e.prototype.searchBook=function(e,t){if(""!==e)switch(t){case"name":this.queriedBooks=this.allBooks.filter((function(t){return t.bookName.includes(e)}));break;case"author":this.queriedBooks=this.allBooks.filter((function(t){return t.author.includes(e)}));break;default:this.queriedBooks=this.allBooks}else this.queriedBooks=this.allBooks},e.prototype.loadFromStorage=function(){for(var e,t=0,o=null!==(e=this.storageService.get(this.booksKey))&&void 0!==e?e:[];t<o.length;t++){var n=o[t],i=new r;i.id=n.id,i.author=n.author,i.bookName=n.bookName,i.releaseYear=n.releaseYear,i.borrowed=n.borrowed,i.borrowedBy=n.borrowedBy,this.library.add(i)}console.log(this.library.getAll())},e}(),a=function(){function e(e,t,o,r){void 0===r&&(r=5),this.currentPage=1,this.paginationId=e,this.listId=t,this.paginatableItems=o,this.itemsPerPage=r,this.initListeners(),this.renderPageNumbers()}return e.prototype.getTotalPages=function(){return Math.ceil(this.paginatableItems.getTotalCount()/this.itemsPerPage)},e.prototype.goToPage=function(e){var t=this.getTotalPages();console.log(t),console.log(e),0==t&&this.clearPagination(),e<1||e>t||(this.currentPage=e,this.updatePaginationUI(),this.renderPageNumbers(),this.renderItems())},e.prototype.renderPageNumbers=function(){var e=this,t=this.getTotalPages();console.log(t);var o=document.getElementById(this.paginationId);if(o){Array.from(document.querySelectorAll(".".concat(this.paginationId,"-page-number"))).forEach((function(e){return e.remove()}));for(var r=function(t){var r=document.createElement("li");r.classList.add("page-item","".concat(n.paginationId,"-page-number")),t===n.currentPage&&r.classList.add("active");var i=document.createElement("a");i.classList.add("page-link"),i.href="#",i.textContent=t.toString(),i.addEventListener("click",(function(o){o.preventDefault(),e.goToPage(t)})),r.appendChild(i),console.log(r),o.insertBefore(r,document.getElementById("".concat(n.paginationId,"-next-page")))},n=this,i=1;i<=t;i++)r(i);this.updatePaginationUI()}},e.prototype.initListeners=function(){var e,t,o=this;null===(e=document.getElementById("".concat(this.paginationId,"-prev-page")))||void 0===e||e.addEventListener("click",(function(e){e.preventDefault(),o.goToPage(o.currentPage-1)})),null===(t=document.getElementById("".concat(this.paginationId,"-next-page")))||void 0===t||t.addEventListener("click",(function(e){e.preventDefault(),o.goToPage(o.currentPage+1)}))},e.prototype.updatePaginationUI=function(){var e,t,o,r,n=this.getTotalPages();null===(t=null===(e=document.getElementById("".concat(this.paginationId,"-prev-page")))||void 0===e?void 0:e.parentElement)||void 0===t||t.classList.toggle("disabled",1===this.currentPage),null===(r=null===(o=document.getElementById("".concat(this.paginationId,"-next-page")))||void 0===o?void 0:o.parentElement)||void 0===r||r.classList.toggle("disabled",this.currentPage===n)},e.prototype.renderItems=function(){var e=document.getElementById(this.listId);if(e){e.innerHTML="";for(var t=0,o=this.paginatableItems.getPaginated(this.currentPage,this.itemsPerPage);t<o.length;t++){var r=o[t],n=document.createElement("li");n.className="list-group-item d-flex justify-content-between";var i=document.createTextNode(r.represent()),s=document.createElement("p");s.className="mt-auto mb-auto",s.appendChild(i),n.appendChild(s),e.appendChild(n)}}},e.prototype.clearPagination=function(){if(document.getElementById(this.paginationId)){Array.from(document.querySelectorAll(".".concat(this.paginationId,"-page-number"))).forEach((function(e){return e.remove()}));var e=document.getElementById(this.listId);e&&(e.innerHTML="")}},e}(),u=function(){function e(){this.userService=new n,this.libraryService=new s(this.userService),this.setupUserForm(),this.setupBookForm(),this.setupBorrowBookForm(),this.setupReturnBookForm(),this.setupDeleteBookForm(),this.setupDeleteUserForm(),this.setupSearchForm(),this.libraryPagination=new a("books-navigation","books-list",this.libraryService),this.usersPagination=new a("users-navigation","users-list",this.userService),this.messageModalButton=document.getElementById("message-modal-button"),this.messageModalBody=document.getElementById("message-modal-body"),this.messageModalLabel=document.getElementById("messageModalLabel"),this.libraryPagination.goToPage(1),this.usersPagination.goToPage(1)}return e.prototype.setupUserForm=function(){var e=this,t=document.getElementById("create-user-form");t&&t.addEventListener("submit",(function(o){var r,n,i,s;o.preventDefault();try{r=document.getElementById("username"),n=document.getElementById("email"),i=r.value,s=n.value,e.userService.add(i,s),t.reset(),e.usersPagination.goToPage(1)}catch(e){console.log(e)}}))},e.prototype.setupBookForm=function(){var e=this,t=document.getElementById("create-book-form");t&&t.addEventListener("submit",(function(o){var r,n,i;o.preventDefault();try{r=document.getElementById("bookName").value,n=document.getElementById("author").value,i=parseInt(document.getElementById("releaseYear").value),e.libraryService.addBook(r,n,i),t.reset(),e.libraryPagination.goToPage(1)}catch(e){console.log(e)}}))},e.prototype.setupBorrowBookForm=function(){var e=this,t=document.getElementById("borrow-book-form");t.addEventListener("submit",(function(o){o.preventDefault();try{!function(){var t=parseInt(document.getElementById("borrow-user-id").value),o=parseInt(document.getElementById("borrow-book-id").value);e.libraryService.borrowBook(t,o);var r=e.libraryService.getById(o);if(!r)throw new Error("Error");var n=e.userService.getById(t);if(!n)throw new Error("Error");e.notifyUser("Book borrowed","".concat(r.getFullName()," has been borrowed by ").concat(n.represent()))}(),t.reset(),e.libraryPagination.goToPage(1)}catch(e){alert(e)}}))},e.prototype.setupReturnBookForm=function(){var e=this,t=document.getElementById("return-book-form");t.addEventListener("submit",(function(o){o.preventDefault();try{!function(){var t=parseInt(document.getElementById("return-user-id").value),o=parseInt(document.getElementById("return-book-id").value);e.libraryService.returnBook(t,o);var r=e.libraryService.getById(o);if(!r)throw new Error("Error");e.notifyUser("Book returned","".concat(r.getFullName()," has been returned."))}(),t.reset(),e.libraryPagination.goToPage(1)}catch(e){alert(e)}}))},e.prototype.notifyUser=function(e,t){this.messageModalLabel.innerText=e,this.messageModalBody.innerText=t,this.messageModalButton.click()},e.prototype.setupSearchForm=function(){var e=this,t=document.getElementById("search-form");t.addEventListener("reset",(function(o){o.preventDefault(),t.reset(),e.libraryService.searchBook("",""),e.libraryPagination.goToPage(1)})),t.addEventListener("submit",(function(t){var o,r;t.preventDefault();try{o=document.getElementById("search-book").value,r=document.getElementById("search-book-option").value,console.log("Search options"),console.log(r),console.log("Search query"),console.log(o),e.libraryService.searchBook(o,r),e.libraryPagination.goToPage(1)}catch(e){alert(e)}}))},e.prototype.setupDeleteBookForm=function(){var e=this,t=document.getElementById("delete-book-form");t.addEventListener("submit",(function(o){var r;o.preventDefault();try{r=parseInt(document.getElementById("delete-book-id").value),e.libraryService.removeBook(r),t.reset(),e.libraryPagination.goToPage(1),e.notifyUser("Book deleted","Book was successfully deleted")}catch(t){e.notifyUser("Error occurred",t)}}))},e.prototype.setupDeleteUserForm=function(){var e=this,t=document.getElementById("delete-user-form");t.addEventListener("submit",(function(o){var r;o.preventDefault();try{r=parseInt(document.getElementById("delete-user-id").value),e.userService.removeById(r),t.reset(),e.usersPagination.goToPage(1),e.notifyUser("User deleted","User was successfully deleted")}catch(t){e.notifyUser("Error occurred",t)}}))},e}();document.addEventListener("DOMContentLoaded",(function(){new u}))})();