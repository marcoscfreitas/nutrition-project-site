function somaCaloria() {
    // Valores nutricionais por grama de cada alimento
    var carboidratos_por_grama = {
        Arroz: 0.282,
        Feijão: 0.20,
        Pão: 0.50,
        Laranja: 0.1175,
        Carne: 0.00,  // Varia conforme o tipo de Carne
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

    // Quantidade consumida em gramas
    var gramas = {
        Arroz: +document.getElementById('gramaArroz').value,
        Feijão: +document.getElementById('gramaFeijao').value,
        Pão: +document.getElementById('gramaPao').value,
        Laranja: +document.getElementById('gramaLaranja').value,
        Carne: +document.getElementById('gramaCarne').value,
        Frango: +document.getElementById('gramaFrango').value,
        Ovo: +document.getElementById('gramaOvo').value,
        Café: +document.getElementById('gramaCafe').value,
        Banana: +document.getElementById('gramaBanana').value,
        Batata: +document.getElementById('gramaBatata').value
    };

    var calorias_por_alimento = {};

    // Calcular calorias ingeridas por cada alimento
    for (var alimento in gramas) {
        var carb = carboidratos_por_grama[alimento] * gramas[alimento];
        var prot = proteinas_por_grama[alimento] * gramas[alimento];
        var gord = gorduras_por_grama[alimento] * gramas[alimento];

        var calorias = (carb * 4) + (prot * 4) + (gord * 9);
        calorias_por_alimento[alimento] = calorias;
    }

    // Gerar gráfico de colunas para calorias ingeridas por cada alimento
    Highcharts.chart('container-column', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Calorias Ingeridas por Alimento'
        },
        xAxis: {
            categories: Object.keys(calorias_por_alimento)
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Calorias (kcal)'
            }
        },
        series: [{
            name: 'Calorias (kcal)',
            data: Object.values(calorias_por_alimento)
        }]
    });

    // Gerar gráficos de pizza para cada alimento
    var containerPies = document.getElementById('container-pies');
    containerPies.innerHTML = '';

    for (var alimento in gramas) {
        if (gramas[alimento] > 0) {
            var div = document.createElement('div');
            div.style.width = '23%';
            div.style.height = '300px';
            div.style.margin = '10px';

            containerPies.appendChild(div);

            Highcharts.chart(div, {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: alimento
                },
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
