import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app';

function LandingPage() {
  const history = useHistory();
  const [user, loading, error] = useAuthState(firebase.auth());

  if (user) {
    history.replace('/dashboard');
  }

  if (loading) {
    return null;
  }
  return (
    <div>
      <Link to='/login'>Login</Link>
      <br />
      <Link to='/register'>Register</Link>
    </div>
  );
}

export default LandingPage;
