export interface CustomizedTripDTO{
    startDate: Date;
    endDate: Date;
    cityId: string;
    name: string;

}
export interface GeneratedTripDTO{
    noOfDays: number;
    activities: string[];
    cityId: string;
    name: string;

}