Sure, I'll show you how to create a standard layout with Material-UI components. This example will have a header with the company logo on the left and a user account icon on the right. Clicking on the account icon will open a menu with a "Logout" option.

Firstly, we will need to install additional packages from Material-UI:

```bash
npm install @mui/icons-material @mui/material @emotion/react @emotion/styled
```

Or, if you're using Yarn:

```bash
yarn add @mui/icons-material @mui/material @emotion/react @emotion/styled
```

Here is the component structure that creates the described layout:

```tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon /> {/* This should be replaced by your company logo */}
        </IconButton>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Company Name
        </Typography>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
```

In this structure:

- `AppBar` component creates the header bar.
- `Toolbar` holds the items in the header.
- `IconButton` is used to wrap the icons, and in this case, the AccountCircle icon.
- `Menu` creates the submenu when the user icon is clicked. The `anchorEl` state variable is used to control the position and visibility of the menu.
- `MenuItem` is used to add items to the menu.

You should replace the `MenuIcon` and the text inside the `Typography` component with your company's logo and name respectively. 

For the logout functionality, you can replace the `handleClose` function with a function that logs out the user and redirects them to the login page. The specifics of this will depend on how your authentication is set up.

You can now use this `Header` component in your pages. For instance, you could create a `Layout` component that includes the `Header` and renders any child components passed into it:

```tsx
import React from 'react';
import Header from './Header';

const Layout: React.FC = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);

export default Layout;
```

Now, any page wrapped in the `Layout` component will include the header:

```tsx
import React

 from 'react';
import Layout from './Layout';

const HomePage: React.FC = () => (
  <Layout>
    <h1>Welcome to the Home Page</h1>
    {/* Other components specific to the home page */}
  </Layout>
);

export default HomePage;
```
This structure will help you maintain a consistent layout across all your pages.
