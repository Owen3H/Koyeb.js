## <img align="left" width="132" height="34.3" src="https://www.koyeb.com/_next/image?url=%2Fstatic%2Fimages%2Fkoyeb-logo-white.svg&w=128&q=75">.js

An unofficial wrapper for the Koyeb REST API, enabling you to interact with apps, services and more.<br> Designed to have a simple, intuitive syntax using asynchronous functions.<br>

> This package depends on [Undici](https://npmjs.com/package/undici), a modern HTTP client with a very fast request implementation.

## Features
  <details>
  <summary>🟩 Completed</summary>

  - **Service control** (resume, pause, re-deploy)<br>
  - **Get a list of services and apps**<br>
  - **Support for multiple apps using classes**<br>
  - **Execute commands on an instance**
  </details>

  <details>
  <summary>🟨 In Progress</summary>

  - Deployment & related methods<br>
  - More instance methods (get, latest, list)
  </details>

  <details>
  <summary>🟥 Not Implemented / Future Ideas</summary>

  - Metrics <br>
  - Logs <br>
  - Secrets
  </details>

## Install and import
```bash
npm i koyeb.js
```

```js
import Koyeb from 'koyeb.js'
// Support for CommonJS coming soon!
```

### Initialize an App
```js
const myApp = await new Koyeb.App('accountAuthToken').fromName('appName')

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
const myInstance = await new Koyeb.Instance('accountAuthToken').latest('appID')

// Or get a specific instance by its ID.
const myInstance = await new Koyeb.Instance('accountAuthToken').get('instanceID')
```

### Execute commands
```js

// Returns a promise containing the command result.
const ls = await instance.executeCommand({ command: ['ls'] })

// You can also pass 3 optional keys (ttyWidth, ttyHeight, data) into the object.
// More info here -> https://www.koyeb.com/docs/api#operation/ExecCommand

// This example outputs a list of files & directories on the instance.
console.log(ls) 
```