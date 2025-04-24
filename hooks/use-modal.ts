import { ICakeDecorationItem } from "@/features/ingredients/types/cake-decoration-type";
import { ICakeExtraOptionItem } from "@/features/ingredients/types/cake-extra-option-type";
import { ICakeMessageOptionItem } from "@/features/ingredients/types/cake-message-option-type";
import { ICakePartItem } from "@/features/ingredients/types/cake-part-type";
import { create } from "zustand";

// example -- 2 modal
export type ModalType =
  | "updateBookingServicesModalSheet"
  | "createNewServicesBookingModal"
  | "createNewUserModal"
  | "createNewBakeryModal"
  | "cakeDecorationModal"
  | "cakeExtraModal"
  | "cakeMessageModal"
  | "cakePartModal"
  | "collectionCakeDecorationModal"
  | "collectionCakeExtraOptionModal"
  | "collectionCakeMessageModal"
  | "collectionCakePartModal"
  | "bakeryDetailModal"
  | "createIngredientTypeModal"
  | "createMessageTypeModal"
  | "createExtraTypeModal"
  | "createPartTypeModal";

export interface ModalData {
  // user   -- example
  // user?: IUser;
  ingredientType?: string;
  existingTypes?: string[];
  cakeDecoration?: ICakeDecorationItem;
  cakeExtra?: ICakeExtraOptionItem;
  cakeMessage?: ICakeMessageOptionItem;
  cakePart?: ICakePartItem;
  bakeryId?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false }),
}));
