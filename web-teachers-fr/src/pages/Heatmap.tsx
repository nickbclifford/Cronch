import bind from 'bind-decorator';
import moment from 'moment';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import withAnalyticsContext, { WithAnalyticsContextProps } from '../common/AnalyticsContext';
import HeatmapDisplay from '../components/HeatmapDisplay';
import { DBTimeslot } from '../model/Timeslot';
import styles from './Heatmap.module.scss';

interface BarChartDataPoint {
	seriesName: string;
	data: Array<{
		x: string,
		y: number
	}>;
	color: string;
}

interface AnalyticsState {
    times: DBTimeslot[];
    weeklyChartData: any;
}

export default class Analytics extends React.Component<RouteComponentProps & WithAnalyticsContextProps, AnalyticsState> {
    analyticsSubscription: Subscription | null = null;

    constructor(props: any) {
        super(props);
        this.state = {
            times: [],
            weeklyChartData: null
        }
	}
	
	render() {
		return('hello');
	}

    componentDidMount() {
        this.analyticsSubscription = this.props.analyticsContext.timeslots.subscribe((timeslots: any) => {
            if (timeslots) {

                // make monthly data
                // gets the month reference point
                const thisMonth = moment();

                const monthlyTimes: DBTimeslot[] = []; // this month's timeslots
                for (const time of this.state.times) {
                    if (time.end !== null && time.start.getMonth() === thisMonth.month()) {
                        monthlyTimes.push(time);
                    }
                }

                // now that we have the available days of the week, we need to create the chartData
                // we need one series that has each day
                const chartData: BarChartDataPoint[] = [];

                const thisMonthData: BarChartDataPoint = {
                    seriesName: 'Series',
                    data: [],
                    color: 'purple'
                };

                for (let i = 1; i <= 31; i++) {
                    // i is day of the month
                    let dayTotal = 0;

                    monthlyTimes.forEach(time => {
                        if (time.end !== null && time.start.getDate() === i) {
                            dayTotal += this.calcHourDiff(time.start, time.end);
                        }
                    });
                    thisMonthData.data.push({
                        x: `${thisMonth.month() + 1}/${i.toString()}`,
                        y: (dayTotal > 0) ? parseFloat(dayTotal.toFixed(2)) : dayTotal
                    });
                }

                this.setState({ times: timeslots });
            } else {
                this.setState({ times: [] });
            }
        });
    }

    private calcHourDiff(start: Date, end: Date): number {
		return moment.duration(moment(end).diff(start)).as('hours');
	}
}