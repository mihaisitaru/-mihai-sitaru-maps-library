function isPalindrome(string) {
  return string.split("").reverse().join("") == string;
}

module.exports = isPalindrome;
