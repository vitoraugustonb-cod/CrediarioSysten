# Diretrizes do Projeto Crediário System

## Regra de Git Commit & Push
- **NUNCA** execute `git commit` ou `git push` de forma autônoma.
- **SEMPRE** pergunte ao usuário se ele deseja fazer o commit e o push após a conclusão das tarefas de qualquer prompt.
- Aguarde a resposta afirmativa do usuário antes de rodar os comandos de versionamento.

## Regra de Branches (Git Flow)
- **NUNCA** faça commit ou push direto na branch `main`.
- Todos os commits e desenvolvimentos devem ser realizados **obrigatoriamente na branch `develop`**.
- O merge de `develop` para `main` só deve ocorrer após os testes e validações estarem concluídos e aprovados pelo usuário.
