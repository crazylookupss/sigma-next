import type { SigmaUserDto } from "@/types/user";

export interface UserTabProps {
  user: SigmaUserDto;
  copyToClipboard: (text: string, label: string) => void;
}
