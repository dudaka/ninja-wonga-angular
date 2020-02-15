import { interpolate } from 'd3-interpolate';
import { arcPath } from './chart-settings';

// use function keyword to allow use of 'this'
export function arcTweenUpdate(d) {
  // console.log(this._current, d);
  // interpolate between the two objects
  const i = interpolate(this._current, d);
  // update the current prop with new updated data
  this._current = i(1);

  return (t) => arcPath(i(t));
    // i(t) returns a value of d (data object) which we pass to arcPath
}

export const arcTweenEnter = d => {
  const i = interpolate(d.endAngle - 0.1, d.startAngle);

  return (t) => {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

export const arcTweenExit = d => {
  const i = interpolate(d.startAngle, d.endAngle);

  return (t) => {
    d.startAngle = i(t);
    return arcPath(d);
  };
};
