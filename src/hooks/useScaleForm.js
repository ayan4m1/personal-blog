import { useFormik } from 'formik';
import { uniqueId } from 'lodash-es';

import { convert } from 'utils/units';

const convertRegex = /([\d.-]+)\s+(\w+)\s+in\s+(\w+)/;

export default function useScaleForm(onHistoryPush) {
  return useFormik({
    initialValues: {
      conversion: ''
    },
    onSubmit: (vals, { setFieldError }) => {
      if (convertRegex.test(vals.conversion)) {
        const [, rawValue, unit, targetUnit] =
          vals.conversion.match(convertRegex);

        if (!rawValue || !unit || !targetUnit) {
          return setFieldError('conversion', 'Could not parse input.');
        }

        if (!convert().from(unit).possibilities().includes(targetUnit)) {
          return setFieldError(
            'conversion',
            `Cannot convert ${unit} to ${targetUnit}`
          );
        }

        const value = parseFloat(rawValue);

        if (isNaN(value)) {
          return setFieldError('conversion', `Could not parse value.`);
        }

        onHistoryPush({
          id: uniqueId(),
          unit,
          targetUnit,
          value
        });
      } else {
        const [rawValue, unit] = vals.conversion.split(/\s+/);

        if (!rawValue || !unit) {
          return setFieldError('conversion', 'Could not parse input.');
        }

        const value = parseFloat(rawValue);

        if (isNaN(value)) {
          return setFieldError('conversion', `Could not parse value.`);
        }

        if (!convert().possibilities('length').includes(unit)) {
          return setFieldError('conversion', `Unsupported unit ${unit}`);
        }

        onHistoryPush({
          id: uniqueId(),
          unit,
          targetUnit: unit,
          value
        });
      }
    }
  });
}
