export class Validation {
  private static instance: Validation;

  private constructor() {}
  private readonly validaEmailRegExp: RegExp = new RegExp(
    '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
  );
  private readonly validReleaseYearRegExp: RegExp = new RegExp(
    '^(0|[1-9][0-9]{0,3})$'
  );
  validateCreateBookRequest(
    bookName: string,
    author: string,
    releaseYear: number
  ): boolean {
    if (!bookName) return false;
    if (!author) return false;
    if (!releaseYear) return false;
    if (!this.validReleaseYearRegExp.test(releaseYear.toString())) return false;
    return true;
  }

  validateCreateUserRequest(username: string, email: string): boolean {
    if (!username) return false;
    if (!email) return false;
    if (!this.validaEmailRegExp.test(email)) return false;
    return true;
  }

  static getInstance() {
    if (!Validation.instance) {
      Validation.instance = new Validation();
    }

    return Validation.instance;
  }
}
