import React from "react";
import * as SC from "./styles";
import { useContext } from "../../../hooks/useContext";
import copy from "../../../assets/copy.svg";
import dots from "../../../assets/dots.svg";
import { Button, Modal, Backdrop  } from "@material-ui/core";
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from "@jsonforms/core";
import {
    materialRenderers,
    materialCells
  } from '@jsonforms/material-renderers';
import { useEffect } from "react";
import CliAccess from "./CliAccess";
import Delete from "./Delete";

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
        email: {
            type: "string",
            format: "email",
            pattern: "^\\S+@\\S+\\.\\S+$",
            minLength: 6,
            maxLength: 127
        },
    },
    required: ["firstName", "lastName", "email"]
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
        scope: "#/properties/email",
        options: {
            hideRequiredAsterisk: true,
        }
      },
    ]
  }

const Overview: React.FC = () => {
    const { userData } = useContext();
    const [editInformation, setEditInformation] = React.useState(false);
    const [data, setData] = React.useState({firstName: userData.firstName, lastName: userData.lastName, email: userData.primaryEmail});
    const [errors, setErrors] = React.useState<object[]>([]);
    const [validationMode, setValidationMode] = React.useState<ValidationMode>("ValidateAndHide");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [cliOpen, setCliOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    useEffect(() => {
        setData({firstName: userData.firstName, lastName: userData.lastName, email: userData.primaryEmail});
    }, [userData]);

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
        setData({firstName: userData.firstName, lastName: userData.lastName, email: userData.primaryEmail});
    }

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
                    <SC.DotsWrapper onClick={() => setDeleteOpen(true)}>
                        <SC.Dots src={dots} alt="options" height="20" width="4" />
                    </SC.DotsWrapper>
                    <SC.UserImage alt="user" src={userData.picture} height="88" width="88" />
                    <SC.FlexDown>
                        <SC.UserName>{data.firstName} {data.lastName}</SC.UserName>
                        <SC.UserCompany>{data.email} </SC.UserCompany>
                        <SC.UserId><strong>User-ID:</strong> {userData.id} <img onClick={() => handleCopy(userData.id || "")} src={copy} alt="copy" height="12" width="12" /></SC.UserId>
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
                        <SC.InfoField>{data.email}</SC.InfoField>
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
                <Button onClick={() => setCliOpen(true)} style={{width: "200px"}} fullWidth={false} size="large" color="primary" variant="contained">Edit information</Button>
            </SC.CLIAccesWrapper>
        </SC.Overview>
    )
}

export default Overview;