export type ICakeMessageOptionType = {
  type: string;
  items: ICakeMessageOptionItem[];
};

export type ICakeMessageOptionItem = {
  id: string;
  name: string;
  color: string;
  type: string;
  bakery_id: string;
};
