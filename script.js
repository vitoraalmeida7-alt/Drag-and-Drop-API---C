
const listaPaises = [
    { nome: "Brasil 🇧🇷", continente: "America" },
    { nome: "Canadá 🇨🇦", continente: "America" },
    { nome: "França 🇫🇷", continente: "Europa" },
    { nome: "Itália 🇮🇹", continente: "Europa" },
    { nome: "Egito 🇪🇬", continente: "Africa" },
    { nome: "Quênia 🇰🇪", continente: "Africa" },
    { nome: "Japão 🇯🇵", continente: "Asia" },
    { nome: "China 🇨🇳", continente: "Asia" },
    { nome: "Austrália 🇦🇺", continente: "Oceania" },
    { nome: "Nova Zelândia 🇳🇿", continente: "Oceania" },
    { nome: "Antártida 🐧", continente: "Antartida" },
    { nome: "Argentina 🇦🇷", continente: "America" }
];

const areaPaises = document.getElementById("paises");
const areasContinentes = document.querySelectorAll(".continente");
const mensagem = document.getElementById("mensagem");

let paisArrastado = null;
let pontos = 0;
let acertos = 0;

function embaralhar(lista) {
    return lista.sort(() => Math.random() - 0.5);
}

function atualizarPlacar() {
    document.getElementById("pontos").textContent = pontos;
    document.getElementById("acertos").textContent = acertos;
    document.getElementById("restantes").textContent =
        listaPaises.length - acertos;
}

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = "mensagem";

    if (tipo) {
        mensagem.classList.add(tipo);
    }
}

function criarPaises() {
    areaPaises.innerHTML = "";

    embaralhar([...listaPaises]).forEach((pais, indice) => {
        const cartao = document.createElement("div");

        cartao.className = "pais";
        cartao.textContent = pais.nome;
        cartao.draggable = true;
        cartao.dataset.continente = pais.continente;
        cartao.dataset.nome = pais.nome;
        cartao.id = "pais-" + indice;
        cartao.dataset.resolvido = "false";

        cartao.addEventListener("dragstart", evento => {
            paisArrastado = cartao;

            cartao.classList.add("arrastando");

            evento.dataTransfer.effectAllowed = "move";
            evento.dataTransfer.setData("text/plain", cartao.id);
        });

        cartao.addEventListener("dragend", () => {
            cartao.classList.remove("arrastando");

            areasContinentes.forEach(area => {
                area.classList.remove("destacado");
            });

            paisArrastado = null;
        });

        areaPaises.appendChild(cartao);
    });
}

areasContinentes.forEach(area => {

    area.addEventListener("dragover", evento => {
        evento.preventDefault();

        evento.dataTransfer.dropEffect = "move";
        area.classList.add("destacado");
    });

    area.addEventListener("dragleave", evento => {
        if (!area.contains(evento.relatedTarget)) {
            area.classList.remove("destacado");
        }
    });

    // Verifica a resposta quando o cartão é solto.
    area.addEventListener("drop", evento => {
        evento.preventDefault();

        area.classList.remove("destacado");

        if (!paisArrastado) return;

        if (paisArrastado.dataset.resolvido === "true") return;

        const continenteCorreto =
            paisArrastado.dataset.continente;

        const continenteEscolhido =
            area.dataset.continente;

        if (continenteCorreto === continenteEscolhido) {

            // RESPOSTA CORRETA
            const etiqueta = document.createElement("div");

            etiqueta.className = "pais-resolvido";
            etiqueta.textContent = "✅ " + paisArrastado.dataset.nome;

            area.querySelector(".respostas").appendChild(etiqueta);

            paisArrastado.dataset.resolvido = "true";
            paisArrastado.remove();
            paisArrastado = null;

            pontos += 10;
            acertos++;

            area.classList.add("correto");

            mostrarMensagem(
                "🎉 Correto! Você ganhou 10 pontos!",
                "sucesso"
            );

            atualizarPlacar();

            setTimeout(() => {
                area.classList.remove("correto");
            }, 900);

            if (acertos === listaPaises.length) {
                mostrarMensagem(
                    "🏆 Parabéns! Você completou o jogo com " +
                    pontos + " pontos!",
                    "sucesso"
                );
            }

        } else {

            // RESPOSTA INCORRETA
            area.classList.add("errado");

            mostrarMensagem(
                "❌ Ops! " + paisArrastado.dataset.nome +
                " não pertence a esse continente. Tente novamente!",
                "erro"
            );

            setTimeout(() => {
                area.classList.remove("errado");
            }, 800);
        }
    });
});

document.getElementById("reiniciar").addEventListener("click", () => {
    pontos = 0;
    acertos = 0;

    areasContinentes.forEach(area => {
        area.querySelector(".respostas").innerHTML = "";
        area.classList.remove("correto", "errado", "destacado");
    });

    criarPaises();
    atualizarPlacar();

    mostrarMensagem(
        "Vamos jogar! Arraste um país para o continente correto."
    );
});

criarPaises();
atualizarPlacar();
