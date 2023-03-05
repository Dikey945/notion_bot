import {Categories} from "./ExpensesData";

export interface NotionExpensesDB{
  name: string;
  month: string;
  date: string;
  amount: number;
  category: Categories
}