export const NIC_REGEX = /^([0-9]{9}[VXvx]|[0-9]{12})$/;
export const PHONE_REGEX = /^0[0-9]{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export const VALIDATION_MESSAGES = {
  nic: "NIC must be 9 digits followed by V or X, or 12 digits.",
  phoneNumber: "Phone number must be 10 digits starting with 0.",
  email: "Enter a valid email address.",
  password:
    "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.",
};

const FIELD_REGEX = {
  nic: NIC_REGEX,
  phoneNumber: PHONE_REGEX,
  email: EMAIL_REGEX,
  password: PASSWORD_REGEX,
};

// Returns an inline error message for a field, or "" when the value is valid
// (or the field is not one we validate). Empty values return "" so "required"
// handling stays with the form's own required attributes.
export const validateField = (field, value) => {
  const regex = FIELD_REGEX[field];
  if (!regex) return "";
  if (value === undefined || value === null || value === "") return "";
  return regex.test(value) ? "" : VALIDATION_MESSAGES[field];
};
