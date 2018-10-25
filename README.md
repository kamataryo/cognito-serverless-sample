# cognito-serverless-sample

## Developmental Dependencies

- Node.js > 8
- awscli
- direnv

## Configuration

1. Fill `.envrc`

   ```
   export PATH=$(npm bin):$PATH

   export AWS_ACCESS_KEY_ID=xxxx
   export AWS_SECRET_ACCESS_KEY=xxxx
   ```

2. Run `npm run setup` to create an user pool and it's client. you can specify stage like `npm run setup -- --stage dev`, or `npm run setup -- --stage v1`. Copy displayed user pool id, user pool client id, and identity pool id and append to `.envrc`

   ```
   export PATH=$(npm bin):$PATH

   export AWS_ACCESS_KEY_ID=xxxx
   export AWS_SECRET_ACCESS_KEY=xxxx

   SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_DEV=ap-northeast1_yyyy1
   SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_V1=ap-northeast1_yyyy2

   SAMPLE_APP_AWS_COGNITO_USER_POOL_CLIENT_ID_DEV=zzzz
   SAMPLE_APP_AWS_COGNITO_USER_POOL_CLIENT_ID_V1=zzzz

   SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_DEV=ap-northeast-1:wwww
   SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_V1=ap-northeast-1:wwww
   ```

3. After you have ran `npm run deploy` once, append the API Key obtained to `.envrc`

   ```
   $ sls info
   ...
   api keys:
     adminApiKey-v1: zzzz
   ...
   ```

```
export PATH=$(npm bin):$PATH

export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxxx

SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_DEV=ap-northeast1_yyyy1
SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_V1=ap-northeast1_yyyy2

SAMPLE_APP_AWS_COGNITO_USER_POOL_CLIENT_ID_DEV=zzzz
SAMPLE_APP_AWS_COGNITO_USER_POOL_CLIENT_ID_V1=zzzz

SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_DEV=ap-northeast-1:wwww
SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_V1=ap-northeast-1:wwww

SAMPLE_APP_ADMIN_API_KEY=zzzz
```

## Run API locally

```
$ npm start
```

## Deploy

```
$ npm install
$ npm run deploy
```

## Clean up

1. Serverless Framework

   ```shell
   $ sls remove
   ```

2. Remove AWS Cognito user pool manually

   ```shell
   # **ATTENTION** all the identity in the user pool will be cleared.
   $ aws cognito-idp delete-user-pool --user-pool-id $SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_DEV
   $ aws cognito-idp delete-user-pool --user-pool-id $SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_V1
   $ aws cognito-identity delete-identity-pool --identity-pool-id $SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_DEV
   $ aws cognito-identity delete-identity-pool --identity-pool-id $SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_V1
   ```
