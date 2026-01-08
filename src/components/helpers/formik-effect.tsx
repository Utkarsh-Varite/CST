import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";

const FormikEffect = ({
  onChange,
}: {
  onChange: (current: any, prev?: any) => void;
}) => {
  const { values } = useFormikContext();
  const prevValues = useRef<any>(null);

  useEffect(() => {
    onChange(values, prevValues.current);
    prevValues.current = values;
  }, [values]);

  return null;
};

export default FormikEffect;
