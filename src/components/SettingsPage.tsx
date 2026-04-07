import React from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone, 
  Moon, 
  Sun,
  ChevronRight,
  Fingerprint,
  Eye,
  CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass rounded-2xl p-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/20">
          JM
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Jatin Malik</h2>
          <p className="text-muted-foreground">jatinmalik34568@gmail.com</p>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full uppercase tracking-wider">Pro Account</span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-wider">Verified</span>
          </div>
        </div>
        <button className="px-6 py-2 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-bold transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsSection title="Account Settings">
          <SettingsItem icon={User} label="Username" value="jatin_malik" />
          <SettingsItem icon={Mail} label="Email" value="jatinmalik34568@gmail.com" />
          <SettingsItem icon={Lock} label="Password" value="••••••••••••" />
          <SettingsItem icon={Smartphone} label="Two-Factor Auth" value="Enabled" isAction />
        </SettingsSection>

        <SettingsSection title="Security & Privacy">
          <SettingsItem icon={Fingerprint} label="Biometric Login" value="Enabled" isToggle active />
          <SettingsItem icon={Shield} label="Security PIN" value="****" isAction />
          <SettingsItem icon={Eye} label="Privacy Mode" value="Hidden" isToggle />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem icon={Moon} label="Dark Mode" value="On" isToggle active />
          <SettingsItem icon={Bell} label="Notifications" value="All" isAction />
          <SettingsItem icon={CreditCard} label="Payment Methods" value="2 Cards" isAction />
        </SettingsSection>

        <SettingsSection title="Trading Settings">
          <SettingsItem icon={SettingsSection} label="Default Order" value="Market" isAction />
          <SettingsItem icon={SettingsSection} label="Risk Management" value="Strict" isAction />
          <SettingsItem icon={SettingsSection} label="Chart Indicators" value="Custom" isAction />
        </SettingsSection>
      </div>
      
      <div className="flex justify-end gap-4 pb-12">
        <button className="px-8 py-3 bg-secondary rounded-xl font-bold hover:bg-secondary/80 transition-colors">Cancel</button>
        <button className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Save Changes</button>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: any) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 bg-secondary/20">
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <div className="p-2">
        {children}
      </div>
    </div>
  );
}

function SettingsItem({ icon: Icon, label, value, isAction, isToggle, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/30 transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-blue-500 transition-colors">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-bold">{label}</p>
          <p className="text-[10px] text-muted-foreground">{value}</p>
        </div>
      </div>
      {isToggle ? (
        <div className={cn(
          "w-10 h-5 rounded-full relative transition-colors",
          active ? "bg-blue-600" : "bg-muted"
        )}>
          <div className={cn(
            "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
            active ? "right-1" : "left-1"
          )} />
        </div>
      ) : (
        <ChevronRight size={16} className="text-muted-foreground" />
      )}
    </div>
  );
}
