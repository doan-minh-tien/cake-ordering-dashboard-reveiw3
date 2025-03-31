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
  image: IImage | null;
  type: string;
  bakery_id: string;
};


export interface IImage {
  file_name: string;
  file_url: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

