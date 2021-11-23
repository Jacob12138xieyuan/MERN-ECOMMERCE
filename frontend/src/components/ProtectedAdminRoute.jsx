import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedAdminRoute = ({ component: Component, ...rest }) => {
	const { userInfo } = useSelector((state) => state.loginStatus);

	return (
		<Route
			{...rest}
			render={(props) => {
				if (userInfo && userInfo.isAdmin) {
					return <Component {...props} />;
				} else {
					return (
						<Redirect to={{ pathname: '/', state: { from: props.location } }} />
					);
				}
			}}
		></Route>
	);
};

export default ProtectedAdminRoute;
