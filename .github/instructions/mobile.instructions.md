---
applyTo: ["src/**/*.{ts,tsx}", "metro.config.js", "babel.config.js"]
---
# Instruções Mobile (React Native / Expo)

- Não alterar versões de dependências (`package.json`, Gradle, Pods) sem justificativa técnica robusta e aprovada.
- Preservar configurações nativas geradas pelo Expo.
- Evitar edição de arquivos auto-gerados (`ios/`, `android/`) a menos que estritamente necessário.
- Verificar consistência de aliases (`babel-plugin-module-resolver`) ao adicionar novas pastas.
- Priorizar `lucide-react-native` para ícones.
- Validar `RootStackParamList` ao adicionar novas telas de navegação.
- Não refatorar componentes de UI (`src/ui/`) a menos que solicitado.
