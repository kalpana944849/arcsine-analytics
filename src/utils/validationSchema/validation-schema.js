import * as Yup from 'yup';

export const dataGeneralSchema = Yup.object().shape({
    shortName: Yup.string().required('Short name is required.'),
    codingType: Yup.string().required('Coding type is required.'),
    codingVersion: Yup.string().required('Coding version is required.')
});

export const dataGeneralSchemaWithoutOCCDS = Yup.object().shape({
    shortName: Yup.string().required('Short name is required.')
});
