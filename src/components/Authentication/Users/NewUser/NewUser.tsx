import React from "react";
import {Props} from "../../../../interfaces/newUser";
import * as SC from "./styles";
import { Button } from "@material-ui/core";
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from "@jsonforms/core";
import {
    materialRenderers,
    materialCells
  } from '@jsonforms/material-renderers';
import cross from "../../../../assets/cross.svg";
import copyIcon from "../../../../assets/copy.svg";

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

const NewUser = React.forwardRef(({open, onClose}: Props, ref) => {
    const [data, setData] = React.useState({});
    const [errors, setErrors] = React.useState<object[]>([]);
    const [validationMode, setValidationMode] = React.useState<ValidationMode>("ValidateAndHide");
    const [userCreated, setUserCreated] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [copy, setCopy] = React.useState(false);
    let timeout: NodeJS.Timeout;

    const handleSubmit = () => {
        if (errors.length > 0) {
            setValidationMode("ValidateAndShow");
        } else {
            setIsSubmitting(true);
            // create the user
            setTimeout(() => {
             setUserCreated(true);  
             setIsSubmitting(false); 
            }, 1000);
        }
    }

    const handleCopy = (text: string) => {
        clearTimeout(timeout);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopy(true);
        timeout = setTimeout(() => {
            setCopy(false);
        }, 3000);
    }
    
    return (
        <SC.Card open={open}>
            <SC.Close onClick={() => onClose()} src={cross} alt="close" height="12" width="12" />
            {
                !userCreated ? (
                <>
                    <SC.Title>New User</SC.Title>
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
                            <Button disabled={isSubmitting} onClick={handleSubmit} style={{width: "200px"}} fullWidth={false} size="large" color="primary" variant="contained">{isSubmitting ? "Creating..." : "Create"}</Button>
                        </SC.FormInputWrapper>
                    </SC.FormWrapper>
                </>
                ) : (
                    <>
                        <SC.Title>User Bob Smith Created!</SC.Title>
                        <SC.Description>Securely share the following link with the user. The one-time use token included in the link expires in eight hours.</SC.Description>
                        <SC.LineInstructionWrapper onClick={() => handleCopy(`http://....`)}>
                            <SC.LineInstructionCopy>
                                <img src={copyIcon} alt="copy" height="16" width="16" />
                            </SC.LineInstructionCopy>
                            <SC.LineInstructionFade onlyMobileVisible={true} change={false} />
                            <SC.LineInstruction>http://....</SC.LineInstruction>
                            <SC.CopySuccess copy={copy}>Copied to clipboard!</SC.CopySuccess>
                        </SC.LineInstructionWrapper>
                        <SC.UserCreatedButtonWrapper>
                            <Button onClick={() => onClose()} style={{width: "200px"}} fullWidth={false} size="large" color="primary" variant="contained">Done</Button>
                        </SC.UserCreatedButtonWrapper>
                    </>
                )
            }
        </SC.Card>
    )
})

export default NewUser;