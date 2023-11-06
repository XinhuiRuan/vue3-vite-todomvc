<template>
  <section class="todoapp">
    <header class="header">
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        v-model.trim="inputValue"
        @keyup.enter="addItem"
        v-app-focus
      />
    </header>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section v-show="todoList.length" class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="toggleAll"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        <li
          v-for="(item, index) in filterList"
          :key="item.id"
          :class="{ completed: item.completed, editing: item.editing }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="item.completed" />
            <label @dblclick="item.editing = true">{{ item.name }}</label>
            <button class="destroy" @click="deleteItem(index)"></button>
          </div>
          <input
            class="edit"
            :value="item.name"
            v-app-focus
            @keyup.esc="item.editing = false"
            @keyup.enter="handleEnter(index, $event)"
            @blur="handleBlur(index, $event)"
          />
        </li>
        <!-- <li>
						<div class="view">
							<input class="toggle" type="checkbox">
							<label>Buy a unicorn</label>
							<button class="destroy"></button>
						</div>
						<input class="edit" value="Rule the web">
					</li> -->
      </ul>
    </section>
    <!-- This footer should be hidden by default and shown when there are todos -->
    <footer v-show="todoList.length" class="footer">
      <!-- This should be `0 items left` by default -->
      <span class="todo-count"
        ><strong>{{ leftNum }}</strong> item{{
          leftNum === 1 ? "" : "s"
        }}
        left</span
      >
      <!-- Remove this if you don't implement routing -->
      <ul class="filters">
        <li>
          <a :class="{selected: hash === ''}" href="#/">All</a>
        </li>
        <li>
          <a :class="{selected: hash === 'active'}" href="#/active">Active</a>
        </li>
        <li>
          <a :class="{selected: hash === 'completed'}" href="#/completed">Completed</a>
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button class="clear-completed" @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by <a href="http://todomvc.com">you</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs, watch } from "vue";

interface TodoItem {
  id: number;
  name: string;
  completed: boolean;
  editing: boolean;
}
interface Obj {
  hash: string;
  inputValue: string;
  todoList: Array<TodoItem>;
}

let key = 'TO_DO_LIST'
let handleLocalStorage = {
  get(){
    return JSON.parse(localStorage.getItem(key) || '[]')
  },
  set(){
    localStorage.setItem(key, JSON.stringify(obj.todoList))
  }
}

const obj: Obj = reactive({
  hash: "",
  inputValue: "",
  todoList: handleLocalStorage.get(),
});

watch(() => obj.todoList, () => {
  handleLocalStorage.set()
},{
  deep: true
})

const filterList = computed(() => {
  switch (obj.hash) {
    case "active":
      return obj.todoList.filter((item) => !item.completed);
      break;
    case "completed":
      return obj.todoList.filter((item) => item.completed);
      break;
    default:
      return obj.todoList;
  }
});

// 增加事项
const addItem = () => {
  if (!obj.inputValue) return;
  obj.todoList.push({
    id: obj.todoList.length + 1,
    name: obj.inputValue,
    completed: false,
    editing: false,
  });
  obj.inputValue = "";
};
// 删除事项
let deleteItem = (index: number) => {
  obj.todoList.splice(index, 1);
};
// 清楚完成项
let clearCompleted = () => {
  obj.todoList = obj.todoList.filter((item) => !item.completed);
};

// 剩余未完成的数量
let leftNum = computed(
  () => obj.todoList.filter((item) => !item.completed).length
);

// 切换全选
let toggleAll = computed({
  get() {
    return leftNum.value === 0;
  },
  set(newVal: boolean) {
    obj.todoList.forEach((item) => (item.completed = newVal));
  },
});

let handleEnter = (index: number, e: any) => {
  let value = e.target.value.trim();
  if (!value) {
    deleteItem(index);
    return;
  }
  obj.todoList[index].name = value;
  obj.todoList[index].editing = false;
};

let handleBlur = (index: number, e: any) => {
  if (!obj.todoList[index].editing) return;
  let value = e.target.value.trim();
  if (!value) {
    deleteItem(index);
    return;
  }
  obj.todoList[index].name = value;
  obj.todoList[index].editing = false;
};

window.onhashchange = () => {
  obj.hash = window.location.hash.slice(2);
};
let x:any = null
window.onhashchange(x)


const { todoList, inputValue, hash } = { ...toRefs(obj) };
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
