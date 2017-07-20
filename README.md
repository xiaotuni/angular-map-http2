# TravelTogether

项目的依赖安装
```bash
npm install
```
项目启动
```bash
npm run dev
```
单独启动前端的话
```
npm run start
```
单独启动后台接口
```bash
npm run start-dev
```

如果专门调试接口的话，还是分别单独启动为好.

## nodejs.sql MySql 5.7以上版本。
由于本试例中要用到MYSQL数据，所在在项目的根目录中有一个nodejs.sql的文件。将结构导入到数据库中即可，数据库版本是5.7以的，因为里面有一个sys_rule表里的Content存放的是JSON,只有5.7才能支持JSON字段。
 
 ## 修改数据库连接
 /server/ctrl_es6/DbHelper.js里33行左右
 ```javascript
 /**
   * 创建一个资源池
   * 
   * @memberof MySqlHelper
   */
  __CreatePool() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost', // 数据库连接
      user: 'liaohb',    // 数据库名用户名
      password: 'xiaotuni', // 密码
      database: 'nodejs'   // 表空间
    });

    this.pool.on('connection', (connection)=> {
      // connection.query('SET SESSION auto_increment_increment=1')
    });
    this.pool.on('release', (connection)=> {
      // console.log('Connection %d released', connection.threadId);
    });
  }

 ```
 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
