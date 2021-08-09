import React from "react";
import * as SC from "./styles";
import { useContext } from "../../../hooks/useContext";
import copy from "../../../assets/copy.svg";
import dots from "../../../assets/dots.svg";
import { Button, Modal, Backdrop } from "@material-ui/core";
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from "@jsonforms/core";
import {
    materialRenderers,
    materialCells
  } from '@jsonforms/material-renderers';
import { useEffect } from "react";
import CliAccess from "./CliAccess";
import Delete from "./Delete";
import { useParams } from "react-router-dom";
import { useAccountUserGetOne } from "../../../hooks/api/v1/account/user/useGetOne";
import client from "../../../assets/client.jpg";

const schema = {
    type: "object",
    properties: {
        firstName: {
            type: "string",
            minLength: 2,
        },
        lastName: {
            type: "string",
            minLength: 2,
        },
        primaryEmail: {
            type: "string",
            format: "email",
            pattern: "^\\S+@\\S+\\.\\S+$",
            minLength: 6,
            maxLength: 127
        },
    },
    required: ["firstName", "lastName", "primaryEmail"]
  }

  const uischema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/firstName",
        options: {
            hideRequiredAsterisk: true,
        }
      },
      {
        type: "Control",
        scope: "#/properties/lastName",
        options: {
            hideRequiredAsterisk: true,
        }
      },
      {
        type: "Control",
        scope: "#/properties/primaryEmail",
        options: {
            hideRequiredAsterisk: true,
        }
      },
    ]
  }

const Overview: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { userData } = useContext();
    const [editInformation, setEditInformation] = React.useState(false);
    const [data, setData] = React.useState({firstName: userData.firstName, lastName: userData.lastName, primaryEmail: userData.primaryEmail});
    const { data: accountData, refetch: reloadAccount } = useAccountUserGetOne<any>({ enabled: userData.token, userId, accountId: userData.accountId });
    const [errors, setErrors] = React.useState<object[]>([]);
    const [validationMode, setValidationMode] = React.useState<ValidationMode>("ValidateAndHide");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [cliOpen, setCliOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [idCopied, setIdCopied] = React.useState(false);
    const [popperOpen, setPopperOpen] = React.useState(false);
    let timeout: NodeJS.Timeout;

    useEffect(() => {
        if (accountData && accountData.data) {
            setData(accountData.data);
        }
    }, [accountData]);

    const handleSubmit = () => {
        if (errors.length > 0) {
            setValidationMode("ValidateAndShow");
        } else {
            //update the user info
            setIsSubmitting(true);
            setTimeout(() => {
                setEditInformation(false);
                setIsSubmitting(false);
                setValidationMode("ValidateAndHide");
            }, 1000);
        }
    }

    const handleCancel = () => {
        setEditInformation(false);
        setIsSubmitting(false);
        setData(accountData?.data);
    }

    const handleCopy = (text: string) => {
        clearTimeout(timeout);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setIdCopied(true);
        timeout = setTimeout(() => {
            setIdCopied(false);
        }, 3000);
    }

    return (
        <SC.Overview onClick={(e: any) => (e.target.id !== "popper" && e.target.id !== "popperWrapper") && setPopperOpen(false)}>
            <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                >
                <Delete open={deleteOpen} onClose={() => setDeleteOpen(false)} />
            </Modal>
            <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={cliOpen}
                    onClose={() => setCliOpen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                >
                <CliAccess open={cliOpen} onClose={() => setCliOpen(false)} />
            </Modal>
            <SC.UserCard>
                <SC.UserInfoContainer>
                    <div>
                        <SC.DotsWrapper id="popper" onClick={() => setPopperOpen(true)}>
                            <SC.Dots src={dots} alt="options" height="20" width="4" />
                        </SC.DotsWrapper>
                        <SC.PopperOpen id="popperWrapper" active={popperOpen}>
                            <SC.PopperElement onClick={() => setDeleteOpen(true)}>Delete User</SC.PopperElement>
                        </SC.PopperOpen>
                    </div>
                    <SC.UserImage alt="user" src={client} height="88" width="88" />
                    <SC.FlexDown>
                        <SC.UserName>{accountData?.data.firstName} {accountData?.data.lastName}</SC.UserName>
                        <SC.UserCompany>{accountData?.data.primaryEmail} </SC.UserCompany>
                        <SC.UserId><strong>User-ID:&nbsp;</strong> {accountData?.data.id} <img onClick={() => handleCopy(accountData?.data.id || "")} src={copy} alt="copy" height="12" width="12" /></SC.UserId>
                        <SC.CopySuccess copy={idCopied}>Copied to clipboard!</SC.CopySuccess>
                    </SC.FlexDown>
                </SC.UserInfoContainer>
                {
                    !editInformation ? (
                <>
                    <SC.InfoFieldWrapper>
                        <SC.InfoFieldPlaceholder>First Name</SC.InfoFieldPlaceholder>
                        <SC.InfoField>{data.firstName}</SC.InfoField>
                    </SC.InfoFieldWrapper>
                    <SC.InfoFieldWrapper>
                        <SC.InfoFieldPlaceholder>Last Name</SC.InfoFieldPlaceholder>
                        <SC.InfoField>{data.lastName}</SC.InfoField>
                    </SC.InfoFieldWrapper>
                    <SC.InfoFieldWrapper>
                        <SC.InfoFieldPlaceholder>E-mail</SC.InfoFieldPlaceholder>
                        <SC.InfoField>{data.primaryEmail}</SC.InfoField>
                    </SC.InfoFieldWrapper>
                    <SC.EditButtonWrapper>
                        <Button onClick={() => setEditInformation(true)} fullWidth={false} size="medium" color="primary" variant="outlined">Edit information</Button>
                    </SC.EditButtonWrapper>
                </>
                    ) : (
                        <SC.FormWrapper>
                            <JsonForms
                            schema={schema}
                            uischema={uischema}
                            data={data}
                            renderers={materialRenderers}
                            cells={materialCells}
                            onChange={({ errors, data }) => {
                                errors && setErrors(errors);
                                setData(data);
                            }}
                            validationMode={validationMode}
                            />
                            <SC.FormInputWrapper>
                                <Button disabled={isSubmitting} onClick={handleSubmit} style={{marginRight: "16px"}} fullWidth={false} size="small" color="primary" variant="contained">{isSubmitting ? "Saving..." : "Save"}</Button>
                                <Button onClick={handleCancel} fullWidth={false} size="small" color="primary" variant="outlined">Cancel</Button>
                            </SC.FormInputWrapper>
                        </SC.FormWrapper>
                    )
                }
            </SC.UserCard>
            <SC.CLIAccesWrapper>
                <SC.CLIAccess>Command Line (CLI) Access</SC.CLIAccess>
                <Button onClick={() => setCliOpen(true)} style={{width: "200px"}} fullWidth={false} size="large" color="primary" variant="contained">Grant CLI Access</Button>
            </SC.CLIAccesWrapper>
        </SC.Overview>
    )
}

export default Overview;