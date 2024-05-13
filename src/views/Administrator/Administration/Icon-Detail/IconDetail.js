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
const IconDetail = (props) => {
  const { setFolderName, setFileName, selectedRow } = props;

  return (
    <>
      <Form
        render={(renderProps) => (
          <Dialog 
            title={`${selectedRow.iconNameShort} Detail`}
            onClose={props.cancel}
          >
            
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
                  <p> {selectedRow.iconId}</p>
                </div>
              </div>
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
                  editorId={"iconNameShort"}
                  className={"k-form-label"}
                >
                  {"Name :- "}
                </Label>
                <div
                
                  className={"k-form-field-wrap"}
                  style={{ textAlign: "center" }}
                >
                  <p > {selectedRow.iconNameShort}</p>
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
                  editorId={"iconNameShort"}
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
export default IconDetail;
