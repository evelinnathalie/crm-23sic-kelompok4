import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#5A6B3E] text-white text-center text-sm py-4">
      <p>&copy; {new Date().getFullYear()} Monochrome Space</p>
    </footer>
  );
}
