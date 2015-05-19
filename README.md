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
gulp develop
```

#### Create module using a template
```bash
gulp create-module --name login --template material
gulp develop
```
Available templates
- basic
- material


#### Remove module
```bash
gulp remove-module --name login
gulp develop
```
