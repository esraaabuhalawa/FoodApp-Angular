export interface User {
  id: number;
  userName: string;
  email: string;
  country: string;
  phoneNumber: string;
  imagePath: string | null;
  group: Group;
  creationDate: string;
  modificationDate: string;
}

export interface Group {
  id: number;
  name: string;
  creationDate: string;
  modificationDate: string;
}
