export default function Footer({ name, address, phone }) {
  return (
    <footer>
      <div><b>{name}</b><br />{address}</div>
      <div><a href={`tel:${phone}`}>{phone}</a></div>
      <div>&copy; {new Date().getFullYear()} {name}</div>
    </footer>
  );
}
