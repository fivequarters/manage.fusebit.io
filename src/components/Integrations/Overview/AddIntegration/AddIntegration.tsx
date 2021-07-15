import React from "react";
import * as SC from "./styles";
import {Props} from "../../../../interfaces/addIntegration";

const AddIntegration: React.FC<Props> = ({open, onClose}) => {
    return (
        <SC.Card open={open}>
            HEELOOOO
        </SC.Card>
    )
}

export default AddIntegration;