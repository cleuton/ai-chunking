// Texto de exemplo usado pra demonstrar as tres estrategias.
// Ele tem dois assuntos diferentes (financeiro e lancamento de produto)
// e varios pronomes que so fazem sentido dentro do paragrafo certo -
// isso ajuda a mostrar a diferenca entre as estrategias na pratica.

export const sampleText = `A empresa Nortex encerrou o terceiro trimestre de 2025 com receita de 42 milhoes de reais, um crescimento de 18% em relacao ao trimestre anterior. Esse resultado foi puxado principalmente pela divisao de software, que respondeu por 60% do faturamento total. A margem operacional tambem melhorou, passando de 12% para 15% no periodo.

O crescimento da receita foi impulsionado por dois fatores principais: a renovacao de contratos com clientes corporativos e a entrada em dois novos mercados na America Latina. Ela tambem se beneficiou da queda no custo de aquisicao de clientes, que caiu 22% depois da reestruturacao da equipe de vendas feita no inicio do ano.

Em outubro, a Nortex lancou o Fluxo, um novo produto de automacao de processos voltado para empresas de medio porte. Ele foi desenvolvido ao longo de oito meses por um time de 14 engenheiros e passou por um periodo de testes fechados com 30 clientes selecionados antes do lancamento publico.

O Fluxo se diferencia dos concorrentes por permitir integracao direta com planilhas e sistemas legados sem exigir conhecimento de programacao. Isso foi apontado pelos clientes do teste fechado como o principal motivo para adocao, especialmente entre empresas que ainda usam processos manuais em areas financeiras e de operacoes.

Nos primeiros trinta dias apos o lancamento, o produto ja havia sido adotado por 340 empresas, superando a meta interna que era de 200 empresas no mesmo periodo. A equipe de produto atribui esse resultado a uma campanha de lancamento feita em parceria com influenciadores do setor de tecnologia empresarial.

Para o quarto trimestre, a Nortex espera manter o ritmo de crescimento, com a expectativa de fechar o ano com receita total acima de 160 milhoes de reais. A empresa tambem planeja abrir um escritorio na Colombia no inicio de 2026 para apoiar a expansao regional que comecou neste trimestre.`;

// Pergunta de exemplo usada pra testar a busca. Note que ela usa
// "ele" para se referir ao produto, sem citar o nome "Fluxo" -
// e um bom teste pra ver quais estrategias preservam essa referencia.
export const sampleQuery = "O que fez o produto novo ser adotado tao rapido pelos clientes?";
