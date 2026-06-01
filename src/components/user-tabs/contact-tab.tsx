"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FieldItem } from "./field-item";
import { Mail, MapPin } from "lucide-react";
import type { UserTabProps } from "./types";

export function ContactTab({ user }: UserTabProps) {
  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border/30 bg-card">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              Contact Channels
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-0.5">
            <FieldItem label="Primary Directory Mail" value={user.mail} copyable />
            <FieldItem label="User Principal Name" value={user.userPrincipalName} copyable />
            <FieldItem label="Mobile Number" value={user.mobilePhone} copyable />
            <FieldItem label="Business Phone" value={user.businessPhone} copyable />

            {user.businessPhones && user.businessPhones.length > 0 && (
              <div className="py-2.5 border-b border-border/30">
                <span className="text-xs text-muted-foreground block mb-1">Alternative Business Phones</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.businessPhones.map((phone, idx) => (
                    <Badge key={idx} variant="outline" className="font-mono text-xs select-all bg-accent/20">
                      {phone}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.otherMails && user.otherMails.length > 0 && (
              <div className="py-2.5 border-b border-border/30">
                <span className="text-xs text-muted-foreground block mb-1">Other Configured Emails</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.otherMails.map((email, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs select-all bg-accent/20 text-primary">
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.proxyAddresses && user.proxyAddresses.length > 0 && (
              <div className="py-2.5">
                <span className="text-xs text-muted-foreground block mb-1">Directory Proxy Addresses (Alias)</span>
                <div className="grid grid-cols-1 gap-1 max-h-[150px] overflow-y-auto pr-1">
                  {user.proxyAddresses.map((proxy, idx) => {
                    const isPrimary = proxy.startsWith("SMTP:");
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs p-1.5 rounded bg-accent/20 border border-border/20">
                        <span className={`font-mono truncate select-all ${isPrimary ? "text-success font-bold" : "text-muted-foreground"}`}>
                          {proxy}
                        </span>
                        <Badge variant={isPrimary ? "success" : "secondary"} className="text-[9px] h-4 uppercase">
                          {isPrimary ? "Primary" : "Alias"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="border-border/30 bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Physical Office & Location
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-0.5">
            <FieldItem label="Office Name" value={user.officeLocation} />
            <FieldItem label="Street Address" value={user.streetAddress} />
            <FieldItem label="City" value={user.city} />
            <FieldItem label="State / Province" value={user.state} />
            <FieldItem label="Postal / ZIP Code" value={user.postalCode} mono />
            <FieldItem label="Country / Region" value={user.country} />
          </CardContent>
          <div className="bg-accent/10 border-t border-border/30 p-5 text-center space-y-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
            <MapPin className="w-7 h-7 text-primary/40 mx-auto animate-bounce" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">
                {user.officeLocation ?? "Remote Work"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {user.city || user.country ? `${user.city ?? ""}, ${user.country ?? ""}` : "No physical address mapped"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
