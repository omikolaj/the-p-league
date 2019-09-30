import { Moment } from 'moment';

export interface SportSession{
    id?: number,
    name?: string,
    startDate?: Moment,
    endDate?: Moment, 
    totalPrice?: number
}