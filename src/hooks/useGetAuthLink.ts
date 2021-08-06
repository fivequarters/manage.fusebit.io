const {
    REACT_APP_AUTH0_DOMAIN,
    REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_FUSEBIT_DEPLOYMENT
} = process.env;

export const  useGetAuthLink = () => {
    const getAuthLink = () => {
        const authLink = `${REACT_APP_AUTH0_DOMAIN}/authorize?response_type=token&client_id=${REACT_APP_AUTH0_CLIENT_ID}&audience=${REACT_APP_FUSEBIT_DEPLOYMENT}&redirect_uri=${window.location.origin}/callback&scope=openid profile email`;
        return authLink;
    }

    return {
        getAuthLink
    };
};