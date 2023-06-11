<div align="left">
  <a href="https://koyeb.com/docs/api">
    <img align="left" src="https://www.koyeb.com/static/images/icons/koyeb.svg" alt="Logo" width="80" height="80">
  </a>
  <h2 align="left">Koyeb.js</h2>
  
  [![Github Repo Size](https://img.shields.io/github/repo-size/Owen3H/Koyeb.js?label=Repository%20Size&logo=Github)](https://github.com/Owen3H/Koyeb.js) 
  [![Codacy Badge](https://app.codacy.com/project/badge/Grade/77a5d15fa73d426c8210e8606a357e73)](https://app.codacy.com/gh/Owen3H/Koyeb.js/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
</div>

An *unofficial* wrapper for the [Koyeb REST API](https://koyeb.com/docs/api), enabling you to interact with apps, services and more.<br> Designed to have a simple, intuitive syntax using asynchronous functions.<br>
  
> This package depends on [Undici](https://npmjs.com/package/undici), a modern HTTP client with a very fast request implementation.

## Features
  <details>
  <summary>🟩 Completed</summary>

  - **Service control** (resume, pause, re-deploy)<br>
  - **Get a list of services and apps**<br>
  - **Support for multiple apps using classes**<br>
  - **Get a specific instance, or the latest**<br>
  - **Execute commands on an instance**
  </details>

  <details>
  <summary>🟨 In Progress</summary>

  - Deployment & related methods<br>
  - Finish instance & service<br>
  - Metrics
  </details>

  <details>
  <summary>🟥 Not Implemented / Future Ideas</summary>
  
  - Logs <br>
  - Secrets
  </details>

## Install & Import
```bash
npm i koyeb.js
```

```js
// ESM (Supports top-level await)
import * as Koyeb from 'koyeb.js'

// or
const Koyeb = require('koyeb.js')
```

### Secure your Auth Token
1. Head to Account ➟ API
2. Create a new access token and copy the generated string.
3. Head to your app settings ➟ Environment Variables ➟ Add Variable
4. Name the variable `AUTH_TOKEN` and paste your copied token in the 'value' field.
5. Hit 'Apply'. You can now access your token without exposing it to others!

```js
const token = process.env.AUTH_TOKEN
```

### Initialize an App
```js
const myApp = await new Koyeb.App(token).fromName('appName')

// Alternatively, you can replace fromName with 2 other methods.
.fromID('13j25-4323b2-671f') // The ID of the application.
.fromIndex(0) // The index of the app in your app list.
```

### Service creation and control
```js
// Here we create a service from the first in the app list.
const services = await myApp.listServices(),
      service = new Koyeb.Service(services[0].id, token)

console.log(service.paused()) // Calls status() internally and returns a true if we received 'PAUSED'.
console.log(service.status()) // Calls info() internally and returns a string.
console.log(service.info()) // Returns a JSON object.

// Each will return true/false if the request succeeded/failed.
// Calling resume/pause when already running/paused will return false.
await service.redeploy()
await service.resume()
await service.pause()
```

### Get an Instance
```js
// Returns the application's current instance.
const myInstance = await new Koyeb.Instance(appID, token).latest()

// Or get a specific instance by its ID.
const myInstance = await new Koyeb.Instance.get(instanceID, token)
```

### Execute commands
```js
// Returns a promise containing the command result.
// This example outputs a list of files & directories on the instance.
const ls = await instance.executeCommand({ command: ['ls'] })
console.log(ls)

// You can also pass 3 optional keys (ttyWidth, ttyHeight, data).
// More info -> https://www.koyeb.com/docs/api#operation/ExecCommand
```
