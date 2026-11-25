const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const [action, email] = process.argv.slice(2);
if (!['grant', 'revoke'].includes(action) || !email) {
  console.error('Usage: npm run set-admin-claim -- <grant|revoke> <account-email>');
  process.exit(1);
}

const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
initializeApp({
  credential: applicationDefault(),
  ...(projectId ? { projectId } : {}),
});

async function updateAdminClaim() {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  if (user.disabled) throw new Error('The account is disabled.');
  if (action === 'grant' && !user.emailVerified) {
    throw new Error('Verify the account email before granting administrator access.');
  }

  const customClaims = { ...user.customClaims };
  if (action === 'grant') customClaims.admin = true;
  else delete customClaims.admin;

  await auth.setCustomUserClaims(user.uid, customClaims);
  console.log(`Administrator claim ${action === 'grant' ? 'granted to' : 'removed from'} ${user.email}.`);
  console.log('The user must sign out and sign in again to refresh their ID token.');
}

updateAdminClaim().catch((error) => {
  console.error(`Could not update administrator claim: ${error.message}`);
  process.exitCode = 1;
});
