import React from "react";
import * as SC from "./styles";
import { useContext } from "../../../hooks/useContext";
import copy from "../../../assets/copy.svg";
import dots from "../../../assets/dots.svg";
import { Button } from "@material-ui/core";

const Overview: React.FC = () => {
    const { userData } = useContext();
    const [editInformation, setEditInformation] = React.useState(false);

    const handleCopy = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    return (
        <SC.Overview>
            <SC.UserCard>
                <SC.UserInfoContainer>
                    <SC.Dots src={dots} alt="options" height="20" width="4" />
                    <SC.UserImage alt="user" src={userData.picture} height="88" width="88" />
                    <SC.FlexDown>
                        <SC.UserName>{userData.firstName} {userData.lastName}</SC.UserName>
                        <SC.UserCompany>{userData.company} </SC.UserCompany>
                        <SC.UserId><strong>User-ID:</strong> {userData.id} <img onClick={() => handleCopy(userData.id || "")} src={copy} alt="copy" height="12" width="12" /></SC.UserId>
                    </SC.FlexDown>
                </SC.UserInfoContainer>
                {
                    !editInformation ? (
                <>
                    <SC.InfoFieldWrapper>
                        <SC.InfoFieldPlaceholder>First Name</SC.InfoFieldPlaceholder>
                        <SC.InfoField>{userData.firstName}</SC.InfoField>
                    </SC.InfoFieldWrapper>
                    <SC.InfoFieldWrapper>
                        <SC.InfoFieldPlaceholder>Last Name</SC.InfoFieldPlaceholder>
                        <SC.InfoField>{userData.lastName}</SC.InfoField>
                    </SC.InfoFieldWrapper>
                    <SC.InfoFieldWrapper>
                        <SC.InfoFieldPlaceholder>E-mail</SC.InfoFieldPlaceholder>
                        <SC.InfoField>{userData.primaryEmail}</SC.InfoField>
                    </SC.InfoFieldWrapper>
                    <SC.EditButtonWrapper>
                        <Button onClick={() => setEditInformation(true)} fullWidth={false} size="medium" color="primary" variant="outlined">Edit information</Button>
                    </SC.EditButtonWrapper>
                </>
                    ) : null
                }
            </SC.UserCard>
            <SC.CLIAccesWrapper>
                <SC.CLIAccess>Command Line (CLI) Access</SC.CLIAccess>
                <Button style={{width: "200px"}} fullWidth={false} size="large" color="primary" variant="contained">Edit information</Button>
            </SC.CLIAccesWrapper>
        </SC.Overview>
    )
}

export default Overview;