import React from "react";
import * as SC from "./styles";
import warning from "../../assets/warning-red.svg";
import {Props} from "../../interfaces/fatalError";

const FatalError: React.FC<Props> = ({subtitle, description}) => {
    return (
        <SC.Wrapper>
            <SC.Warning src={warning} alt="warning" height="40" width="40" />
            <SC.Title>Error</SC.Title>
            <SC.Subtitle>{subtitle}</SC.Subtitle>
            <SC.Description>{description}</SC.Description>
            <SC.Hr />
        </SC.Wrapper>
    )
}

export default FatalError;