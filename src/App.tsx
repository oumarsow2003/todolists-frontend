import { Button, Layout, List, Menu, MenuProps } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { apiClient } from "./api-client";
import { useEffect, useState } from "react";
import { ListForm } from "./ListForm";
import { TodoForm } from "./TodoForm";
import { Item } from "./api-types";
const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export default function App() {
  // TODO use correct types instead of any
  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any | null>(null);
  const [showListForm, setShowListForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [selectedListItems, setSelectedListItems] = useState<Item[]>([]);

  useEffect(() => {
    apiClient.getLists().then(setLists);
  }, []);

  useEffect(() => {
    if (selectedList) {
      lists.forEach(list => {
        if(list.id === selectedList) {
          setSelectedListItems(list.items)
        }
      })
    }
  }, [selectedList]);

  const handleItemClick = (key: string) => {
    if (key === 'add') {
      setSelectedList(null);
      setShowListForm(true);
    } else {
      setSelectedList(key);
    }
  }

  // TODO: fix any, use type from API
  const items: MenuItem[] = lists.map((list: any) => ({
    key: list.id,
    label: list.name
  }));

  function handleListAdded(listName: string): void {
    console.debug('-- handleListAdded', listName);
    apiClient.addList(listName,'').then((result) => {
      apiClient.getLists().then(setLists);
    });
    setShowListForm(false);
  }

  async function handleTodoAdded(todo: string): Promise<void> {
    if (selectedList) {
      await apiClient.addItem(todo, '', 'PENDING', Date.now().toString(), selectedList);
      const updatedLists = await apiClient.getLists();
      const currentList = updatedLists.find((list: any) => list.id === selectedList);
      if (currentList) {
        setSelectedListItems(currentList.items || []);
      } else {
        setSelectedListItems([]);
      }
    }
    setShowTodoForm(false);
  }
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          TODO LISTS
      </Header>
      <Layout>
        <Sider width={200} style={{ background: 'black' }}>
          <Menu
            theme="dark"
            mode="inline"
            items={[{key: 'add', label: 'Add list', icon: <PlusOutlined />}, ...items]}
            onClick={(e) => handleItemClick(e.key)}
          />
        </Sider>
        <Content
          style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          }}    
        >
          {showListForm && <ListForm onListAdded={handleListAdded} />}
          {selectedList && 
            <div>
              <Button onClick={() => setShowTodoForm(true)}>Add Todo</Button>
              <List
                dataSource={selectedListItems}
                renderItem={(item) => <List.Item>{item.title}</List.Item>}
              />
            </div>
          }
          {!selectedList && !showListForm && <div>Select a list</div>}    
          {showTodoForm && <TodoForm onTodoAdded={handleTodoAdded} />}
        </Content>
      </Layout>
    </Layout>
  )
}