# Migration to VITE

Follow this [guide](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)

## Node upgrade

Use latest version of node to avoid an error about `perf hooks`
```
nvm use v19.6.0
```

## Edit `package.json`:

remove:
```
    // scripts
	"serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
	   "lint": "vue-cli-service lint",
	// dependencies
	"core-js": "^3.6.5",
	
    //devDependencies
    "@vue/cli-plugin-babel": "^4.5.15",
    "@vue/cli-plugin-eslint": "^4.5.15",
    "@vue/cli-plugin-unit-jest": "^4.5.13",
    "@vue/cli-service": "^4.5.15",
    "babel-eslint": "^10.1.0", 
	
	// elsewhere
	parserOptions: {
    parser: "babel-eslint",
	},
  

```

add:
```
//scripts
"dev": "vite",
"build": "vite build",
"serve": "vite preview",
"lint": "eslint --ext .js,.vue --ignore-path .gitignore --fix src",
// devDependencies
"@vitejs/plugin-vue": "^1.6.1",
"vite": "^2.5.4",
```

## Create `vite.config.js`

Note the injection of env var so we can set the base (else assets don't load when served at subdomain)

```
import { defineConfig, loadEnv  } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return defineConfig({
    base: process.env.VITE_BASE,
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};

```

## Move index.html to root

move `./public/index.html` to `./index.html`

## Edit index.html

Remove:

```
   <title><%= htmlWebpackPlugin.options.title %></title>
   ```
Add:   
   ```
   <title>Spinner</title>
   ```
   
Remove:
```
 <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
 ```
 
 Add:
 ```
 <strong>We're sorry but this app doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
 ```
 
 Add (below body to avoid mount returned null error):
 
 ```
 <script type="module" src="/src/main.js"></script>
 ```
 
 
 ## Update environment vars
 
 Find usage of old way of accessing environment vars
 
 ```
 grep -r 'process.env' ./src
 ```

None found this time ....

## Router

Not used - so no changes needed here

## Environment variables

Add environment variables files to allow subdomain in production 

`.env.development` & `.env.test`:

```
VITE_BASE='/'
```

`.env.production`
```
VITE_BASE='/static/ui/spinner-1.0/'
```

## Try it 

remove  vue-jest, jest from package.json to solve node gyp issue?

```
rm package-lock.json # upgrading from old version throws errors, so start fresh

npm install #you might see a message about package.json.lock being created with old version of npm
npm audit fix #clear up security issues, all should resolve
npm run dev
npm run build
```

Node-gyp compilation issue - so delete package-lock.json and drop in known good package.json from bookjs and install from there...

````
es6-promise/auto (imported by /home/tim/sources/spinner-amax/ui/src/main.js)
  vuex (imported by /home/tim/sources/spinner-amax/ui/src/components/StepCommand.vue?id=0)
  uuid (imported by /home/tim/sources/spinner-amax/ui/src/App.vue?id=0)
  axios (imported by /home/tim/sources/spinner-amax/ui/src/components/LoggingStream.vue?id=0)
  chart.js (imported by /home/tim/sources/spinner-amax/ui/src/components/GraphOutput.vue?id=0)
  @cycjimmy/jsmpeg-player (imported by /home/tim/sources/spinner-amax/ui/src/components/VideoElement.vue?id=0)
  smoothie (imported by /home/tim/sources/spinner-amax/ui/src/components/ControlPanelSpinningDisk.vue?id=0)
```

npm install --save es6-promise
npm install --save vuex
npm install --save uuid
npm install --save axios 
npm install --save chart.js
npm install --save @cycjimmy/jsmpeg-player
npm install --save smoothie
