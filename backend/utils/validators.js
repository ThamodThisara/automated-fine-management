export const NIC_REGEX = /^([0-9]{9}[VXvx]|[0-9]{12})$/;
export const PHONE_REGEX = /^0[0-9]{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export const VALIDATION_MESSAGES = {
  nic: "NIC must be 9 digits followed by V or X, or 12 digits.",
  phoneNumber: "Phone number must be 10 digits starting with 0.",
  email: "Enter a valid email address.",
  password:
    "Password must be at least 8 characters and include a number and a symbol.",
};

// Normalizes a NIC to the canonical stored form (trimmed, uppercase V/X).
export const normalizeNic = (nic) =>
  typeof nic === "string" ? nic.trim().toUpperCase() : nic;

export const isValidPassword = (password) =>
  typeof password === "string" && PASSWORD_REGEX.test(password);
