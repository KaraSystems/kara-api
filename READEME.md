## Documentação da aplicação

# New Tag version

Generate new tag version
`git tag -m "0.0.0" -a "0.0.0"`

Send tags to git
`git push --follow-tags`

# Testes

Executar os testes enquanto desenvolve
`npm run test:unit`

Executar os testes uma vez
`npm test`

# MongoDb

Intalação MongoDb
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

executar serviço `sudo systemctl start mongod`
acessar bases `mongo`

# Docker

Build API
`sudo docker build -t kara-api .`
`sudo docker-compose build`
`npm run up`

Execute API
`sudo docker run -p 5000:5000 kara-api`

# Debug

Criar o arquivo `launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Docker: Attach to Node",
      "remoteRoot": "/usr/application/kara-api",
      "port": 9222,
      "restart": true
    }
  ]
}
```
