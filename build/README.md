# Build Assets

Este diretório contém os recursos necessários para a build da aplicação.

## Ícones Necessários

Para que a aplicação tenha ícones em todas as plataformas, você precisa adicionar os seguintes arquivos neste diretório:

### Windows
- **icon.ico** (256x256 pixels ou maior)
  - Formato: ICO
  - Pode ser criado usando ferramentas online como: https://convertio.co/png-ico/

### macOS
- **icon.icns** (512x512 pixels ou maior)
  - Formato: ICNS (Apple Icon Image)
  - Pode ser criado usando ferramentas como: https://cloudconvert.com/png-to-icns

### Linux
- **icon.png** (512x512 pixels)
  - Formato: PNG
  - Transparência é recomendada

## Como Criar os Ícones

1. Crie um ícone base em PNG com resolução de 1024x1024 pixels
2. Use ferramentas de conversão online para converter para os formatos necessários:
   - PNG → ICO (Windows)
   - PNG → ICNS (macOS)
   - PNG permanece como está (Linux)

## Ferramentas Úteis

- **Electron Icon Maker**: https://www.electron.build/icons
- **CloudConvert**: https://cloudconvert.com/
- **Convertio**: https://convertio.co/

## Nota

Se os ícones não estiverem presentes, o Electron usará o ícone padrão do Electron durante a build.
