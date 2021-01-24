import { Route, Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user, loading, error] = useAuthState(firebase.auth());

  const isAuthorized = () => {
    return user ? true : false;
  };

  if (loading) return null;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized() ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

export default PrivateRoute;
