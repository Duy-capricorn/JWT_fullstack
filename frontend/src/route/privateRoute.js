import { UserContext } from '@/context/userContext';
import { useContext, useEffect, useEffect } from 'react';

import Login from '@/app/login/login';

const withAuth = (Component) => {
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user && user.isAuthenticated === true) {
        }
    }, []);
    const Auth = (props) => {
        // Login data added to props via redux-store (or use react context for example)
        const { isLoggedIn } = props;

        // If user is not logged in, return login component
        if (!isLoggedIn) {
            return <Login />;
        }

        // If user is logged in, return original component
        return <Component {...props} />;
    };

    // Copy getInitial props so it will run as well
    if (Component.getInitialProps) {
        Auth.getInitialProps = Component.getInitialProps;
    }

    return Auth;
};

// function PrivateRotes(props) {
//     useEffect(() => {}, []);

//     return <></>;
// }

export default withAuth;
