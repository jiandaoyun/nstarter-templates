# nstarter-ts-express

An Expressjs project template with Typescript for `nstarter`.

This is a backend oriented project template.

## Directory layout

```
.
├── template/               # Template project root.
│   ├── conf.d/             # Project config file template.
│   ├── public/             # Public resources for Web GUI.
│   │   ├── js/             # Scripts for browsers to use.
│   │   └── css/            # Style sheets.
│   ├── resources/          # Project service resource directory.
│   │   └── i18n/           # Internationalization textual data.
│   ├── src/                # Project source code directory.
│   │   ├── adapters/       # Connectors for 3rd party API.
│   │   ├── config/         # Configuration loader.
│   │   ├── constants/      # Shared project constants.
│   │   ├── cron_job/       # Cron job service.
│   │   ├── database/       # Database connector.
│   │   ├── errors/         # Shared error declaration.
│   │   ├── logger/         # Logger module.
│   │   ├── middlewares/    # Middleware extensions for Express.
│   │   ├── models/         # Database data structure model.
│   │   ├── routes/         # Express request routes.
│   │   ├── services/       # Service daemon.
│   │   ├── types/          # Typescript type extensions.
│   │   ├── utils/          # Shared project utility methods.
│   │   ├── websocket/      # Websocket module.
│   │   ├── app.ts          # Main app file.
│   │   └── server.ts       # Http server module of the Express project.
│   ├── test/               # Automated tests.
│   ├── temp/               # Temporary directory.
│   ├── tools/              # Project utilities for maintenance.
│   ├── views/              # View template files for Express.
│   ├── config.schema.json  # Project configuration check schema for IDE integrate.
│   ├── pm2.json            # PM2 process manger config file for starting server.
│   ├── tsconfig.json       # Typescript options for template project.
│   ├── tslint.json         # Tslint config for Typescript linting.
│   ├── package.json        # Npm configuration for project with dependencies and tools.
│   ├── LICENSE             # Project license template.
│   └── README.md           # Project readme template.
├── package.json            # Npm release opitons for template project.
├── module.conf.yml         # Template module description file for nstarter.
└── README.md
```

## Templating

For details to create `nstarter` template, please read more about [templating](./doc/templating.md).


## License

[MIT](./LICENSE)

----

Made on 🌍 with 💓.
