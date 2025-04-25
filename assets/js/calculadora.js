function nextStep(current) {
    document.getElementById(`step-${current}`).classList.add('hidden');
    document.getElementById(`step-${current + 1}`).classList.remove('hidden');

    const progress = document.getElementById('progress');
    if (current === 1) {
        progress.style.width = '33%';
    } else if (current === 2) {
        progress.style.width = '66%';
    } else if (current === 3) {
        progress.style.width = '100%';
    }
}

function resetForm() {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(el => el.classList.add('hidden'));
    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('beer-form').reset();
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('progress').style.width = '0%';
}

function calcularCerveja() {
    const convidados = parseInt(document.getElementById('guests').value);
    const consumo = parseFloat(document.getElementById('consumo').value);
    const duracao = parseInt(document.getElementById('duracao').value);
    const periodo = document.getElementById('periodo').value;
    const clima = parseFloat(document.getElementById('clima').value);
    const outrasBebidas = parseFloat(document.getElementById('outras-bebidas').value);

    const baseConsumoHora = 0.6; // Base de 500ml por hora
    let ajustePeriodo = (periodo === 'dia') ? 1.1 : 1.0;
    let fatorDuracao = duracao;
    if (duracao > 5) {
        fatorDuracao = duracao * 0.9;
    }

    const litrosPorPessoa = baseConsumoHora * consumo * fatorDuracao * ajustePeriodo * clima * outrasBebidas;
    const litrosTotais = convidados * litrosPorPessoa;
    const litrosTotaisArredondado = Math.ceil(litrosTotais); // Arredonda pra cima para não faltar

    let mensagem = `<p>🧮 Você vai precisar de aproximadamente <strong>${litrosTotaisArredondado}L</strong> de cerveja.</p>`;

    if (litrosTotaisArredondado <= 18) {
        mensagem += `<p>👉 Sugestão: ${litrosTotaisArredondado} growlers de 1L 🍶</p>`;
    } else {
        // Novo cálculo de barris, mais inteligente
        let litrosRestantes = litrosTotaisArredondado;
        let barris50 = 0;
        let barris30 = 0;
        let barris19 = 0;

        // Priorizar 50L
        barris50 = Math.floor(litrosRestantes / 50);
        litrosRestantes -= barris50 * 50;

        // Priorizar 30L depois
        if (litrosRestantes >= 25) {
            barris30 = Math.floor(litrosRestantes / 30);
            litrosRestantes -= barris30 * 30;
        }

        // Se ainda restar algo, avaliar se 1 barril de 30L resolve melhor que dois de 19L
        if (litrosRestantes > 18) {
            barris30 += 1;
            litrosRestantes = 0;
        } else if (litrosRestantes > 0) {
            barris19 = Math.ceil(litrosRestantes / 19);
            litrosRestantes = 0;
        }

        mensagem += `<p>👉 Sugestão de barris:</p><ul>`;
        if (barris50 > 0) mensagem += `<li>${barris50} barril(is) de 50L 🛢️</li>`;
        if (barris30 > 0) mensagem += `<li>${barris30} barril(is) de 30L 🛢️</li>`;
        if (barris19 > 0) mensagem += `<li>${barris19} barril(is) de 19L 🛢️</li>`;
        mensagem += `</ul>`;
    }

    // Link para pedido no WhatsApp
    const textoPedido = encodeURIComponent(`Olá! Gostaria de fazer um pedido de cerveja para meu evento. Preciso de aproximadamente ${litrosTotaisArredondado}L de cerveja. Podem me ajudar? 🍻`);
    const linkWhatsApp = `https://wa.me/+556296054989?text=${textoPedido}`;

    mensagem += `<p><a href="${linkWhatsApp}" target="_blank" class="button primary">📲 Fazer pedido no WhatsApp</a></p>`;

    document.getElementById('resultado').innerHTML = mensagem;

    nextStep(3); // Avança para o resultado
}


