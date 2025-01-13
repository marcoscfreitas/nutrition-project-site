$(document).ready(function () {
    var graficoCriado = false; // variavel criada para verificar se grafico já foi criado

    $('#visualizacao').click(function () {
        somaCaloria(); // função para calcular as calorias de acordo com macronutrientes
        
        // exibe os elementos da parte 2 após botao de visualização ser criado
        $('#adicionar-refeicao').show();
        $('#tabelaRefeicoes').show();

        // verifica se foi criado para, e caso contrario inicia o gráfico para ser atualizado com as metas
        if (graficoCriado === false) {
            graficoMetasDiarias(); // chama o gráfico das metas diárias
            graficoCriado = true;
        }
    });

    $('#adicionar-refeicao').click(function () {
        adicionarRefeicao(); // função para adicionar refeição na tabela
        $('.input-food').val(''); // zera valores dos inputs
    });

    $('#confirmar-meta').click(function () {
        confirmarMetaDiaria(); // função para definir meta diária
    });
});


// variaveis globais com objetos para armazenar valores de carboidrato, proteina e gordura por grama
var gramas = {};
var carboidratos_por_grama = {
    Arroz: 0.282,
    Feijão: 0.20,
    Pão: 0.50,
    Laranja: 0.1175,
    Carne: 0.00,
    Frango: 0.00,
    Ovo: 0.0072,
    Café: 0.00,
    Banana: 0.2284,
    Batata: 0.1758
};
var proteinas_por_grama = {
    Arroz: 0.027,
    Feijão: 0.09,
    Pão: 0.09,
    Laranja: 0.0094,
    Carne: 0.26,
    Frango: 0.31,
    Ovo: 0.13,
    Café: 0.00,
    Banana: 0.0109,
    Batata: 0.0202
};
var gorduras_por_grama = {
    Arroz: 0.003,
    Feijão: 0.005,
    Pão: 0.005,
    Laranja: 0.0012,
    Carne: 0.20,
    Frango: 0.036,
    Ovo: 0.10,
    Café: 0.00,
    Banana: 0.0033,
    Batata: 0.001
};

// variavel globais com objetos para armazenar metas e também consumo diario
var metaDiaria = {
    carboidratos: 0,
    proteinas: 0,
    gorduras: 0
};
var consumoDiario = []; // % da meta cumprida
var graficoLinhas; // grafico highcharts

// grafico da meta diaria
function graficoMetasDiarias() {
    graficoLinhas = Highcharts.chart('container-chart-table', {
        chart: { type: 'line' },
        title: { text: 'Meta Diária em %' },
        xAxis: {
            categories: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
            title: { text: 'Dias da Semana' }
        },
        yAxis: {
            title: { text: 'Porcentagem (%)' },
            max: 100,
            min: 0
        },
        series: [
            { name: 'Carboidratos', data: [] },
            { name: 'Proteínas', data: [] },
            { name: 'Gorduras', data: [] }
        ]
    });
}

// função para confirmar e atualizar as metas diarias caso desejado
function confirmarMetaDiaria() {
    metaDiaria.carboidratos = +$('#meta-carboidratos').val();
    metaDiaria.proteinas = +$('#meta-proteinas').val();
    metaDiaria.gorduras = +$('#meta-gorduras').val();

    // verificador para inserir valores positivos para meta diaria
    if (metaDiaria.carboidratos > 0 && metaDiaria.proteinas > 0 && metaDiaria.gorduras > 0) {
        alert('Meta diária atualizada!');
    } else {
        alert('Por favor, insira valores válidos para as metas diárias.');
    }
}

