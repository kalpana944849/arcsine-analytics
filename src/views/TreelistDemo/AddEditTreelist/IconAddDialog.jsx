import * as React from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Form, FormElement, FieldWrapper, Field } from '@progress/kendo-react-form';
import { Label } from '@progress/kendo-react-labels';
import { Button } from "@progress/kendo-react-buttons";
import { Checkbox, TextBox } from '@progress/kendo-react-inputs';
import { cancelIcon, saveIcon } from '@progress/kendo-svg-icons';
const IconAddDialog = props => {
  const {setFolderName, setFileName, selectedRow, type, title} = props;

  return <Form  render={renderProps => <Dialog title={`Add ${title} ${type == 'file'? 'Item': 'Folder'}`}onClose={props.cancel}>
          <FormElement>
          <FieldWrapper>
            {type=='file'?
              <Label editorId={"folderNameShort"} className={"k-form-label"}>
                {"Item Name"}
              </Label>:
              <Label editorId={"folderNameShort"} className={"k-form-label"}>
              {"Folder Name"}
            </Label>
  }
              <div className={"k-form-field-wrap"}>
                <Field onChange={(e)=>setFolderName(e.target.value)} name={"folderNameShort"} id={"folderNameShort"} component={TextBox} />
              </div>
            </FieldWrapper>
            {/* <FieldWrapper>
              <Label editorId={"folderNameLong"} className={"k-form-label"}>
                {"File Name"}
              </Label>
              <div className={"k-form-field-wrap"}>
                <Field onChange={(e)=>setFileName(e.target.value)} name="folderNameLong" id={"folderNameLong"} component={TextBox} />
              </div>
            </FieldWrapper> */}
          </FormElement>
          <DialogActionsBar layout={"start"}>
            <Button onClick={props.save} themeColor={"primary"} type={"submit"} icon="save" svgIcon={saveIcon}>
              Save
            </Button>
            <Button onClick={props.cancel} icon="cancel" svgIcon={cancelIcon}>
              Cancel
            </Button>
          </DialogActionsBar>
        </Dialog>} />;
};
export default IconAddDialog;