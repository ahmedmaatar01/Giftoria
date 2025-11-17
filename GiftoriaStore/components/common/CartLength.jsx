"use client";

import { useContextElement } from "@/context/Context";

export default function CartLength() {
  const { cartProducts } = useContextElement();
  return <span className="arabic_div">{cartProducts.length}</span>;
}
