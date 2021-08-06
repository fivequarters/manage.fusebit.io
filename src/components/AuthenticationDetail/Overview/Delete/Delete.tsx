import React from "react";
import * as SC from "./styles";
import cross from "../../../../assets/cross.svg";
import {Props} from "../../../../interfaces/delete";
import { Button } from "@material-ui/core";

const Delete = React.forwardRef(({open, onClose}: Props, ref) => {
    return (
        <SC.Card open={open}>
            <SC.Close onClick={() => onClose()} src={cross} alt="cross" height="12" width="12" />
            <SC.Title>Are you sure you want to delete this user?</SC.Title>
            <SC.Description>You cannot undo this action.</SC.Description>
            <SC.ButtonsWrapper>
                <Button style={{width: "77px", marginRight: "16px"}} size="medium" variant="outlined" color="primary">Cancel</Button>
                <Button style={{width: "77px"}} size="medium" variant="contained" color="primary">Delete</Button>
            </SC.ButtonsWrapper>
        </SC.Card>
    )
})

export default Delete;