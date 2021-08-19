## Documentação da aplicação

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

Execute API
`sudo docker run -p 5000:5000 kara-api`
