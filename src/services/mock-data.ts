import type { EntraTenant } from "@/types/tenant";
import type { SigmaUserDto } from "@/types/user";
import type { EntraGroup } from "@/types/group";
import type { EntraServicePrincipal, AppStatistics } from "@/types/application";

const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack", "Kara", "Leo", "Mona", "Nate", "Opal", "Pete", "Quinn", "Rosa", "Sam", "Tina"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const domains = ["acmecorp.com", "contoso.com", "fabrikam.com", "northwind.com", "adventureworks.com"];
const jobTitles = ["Software Engineer", "DevOps Lead", "Security Analyst", "Product Manager", "Data Scientist", "IT Admin", "Compliance Officer", "Architect", "Consultant", "Director"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

const mockUsers: SigmaUserDto[] = Array.from({ length: 247 }, () => {
  const first = randomItem(firstNames);
  const last = randomItem(lastNames);
  const domain = randomItem(domains);
  return {
    id: crypto.randomUUID(),
    displayName: `${first} ${last}`,
    userPrincipalName: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
    mail: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
    jobTitle: randomItem(jobTitles),
    department: randomItem(["Engineering", "Security", "HR", "Finance", "Marketing", "Legal", "IT", "Operations"]),
    officeLocation: randomItem(["San Francisco", "New York", "London", "Tokyo", "Sydney", "Berlin", "Remote"]),
    mobilePhone: Math.random() > 0.3 ? `+1 (555) ${String(100 + Math.floor(Math.random() * 900)).padStart(3, "0")}-${String(1000 + Math.floor(Math.random() * 9000))}` : null,
    businessPhones: Math.random() > 0.5 ? [`+1 (555) ${String(100 + Math.floor(Math.random() * 900)).padStart(3, "0")}-${String(1000 + Math.floor(Math.random() * 9000))}`] : [],
    accountEnabled: Math.random() > 0.15,
    userType: Math.random() > 0.2 ? "Member" : "Guest",
    createdDateTime: randomDate(new Date("2018-01-01"), new Date("2025-12-31")),
    signInActivity: Math.random() > 0.1
      ? { lastSignInDateTime: randomDate(new Date("2025-01-01"), new Date("2026-05-28")) }
      : undefined,
    manager: Math.random() > 0.4
      ? {
          id: crypto.randomUUID(),
          displayName: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
          userPrincipalName: `${randomItem(firstNames).toLowerCase()}.${randomItem(lastNames).toLowerCase()}@${randomItem(domains)}`,
        }
      : null,
    assignedLicenses: [],
    assignedPlans: [],
  };
});

const mockGroups: EntraGroup[] = Array.from({ length: 86 }, (_, i) => {
  const isUnified = Math.random() > 0.5;
  const prefix = isUnified ? "M365" : "SG";
  return {
    id: crypto.randomUUID(),
    displayName: `${prefix}-${randomItem(["Engineering", "Security", "HR", "Finance", "Marketing", "Legal", "IT", "Exec", "Sales", "Support", "DevOps", "Data", "Admin", "Contractors", "Partners", "Audit"])}-${String(i + 1).padStart(3, "0")}`,
    description: Math.random() > 0.3 ? `Security group for ${randomItem(["engineering", "security", "HR", "finance", "marketing", "legal", "IT"])} team members` : null,
    mail: isUnified ? `${prefix.toLowerCase()}-${i + 1}@${randomItem(domains)}` : null,
    mailEnabled: isUnified,
    securityEnabled: !isUnified || Math.random() > 0.5,
    groupTypes: isUnified ? ["Unified"] : [],
    visibility: Math.random() > 0.3 ? "Public" : "Private",
    createdDateTime: randomDate(new Date("2019-01-01"), new Date("2025-12-31")),
    memberCount: Math.floor(Math.random() * 500),
    ownerCount: Math.floor(Math.random() * 5) + 1,
  };
});

const mockServicePrincipals: EntraServicePrincipal[] = Array.from({ length: 124 }, () => {
  const statuses = ["active", "active", "active", "active", "warning", "warning", "error"] as const;
  return {
    id: crypto.randomUUID(),
    appId: crypto.randomUUID(),
    displayName: `${randomItem(["Azure", "AWS", "Salesforce", "Okta", "Datadog", "Splunk", "Jira", "Confluence", "Slack", "Zoom", "GitHub", "GitLab", "Sentry", "PagerDuty", "Snowflake", "Tableau", "PowerBI", "SAP"])} ${randomItem(["Prod", "Staging", "Dev", "QA", "Sandbox", "EU", "US", "APAC"])}`,
    appDescription: Math.random() > 0.5 ? `Enterprise integration for ${randomItem(["monitoring", "logging", "CI/CD", "analytics", "communication", "security", "compliance", "HR"])}` : null,
    appOwnerOrganizationId: crypto.randomUUID(),
    servicePrincipalType: "Application",
    signInAudience: randomItem(["AzureADMyOrg", "AzureADMultipleOrgs", "AzureADandPersonalMicrosoftAccount"]),
    accountEnabled: Math.random() > 0.1,
    appRoleAssignmentRequired: Math.random() > 0.3,
    preferredSingleSignOnMode: Math.random() > 0.3 ? randomItem(["saml", "oidc", "password"]) : null,
    notificationEmailAddresses: Math.random() > 0.7 ? [`admin@${randomItem(domains)}`] : [],
    appRoles: [],
    keyCredentials: Math.random() > 0.4
      ? [{
          keyId: crypto.randomUUID(),
          displayName: "Cert-1",
          startDateTime: randomDate(new Date("2024-01-01"), new Date("2025-01-01")),
          endDateTime: randomDate(new Date("2025-06-01"), new Date("2027-12-31")),
          type: "AsymmetricX509Cert",
          usage: "Verify",
        }]
      : [],
    passwordCredentials: Math.random() > 0.5
      ? [{
          keyId: crypto.randomUUID(),
          displayName: "Client Secret",
          startDateTime: randomDate(new Date("2024-01-01"), new Date("2025-01-01")),
          endDateTime: randomDate(new Date("2025-06-01"), new Date("2027-12-31")),
          type: "Password",
          usage: "Sign",
        }]
      : [],
    createdDateTime: randomDate(new Date("2020-01-01"), new Date("2025-12-31")),
    assignedUserCount: Math.floor(Math.random() * 200),
    assignedGroupCount: Math.floor(Math.random() * 30),
    signInStatus: statuses[Math.floor(Math.random() * statuses.length)],
  };
});

const mockDashboard: AppStatistics = {
  totalApps: mockServicePrincipals.length,
  activeCount: mockServicePrincipals.filter((s) => s.signInStatus === "active").length,
  warningCount: mockServicePrincipals.filter((s) => s.signInStatus === "warning").length,
  expiredCount: mockServicePrincipals.filter((s) => s.signInStatus === "error").length,
  healthDistribution: [
    { name: "Active", value: mockServicePrincipals.filter((s) => s.signInStatus === "active").length, color: "#10b981" },
    { name: "Warning", value: mockServicePrincipals.filter((s) => s.signInStatus === "warning").length, color: "#f59e0b" },
    { name: "Critical", value: mockServicePrincipals.filter((s) => s.signInStatus === "error").length, color: "#ef4444" },
  ],
  signInTrend: Array.from({ length: 30 }, (_, i) => {
    const d = new Date("2026-04-28");
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      count: Math.floor(Math.random() * 500) + 100,
    };
  }),
};

const mockTenant: EntraTenant = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  displayName: "Acme Corporation",
  primaryDomain: "acmecorp.com",
  license: "Microsoft Entra ID P2",
  usersCount: mockUsers.length,
  groupsCount: mockGroups.length,
  applicationsCount: 89,
  enterpriseApplicationsCount: mockServicePrincipals.length,
  devicesCount: 1432,
};

export { mockUsers, mockGroups, mockServicePrincipals, mockDashboard, mockTenant };
