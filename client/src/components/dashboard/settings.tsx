import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Settings() {
  const { user } = useCurrentUser();

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Personal Information Section */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="size-8">
                <AvatarImage src={user?.profilePicture || ""} />
                <AvatarFallback>
                  {user?.displayName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={user.displayName}
                id="name"
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={user.email}
                id="email"
                readOnly
                className="bg-gray-100"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Your account is linked with Google. To change your email, please
              contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
