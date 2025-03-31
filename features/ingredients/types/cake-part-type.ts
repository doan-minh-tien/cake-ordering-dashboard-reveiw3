import { IImage } from "./cake-decoration-type";

export type ICakePartType = {
  type: string;
  items: ICakePartItem[];
};

export type ICakePartItem = {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  is_default: boolean;
  image_id: string | null;
  image: IImage | null;
  type: string;
  bakery_id: string;
};
