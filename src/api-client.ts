// import { ITodoList, TodoListStatus } from './api-types'
import { ListsApi, ItemsApi } from 'todo-list-client'
import axios from 'axios'
import { List, Item } from './api-types'
import { v4 as uuidv4 } from 'uuid';


const apiList = new ListsApi(
    {
         isJsonMime: (mime: string) => mime.startsWith('application/json')
     },
     'http://localhost:3000',
    axios,
    )

const apiItem = new ItemsApi(
    {
            isJsonMime: (mime: string) => mime.startsWith('application/json')
        },
        'http://localhost:3000',
    axios,
    )
export const apiClient = {
    getLists: async () => {
        const response = await apiList.listsGet()
        return response.data
    },
    addList: async (listName: string, description: string) => {
        const list : List = {id : uuidv4(), name : listName, description}
        return apiList.listsPost(list)
    },
    putList: async (list : List) => {
        return apiList.listsPost(list)
    },
    addItem: async (title: string,description:string,etat:string,date:string,listId:string) => {
        const item : Item = {id : '', title, description, etat, date, listId}
        return apiItem.listsListIdItemsPost(listId,item)
    },
    putItem: async (item : Item) => {
        return apiItem.listsListIdItemsPost(item.listId,item)
    }
    

}
