import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav>
      <ul className="flex gap-4">
        <li>
          <Link href="/" className="text-blue-500 hover:text-yellow-500">
            Pagos simples
          </Link>
        </li>
        <li>
          <Link href="/plan" className="text-blue-500 hover:text-yellow-500">
            Subscripciones
          </Link>
        </li>
        <li>
          <Link
            href="/manage-subscription"
            className="text-blue-500 hover:text-yellow-500"
          >
            Gestionar suscripción
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
