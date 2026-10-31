import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { cx } from "../../utils/cx";
import { useCalendarNavigation } from "./useCalendarNavigation";
import {
  buildCalendarWeeks,
  formatDate,
  formatMonth,
  isSameDay,
  startOfDay,
} from "./DateTime.utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarProps {
  selectedDate: Date | null;
  onSelect: (day: Date) => void;
}

// The month grid inside DateTime's popover. Popover.Content unmounts while closed,
// so the calendar mounts fresh on every open: it starts on the selected month and
// focuses the selected day (or today) on mount, once its day buttons exist. DateTime
// turns off Radix's own open auto-focus so nothing competes with that.
export function Calendar({ selectedDate, onSelect }: CalendarProps) {
  const {
    viewDate,
    focusedDate,
    setFocusedDate,
    showPreviousMonth,
    showNextMonth,
    dayRef,
    handleGridKeyDown,
  } = useCalendarNavigation({ selectedDate, onSelect });

  const today = startOfDay(new Date());
  const weeks = buildCalendarWeeks(viewDate);

  return (
    <>
      <div className="q-date-time__header">
        <button
          type="button"
          className="q-date-time__nav"
          aria-label="Previous month"
          onClick={showPreviousMonth}
        >
          <ChevronLeftIcon />
        </button>
        <span className="q-date-time__month-label">{formatMonth(viewDate)}</span>
        <button
          type="button"
          className="q-date-time__nav"
          aria-label="Next month"
          onClick={showNextMonth}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div
        className="q-date-time__grid"
        role="grid"
        aria-label={formatMonth(viewDate)}
        onKeyDown={handleGridKeyDown}
      >
        <div className="q-date-time__weekdays" role="row">
          {WEEKDAY_LABELS.map((weekday) => (
            <span key={weekday} className="q-date-time__weekday" role="columnheader">
              {weekday}
            </span>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="q-date-time__week" role="row">
            {week.map((day) => {
              const dayClasses = cx(
                "q-date-time__day",
                day.getMonth() !== viewDate.getMonth() && "q-date-time__day--outside",
                isSameDay(day, selectedDate) && "q-date-time__day--selected",
                isSameDay(day, today) && "q-date-time__day--today",
              );

              return (
                <button
                  key={day.toDateString()}
                  ref={dayRef(day)}
                  type="button"
                  role="gridcell"
                  className={dayClasses}
                  tabIndex={isSameDay(day, focusedDate) ? 0 : -1}
                  aria-selected={isSameDay(day, selectedDate)}
                  aria-current={isSameDay(day, today) ? "date" : undefined}
                  aria-label={formatDate(day)}
                  onClick={() => onSelect(day)}
                  onFocus={() => setFocusedDate(day)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
