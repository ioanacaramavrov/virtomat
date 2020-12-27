export class UserModel {
  // tslint:disable-next-line:variable-name
  _id: string;
  firstName: string;
  lastName: string;
  email: string;

  // tslint:disable-next-line:variable-name
  constructor(_id: string, firstName: string, lastName: string, email: string) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
