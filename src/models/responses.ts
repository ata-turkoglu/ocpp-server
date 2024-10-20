import { IdTagInfo } from "./common";
import { RegistrationStatus } from "./enums";

export interface AuthorizeRes {
    idTagInfo: IdTagInfo;
}

export interface BootNotificationRes {
    currentTime: Date;
    interval: Number;
    status: RegistrationStatus;
}

export interface StartTransactionRes {
    idTagInfo: IdTagInfo;
    transactionId: number;
}

export interface StopTransactionRes {
    idTagInfo: IdTagInfo;
}
