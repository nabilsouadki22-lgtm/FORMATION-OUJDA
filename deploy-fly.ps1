# Fly.io deployment helper for Centre Formation Oujda
# Usage:
#   1. Install flyctl: https://fly.io/docs/hands-on/install-flyctl/
#   2. Log in: flyctl auth login
#   3. Run this script from the repository root.

param(
    [string]$BackendApp = 'CentreFormationOujda-backend',
    [string]$FrontendApp = 'CentreFormationOujda-frontend',
    [string]$JwtSecret = 'replace-with-a-secure-random-string',
    [string]$StripeSecret = 'sk_test_replace',
    [string]$StripeWebhookSecret = 'whsec_replace'
)

$frontendUrl = "https://$FrontendApp.fly.dev"
$backendUrl = "https://$BackendApp.fly.dev"

Write-Output "Deploying backend app: $BackendApp"
flyctl launch --config fly-backend.toml --no-deploy --name $BackendApp
flyctl secrets set -a $BackendApp `
  JWT_SECRET="$JwtSecret" `
  STRIPE_SECRET_KEY="$StripeSecret" `
  STRIPE_WEBHOOK_SECRET="$StripeWebhookSecret" `
  FRONTEND_URL="$frontendUrl"
flyctl deploy --config fly-backend.toml

Write-Output "Deploying frontend app: $FrontendApp"
flyctl launch --config fly-frontend.toml --no-deploy --name $FrontendApp
flyctl secrets set -a $FrontendApp `
  VITE_API_BASE="$backendUrl"
flyctl deploy --config fly-frontend.toml

Write-Output "Backend should be available at: $backendUrl"
Write-Output "Frontend should be available at: $frontendUrl"
Write-Output "Once the frontend URL is live, update the backend FRONTEND_URL secret if needed."
flyctl secrets set -a $BackendApp FRONTEND_URL="$frontendUrl"
