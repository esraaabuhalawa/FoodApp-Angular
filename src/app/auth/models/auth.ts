export interface ILogin {
  email: string;
  password: string;
}

export interface IVerify {
  email: string;
  code: string;
}

export interface IChangePassword {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}


export interface ResetPasswordData {
  email: string;
  password: string;
  confirmPassword: string;
  seed: string;
}

