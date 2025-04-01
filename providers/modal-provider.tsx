"use client";
import CakeDecorationModal from "@/features/ingredients/components/ingredient-modal/cake-decoration-modal";
import CakeExtraModal from "@/features/ingredients/components/ingredient-modal/cake-extra-modal";
import CakeMessageOptionModal from "@/features/ingredients/components/ingredient-modal/cake-message-option";
import CakePartModal from "@/features/ingredients/components/ingredient-modal/cake-part-modal";
import CollectionCakeDecorationModal from "@/features/ingredients/components/ingredient-modal/collection-cake-decoration-modal";
import CollectionCakeExtraModal from "@/features/ingredients/components/ingredient-modal/collection-cake-extra-modal";
import CollectionCakePartModal from "@/features/ingredients/components/ingredient-modal/collection-cake-part-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CakeDecorationModal />
      <CakeExtraModal />
      <CakeMessageOptionModal />
      <CakePartModal />
      <CollectionCakeDecorationModal />
      <CollectionCakeExtraModal/>
      <CollectionCakePartModal/>
    </>
  );
};
