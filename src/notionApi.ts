import { Client } from '@notionhq/client'
import * as dotenv from 'dotenv'
import {Categories, ExpensesData} from "./types/ExpensesData";

dotenv.config()
const databaseId = process.env.NOTION_DATABASE_ID
const integrationToken = process.env.NOTION_INTEGRATION_TOKEN
const formatDateOptions:  Intl.DateTimeFormatOptions | undefined = {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}
console.log(new Date().toLocaleDateString('en-GB', formatDateOptions))
const notion = new Client({
  auth: integrationToken
})
const createNewPage = (name: string, date: Date, amount: number, category: Categories) => {
  const newPage = {
    properties: {
      Name: {
        rich_text: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Month: {
        select: {
          name: date.toLocaleDateString('en-GB', {month: 'long'}),
        }
      },
      Date: {
        date: {
          start: date.toISOString().split('T')[0],
        },
      },
      Category: {
        multi_select: [{
          name: category,
        }]
      },
      Amount: {
        number: amount,
      },
      // Add other properties as needed
    },
  };
  return newPage
}

// const databaseFetch = async () => {
//   if(databaseId) {
//     const db = await notion.databases.retrieve({database_id: databaseId});
//     console.log(db.properties)
//
//   }
// }
//
//
// databaseFetch()




export const notionApi = {
  async updateExpensesDB(expensesData: ExpensesData) {
    const {name, date, amount, category}  = expensesData;


    const res = await notion.pages.create({
      parent: {
        database_id: databaseId!,
      },
      // @ts-ignore
      properties: createNewPage(name, date, amount, category).properties,
    });

    console.log(res)
  }
}
