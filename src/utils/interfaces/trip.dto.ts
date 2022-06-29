export interface CustomizedTripDTO{
    cityId: string;
    name: string;
}
export interface CreateGeneratedTripDTO{
    numberOfDays: number;
    activities: string[];
    cityId: string;
    name: string;
}
export interface SaveGeneratedTripAgendaDTO{
    cityId: string;
    name: string;
    agenda: Agenda[];
}
interface Agenda {
    [key: string]: {
        id: string;
        name: string;
    }[]
}