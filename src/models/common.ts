import {
    AuthorizationStatus,
    Measurand,
    Phase,
    ReadingContext,
    UnitOfMeasure,
    ValueFormat,
} from "./enums";

export interface IdTagInfo {
    expiryDate?: Date | null;
    parentIdTag?: string; //IdToken
    status: AuthorizationStatus;
}

export interface Message {
    messageTypeId: string;
    uniqueId: string;
    action: string;
    payload: any;
}

export interface SocketInfo {
    idTag: string;
    charger: string;
}

export interface MeterValue {
    timestamp: Date;
    sampledValue: SampledValue[];
}

export interface SampledValue {
    value: string;
    context?: ReadingContext;
    format?: ValueFormat;
    measurand?: Measurand;
    phase?: Phase;
    location?: Location;
    unit?: UnitOfMeasure;
}
