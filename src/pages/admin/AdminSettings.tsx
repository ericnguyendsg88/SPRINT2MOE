import { Settings, Bell, Shield, Database, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function AdminSettings() {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure education account system parameters
        </p>
      </div>

      {/* Account Lifecycle Settings */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Account Lifecycle</h2>
            <p className="text-sm text-muted-foreground">Automatic activation and closure settings</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-activate at age 16</Label>
              <p className="text-xs text-muted-foreground">
                Automatically create accounts for Singapore Citizens turning 16
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-close at age 30</Label>
              <p className="text-xs text-muted-foreground">
                Automatically close accounts when holders reach 30
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="activationDays">Days before birthday to activate</Label>
            <Input id="activationDays" type="number" defaultValue="0" className="max-w-[200px]" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="closureDays">Days after birthday to close</Label>
            <Input id="closureDays" type="number" defaultValue="30" className="max-w-[200px]" />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">Email and SMS notification settings</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Account activation notifications</Label>
              <p className="text-xs text-muted-foreground">
                Notify users when their account is activated
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment reminders</Label>
              <p className="text-xs text-muted-foreground">
                Send reminders for pending and overdue payments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Balance alerts</Label>
              <p className="text-xs text-muted-foreground">
                Notify users when balance is low
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="lowBalanceThreshold">Low balance threshold ($)</Label>
            <Input id="lowBalanceThreshold" type="number" defaultValue="100" className="max-w-[200px]" />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Security</h2>
            <p className="text-sm text-muted-foreground">Access control and audit settings</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require 2FA for admin actions</Label>
              <p className="text-xs text-muted-foreground">
                Two-factor authentication for sensitive operations
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Audit logging</Label>
              <p className="text-xs text-muted-foreground">
                Log all administrative actions
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
            <Input id="sessionTimeout" type="number" defaultValue="30" className="max-w-[200px]" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="accent" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
