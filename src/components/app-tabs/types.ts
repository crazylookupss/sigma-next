import type {
  EntraServicePrincipal,
  ServicePrincipalSsoConfig,
  ServicePrincipalProxyConfig,
  ProtocolAnalysisResult,
} from "@/types/application";

export interface TabProps {
  sp: EntraServicePrincipal;
  ssoConfig?: ServicePrincipalSsoConfig;
  owners: Array<{ id: string; displayName?: string; userPrincipalName?: string; ownerType?: string }>;
  assignments: Array<{ id: string; principalDisplayName?: string; principalId?: string; principalType?: string; appRoleValue?: string; createdDateTime?: string }>;
  protocolAnalysis?: ProtocolAnalysisResult;
  proxyConfig?: ServicePrincipalProxyConfig;
  copyToClipboard: (text: string, label: string) => void;
  copied: string | null;
}
