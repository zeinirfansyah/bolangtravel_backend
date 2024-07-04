const { isLength, isStrongPassword, isEmail } = require("validator");

const validateUsername = (username) => {
  username = username.trim();

  if (
    !isLength(username, {
      min: 6,
      max: 20,
    })
  ) {
    return "Username must be between 6 and 20 characters";
  }

  const usernameRegex = /^[a-zA-Z0-9-_\.]+$/; // Allow letters, numbers, hyphens (-), underscores (_), and dots (.)
  if (!usernameRegex.test(username)) {
    return "Username can only contain letters, numbers, hypens (-), underscores (_), and dots (.)";
  }
};

const validatePhone = (phone) => {
  phone = phone.trim();
  const phoneRegex = /^[0-9]+$/;

  if (!phoneRegex.test(phone)) {
    return "Phone number can only contain numbers";
  }

  if (!isLength(phone, { min: 10, max: 13 })) {
    return "Phone number must be between 10 and 13 characters";
  }
};

const validateEmail = (email) => {
  email = email.trim();

  if (!isEmail(email)) {
    return "Invalid email";
  }
};

const validatePassword = (password) => {
  password = password.trim();

  if (
    !isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return [
      "Password must be at least 6 characters long",
      "Password must contain at least one lowercase letter",
      "Password must contain at least one uppercase letter",
      "Password must contain at least one number",
      "Password must contain at least one symbol",
    ];
  }
};

module.exports = { validateUsername, validateEmail, validatePassword, validatePhone };
