import type { EntraServicePrincipal } from "@/types/application";
import type { ServicePrincipalSsoConfig } from "@/hooks/use-applications";

export interface TabProps {
  sp: EntraServicePrincipal;
  ssoConfig?: ServicePrincipalSsoConfig;
  owners: Array<{ id: string; displayName?: string; userPrincipalName?: string; ownerType?: string }>;
  assignments: Array<{ id: string; principalDisplayName?: string; principalId?: string; principalType?: string; appRoleValue?: string; createdDateTime?: string }>;
  protocolAnalysis?: {
    primaryProtocol: string;
    detectedProtocols: Array<{
      protocol: string;
      isDetected: boolean;
      normalizedScore: number;
      evidence: Array<{ description: string }>;
    }>;
    governanceInsights: Array<{ severity: string; category: string; message: string }>;
    allEvidence: unknown[];
    analysisTimestamp: string;
  };
  proxyConfig?: {
    isConfigured: boolean;
    internalUrl?: string;
    externalUrl?: string;
    preAuthentication?: string;
    translateUrlsInBody?: boolean;
    verifyDomainCertificates?: boolean;
  };
  copyToClipboard: (text: string, label: string) => void;
  copied: string | null;
}
