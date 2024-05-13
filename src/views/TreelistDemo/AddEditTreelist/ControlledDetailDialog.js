import * as React from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import {
  Form,
  FormElement,
  FieldWrapper,
  Field,
} from "@progress/kendo-react-form";
import { Label } from "@progress/kendo-react-labels";
import { Button } from "@progress/kendo-react-buttons";
import { Checkbox, TextBox } from "@progress/kendo-react-inputs";
import { cancelIcon, saveIcon } from "@progress/kendo-svg-icons";
const ControlledDetailDialog = (props) => {
  const { setFolderName, setFileName, selectedRow } = props;

  return (
    <>
      <Form
        render={(renderProps) => (
          <Dialog 
            title={`${selectedRow.libraryControlledTerminologyCategoryNameShort} Detail`}
            onClose={props.cancel}
          >
            {/* <FormElement> */}
            <FieldWrapper>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                <Label
                  editorId={"libraryControlledTerminologyCategoryGuid"}
                  className={"k-form-label"}
                >
                  {"Unique Id :- "}
                </Label>
                <div
                  className={"k-form-field-wrap"}
                  style={{ textAlign: "left" }}
                >
                  <p> {selectedRow.libraryControlledTerminologyCategoryGuid}</p>
                </div>
              </div>

              {/* <div className={"k-form-field-wrap"}>
                <Field onChange={(e)=>setFolderName(e.target.value)} name={"folderNameShort"} id={"folderNameShort"} component={TextBox} />
              </div> */}
            </FieldWrapper>
            <FieldWrapper>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  textAlign: "left",
                }}
              >
                <Label
                  editorId={"libraryControlledTerminologyCategoryNameShort"}
                  className={"k-form-label"}
                >
                  {"Name :- "}
                </Label>
                <div
                
                  className={"k-form-field-wrap"}
                  style={{ textAlign: "center" }}
                >
                  <p > {selectedRow.libraryControlledTerminologyCategoryNameShort}</p>
                </div>
              </div>
            </FieldWrapper>
            <FieldWrapper>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                <Label
                  editorId={"libraryControlledTerminologyCategoryNameShort"}
                  className={"k-form-label"}
                >
                  {"Parent ID :-"}
                </Label>
                <div
                  className={"k-form-field-wrap"}
                  style={{ textAlign: "center" }}
                >
                  <p> {selectedRow.parentId ? <>{selectedRow.parentId}</> : "Null"}</p>
                </div>
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
            {/* </FormElement> */}
            {/* <DialogActionsBar layout={"start"}>
            <Button onClick={props.save} themeColor={"primary"} type={"submit"} icon="save" svgIcon={saveIcon}>
              Save
            </Button>
            <Button onClick={props.cancel} icon="cancel" svgIcon={cancelIcon}>
              Cancel
            </Button>
          </DialogActionsBar> */}
          </Dialog>
        )}
      />
    </>
  );
};
export default ControlledDetailDialog;
