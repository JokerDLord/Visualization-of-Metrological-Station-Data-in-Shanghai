# vue学习笔记

### v-on修饰符

.stop 停止事件冒泡 例如@click.stop

.prevent

.native

.once只触发一次回调

### v-if,v-else-if,v-else

v-if经常使用 v-if="bool"判断是否渲染出来,为false时显示v-else的内容

v-else-if类似于上面条件不满足时的条件判断v-if -> v-else-if -> v-else,不过不建议多用这东西

### input复用问题

通过条件判断可选择input vdom会复用之前渲染的虚拟dom，所以不会创建新的，会保留原有

input的value，key=”“可作为标识，使得input不复用

### v-if v-show区别

v-if 条件为false时，包含该指令的元素根本不会存于dom中

v-show只是增加行内样式 display:none（多次切换选他）

### v-for遍历数组、对象

v-for="item in names" {{item}}

v-for="(item,index) in names" {{index+1}}.{{item}}

v-for="item in info" {{item}} 遍历对象时，这样写是获取对象的value

v-for="(value,key)in info" {{key}}  {{value}} 可获取对象的值键

v-for="(value,key,index)in info" {{index}}  {{key}}  {{value}} 

key的作用是为了高效更新虚拟dom，即插入新dom的时候，保证原有的一一对应而不是一一更改

所以记住 多:key="xx"

### 数组中哪些方法是响应式的

push() pop() shift() unshift() splice() sort() reverse()

使用数组自己的方法进行改变都是响应式的，索引不是！

Vue.set(this.letters,0,'gailegaile')//三个参数 要修改的对象，索引值，改的元素