/*
 * @Description:
 * @Date: 2021-12-09 18:27:07
 * @LastEditTime: 2021-12-09 18:30:00
 */

import moment from "moment";
import _dropWhile from "lodash/dropWhile";
import _round from "lodash/round";

export const formatDuration = (duration) => {
  const ONE_MILLISECOND = 1000;
  const ONE_SECOND = 1000 * ONE_MILLISECOND;
  const ONE_MINUTE = 60 * ONE_SECOND;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const ONE_DAY = 24 * ONE_HOUR;
  const UNIT_STEPS = [
    { unit: "d", microseconds: ONE_DAY, ofPrevious: 24 },
    { unit: "h", microseconds: ONE_HOUR, ofPrevious: 60 },
    { unit: "m", microseconds: ONE_MINUTE, ofPrevious: 60 },
    { unit: "s", microseconds: ONE_SECOND, ofPrevious: 1000 },
    { unit: "ms", microseconds: ONE_MILLISECOND, ofPrevious: 1000 },
    { unit: "μs", microseconds: 1, ofPrevious: 1000 },
  ];
  // Drop all units that are too large except the last one
  const [primaryUnit, secondaryUnit] = _dropWhile(
    UNIT_STEPS,
    ({ microseconds }, index) =>
      index < UNIT_STEPS.length - 1 && microseconds > duration
  );

  if (primaryUnit.ofPrevious === 1000) {
    // If the unit is decimal based, display as a decimal
    return `${_round(duration / primaryUnit.microseconds, 2)}${
      primaryUnit.unit
    }`;
  }

  const primaryValue = Math.floor(duration / primaryUnit.microseconds);
  const primaryUnitString = `${primaryValue}${primaryUnit.unit}`;
  const secondaryValue = Math.round(
    (duration / secondaryUnit.microseconds) % primaryUnit.ofPrevious
  );
  const secondaryUnitString = `${secondaryValue}${secondaryUnit.unit}`;
  return secondaryValue === 0
    ? primaryUnitString
    : `${primaryUnitString} ${secondaryUnitString}`;
};

export const formatRelativeDate = (value, fullMonthName) => {
  const TODAY = "Today";
  const YESTERDAY = "Yesterday";
  const m = moment.isMoment(value) ? value : moment(value);
  const monthFormat = fullMonthName ? "MMMM" : "MMM";
  const dt = new Date();
  if (dt.getFullYear() !== m.year()) {
    return m.format(`${monthFormat} D, YYYY`);
  }
  const mMonth = m.month();
  const mDate = m.date();
  const date = dt.getDate();
  if (mMonth === dt.getMonth() && mDate === date) {
    return TODAY;
  }
  dt.setDate(date - 1);
  if (mMonth === dt.getMonth() && mDate === dt.getDate()) {
    return YESTERDAY;
  }
  return m.format(`${monthFormat} D`);
};
export default {};
