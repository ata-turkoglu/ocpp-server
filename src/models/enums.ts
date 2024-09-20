export enum AuthorizationStatus {
    Accepted = "Accepted",
    Blocked = "Blocked",
    Expired = "Expired",
    Invalid = "Invalid",
    ConcurrentTx = "ConcurrentTx",
}

export enum RegistrationStatus {
    Accepted = "Accepted",
    Pending = "Pending",
    Rejected = "Rejected",
}

export enum ChargePointErrorCode {
    ConnectorLockFailure = "Failure to lock or unlock connector.",
    EVCommunicationError = "Communication failure with the vehicle, might be Mode 3 or other communication protocol problem. This is not a real error in the sense that the Charge Point doesn’t need to go to the faulted state. Instead, it should go to the SuspendedEVSE state.",
    GroundFailure = "Ground fault circuit interrupter has been activated.",
    HighTemperature = "Temperature inside Charge Point is too high.",
    InternalError = "Error in internal hard- or software component.",
    LocalListConflict = "The authorization information received from the Central System is in conflict with the LocalAuthorizationList.",
    NoError = "No error to report.",
    OtherError = "Other type of error. More information in vendorErrorCode.",
    OverCurrentFailure = "Over current protection device has tripped.",
    OverVoltage = "Voltage has risen above an acceptable level.",
    PowerMeterFailure = "Failure to read electrical/energy/power meter.",
    PowerSwitchFailure = "Failure to control power switch.",
    ReaderFailure = "Failure with idTag reader.",
    ResetFailure = "Unable to perform a reset.",
    UnderVoltage = "Voltage has dropped below an acceptable level.",
    WeakSignal = "Wireless communication device reports a weak signal.",
}

export enum ChargePointStatus {
    Available = "Available",
    Preparing = "Preparing",
    Charging = "Charging",
    SuspendedEVSE = "SuspendedEVSE",
    SuspendedEV = "SuspendedEV",
    Finishing = "Finishing",
    Reserved = "Reserved",
    Unavailable = "Unavailable",
    Faulted = "Faulted",
}

export enum ReadingContext {
    InterruptionBegin = "Interruption.Begin",
    InterruptionEnd = "Interruption.End",
    Other = "Other",
    SampleClock = "Sample.Clock",
    SamplePeriodic = "Sample.Periodic",
    TransactionBegin = "Transaction.Begin",
    TransactionEnd = "Transaction.End",
    Trigger = "Trigger",
}

export enum ValueFormat {
    Raw = "Raw",
    SignedData = "SignedData",
}

export enum Measurand {
    CurrentExport = "Current.Export",
    CurrentImport = "Current.Import",
    CurrentOffered = "Current.Offered",
    EnergyActiveExportRegister = "Energy.Active.Export.Register",
    EnergyActiveImportRegister = "Energy.Active.Import.Register",
    EnergyReactiveExportRegister = "Energy.Reactive.Export.Register",
    EnergyReactiveImportRegister = "Energy.Reactive.Import.Register",
    EnergyActiveExportInterval = "Energy.Active.Export.Interval",
    EnergyActiveImportInterval = "Energy.Active.Import.Interval",
    EnergyReactiveExportInterval = "Energy.Reactive.Export.Interval",
    EnergyReactiveImportInterval = "Energy.Reactive.Import.Interval",
    Frequency = "Frequency",
    PowerActiveExport = "Power.Active.Export",
    PowerActiveImport = "Power.Active.Import",
    PowerFactor = "Power.Factor",
    PowerOffered = "Power.Offered",
    PowerReactiveExport = "Power.Reactive.Export",
    PowerReactiveImport = "Power.Reactive.Import",
    RPM = "RPM",
    SoC = "SoC",
    Temperature = "Temperature",
    Voltage = "Voltage",
}

export enum Phase {
    L1 = "L1",
    L2 = "L2",
    L3 = "L3",
    N = "N",
    L1N = "L1-N",
    L2N = "L2-N",
    L3N = "L3-N",
    L1L2 = "L1-L2",
    L2L3 = "L2-L3",
    L3L1 = "L3-L1",
}

export enum Location {
    Body = "Body",
    Cable = "Cable",
    EV = "EV",
    Inlet = "Inlet",
    Outlet = "Outlet",
}

export enum UnitOfMeasure {
    Wh = "Wh",
    kWh = "kWh",
    varh = "varh",
    kvarh = "kvarh",
    W = "W",
    kW = "kW",
    VA = "VA",
    kVA = "kVA",
    var = "var",
    kvar = "kvar",
    A = "A",
    V = "V",
    Celsius = "Celsius",
    Fahrenheit = "Fahrenheit",
    K = "K",
    Percent = "Percent",
}

export enum Reason {
    DeAuthorized = "DeAuthorized",
    EmergencyStop = "EmergencyStop",
    EVDisconnected = "EVDisconnected",
    HardReset = "HardReset",
    Local = "Local",
    Other = "Other",
    PowerLoss = "PowerLoss",
    Reboot = "Reboot",
    Remote = "Remote",
    SoftReset = "SoftReset",
    UnlockCommand = "UnlockCommand",
}
