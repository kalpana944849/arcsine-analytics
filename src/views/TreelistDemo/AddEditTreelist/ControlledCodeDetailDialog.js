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
const ControlledCodeDetailDialog = (props) => {
  const { setFolderName, setFileName, selectedRow } = props;

  return (
    <>
      <Form
        render={(renderProps) => (
          <Dialog 
            title={`${selectedRow.libraryControlledTerminologyNameShort} Detail`}
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
                  editorId={"libraryControlledTerminologyGuid"}
                  className={"k-form-label"}
                >
                  {"Unique Id :- "}
                </Label>
                <div
                  className={"k-form-field-wrap"}
                  style={{ textAlign: "left" }}
                >
                  <p> {selectedRow.libraryControlledTerminologyGuid}</p>
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
                  editorId={"libraryControlledTerminologyNameShort"}
                  className={"k-form-label"}
                >
                  {"Name :- "}
                </Label>
                <div
                
                  className={"k-form-field-wrap"}
                  style={{ textAlign: "center" }}
                >
                  <p > {selectedRow.libraryControlledTerminologyNameShort}</p>
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
                  editorId={"libraryControlledTerminologyNameShort"}
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
          </Dialog>
        )}
      />
    </>
  );
};
export default ControlledCodeDetailDialog;
