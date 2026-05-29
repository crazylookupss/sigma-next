export interface SigmaUserDto {
  id: string;
  displayName: string;
  userPrincipalName: string;
  mail: string | null;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  businessPhones: string[];
  accountEnabled: boolean | null;
  userType: string | null;
  createdDateTime: string | null;
  signInActivity?: {
    lastSignInDateTime: string | null;
  };
  manager?: {
    id: string;
    displayName: string;
    userPrincipalName: string;
  } | null;
  assignedLicenses?: { skuId: string; skuPartNumber: string }[];
  assignedPlans?: { servicePlanId: string; servicePlanName: string }[];

  // Advanced AD fields
  givenName?: string | null;
  surname?: string | null;
  identities?: { signInType?: string; issuer?: string; issuerAssignedId?: string }[];
  creationType?: string | null;
  preferredLanguage?: string | null;
  signInSessionsValidFromDateTime?: string | null;
  lastPasswordChangeDateTime?: string | null;
  externalUserState?: string | null;
  passwordPolicies?: string | null;
  companyName?: string | null;
  employeeId?: string | null;
  employeeType?: string | null;
  employeeHireDate?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  businessPhone?: string | null;
  otherMails?: string[];
  proxyAddresses?: string[];
  mailNickname?: string | null;
  onPremisesSyncEnabled?: boolean | null;
  onPremisesLastSyncDateTime?: string | null;
  onPremisesDistinguishedName?: string | null;
  onPremisesSamAccountName?: string | null;
  onPremisesSecurityIdentifier?: string | null;
  onPremisesUserPrincipalName?: string | null;
  onPremisesDomainName?: string | null;
  onPremisesExtensionAttributes?: {
    extensionAttribute1?: string | null;
    extensionAttribute2?: string | null;
    extensionAttribute3?: string | null;
    extensionAttribute4?: string | null;
    extensionAttribute5?: string | null;
    extensionAttribute6?: string | null;
    extensionAttribute7?: string | null;
    extensionAttribute8?: string | null;
    extensionAttribute9?: string | null;
    extensionAttribute10?: string | null;
    extensionAttribute11?: string | null;
    extensionAttribute12?: string | null;
    extensionAttribute13?: string | null;
    extensionAttribute14?: string | null;
    extensionAttribute15?: string | null;
  } | null;
}
