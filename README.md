# Danyal Autos website (Next.js + Supabase)

Pages: Home, Stock (category tabs), Bike page (cash price + installment calculator), Accessories, About & contact (with showroom photos), Admin panel.

## 1. Supabase (database + photo storage), about 5 minutes
1. supabase.com > New project (free plan is fine). Save the database password.
2. Open **SQL Editor > New query**, paste everything from `supabase.sql`, press **Run**.
3. Open **Project Settings > API**. Copy the **Project URL** and the **service_role** key.
   The service_role key is a secret: never share it or put it in a public place.

## 2. Test on your computer
```
npm install
copy .env.example .env.local      (Mac/Linux: cp .env.example .env.local)
```
Open `.env.local`, fill the 4 values, then:
```
npm run dev
```
Website: http://localhost:3000   Admin: http://localhost:3000/admin (use your ADMIN_PASSWORD)

## 3. Put it online (Vercel + your domain)
1. Upload this folder to a GitHub repository.
2. vercel.com > Add New > Project > import the repository.
3. Before deploying, add the same 4 values under **Environment Variables**
   (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD, SESSION_SECRET). Deploy.
4. Vercel > Project > Settings > Domains > add your domain and follow the DNS steps it shows.
5. Open `yourdomain.com/admin`, go to **Settings**, enter your phone, WhatsApp number (923001234567), address,
   logo, installment markup %, and Google Maps link.

## Good to know
- Change the admin password: edit ADMIN_PASSWORD in Vercel > Settings > Environment Variables, then redeploy.
- Supabase free projects pause after about 1 week with no activity. If the site shows an error after a quiet period,
  open the Supabase dashboard and press **Restore**. A paid plan avoids this.
- Backup: Supabase dashboard > Table Editor > export each table as CSV now and then. Photos stay in Storage > images.
- Photos are shrunk in the browser before upload, so phone photos are fine.
