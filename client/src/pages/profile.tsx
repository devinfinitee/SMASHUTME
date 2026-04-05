import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Mail } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell searchPlaceholder="Search profile settings...">
      <div className="relative max-w-4xl mx-auto py-8 px-4 md:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-blue/10 to-transparent blur-3xl" />
        <div className="relative">
        <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

        <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_40px_rgba(11,28,48,0.05)] backdrop-blur">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
              <AvatarImage src={undefined} />
              <AvatarFallback className="text-2xl">{initials || "SU"}</AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-2">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center justify-center md:justify-start text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center justify-center md:justify-start text-muted-foreground">
                <UserIcon className="w-4 h-4 mr-2" />
                Student
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-destructive mb-2">Account Actions</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Need to take a break? You can log out of your account here.
          </p>
          <Button variant="destructive" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
        </div>
      </div>
    </AppShell>
  );
}
