# Diretrizes do Projeto Crediário System

## Regra de Git Commit & Push
- **NUNCA** execute `git commit` ou `git push` de forma autônoma.
- **SEMPRE** pergunte ao usuário se ele deseja fazer o commit e o push após a conclusão das tarefas de qualquer prompt.
- Aguarde a resposta afirmativa do usuário antes de rodar os comandos de versionamento.

## Regra de Branches (Git Flow)
- **NUNCA** faça commit ou push direto na branch `main`.
- Todos os commits e desenvolvimentos devem ser realizados **obrigatoriamente na branch `develop`**.
- O merge de `develop` para `main` só deve ocorrer após os testes e validações estarem concluídos e aprovados pelo usuário.

## Regra de Segurança do Banco de Dados (Produção em Uso)
- **NUNCA** execute comandos que apaguem, resetem ou limpem dados ou tabelas do banco de dados (`DELETE`, `TRUNCATE`, `DROP`, `prisma migrate reset`, scripts de limpeza, etc.) de forma autônoma.
- **NENHUM** dado ou registro pode ser apagado sem consulta prévia detalhada e uma confirmação expressa e clara do usuário permitindo a ação.
- Qualquer alteração de schema ou migração deve ser estritamente retrocompatível e garantir preservação total dos dados (zero data loss).
