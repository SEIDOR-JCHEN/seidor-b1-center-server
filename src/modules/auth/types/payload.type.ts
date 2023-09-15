export type JwtPayload = {
  id: string;
  email: string;
  role: string;
  organization: JwtPayloadOrg[];
};

export type JwtPayloadOrg = {
  orgId: number;
  orgName: string;
  orgRole: string;
  apps: JwtPayloadOrgApp[];
};

export type JwtPayloadOrgApp = {
  appId: number;
  appName: string;
  active: boolean;
};
