export interface BusinessUserInput {
    email : string;
    companyName: string;
    address?: string;
    username: string;
    password: string;
    phoneNumber: string
    fb_link?: string;
    ig_link?: string;
    nationalId:string;
  }
  export interface NormalUserInput {
    email : string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    currentCity?: string;
    phoneNumber?: string
  }
  export interface LoginInput{
    email: string;
    username: string;
    password: string
  }