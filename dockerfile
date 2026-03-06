# 1. Usa uma imagem oficial do Node (versão leve 'alpine')
FROM node:20-alpine

# 2. Define a pasta de trabalho dentro do contêiner
WORKDIR /usr/src/app

# 3. Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# 4. Copia o resto do projeto (incluindo a pasta src e tsconfig)
COPY . .

# 5. Compila o TypeScript gerando a pasta dist lá dentro do contêiner
RUN npx tsc

# 6. Expõe a porta que a API usa
EXPOSE 3000

# 7. Comando para iniciar o servidor compilado
# Atenção: Ajustei o caminho para "dist/app/app.js" baseado na sua estrutura de pastas!
CMD ["node", "dist/app/app.js"]