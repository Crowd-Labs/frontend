import { intervalToDuration } from 'date-fns';

export const getDateDiffFromNow = (timestamp: number) => {
    const startDate = new Date(); // 开始日期
    const endDate = new Date(timestamp * 1000); // 结束日期
    const duration = intervalToDuration({ start: startDate, end: endDate });
    return `${duration.days}d ${duration.hours}h ${duration.minutes}m`
}