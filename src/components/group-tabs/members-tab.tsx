"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { GroupTabProps } from "./types";

export function MembersTab({ members, isMembersLoading }: GroupTabProps) {
  const [membersSearch, setMembersSearch] = useState("");
  const [membersTypeFilter, setMembersTypeFilter] = useState("All");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchSearch =
        !membersSearch.trim() ||
        member.displayName?.toLowerCase().includes(membersSearch.toLowerCase()) ||
        member.userPrincipalName?.toLowerCase().includes(membersSearch.toLowerCase());
      const matchType =
        membersTypeFilter === "All" ||
        (membersTypeFilter === "User" && member.type === "user") ||
        (membersTypeFilter === "Group" && member.type === "group") ||
        (membersTypeFilter === "Device" && member.type === "device");
      return matchSearch && matchType;
    });
  }, [members, membersSearch, membersTypeFilter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-foreground">Group Members</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search members..."
              value={membersSearch}
              onChange={(e) => setMembersSearch(e.target.value)}
              className="px-3 py-1.5 bg-accent border border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={membersTypeFilter}
              onChange={(e) => setMembersTypeFilter(e.target.value)}
              className="px-2 py-1.5 bg-accent border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Types</option>
              <option value="User">Users</option>
              <option value="Group">Groups</option>
              <option value="Device">Devices</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isMembersLoading ? (
          <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
        ) : filteredMembers.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8 font-medium">No matching members found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">User Principal Name / ID</th>
                  <th className="py-2 pr-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-accent/20">
                    <td className="py-2.5 pr-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                        {member.displayName?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-foreground">{member.displayName}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-muted-foreground select-all">{member.userPrincipalName ?? member.id}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={member.type === "user" ? "secondary" : member.type === "group" ? "default" : "secondary"}>
                        {member.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
