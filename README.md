# Casamento — Iveth Almeida & Yola Carmelino

Convite digital inicial feito com React + Vite.

## Como executar no Windows CMD

1. Abre o CMD.
2. Entra na pasta do projeto:
   `cd /d C:\Users\DELL\Downloads\CASAMENTO_IVETH_YOLA`
3. Instala as dependências:
   `npm install`
4. Inicia o site:
   `npm run dev`
5. Abre no navegador o endereço indicado pelo Vite, normalmente:
   `http://localhost:5173`

## Personalizar a fotografia

Substitui `public/casal-placeholder.svg` por uma fotografia dos noivos chamada `casal.jpg`.
Depois, em `src/App.css`, procura todas as ocorrências de:

`url("/casal-placeholder.svg")`

e troca por:

`url("/casal.jpg")`

## Informação ainda por confirmar

A data, o horário e o local estão como “A anunciar”. Devem ser atualizados quando os noivos fornecerem os dados oficiais.

## Nota importante

O formulário nesta primeira versão demonstra a navegação e a experiência visual. Ainda não envia nem guarda confirmações numa base de dados. O painel administrativo e a integração de armazenamento serão construídos numa etapa posterior.
