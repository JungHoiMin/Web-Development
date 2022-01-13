import React from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo.js';
import { Paper,
         List,
         Container, 
         Grid, 
         Button, 
         AppBar, 
         Toolbar, 
         Typography
       } from "@material-ui/core";
import './App.css';
import { call, signout } from "./service/ApiService";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      loading: true,  // 로딩 중 상태를 표현할 변수
    };
  }

  componentDidMount() {
    call("/todo", "GET", null).then((response) => 
      this.setState({ items: response.data, loading: false })
      );
  }

  add = (item) => {
    call("/todo", "POST", item).then((response) => 
      this.setState({ items: response.data })
    );
  };

  delete = (item) => {
    call("/todo", "DELETE", item).then((response) =>
      this.setState({ items: response.data })
    );
  };

  update = (item) => {
    call("/todo", "PUT", item).then((response) => 
      this.setState({ items: response.data })
    );
  };

  render() {
    var todoItems = this.state.items.length > 0 && (
      <Paper style={{ margin:16 }}>
        <List>
          {this.state.items.map((item, idx) => (
            <Todo
              item={item}
              key={item.id}
              delete={this.delete}
              update={this.update}   
            />
          ))}
        </List>
      </Paper>
    );
    
    // navigationBar 추가
    var navigationBar = (
      <AppBar position="static">
        <Toolbar>
          <Grid justify="space-between" container>
            <Grid item>
              <Typography variant="h6">오늘의 할일</Typography>
            </Grid>
          </Grid>
          <Grid>
            <Button color="inherit" onClick={signout}>
              로그아웃
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    );
    
    /* 로딩 중이 아닐 때 렌더링 할 부분 */
    var todoListPage = (
      <div>
        {navigationBar} {/* 내비게이션 바 렌더링 */}
        <Container maxWidth="md">
          <AddTodo add={this.add} />
          <div className="TodoList">{todoItems}</div>
        </Container>
      </div>
    );

    /* 로딩 중일 때 렌더링 할 부분 */
    var loadingPage = <h1> 로딩중.. </h1>;
    
    var content = loadingPage;
    if (!this.state.loading){
      /* 로딩 중이 아니면 todoListPage를 선택 */
      content = todoListPage;
    }

    /* 선택한 content 렌더링 */
    return <div className="App">{content}</div>;
  }
}

export default App;
