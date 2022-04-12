import { useState } from 'react';

import FirebaseAuthService from './FirebaseAuthService';
import LoginForm from './Components/loginForm';

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  FirebaseAuthService.subscribeAuthChanges(setUser);

  console.log(user);

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Food Recipes</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>
    </div>
  );
}

export default App;