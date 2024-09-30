# Password Manager

A simple password manager application built with Node.js, Express. This application allows you to securely store, retrieve, and manage your passwords. It stores it locally preventing any security leaks.

## Features

- Add new passwords
- View stored passwords
- Copy passwords to clipboard
- Delete passwords
- Encrypt and decrypt passwords using AES-256-CBC
- running in browser in localhost

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/password-manager.git
   cd password-manager
   ```

2. Install dependencies

   ```sh
   npm i
   ```

3. Create .env file and create SECRET_KEY used for encrypting passwords

- since data are stored in json file they can be easily accessed so encrypting passswords makes the app more secure

```
SECRET_KEY=my_key
```

# Usage

1. To use create a shortcut to desktop and run index.js with node
2. open localhost:3000 in browser
