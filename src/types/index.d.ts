// Table: user
// | Field    | Type         | Constraints                                    | Comment   |
// | -------- | ------------ | ---------------------------------------------- | --------- |
// | id       | bigint       | primary key auto_increment                     |           |
// | username | varchar(255) | not null                                       | 用户名    |
// | phone    | varchar(255) | not null, unique                               | 手机号    |
// | password | varchar(255) | not null                                       | 密码      |
// | avatar   | varchar(255) |                                                | 头像      |
// | regtime  | datetime     | not null, default now()                        | 注册时间  |
// | status   | int          | not null, check (status in (0, 1, 2, 3, 4, 5)) | default 0 |
// 用户类型
export interface userType {
  id?: number
  username?: string
  phone?: string
  avatar?: string
  regtime?: string
  password?: string
  status?: number
}

// Table: address
// | Field  | Type         | Constraints                | Comment  |
// | ------ | ------------ | -------------------------- | -------- |
// | id     | bigint       | primary key auto_increment |          |
// | uid    | bigint       | 外键user(id)               | 用户id   |
// | name   | varchar(255) |                            | 姓名     |
// | phone  | varchar(255) |                            | 手机号   |
// | detail | varchar(255) |                            | 详细地址 |
// 地址类型
export interface addressType {
  id?: number
  uid?: number
  name?: string
  phone?: string
  detail?: string
  status?: number
}

// Table: restaurant
// | Field    | Type          | Constraints                                     | Comment            |
// | -------- | ------------- | ----------------------------------------------- | ------------------ |
// | id       | bigint        | primary key auto_increment                      |                    |
// | name     | varchar(255)  | not null                                        | 饭店名称           |
// | phone    | varchar(255)  | not null, unique                                | 饭店电话           |
// | password | varchar(255)  | not null                                        | 密码               |
// | announce | varchar(255)  |                                                 | 描述信息           |
// | address  | varchar(255)  |                                                 | 地址               |
// | cover    | varchar(255)  |                                                 | 封面               |
// | sale     | bigint        | not null, default 0                             | 销量               |
// | mark     | decimal(2, 1) | check (mark <= 5 and mark >= 1)                 | 评分               |
// | percent  | decimal(4, 2) | not null, default 10.00                         | 抽成               |
// | regtime  | datetime      | default now()                                   | 注册时间           |
// | status   | int           | default 0, check (status in (0, 1, 2, 3, 4, 5)) | 订单状态 default 0 |
// 饭店类型
export interface restaurantType {
  id?: number
  name?: string
  phone?: string
  password?: string
  announce?: string
  address?: string
  cover?: string
  sale?: number
  mark?: number
  percent?: number
  regtime?: string // 注册时间格式待定
  status?: number
}

// Table: category
// | Field  | Type         | Constraints                          | Comment  |
// | ------ | ------------ | ------------------------------------ | -------- |
// | id     | bigint       | primary key auto_increment           |          |
// | rid    | bigint       | not null, 外键restaurant(id)         | 所属饭店 |
// | name   | varchar(255) | not null                             | 分类名称 |
// | status | int          | check (status in (0, 1, 2, 3, 4, 5)) | 分类状态 |
// 分类类型
export interface categoryType {
  id?: number
  rid?: number
  name?: string
  status?: number
}

// Table: dish
// | Field    | Type          | Constraints                          | Comment |
// | -------- | ------------- | ------------------------------------ | ------- |
// | id       | bigint        | primary key auto_increment           |         |
// | cid      | bigint        | not null, 外键category (id)          | 分类    |
// | name     | varchar(255)  | not null                             | 菜品名  |
// | descr    | varchar(255)  |                                      | 描述    |
// | price    | decimal(6, 2) | not null                             | 价格    |
// | discount | decimal(4, 2) | not null, default 0.00               | 折扣    |
// | cover    | varchar(255)  |                                      | 封面    |
// | status   | int           | check (status in (0, 1, 2, 3, 4, 5)) | 状态    |
// 菜品类型
export interface dishType {
  id?: number
  cid?: number
  name?: string
  descr?: string
  price?: number
  discount?: number
  cover?: string
  status?: number
}

// Table: orders
// | Field       | Type          | Constraints                          | Comment    |
// | ----------- | ------------- | ------------------------------------ | ---------- |
// | id          | bigint        | primary key auto_increment           |            |
// | uid         | bigint        | 外键user (id)                        | 用户       |
// | aid         | bigint        | 外键address (id)                     | 地址       |
// | totalprice  | decimal(8, 2) |                                      | 订单总价格 |
// | create_time | datetime      | not null, default now()              | 创建时间   |
// | comment     | varchar(255)  |                                      | 订单备注   |
// | status      | int           | check (status in (0, 1, 2, 3, 4, 5)) | 订单状态   |
// 订单类型
export interface orderType {
  id?: number
  rid?: number
  uid?: number
  aid?: number
  totalprice?: number
  create_time?: string
  comment?: string
  status?: number
}

// Table: orderdetail
// | Field    | Type          | Constraints                                | Comment |
// | -------- | ------------- | ------------------------------------------ | ------- |
// | id       | bigint        | primary key auto_increment                 |         |
// | oid      | bigint        | 外键orders (id)                            | 订单    |
// | did      | bigint        | 外键dish (id)                              | 菜品    |
// | price    | decimal(6, 2) |                                            | 价格    |
// | mark     | int           | default 0, check (mark <= 5 and mark >= 0) | 评分    |
// | quantity | int           | not null, default 1                        | 数量    |
// 订单详情类型
export interface orderDetailType {
  id?: number
  oid?: number
  did?: number
  price?: number
  mark?: number
  quantity?: number
}

// #### Table: shopcar
// | Field    | Type   | Constraints                | Comment |
// | -------- | ------ | -------------------------- | ------- |
// | id       | bigint | primary key auto_increment |         |
// | uid      | bigint | not null, 外键user (id)    | 用户    |
// | did      | bigint | not null                   | 菜品    |
// | quantity | int    | not null, default 1        | 数量    |
export interface shopCarType {
  id?: number
  uid?: number
  did?: number
  rid?: number
  quantity?: number
}

// 购物车项目详情
export interface shopCarItemType extends shopCarType {
  dish?: dishType
}

// 页面类型
export interface pageType {
  records: Array
  total: number
  size: number
  current: number
}

// 返回的数据外层
export interface responseType {
  code: number
  msg: string
  data?: any
}

// 登陆发送的数据
export interface loginType {
  phone: string
  password: string
}

// 登陆返回的数据
export interface loginResType {
  name: string
  token: string
}

// 订单列表项
export interface orderListItemType {
  id: number
  user: userType
  restaurant: restaurantType
  address: addressType
  status?: number
  totalprice?: number
  create_time?: string
  comment?: string
}

// 订单详情列表项
export interface orderDetailListItemType {
  id?: number
  dish?: dishType
  quantity?: number
  price?: number
  mark?: number
}
