import { User, Mail, Briefcase, MapPin, Calendar, Edit } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nebula-cyan to-nebula-purple mx-auto flex items-center justify-center">
                <User className="size-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Admin User</h3>
                <p className="text-sm text-slate-400">admin@nebula.com</p>
              </div>
              <div className="pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Briefcase className="size-4" />
                  <span>DevOps Engineer</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <MapPin className="size-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Calendar className="size-4" />
                  <span>Joined Jan 2024</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-nebula-purple to-nebula-blue hover:from-nebula-purple-dark hover:to-nebula-blue text-white">
                <Edit className="size-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 bg-nebula-navy-light border-nebula-navy-lighter">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  defaultValue="Admin"
                  className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue="User"
                  className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@nebula.com"
                  className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Role</Label>
                <Input
                  id="role"
                  defaultValue="DevOps Engineer"
                  className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">Department</Label>
                <Input
                  id="department"
                  defaultValue="Engineering"
                  className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location" className="text-white">Location</Label>
                <Input
                  id="location"
                  defaultValue="San Francisco, CA"
                  className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <textarea
                  id="bio"
                  rows={4}
                  defaultValue="DevOps engineer passionate about infrastructure automation and observability."
                  className="w-full px-3 py-2 bg-nebula-navy-dark border border-nebula-navy-lighter rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-nebula-purple"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="bg-nebula-navy-dark border-nebula-navy-lighter text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          className="bg-transparent border-nebula-navy-lighter text-white hover:bg-nebula-navy-lighter"
        >
          Cancel
        </Button>
        <Button className="bg-gradient-to-r from-nebula-purple to-nebula-blue hover:from-nebula-purple-dark hover:to-nebula-blue text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
