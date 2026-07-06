# Baby Checklist App (Be Trai)

## Chay thu local
```bash
npm install
npm run dev
```

## Build production
```bash
npm run build
npm run preview
```

## Deploy len Vercel/Netlify (mien phi, co link web + PWA cai duoc nhu app)
1. Day code nay len 1 repo GitHub.
2. Vao vercel.com (hoac netlify.com) -> New Project -> Import repo.
3. Build command: `npm run build` | Output dir: `dist`
4. Deploy xong se co URL public, vao URL do tren dien thoai, chon "Add to Home Screen" -> co icon nhu app thuc su (PWA), hoat dong offline.

## Dong goi thanh APK Android (khong can Google Play)
Dung Bubblewrap (Google) hoac PWABuilder.com:
1. Deploy web len domain public truoc (buoc tren).
2. Vao https://www.pwabuilder.com/ -> dan URL -> Build My PWA -> chon Android -> tai file .apk/.aab ve.
3. Cai .apk truc tiep vao dien thoai Android (bat "Cho phep cai app nguon khac").

## iOS
- Khong can build gi them: mo Safari -> vao URL app -> bam nut Share -> "Add to Home Screen".
