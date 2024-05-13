import * as Yup from 'yup';

export default Yup.object().shape({
    shortName: Yup.string().required('Short Name is required.'),
    // longName: Yup.string().required('Long Name is required.'),
    // desc: Yup.string().required('Description is required.'),
    // label: Yup.string().required('Label is required.')s
});
