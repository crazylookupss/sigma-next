export interface EntraTenant {
  id: string;
  displayName: string;
  primaryDomain: string;
  license: string;
  usersCount: number;
  groupsCount: number;
  applicationsCount: number;
  enterpriseApplicationsCount: number;
  devicesCount: number;
}
