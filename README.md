# Ask Bageera App

Ask Bageera App is a frontend application built using ReactJS and Material-UI. \
This application serves users like Product and Business Managers, enabling them \
to interact with in-house structured data using natural language.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Code Flow](#code-flow)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/sumveds/ask-bageera-app.git
   cd ask-bageera-app
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the application:**

   ```bash
   # To run it locally
   $ npm run start:dev
   ```

## Usage

The application will be available at `http://localhost:3001`.

## Code Flow

### Entry Point

The entry point of the application is `index.tsx`, where the React app is rendered.

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Auth0Provider
    domain="dev-grekqp1gdk7jbvov.us.auth0.com"
    clientId="raEoYn2Fg0bql9fuLKZlXFaxVA0h5FMd"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);
```

### App Component

The `App.js` file is the root component of the application. \
It sets up routing and includes global providers.

### Pages

Pages are organized into folders based on their functionality:

- **Home:** Home page and its specific components.
- **Chat:** Chat page and its specific components.

Other pages follow a similar structure.

### Components

Common components like Layout, Header, Spinner, and Error are defined in the components directory. \
These components are reusable and help maintain consistency across the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
