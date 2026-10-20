// What each admin tab can edit. type: text | area | cat | file | sel
export const TABS = {
  stock: { label: 'Stock', fields: [
    { k: 'title', label: 'Name (e.g. Honda CD 70 2025)', type: 'text', req: true },
    { k: 'category_id', label: 'Category', type: 'cat' },
    { k: 'price', label: 'Cash price (numbers only, e.g. 189,000)', type: 'text', req: true },
    { k: 'year', label: 'Model year', type: 'text' },
    { k: 'details', label: 'Details', type: 'area' },
    { k: 'image', label: 'Photo', type: 'file' },
    { k: 'installment', label: 'Available on installments', type: 'sel', opts: ['Yes', 'No'] },
    { k: 'status', label: 'Status', type: 'sel', opts: ['Available', 'Sold'] },
  ] },
  accessories: { label: 'Accessories', fields: [
    { k: 'title', label: 'Part name', type: 'text', req: true },
    { k: 'price', label: 'Price', type: 'text' },
    { k: 'details', label: 'Details / fits which bike', type: 'area' },
    { k: 'image', label: 'Photo', type: 'file' },
    { k: 'status', label: 'Status', type: 'sel', opts: ['In stock', 'Out of stock'] },
  ] },
  gallery: { label: 'Showroom photos', fields: [
    { k: 'title', label: 'Caption (e.g. Showroom front, Main road view)', type: 'text', req: true },
    { k: 'image', label: 'Photo', type: 'file', req: true },
  ] },
  categories: { label: 'Categories', fields: [{ k: 'name', label: 'Category name', type: 'text', req: true }] },
};

export const SETTINGS = {
  name: 'Business name', tagline: 'Home page line', phone: 'Phone',
  whatsapp: 'WhatsApp number (923001234567, no + or spaces)', address: 'Address', hours: 'Opening hours',
  markup: 'Installment markup % per year (0 = none)', min_advance: 'Minimum advance % (e.g. 15)', durations: 'Installment months options (e.g. 6,12,18,24)',
  facebook: 'Facebook link', instagram: 'Instagram link', tiktok: 'TikTok link', youtube: 'YouTube channel link',
  map: 'Google Maps embed link (Share > Embed a map > copy the src="..." part)', about: 'About text',
};
