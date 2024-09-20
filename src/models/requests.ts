import { MeterValue } from "./common";
import { ChargePointErrorCode, ChargePointStatus, Reason } from "./enums";

export interface AuthorizeReq {
    idTag: string; //IdToken
}

export interface BootNotificationReq {
    chargeBoxSerialNumber?: string;
    chargePointModel: string;
    chargePointSerialNumber?: string;
    chargePointVendor: string;
    firmwareVersion?: string;
    iccid?: string;
    imsi?: string;
    meterSerialNumber?: string;
    meterType?: string;
}

export interface StatusNotificationReq {
    connectorId: number;
    errorCode: ChargePointErrorCode;
    info?: string;
    status: ChargePointStatus;
    timestamp?: Date;
    vendorId?: string;
    vendorErrorCode?: string;
}

export interface StartTransactionReq {
    idTag: string; //IdToken
    connectorId: number;
    meterStart: number;
    reservationId?: number;
    timestamp?: Date;
}

export interface MeterValueReq {
    connectorId: number;
    transactionId: number;
    meterValue: MeterValue;
}

export interface StopTransactionReq {
    idTag: string; //IdToken
    meterStop: number;
    timestamp: Date;
    transactionId: number;
    reason: Reason;
    transactionData: MeterValue;
}
