export interface IConnectionResponse {
  programme: IProgrammeDetails;
  connection: {
    connectionHistory: IConnectionHistory[];
  };
  designatedBodyCode: IUserDBC;
}

export interface IUpdateConnectionResponse {
  message: string;
}

export interface IProgrammeDetails {
  gmcNumber: number;
  forenames: string;
  surname: string;
  cctDate: Date;
  programmeMembershipType: string;
  programmeName: string;
  currentGrade: string;
  programmeHistory: IProgrammeHistory[];
}

export interface IProgrammeHistory {
  programmeMembershipType: string;
  programmeName: string;
  programmeOwner: string;
  programmeMembershipStartDate: Date;
  programmeMembershipEndDate: Date;
}

export interface IConnectionHistory {
  connectionId: string;
  gmcId: string;
  gmcClientId: string;
  newDesignatedBodyCode: string;
  previousDesignatedBodyCode: string;
  reason: string;
  reasonMessage: string;
  requestType: string;
  requestTime: Date;
  responseCode: string;
  responseMessage: string;
}

export interface IUserDBC {
  designatedBodyCode: string;
}
