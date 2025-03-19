import { create } from "zustand";

export type IBarkery = {
  id: string;
  bakery_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  owner_name: string;
  avatar_file_id: string;
  avatarFile: IAvatar;
  identityCardNumber: string;
  frontCardFileId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDeleted: boolean;
};

export type IAvatar = {
  fileName: string;
  fileUrl: string;
  id: string;
};
