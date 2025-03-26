export type ICakeMessageOptionType = {
  type: string;
  items: ICakeMessageOptionItem[];
};

export type ICakeMessageOptionItem = {
  id: string;
  name: string;
  color: string;
  bakery_id: string;
};
