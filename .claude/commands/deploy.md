---
description: "Deploy Habuild training platform - builds and deploys frontend + backend to Vercel production"
---

Deploy the Habuild Training Platform to production on Vercel.

## Project Info
- Frontend: `/Users/komal/Desktop/Komal/projects/training-module-frontend`
- Backend: `/Users/komal/Desktop/Komal/projects/training-module-backend`
- GitHub: Shubhamzingare/training-module-frontend and training-module-backend
- Live URL: https://habuild-training.vercel.app
- Vercel scope: komal-4348s-projects

## Steps

1. Build frontend locally to catch errors first:
   `cd /Users/komal/Desktop/Komal/projects/training-module-frontend && npm run build`

2. If build passes, deploy backend:
   ```
   cd /Users/komal/Desktop/Komal/projects/training-module-backend
   git add -A
   git commit -m "deploy: <describe changes>"
   gh auth token | git -c credential.helper='!f() { echo "username=Shubhamzingare"; echo "password=$(gh auth token)"; }; f' push origin main
   npx vercel deploy --prod
   ```
   Note the new backend production URL.

3. Update frontend env if backend URL changed:
   `npx vercel env rm REACT_APP_API_URL production --yes`
   `npx vercel env add REACT_APP_API_URL production <<< "<new-backend-url>"`

4. Deploy frontend:
   ```
   cd /Users/komal/Desktop/Komal/projects/training-module-frontend
   git add -A
   git commit -m "deploy: <describe changes>"
   gh auth token | git -c credential.helper='!f() { echo "username=Shubhamzingare"; echo "password=$(gh auth token)"; }; f' push origin main
   npx vercel deploy --prod
   ```

5. Update alias:
   `npx vercel alias set <new-deployment-url> habuild-training.vercel.app`

6. Verify live site:
   `curl -s https://habuild-training.vercel.app` — should load
   `curl -s <backend-url>/api/health` — should return success:true
