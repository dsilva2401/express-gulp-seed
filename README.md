# express-gulp-seed

An easy way to start with express mvc using gulp

```bash
mkdir my-app
cd my-app
git clone https://github.com/dsilva2401/express-gulp-seed.git .
npm install
bower install
gulp develop
```

#### Create module
```bash
gulp create-module --name login
```

#### Create module using a template
```bash
gulp create-module --name login --template material
```
Available templates
- basic
- material

#### Remove module
```bash
gulp remove-module --name login
```

#### Create model
```bash
gulp create-model --name User
```

#### Remove model
```bash
gulp remove-model --name User
```

#### Install plugin
```bash
gulp install-plugin --name plugin-name
```

#### List available plugins
```bash
gulp install-plugin
```

#### Remove plugin
```bash
gulp remove-plugin --name plugin-name
```
