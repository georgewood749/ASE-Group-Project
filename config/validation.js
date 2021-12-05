import PasswordValidator from "password-validator";

const schema = new PasswordValidator();
schema
  .is()
  .min(6) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 1 digits
  .has()
  .not() // has no spaces
  .spaces();

export default schema;
