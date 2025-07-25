import configureMeasurements from 'convert-units';
import length from 'convert-units/definitions/length';

const imperial = {
  ...length.systems.imperial,
  mil: {
    name: {
      singular: 'Mil',
      plural: 'Mils'
    },
    to_anchor: 1 / 12000
  }
};
const modifiedLength = {
  systems: {
    metric: length.systems.metric,
    imperial
  },
  anchors: length.anchors
};

export const convert = configureMeasurements({
  length: modifiedLength
});
