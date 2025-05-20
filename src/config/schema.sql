CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nome_negocio VARCHAR(100),
    moeda VARCHAR(10),
    idioma VARCHAR(10) DEFAULT 'pt',
    tema_visual VARCHAR(10) DEFAULT 'claro'
);

CREATE TABLE movimentacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(10) CHECK (tipo IN ('entrada','saida')) NOT NULL,
    valor NUMERIC(12,2) NOT NULL,
    data DATE NOT NULL,
    categoria VARCHAR(50),
    descricao TEXT
);

CREATE TABLE simulacoes_juros (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    valor_inicial NUMERIC(12,2) NOT NULL,
    aporte_mensal NUMERIC(12,2),
    taxa_juros NUMERIC(5,2) NOT NULL,
    tempo_meses INT NOT NULL,
    montante_final NUMERIC(12,2)
);

CREATE TABLE simulacoes_amortizacao (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(10) CHECK (tipo IN ('SAC','PRICE')) NOT NULL,
    valor_emprestimo NUMERIC(12,2) NOT NULL,
    taxa_juros NUMERIC(5,2) NOT NULL,
    numero_parcelas INT NOT NULL
);

CREATE TABLE parcelas_amortizacao (
    id SERIAL PRIMARY KEY,
    simulacao_id INT NOT NULL REFERENCES simulacoes_amortizacao(id) ON DELETE CASCADE,
    numero_parcela INT NOT NULL,
    valor_parcela NUMERIC(12,2),
    valor_juros NUMERIC(12,2),
    valor_saldo NUMERIC(12,2)
);

CREATE TABLE exportacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_arquivo VARCHAR(10) CHECK (tipo_arquivo IN ('CSV','PDF')) NOT NULL,
    data_exportacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);