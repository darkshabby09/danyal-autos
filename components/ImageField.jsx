'use client';
// Shrinks the photo in the browser before upload (phone photos are big), keeps logos transparent.
export default function ImageField({ name, logo = false, required = false, label }) {
  async function onChange(e) {
    const input = e.target, f = input.files[0];
    if (!f) return;
    try {
      const bmp = await createImageBitmap(f);
      const r = Math.min(1, (logo ? 600 : 1400) / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.round(bmp.width * r); c.height = Math.round(bmp.height * r);
      const x = c.getContext('2d');
      if (!logo) { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
      x.drawImage(bmp, 0, 0, c.width, c.height);
      const type = logo ? 'image/png' : 'image/jpeg';
      const blob = await new Promise((res) => c.toBlob(res, type, 0.82));
      const dt = new DataTransfer();
      dt.items.add(new File([blob], 'photo.' + (logo ? 'png' : 'jpg'), { type }));
      input.files = dt.files;
    } catch { /* if resizing fails the original file is uploaded */ }
  }
  return <input type="file" name={name} accept="image/*" required={required} onChange={onChange} aria-label={label} />;
}
