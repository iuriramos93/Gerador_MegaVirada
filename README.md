# 🎰 Gerador de Apostas Mega da Virada

Aplicação desktop em ElectronJS para gerar combinações de apostas para a Mega da Virada baseadas em um conjunto de números escolhidos pelo usuário.

## 📋 Funcionalidades

✨ **Entrada Intuitiva de Números**
- Digite seus números favoritos (1-60)
- Validação em tempo real
- Suporte para entrada separada por vírgula ou espaço

🎲 **Geração Inteligente de Combinações**
- Algoritmo matemático de combinação C(n,6)
- Geração completa ou amostragem aleatória
- Cálculo automático do máximo de combinações possíveis

📊 **Visualização Clara**
- Interface moderna com tema dark
- Números formatados em estilo de volante
- Numeração automática dos jogos

💾 **Exportação e Impressão**
- Exportar para CSV (compatível com Excel)
- Impressão otimizada dos jogos
- Formatação pronta para uso

## 🚀 Como Usar

### Instalação

1. Clone ou baixe este repositório
2. Instale as dependências:
```bash
npm install
```

### Executar em Modo Desenvolvimento

```bash
npm start
```

ou com DevTools aberto:

```bash
npm run dev
```

### Gerar Executável

Para criar um instalador Windows:

```bash
npm run build
```

O instalador será gerado na pasta `dist/`.

## 📖 Guia de Uso

1. **Digite seus números**: No campo de entrada, digite os números de 1 a 60 que deseja usar como base
   - Exemplo: `05, 12, 23, 30, 45, 51, 52, 53, 58, 60`
   - Mínimo: 6 números
   - Recomendado: até 20 números

2. **Defina a quantidade**: Escolha quantos jogos deseja gerar
   - O sistema mostra o máximo possível automaticamente
   - Exemplo: 10 números = 210 combinações possíveis

3. **Gere as apostas**: Clique em "Gerar Apostas"
   - Processamento rápido (< 3 segundos para até 10.000 combinações)
   - Visualização imediata dos resultados

4. **Exporte ou Imprima**:
   - **CSV**: Salve para abrir no Excel ou Calc
   - **Imprimir**: Imprima diretamente os jogos

## 🎯 Regras da Mega da Virada

- **Números válidos**: 1 a 60
- **Números por jogo**: 6
- **Mínimo para entrada**: 6 números
- **Máximo recomendado**: 20 números

## 💡 Exemplos

### Exemplo 1: Todos os jogos possíveis
- **Entrada**: 10 números (ex: 05, 12, 23, 30, 45, 51, 52, 53, 58, 60)
- **Combinações possíveis**: 210
- **Ação**: Gerar todos os 210 jogos

### Exemplo 2: Amostragem
- **Entrada**: 15 números
- **Combinações possíveis**: 5.005
- **Ação**: Solicitar apenas 100 jogos
- **Resultado**: 100 jogos aleatórios únicos

## 🛠️ Tecnologias

- **ElectronJS** v28 - Framework desktop
- **HTML/CSS/JavaScript** - Interface vanilla (sem frameworks extras)
- **Node.js** - Backend e manipulação de arquivos

## 📁 Estrutura do Projeto

```
Gerador_MegaVirada/
├── main.js           # Processo principal do Electron
├── renderer.js       # Lógica da interface e algoritmo
├── index.html        # Estrutura HTML
├── styles.css        # Estilos modernos
├── package.json      # Configuração do projeto
└── README.md         # Este arquivo
```

## 🧮 Algoritmo de Combinação

O aplicativo utiliza um algoritmo matemático eficiente para gerar combinações:

- **Cálculo**: C(n, 6) = n! / (6! × (n-6)!)
- **Método**: Gerador iterativo com índices
- **Otimização**: Para grandes conjuntos, usa amostragem aleatória

## ⚡ Performance

- 10 números (210 combinações): < 0.5s
- 15 números (5.005 combinações): < 1s
- 20 números (38.760 combinações): < 3s

## 📝 Notas

- Os números são sempre ordenados automaticamente
- Duplicatas são detectadas e removidas
- Números fora do intervalo [1-60] são rejeitados
- A interface é responsiva e funciona em diferentes resoluções

## 🍀 Boa Sorte!

Este é um gerador de combinações para fins de organização de apostas. Lembre-se de que a loteria é um jogo de probabilidade e deve ser jogado com responsabilidade.

---

Desenvolvido com ❤️ para a Mega da Virada
