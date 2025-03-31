import { IImage } from "./cake-decoration-type";

export type ICakeExtraOptionType = {
  type: string;
  items: ICakeExtraOptionItem[];
};

export type ICakeExtraOptionItem = {
  id: string;
  name: string;
  price: number;
  color: string;
  is_default: boolean;
  description: string;
  image_id: string | null;
  image: IImage | null;
  type: string;
  bakery_id: string;

};