// função para calcular as calorias e gerar os gráficos
function somaCaloria() {
    gramas = {
        Arroz: +$('#gramaArroz').val(),
        Feijão: +$('#gramaFeijao').val(),
        Pão: +$('#gramaPao').val(),
        Laranja: +$('#gramaLaranja').val(),
        Carne: +$('#gramaCarne').val(),
        Frango: +$('#gramaFrango').val(),
        Ovo: +$('#gramaOvo').val(),
        Café: +$('#gramaCafe').val(),
        Banana: +$('#gramaBanana').val(),
        Batata: +$('#gramaBatata').val()
    };

    var calorias_por_alimento = {};  // dicionario para armazenar calorias de todos alimentos

    for (var alimento in gramas) { // for para chamar variavel global e multiplicar pelas gramas inseridas
        var carb = carboidratos_por_grama[alimento] * gramas[alimento];
        var prot = proteinas_por_grama[alimento] * gramas[alimento];
        var gord = gorduras_por_grama[alimento] * gramas[alimento];

        var calorias = (carb * 4) + (prot * 4) + (gord * 9);
        calorias_por_alimento[alimento] = calorias; // adiciona caloria respectiva a cada alimento
    }

    Highcharts.chart('container-column', {
        chart: { type: 'column' },
        title: { text: 'Calorias Ingeridas por Alimento' },
        xAxis: { categories: Object.keys(calorias_por_alimento) },
        yAxis: {
            min: 0,
            title: { text: 'Calorias (kcal)' }
        },
        series: [{
            name: 'Calorias (kcal)',
            data: Object.values(calorias_por_alimento)
        }]
    });

    var containerPies = $('#container-pies'); // cria também gráfico pie para cada alimento
    containerPies.empty(); // atualizar graficos a cada refeição nova visualizada

    for (var alimento in gramas) {
        if (gramas[alimento] > 0) { // apenas cria grafico pie para alimentos inseridos
            var div = $('<div></div>').css({ // cria uma div para cada alimento
                width: '23%', height: '300px', margin: '10px'
            });
            containerPies.append(div); // insere na div o gráfico pie

            Highcharts.chart(div[0], {
                chart: { type: 'pie' },
                title: { text: alimento },
                series: [{
                    name: 'Macronutrientes',
                    data: [
                        { name: 'Carboidratos', y: carboidratos_por_grama[alimento] * gramas[alimento] },
                        { name: 'Proteínas', y: proteinas_por_grama[alimento] * gramas[alimento] },
                        { name: 'Gorduras', y: gorduras_por_grama[alimento] * gramas[alimento] }
                    ]
                }]
            });
        }
    }
}

// atualiza o grafico das metas diaria com cada refeição adicionada
function atualizarGraficoMetasDiarias() {
    var totalCarboidratos = 0, totalProteinas = 0, totalGorduras = 0; // reseta para cada uso

    for (var alimento in gramas) {
        totalCarboidratos += carboidratos_por_grama[alimento] * gramas[alimento];
        totalProteinas += proteinas_por_grama[alimento] * gramas[alimento];
        totalGorduras += gorduras_por_grama[alimento] * gramas[alimento];
    }
    //math.min para as % nao ultrapassarem de 100% e "estragar" o gráfico
    var porcentagemCarboidratos = Math.min((totalCarboidratos / metaDiaria.carboidratos) * 100, 100);
    var porcentagemProteinas = Math.min((totalProteinas / metaDiaria.proteinas) * 100, 100);
    var porcentagemGorduras = Math.min((totalGorduras / metaDiaria.gorduras) * 100, 100);

    consumoDiario.push({ // adiciona as % consumidas da meta ao vetor de consumo diario
        carboidratos: porcentagemCarboidratos,
        proteinas: porcentagemProteinas,
        gorduras: porcentagemGorduras
    });

    var contDias = consumoDiario.length - 1; // inicia contDias como limitador para atualizar o gráfico de meta

    if (contDias < 5) { // quando ultrapassa 5 dias, para de atualizar o gráfico
        graficoLinhas.series[0].addPoint(porcentagemCarboidratos);
        graficoLinhas.series[1].addPoint(porcentagemProteinas);
        graficoLinhas.series[2].addPoint(porcentagemGorduras);
    }
}

// função para adicionar a refeição na tabela e atualizar o gráfico de meta
function adicionarRefeicao() {
    var totalCarboidratos = 0, totalProteinas = 0, totalGorduras = 0; // reseta para cada uso

    for (var alimento in gramas) {
        if (gramas[alimento] > 0) { // se o alimento for inserido, soma nas variaveis de contagem para add na tabela
            totalCarboidratos += carboidratos_por_grama[alimento] * gramas[alimento];
            totalProteinas += proteinas_por_grama[alimento] * gramas[alimento];
            totalGorduras += gorduras_por_grama[alimento] * gramas[alimento];
        }
    }

    var linhaVazia = $('#tabelaRefeicoes tbody tr:has(td:empty)').first(); // seleciona os tr da tabela e filtra linhas que tem pelo menos um td vazio, first serve para que somente a primeira linha seja selecionada
    if (linhaVazia.length > 0) { // se for encontrada uma linha vazia, adiciona os valores, caso contrario já estão preenchidas
        linhaVazia.find('td:eq(1)').text(totalCarboidratos.toFixed(2)); // usa o find para encontrar celulas td e os eq para dizer qual celula dentro do td
        linhaVazia.find('td:eq(2)').text(totalProteinas.toFixed(2));
        linhaVazia.find('td:eq(3)').text(totalGorduras.toFixed(2));

        // atualiza o gráfico de linhas
        atualizarGraficoMetasDiarias();
    } else {
        alert('Todas as refeições para a semana já foram adicionadas.'); 
    }
}

function returnTop() { // função para back to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    };