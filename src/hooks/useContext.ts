import constate from "constate";
import { useState } from "react";
import { User } from "../interfaces/user";

const emptyUser: User = {
    fistname: '',
    lastname: '',
    email: ''
}

const _useContext = () => {
    const [userData, setUserData] = useState<User>(emptyUser);

    return {
        userData,
        setUserData
    };
};

const [ContextProvider, useContext] = constate(_useContext);

export { ContextProvider, useContext };