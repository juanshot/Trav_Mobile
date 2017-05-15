export interface AlertMock
{
    id: string,
    headline:string,
    content:string ,
    latitude?:string,
    longitude?:string,
    severity?:number,
    status?:number,
    date?:string,
    type?:string,

    start?:string,
    finish?:string,
    category?:string,
    afected?:string,

    details?:string,
    advice?:string,
    incident?:string,
    analisis?:string,
    
}