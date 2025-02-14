import moment from 'moment';
import {Duration, DurationObjectUnits} from 'luxon';

import React from 'react';

import renderer from 'react-test-renderer';

const mockNow = moment('2017-02-08 12:00');

jest.mock('src/hooks', () => {
    return {
        ...jest.requireActual('src/hooks'),
        useNow: jest.fn(() => mockNow),
    };
});

import FormattedDuration, {formatDuration} from './formatted_duration';

describe('formatDuration', () => {
    test.each<[arg: DurationObjectUnits, narrowOut: string, longOut: string]>([
        [{seconds: 0}, '< 1m', 'less than 1 minute'],
        [{seconds: 59}, '< 1m', 'less than 1 minute'],
        [{minutes: 1}, '1m', '1 minute'],
        [{minutes: 1, seconds: 30}, '1m', '1 minute'],
        [{minutes: 59}, '59m', '59 minutes'],
        [{hours: 1}, '1h', '1 hour'],
        [{hours: 1, minutes: 30}, '1h 30m', '1 hour 30 minutes'],
        [{hours: 23}, '23h', '23 hours'],
        [{days: 1}, '1d', '1 day'],
        [{days: 1, minutes: 5}, '1d 5m', '1 day 5 minutes'],
        [{days: 1, hours: 2, minutes: 5}, '1d 2h 5m', '1 day 2 hours 5 minutes'],
        [{days: 1, hours: 2, minutes: 5, seconds: 30}, '1d 2h 5m', '1 day 2 hours 5 minutes'],
        [{days: 36}, '36d', '36 days'],
        [{days: 99, hours: 10, minutes: 45}, '99d 10h 45m', '99 days 10 hours 45 minutes'],
        [{weeks: 6}, '42d', '42 days'],
        [{weeks: 2, days: 6, minutes: 12}, '20d 12m', '20 days 12 minutes'],
        [{years: 2, days: 6, minutes: 12}, '2y 6d 12m', '2 years 6 days 12 minutes'],
    ])('should format %p as %p and %p', (durationObj, expectedNarrow, expecetedLong) => {
        const duration = Duration.fromObject(durationObj);
        expect(formatDuration(duration)).toEqual(expectedNarrow);
        expect(formatDuration(duration, 'long')).toEqual(expecetedLong);
    });

    it('is backwards-compatible with moment durations', () => {
        const duration = moment.duration({days: 1, hours: 2, minutes: 5});
        expect(formatDuration(duration)).toEqual('1d 2h 5m');
    });
});

describe('FormattedDuration', () => {
    it('renders correctly', () => {
        const duration = renderer.create(
            <FormattedDuration
                from={moment('2013-02-08 09:30').valueOf()}
                to={moment('2013-02-08 09:30:59').valueOf()}
            />,
        ).toJSON();
        expect(duration).toMatchSnapshot();
    });

    it('renders correctly with ago', () => {
        const duration = renderer.create(
            <FormattedDuration
                from={moment('2013-02-08 09:30').valueOf()}
                to={moment('2013-02-08 09:30:59').valueOf()}
                ago={true}
            />,
        ).toJSON();
        expect(duration).toMatchSnapshot();
    });

    it('renders correctly slightly greater than 1 year', () => {
        const duration = renderer.create(
            <FormattedDuration
                from={moment('2013-02-08 09:30').valueOf()}
                to={moment('2014-02-08 09:30:59').valueOf()}
                ago={true}
            />,
        ).toJSON();
        expect(duration).toMatchSnapshot();
    });

    it('renders correctly 1.5 years', () => {
        const duration = renderer.create(
            <FormattedDuration
                from={moment('2013-02-08 09:30').valueOf()}
                to={moment('2014-08-08 09:30:59').valueOf()}
                ago={true}
            />,
        ).toJSON();
        expect(duration).toMatchSnapshot();
    });

    it('renders correctly when to is 0 or undefined', () => {
        const duration = renderer.create(
            <FormattedDuration
                from={moment('2014-02-08 09:30:59').valueOf()}
                ago={true}
            />,
        ).toJSON();
        expect(duration).toMatchSnapshot();
    });
});

