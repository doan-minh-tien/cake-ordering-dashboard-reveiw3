export type ICakeDecorationType = {
  type: string;
  items: ICakeDecorationItem[];
};

export type ICakeDecorationItem = {
  id: string;
  name: string;
  price: number;
  color: string;
  is_default: boolean;
  description: string;
  image_id: string | null;
  image: string | null;
  type: string;
  bakery_id: string;
};
