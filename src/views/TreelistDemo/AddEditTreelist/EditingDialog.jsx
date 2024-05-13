import * as React from 'react';
import {Dialog, DialogActionsBar} from '@progress/kendo-react-dialogs';
import {Field, FieldWrapper, Form, FormElement} from '@progress/kendo-react-form';
import {cancelIcon, saveIcon} from '@progress/kendo-svg-icons';
import {Button} from "@progress/kendo-react-buttons";
import {Label} from '@progress/kendo-react-labels';
import {TextBox} from '@progress/kendo-react-inputs';
const EditingDialog = props => {
    const {
        itemInEdit
    } = props;
    return <Form initialValues={itemInEdit} onSubmit={props.save} render={renderProps => <Dialog title={`Edit ${itemInEdit.folderNameShort}`} onClose={props.cancel}>
        <FormElement>
            <FieldWrapper>
                <Label editorId={"folderNameShort"} className={"k-form-label"}>
                    {"Folder Name Short"}
                </Label>
                <div className={"k-form-field-wrap"}>
                    <Field name={"folderNameShort"} id={"folderNameShort"} component={TextBox} />
                </div>
            </FieldWrapper>
            <FieldWrapper>
                <Label editorId={"folderNameLong"} className={"k-form-label"}>
                    {"Folder Name Long"}
                </Label>
                <div className={"k-form-field-wrap"}>
                    <Field name="folderNameLong" id={"folderNameLong"} component={TextBox} />
                </div>
            </FieldWrapper>
            {/* <FieldWrapper>
              <Label editorId={"fullTime"} className={"k-checkbox-label"}>
                <div className={"k-form-field-wrap"}>
                  <Field name="fullTime" id={'fullTime'} component={Checkbox} />
                </div>
                {"Full Time"}
              </Label>
            </FieldWrapper> */}
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
export default EditingDialog;