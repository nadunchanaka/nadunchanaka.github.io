# Wedding Photos (`wedding-photos/`)

All wedding images (both the main RSVP couple portrait and the interactive album gallery) are stored in this single folder.

---

### 1. Main Couple Photo (`couple.jpg`)
- **Filename**: Must be named **`couple.jpg`** (or `couple.jpeg`, `couple.png`, `couple.webp`).
- **Where it appears**: Displayed exclusively as the main portrait on the **RSVP page** and the formal invitation card inside the welcome envelope.
- **Gallery separation**: `couple.jpg` is **never** shown in the album carousel slider—it is reserved exclusively for the main couple presentation.
- **Fallback**: If `couple.jpg` is missing, the site gracefully falls back to a placeholder image/message without breaking the purple gradient design.

---

### 2. Wedding Album Gallery Photos (`1.jpg`, `2.jpg`, `3.jpg`, ...)
- **Filenames**: Numbered sequentially in the order you want them displayed:
  - `1.jpg`
  - `2.jpg`
  - `3.jpg`
  - `4.jpg`
  - `5.jpg` (and so on...)
- **Where they appear**: Displayed in the interactive carousel slider, thumbnail rail, and fullscreen lightbox.
- **Automatic sorting**: The site automatically sorts them numerically (`1`, `2`, `3`, ..., `10`, `11`).
- **No code editing is required!**

---

### 📝 Step-by-Step Instructions

#### To Replace the Main Couple Photo:
1. Choose your new couple photo.
2. Rename it to **`couple.jpg`**.
3. Drag and drop it into this `wedding-photos/` folder, choosing **Replace / Overwrite**.
4. The RSVP page will update automatically!

#### To Add a New Album Photo:
1. Save the photo with the next number (e.g. `6.jpg`).
2. Drop it into this `wedding-photos/` folder.

#### To Replace an Existing Album Photo:
1. Name your replacement photo with the number of the slide you want to replace (e.g. `2.jpg`).
2. Drop it in and overwrite the old file.

#### To Remove an Album Photo:
1. Delete the image (e.g. delete `5.jpg`).
2. Ensure the remaining images are in sequence (`1.jpg`, `2.jpg`, `3.jpg`...).

---

### 🚀 Rebuilding & Deploying: Do I Need to Rebuild?

- **Local Preview (`npm run dev`)**:
  - **No rebuild needed!** Vite automatically detects any images added, replaced, or deleted in this folder and updates your browser immediately via hot-reload.

- **Publishing to Live GitHub Pages Site (`nadunchanaka.github.io`)**:
  - **Yes, you must rebuild before pushing to GitHub!**
  - Run the following terminal command:
    ```bash
    npm run build
    ```
  - Then commit and push to GitHub:
    ```bash
    git add .
    git commit -m "Update wedding photos"
    git push
    ```
  - GitHub Pages will now serve your updated photos to all guests.

