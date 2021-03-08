# MyFirstNg

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



# 将项目接入qiankun微前端的步骤：

以 Angular-cli 9 生成的 angular 9 项目为例，其他版本的 angular 后续会逐渐补充。

1. 在 src 目录新增 public-path.js 文件，内容为：

if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

2. 设置 history 模式路由的 base，src/app/app-routing.module.ts 文件：

+ import { APP_BASE_HREF } from '@angular/common';
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // @ts-ignore
+  providers: [{ provide: APP_BASE_HREF, useValue: window.__POWERED_BY_QIANKUN__ ? '/app-angular' : '/' }]
})

3. 修改入口文件，src/main.ts 文件。

import './public-path';
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

let app: void | NgModuleRef<AppModule>;
async function render() {
  app = await platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap (props: Object) {
  console.log(props);
}

export async function mount (props: Object) {
  render();
}

export async function unmount (props: Object) {
  console.log(props);
  // @ts-ignore
  app.destroy();
}

4. 修改 webpack 打包配置

先安装 @angular-builders/custom-webpack 插件，注意：angular 9 项目只能安装 9.x 版本，angular 10 项目可以安装最新版。

npm i @angular-builders/custom-webpack@9.2.0 -D

在根目录增加 custom-webpack.config.js ，内容为：

const appName = require('./package.json').name;
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    library: `${appName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${appName}`,
  },
};

修改 angular.json，将 [packageName] > architect > build > builder 和 [packageName] > architect > serve > builder 的值改为我们安装的插件，将我们的打包配置文件加入到 [packageName] > architect > build > options。

- "builder": "@angular-devkit/build-angular:browser",
+ "builder": "@angular-builders/custom-webpack:browser",
  "options": {
+    "customWebpackConfig": {
+      "path": "./custom-webpack.config.js"
+    }
  }

- "builder": "@angular-devkit/build-angular:dev-server",
+ "builder": "@angular-builders/custom-webpack:dev-server",

5. 解决 zone.js 的问题

在父应用引入 zone.js，需要在 import qiankun 之前引入。

将微应用的 src/polyfills.ts 里面的引入 zone.js 代码删掉。

- import 'zone.js/dist/zone';

在微应用的 src/index.html 里面的 <head> 标签加上下面内容，微应用独立访问时使用。

<!-- 也可以使用其他的CDN/本地的包 -->
<script src="https://unpkg.com/zone.js" ignore></script>

6. 修正 ng build 打包报错问题，修改 tsconfig.json 文件，参考issues/431

- "target": "es2015",
+ "target": "es5",
+ "typeRoots": [
+   "node_modules/@types"
+ ],

7. 为了防止主应用或其他微应用也为 angular 时，<app-root></app-root> 会冲突的问题，建议给<app-root> 加上一个唯一的 id，比如说当前应用名称。

src/index.html ：

- <app-root></app-root>
+ <app-root id="angular9"></app-root>

src/app/app.component.ts ：

- selector: 'app-root',
+ selector: '#angular9 app-root',

当然，也可以选择使用 single-spa-angular 插件，参考 single-spa-angular 的官网 和 angular demo

