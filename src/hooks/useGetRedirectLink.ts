import { useContext } from './useContext';

export const  useGetRedirectLink = () => {
    const { userData } = useContext();

    const getRedirectLink = (url: string) => {
        const redirectLink = "/account/" + userData.accountId + "/subscription/" + userData.subscriptionId + url;
        return redirectLink;
    }

    return {
        getRedirectLink
    };
};