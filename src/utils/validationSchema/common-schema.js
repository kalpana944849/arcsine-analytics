import * as Yup from 'yup';

export default Yup.object().shape({
    shortName: Yup.string().required('Short Name is required.')
});
