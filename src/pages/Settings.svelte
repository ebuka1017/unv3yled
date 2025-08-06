<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">Settings</h1>
    <p class="text-muted-foreground mb-8">Manage your account and preferences.</p>
    
    <div class="max-w-2xl space-y-6">
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Account Settings</h3>
        <p class="text-muted-foreground mb-4">Manage your profile and account information.</p>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          Edit Profile
        </button>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Privacy</h3>
        <p class="text-muted-foreground mb-4">Control your privacy settings and data sharing.</p>
        <Link to="/privacy" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-block">
          Privacy Settings
        </Link>
      </div>
      
      <div class="p-6 bg-card rounded-lg border">
        <h3 class="text-lg font-semibold mb-4">Connected Accounts</h3>
        <p class="text-muted-foreground mb-4">Manage your connected services and integrations.</p>
        <Link to="/spotify" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-block">
          Manage Connections
        </Link>
      </div>
    </div>
  </div>
</div>