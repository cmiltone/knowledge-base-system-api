# knowledge-base-system-api
The backend for Agriculture Knowledge base System

# Intro
An application than shares knowledge to farmers Deployed at [https://app.hagak.tech](https://app.hagak.tech)

Blog Link [https://insightsbycmiltone.blogspot.com/2023/11/agriculture-knowledge-base-system.html](https://insightsbycmiltone.blogspot.com/2023/11/agriculture-knowledge-base-system.html)

Authors: 
- Hamiltone Agak <castromiltone@gmail.com>, https://linkedin.com/in/cmiltoen

## Running the app

1. Add a file named `ecosystem.config.js` with the following content:
```
    exports.apps = [
        {
            name: 'node-express',
            script: './build/app.js',
            instances: 'max',
            exec_mode: 'cluster',
            max_memory_restart: '4G',
            node_args: '--max_old_space_size=4096',
        },
    ];   
```

2. Add a `.env` file with the following variables:
    - `SERVER_PORT=8800`
    - `NODE_ENV='development'`
    - `JWT_SECRET='Z2xmw0PnK7XK53ZBfhNCTeHmKwAxdanj'`
    - `JWT_EXPIRY='1d'`

3. Install dependencies:
    - `yarn`

4. Run the app in production(this assumes you have [pm2](https://pm2.keymetrics.io/) installed globally):
    - `yarn serve`

## License
MIT
