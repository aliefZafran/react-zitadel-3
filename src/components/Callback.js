import React, { useEffect, useState } from 'react';
import authConfig from '../authConfig';

const Callback = ({ auth, setAuth, userManager, userInfo, setUserInfo, handleLogout }) => {

  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)

  const callApi = async () => {
    try {
      console.log(token);
      // Call spring api
      // Set the authorization header with token obtained from logging in
      const response = await fetch('http://localhost:18090/api/greet/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        // If the response status is OK (2xx), parse the JSON response
        const data = await response.json();
        setMessage(data.message);
      } else {
        // Handle error responses (e.g., 4xx or 5xx)
        console.error('API Error:', response.status, response.statusText);
      }
    } catch (error) {
      // Handle any network or fetch errors
      console.error('Network Error:', error);
    }
  };

  
  // !Work in progress to allow client side for profile management
  const addMfa = async () => {
    try {
      console.log(token);
      // Make the API request
      const response = await fetch('http://localhost:8080/ui/console/users/me?id=mfa', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        // If the response status is OK (2xx), parse the JSON response
        const data = await response.json();
        setMessage(data.message);
        // You can set the response data in your component's state for rendering.
      } else {
        // Handle error responses (e.g., 4xx or 5xx)
        console.error('API Error:', response.status, response.statusText);
      }
    } catch (error) {
      // Handle any network or fetch errors
      console.error('Network Error:', error);
    }
  }

  useEffect(() => {
    if (auth === null) {
      userManager.signinRedirectCallback().then((user) => {
        if (user) {
          setAuth(true);
          const access_token = user.access_token;
          // Make a request to the user info endpoint using the access token
          fetch(authConfig.userinfo_endpoint, {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          })
            .then(response => response.json())
            .then(userInfo => {
              setUserInfo(userInfo);
              setToken(access_token);
            });
        } else {
          setAuth(false);
        }
      }).catch((error) => {
        setAuth(false);
      });
    }
  }, [auth, userManager, setAuth]);


  if (auth === true && userInfo) {
    return (
      <div>
        <h1>Welcome, {userInfo.name}!</h1>
        <h2>Your ZITADEL Profile Information</h2>
        <h3>Name:  {userInfo.name}</h3>
        <h3>Email: {userInfo.email}</h3>
        <h3>Email Verified: {userInfo.email_verified? "Yes": "No"}</h3>
        <h3>Locale: {userInfo.locale}</h3>
        

        <button onClick={handleLogout}>Log out</button>

        <button style ={{margin: '8px', backgroundColor: 'red'}} onClick={callApi}>Call api</button>
        <button style ={{margin: '8px', backgroundColor: 'green'}} onClick={addMfa}>add mfa</button>
        {message ? <h2>{message}</h2> : null}
      </div>
    );
  }
  else {
      return <div>Loading...</div>;
    }

};

export default Callback;

