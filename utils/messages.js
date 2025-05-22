const Success = {
  SuccessMessage: "Successful.",
  DeleteSuccess: "Record deleted successfully.",
  SavedSuccess: "Saved successfully.",
  LoginSuccess: "Login successfully.",
  VerifySuccess: "User verified successfully.",
  UpdatedSuccess: "Updated successfully.",
  ForgotPasswordEmailSent:
    "An email has been sent to your email. Please follow the instructions given in the email.",
  ResetPasswordSuccess:
    "Password successfully changed, Please navigate to the Login page.",
};

const Error = {
  OtpExpired: "OTP has expired.",
  NoRecordFound: "No record found.",
  DataNull: "Data is null.",
  WrongCredentials: "Wrong Credentials!",
  InvalidEmail: "This email is not registered with us.",
  InvalidOtp: "Invalid OTP.",
  AlreadyExists: "This email is already registered with us.",
  ReferenceNotSet: "Reference not set.",
  InvalidToken: "Auth Token is not supplied or is invalid.",
  DataRequired: "Data is required.",
  DeletedFaild: "DeletedFaild!",
  UpdatedFaild: "Updated Faild!",
  Somthing: "Something went wrong!",
  NotExist: "User does not exist!",
  RecordAlreadyExists: "Record Already Exists",
};

module.exports = {
  Success,
  Error,
};
