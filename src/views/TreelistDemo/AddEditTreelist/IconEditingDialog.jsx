import * as React from 'react';
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs';
import {Field, FieldWrapper, Form, FormElement} from '@progress/kendo-react-form';
import {cancelIcon, saveIcon} from '@progress/kendo-svg-icons';
import {Button} from "@progress/kendo-react-buttons";
import {Label} from '@progress/kendo-react-labels';
import {TextBox} from '@progress/kendo-react-inputs';
const IconEditingDialog = props => {
    const {
        itemInEdit,
        title,
        id
    } = props;
    console.log('itemInEdit', itemInEdit)
    return <Form initialValues={itemInEdit} onSubmit={props.save} render={renderProps => <Dialog title={`Edit ${title}`} onClose={props.cancel}>
        <FormElement>
            <FieldWrapper>
                <Label editorId={id} className={"k-form-label"}>
                    {"Folder Name Short"}
                </Label>
                <div className={"k-form-field-wrap"}>
                    <Field name={id} id={id} component={TextBox} />
                </div>
            </FieldWrapper>
          
          
        </FormElement>
        <DialogActionsBar layout={"start"}>
            <Button themeColor={"primary"} type={"submit"} onClick={renderProps.onSubmit} icon="save" svgIcon={saveIcon}>
              Save
            </Button>
            <Button onClick={props.cancel} icon="cancel" svgIcon={cancelIcon}>
              Cancel
            </Button>
        </DialogActionsBar>
    </Dialog>} />;
};
export default IconEditingDialog;