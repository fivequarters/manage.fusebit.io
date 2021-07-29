import { useAxios } from './useAxios';

export const  useGetAuthLink = () => {
    const { getBaseUrl } = useAxios();

    const getAuthLink = () => {
        const authLink = `https://fusebit.auth0.com/authorize?response_type=token&client_id=dimuls6VLYgXpD7UYCo6yPdKAXPXjQng&audience=${getBaseUrl()}&redirect_uri=${window.location.origin}/callback&scope=openid profile email`;
        return authLink;
    }

    return {
        getAuthLink
    };
};