Dashup Module Email
&middot;
[![Latest Github release](https://img.shields.io/github/release/dashup/module-email.svg)](https://github.com/dashup/module-email/releases/latest)
=====

A connect interface for email on [dashup](https://dashup.io).

## Contents
* [Get Started](#get-started)
* [Connect interface](#connect)

## Get Started

This email connector adds sms actions to Dashup flows:

```json
{
  "url" : "https://dashup.io",
  "key" : "[dashup module key here]",

  "domain" : "[mailgun domain here]",
  "apiKey" : "[mailgun api key here]"
}
```

To start the connection to dashup:

`npm run start`

## Deployment

1. `docker build -t dashup/module-email .`
2. `docker run -d -v /path/to/.dashup.json:/usr/src/module/.dashup.json dashup/module-email`