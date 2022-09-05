# ESCALONADORES AUTOMÁTICOS EM PODS COMO FERRAMENTA DE MITIGAÇÃO DE ATAQUES DDOS DESTINADOS A MICROSSERVIÇOS

Esse projeto foi desenvolvido com:

- [Node.js](https://nodejs.org/en/) na versão 16.14.2
- [React](https://github.com/facebook/react) version 18.1.0
- [postgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) version 20.10.14
- [Kubernetes](https://kubernetes.io/pt-br/) version 4.5.4

## 💻 Projeto

Este trabalho propõe-se a avaliar o uso de mecanismos nativos de nuvem na mitigação de ataques destinados à uma aplicação web baseada em microsserviços e um banco de dados SQL. Para para o setup de experimentação, foram definidos dois modos de ataque DDoS na camada 7 do modelo OSI. Estudou-se como os escalonadores do Kubernetes podem reagir (i. e., via escalonamento vertical ou horizontal) em sendo, tais mecanismos, disparados por métricas diferentes, a saber: i) Horizontal Pod Autoscaling (HPA) utilizando número de solicitações de acesso HTTP, ii)  Horizontal Pod Autoscaling (HPA) utilizando as métricas memória ou iii) Vertical Pod Autoscaling (VPA) utilizando as métricas memória e CPU. A métrica de tempo de resposta da aplicação (i. e., "latência" do ponto de vista de acesso ao serviço pelo cliente) foi utilizada para comparação entre os cenários estudados. Fez-se uso do Prometheus (em conjunto com o Grafana) como modelo de monitoramento (e visualização). No contexto analisado, como resultado foi observado que a utilização do Escalonador Automático Vertical de Pod com limites definidos de CPU e memória trouxe uma mitigação mais efetiva dos ataques de DDoS considerados. Monografia: TCC Dayane Silva Erlacher Castro.pdf.

## 🏁 Cada diretório

### graficos/

Através da biblioteca plotly-2.13.2 foram gerados todos os gráficos para o trabalho de conclusão de curso, este diretório contém o .html para geração dos gráficos.

### infos/

**db/access.txt**
Contém usuário e senha utilizados

**db/criacao-banco.txt**
Todos os comandos desde a criação do container até toda a configuração necessário no banco de dados

**setup/backend/**
Diretório de Back-End

**docker-node-image.txt**
Criação de imagem base node

**shortcuts.txt**
Comandos bastante utilizados

### kubernetes/

**🛠️ Build Kubernetes**
Arquivos de setup YAML. Nomes dos diretórios são sugestivos.

## 📝 Licença

This project is under license from MIT. See the [LICENSE](LICENSE) file for more details
