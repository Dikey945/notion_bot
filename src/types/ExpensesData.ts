export type Categories = 'food' | 'home' | 'entertainment' | 'transport' | 'clothes';
export interface ExpensesData{
  name: string;
  amount: number;
  category: Categories
  date: Date;
}