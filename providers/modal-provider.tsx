"use client";
import CreateMessageTypeModal from "@/features/ingredients/components/ingredient-modal/create-message-type-modal";
import CreateIngredientTypeModal from "@/features/ingredients/components/ingredient-modal/create-ingredient-type-modal";
import CreateExtraTypeModal from "@/features/ingredients/components/ingredient-modal/create-extra-type-modal";
import CreatePartTypeModal from "@/features/ingredients/components/ingredient-modal/create-part-type-modal";
import CakeDecorationModal from "@/features/ingredients/components/ingredient-modal/cake-decoration-modal";
import CollectionCakeDecorationModal from "@/features/ingredients/components/ingredient-modal/collection-cake-decoration-modal";
import CakePartModal from "@/features/ingredients/components/ingredient-modal/cake-part-modal";
import CollectionCakePartModal from "@/features/ingredients/components/ingredient-modal/collection-cake-part-modal";
import CakeExtraModal from "@/features/ingredients/components/ingredient-modal/cake-extra-modal";
import CollectionCakeExtraModal from "@/features/ingredients/components/ingredient-modal/collection-cake-extra-modal";
import CakeMessageModal from "@/features/ingredients/components/ingredient-modal/cake-message-option";
import CollectionCakeMessageModal from "@/features/ingredients/components/ingredient-modal/collection-cake-message-modal";
import BakeryDetailModal from "@/features/barkeries/components/bakery-detail-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateIngredientTypeModal />
      <CreateMessageTypeModal />
      <CreateExtraTypeModal />
      <CreatePartTypeModal />
      <CollectionCakeDecorationModal />
      <CakeDecorationModal />
      <CollectionCakePartModal />
      <CakePartModal />
      <CollectionCakeExtraModal />
      <CakeExtraModal />
      <CollectionCakeMessageModal />
      <CakeMessageModal />
      <BakeryDetailModal />
    </>
  );
};
