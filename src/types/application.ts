export interface SigmaApplicationVerifiedPublisherDto {
  displayName: string | null;
  verifiedPublisherId: string | null;
  addedDateTime: string | null;
}

export interface SigmaApplicationCertificationDto {
  isPublisherAttested: boolean | null;
  isCertifiedByMicrosoft: boolean | null;
  lastCertificationDateTime: string | null;
  certificationExpirationDateTime: string | null;
  certificationDetailsUrl: string | null;
}

export interface Oauth2PermissionScopeDto {
  id: string;
  value: string | null;
  userConsentDisplayName: string | null;
  userConsentDescription: string | null;
  adminConsentDisplayName: string | null;
  adminConsentDescription: string | null;
  isEnabled: boolean;
  type: string | null;
}

export interface PreAuthorizedApplicationDto {
  appId: string;
  delegatedPermissionIds: string[];
}

export interface SigmaApplicationApiDto {
  requestedAccessTokenVersion: number | null;
  acceptMappedClaims: boolean | null;
  knownClientApplications: string[];
  oauth2PermissionScopes: Oauth2PermissionScopeDto[];
  preAuthorizedApplications: PreAuthorizedApplicationDto[];
}

export interface SigmaApplicationPublicClientDto {
  redirectUris: string[];
}

export interface SigmaApplicationInfoDto {
  termsOfServiceUrl: string | null;
  supportUrl: string | null;
  privacyStatementUrl: string | null;
  marketingUrl: string | null;
  logoUrl: string | null;
}

export interface SigmaApplicationParentalControlSettingsDto {
  countriesBlockedForMinors: string[];
  legalAgeGroupRule: string | null;
}

export interface SigmaApplicationImplicitGrantSettingsDto {
  enableIdTokenIssuance: boolean | null;
  enableAccessTokenIssuance: boolean | null;
}

export interface SigmaApplicationWebDto {
  redirectUris: string[];
  homePageUrl: string | null;
  logoutUrl: string | null;
  implicitGrantSettings: SigmaApplicationImplicitGrantSettingsDto | null;
}

export interface EntraApplication {
  id: string;
  displayName: string;
  appId: string;
  description: string | null;
  signInAudience: string;
  publisherDomain: string;
  createdDateTime: string | null;
  tags: string[];

  // Enriched properties for detailed view
  identifierUris?: string[];
  verifiedPublisher?: SigmaApplicationVerifiedPublisherDto | null;
  certification?: SigmaApplicationCertificationDto | null;
  isFallbackPublicClient?: boolean | null;
  applicationTemplateId?: string | null;
  samlMetadataUrl?: string | null;
  tokenEncryptionKeyId?: string | null;
  api?: SigmaApplicationApiDto | null;
  publicClient?: SigmaApplicationPublicClientDto | null;
  info?: SigmaApplicationInfoDto | null;
  parentalControlSettings?: SigmaApplicationParentalControlSettingsDto | null;
  web?: SigmaApplicationWebDto | null;
}

export interface EntraServicePrincipal {
  id: string;
  appId: string;
  displayName: string;
  appDisplayName?: string;
  appDescription: string | null;
  appOwnerOrganizationId: string | null;
  servicePrincipalType: string;
  signInAudience?: string;
  accountEnabled: boolean | null;
  appRoleAssignmentRequired: boolean;
  preferredSingleSignOnMode: string | null;
  notificationEmailAddresses: string[];
  appRoles: AppRole[];
  keyCredentials: Credential[];
  passwordCredentials: Credential[];
  createdDateTime: string | null;
  assignedUserCount?: number;
  assignedGroupCount?: number;
  signInStatus?: "active" | "warning" | "error";
  publisherName?: string | null;
  tags?: string[];
}

export interface AppRole {
  id: string;
  displayName: string;
  description: string;
  value: string | null;
  isEnabled: boolean;
  allowedMemberTypes: string[];
}

export interface Credential {
  keyId: string;
  displayName: string;
  startDateTime: string;
  endDateTime: string;
  type: string;
  usage: string;
  isExpired?: boolean;
  daysToExpiry?: number;
}

export interface AppStatistics {
  totalApps: number;
  activeCount: number;
  warningCount: number;
  expiredCount: number;
  healthDistribution: { name: string; value: number; color: string }[];
  signInTrend: { date: string; count: number }[];
}

// Credential health details from C#
export interface CredentialInfoDto {
  keyId: string | null;
  displayName: string | null;
  type: string | null;
  usage: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  hint: string | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiry: number;
}

export interface AppCredentialHealth {
  certificates: CredentialInfoDto[];
  secrets: CredentialInfoDto[];
  hasExpiredCredentials: boolean;
  hasExpiringCredentials: boolean;
  credentialsExpiringWithin30Days: number;
  credentialsExpired: number;
}

// Required Resource Access permissions from C#
export interface RequiredResourceAccessDto {
  resourceAppId: string;
  resourceDisplayName: string | null;
  delegatedPermissions: string[];
  applicationPermissions: string[];
}

// Application owners from C#
export interface AppOwnerDto {
  id: string;
  displayName: string;
  userPrincipalName: string | null;
  ownerType: string;
}

// Service Principal Reference from C#
export interface ServicePrincipalReferenceDto {
  id: string;
  displayName: string;
  appId: string;
}

// Diagnostics log structures
export interface AuditLogEntryDto {
  id: string;
  activityDisplayName: string;
  category: string | null;
  initiatedBy: string | null;
  targetResourceName: string | null;
  result: string | null;
  resultReason: string | null;
  activityDateTime: string | null;
}

export interface SignInEntryDto {
  id: string;
  userPrincipalName: string;
  userDisplayName: string;
  appDisplayName: string;
  createdDateTime: string;
  status: string;
}

export interface EntraAppAssignment {
  id: string;
  principalId: string;
  principalDisplayName: string;
  principalType: string;
  appRoleId?: string;
  appRoleValue?: string;
  createdDateTime?: string;
}

export interface EntraAppOwner {
  id: string;
  displayName: string;
  userPrincipalName?: string;
  ownerType: string;
}

export interface SsoCertificate {
  keyId: string | null;
  displayName: string | null;
  thumbprint: string | null;
  type: string | null;
  usage: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
}

export interface ServicePrincipalSsoConfig {
  preferredSingleSignOnMode: string;
  samlMetadataUrl: string | null;
  entityId: string | null;
  replyUrls: string[];
  signOnUrl: string | null;
  logoutUrl: string | null;
  homePageUrl: string | null;
  certificates: SsoCertificate[];
  authorizationEndpoint: string | null;
  tokenEndpoint: string | null;
  issuer: string | null;
  federationMetadataUrl: string | null;
  loginUrl: string | null;
  microsoftEntraIdentifier: string | null;
  tenantId: string | null;
}
